import time
import json
from elasticsearch import Elasticsearch
from datetime import datetime
from collections import Counter
import pytz
import os

# Konfigurasjon
ES_HOST = "http://localhost:9200"
POLL_INTERVAL = 10  # sekunder
LEARNING_THRESHOLD = 3  # hvor mange ganger en IP må dukke opp før den regnes som kjent
LEARNED_IPS_FILE = "learned_ips.json"

# Elasticsearch-klient
es = Elasticsearch(ES_HOST)

# Kjente IP-er lært av "AI"
ip_counter = Counter()
learned_ips = set()

# Sett for å holde styr på hvilke dokumenter vi allerede har sett
seen_ids = set()

def load_learned_ips():
    if os.path.exists(LEARNED_IPS_FILE):
        with open(LEARNED_IPS_FILE, "r") as f:
            return set(json.load(f))
    return set()

def save_learned_ips():
    with open(LEARNED_IPS_FILE, "w") as f:
        json.dump(list(learned_ips), f)

def fetch_logs():
    query = {
        "query": {
            "match_all": {}
        },
        "sort": [{"@timestamp": {"order": "desc"}}],
        "size": 50
    }
    try:
        response = es.search(index=".ds-logs-apm.error-*", body=query)
        return response["hits"]["hits"]
    except Exception as e:
        print(f"Feil ved henting av logger: {e}")
        return []

def analyze_log(hit):
    log_id = hit["_id"]
    source = hit["_source"]
    timestamp = source.get("@timestamp", "N/A")
    ip = source.get("error", {}).get("custom", {}).get("ip", "N/A")
    email = source.get("error", {}).get("custom", {}).get("email", "N/A")

    if ip != "N/A":
        ip_counter[ip] += 1

        # Lær opp IP-en automatisk
        if ip_counter[ip] >= LEARNING_THRESHOLD:
            learned_ips.add(ip)
            save_learned_ips()

        if ip not in learned_ips:
            print("\n[AI VARSEL] Ukjent eller sjelden IP-adresse oppdaget!")
            print(f"Tidspunkt: {timestamp}")
            print(f"IP: {ip}")
            print(f"Bruker: {email}")
            print(f"Denne IP-en er observert {ip_counter[ip]} gang(er)")
            print("-------------------------------")

def main():
    global learned_ips
    learned_ips = load_learned_ips()
    print("Starter AI-loggovervåkning...")
    while True:
        logs = fetch_logs()
        for log in logs:
            if log["_id"] not in seen_ids:
                analyze_log(log)
                seen_ids.add(log["_id"])

        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    main()
