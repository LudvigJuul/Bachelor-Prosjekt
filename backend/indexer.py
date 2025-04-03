from elasticsearch import Elasticsearch
import pandas as pd
from datetime import datetime
import pytz
import json


import pyfiglet

text = "Indexer"
font = pyfiglet.Figlet(font="isometric1") #isometric1

# Render én og én bokstav
rendered_letters = [font.renderText(char).splitlines() for char in text]

# Finn maks høyde (linjer) brukt i fonten
max_height = max(len(letter) for letter in rendered_letters)

# Sørg for at alle bokstavene har like mange linjer (fyll med tomme linjer)
for letter in rendered_letters:
    while len(letter) < max_height:
        letter.append(" " * len(letter[0]))

# Slå sammen linjene horisontalt
output_lines = []
for i in range(max_height):
    line = "  ".join(letter[i] for letter in rendered_letters)
    output_lines.append(line)

# Print resultat

length = 110

print("\n".join(output_lines))
print("\n")
print("=" * length)
print("- " * int(length / 2))  
#print("\n")

es = Elasticsearch("http://localhost:9200")

query = {
    "query": {
        "query_string": {
            "query": "login"
        }
    },
    "size": 150
}

index_patterns = [
    "apm-*",
    ".ds-*"
]

def extract_custom_info(source):
    ip = email = success = "N/A"

    # 1. error.custom
    error_custom = source.get("error", {}).get("custom")
    if isinstance(error_custom, dict):
        ip = error_custom.get("ip", ip)
        email = error_custom.get("email", email)
        success = error_custom.get("success", success)

    # 2. error.log.stacktrace -> kwargs.custom / kwargs.extra
    stacktrace = source.get("error", {}).get("log", {}).get("stacktrace", [])
    for frame in stacktrace:
        kwargs = frame.get("vars", {}).get("kwargs", {})
        for key in ["custom", "extra"]:
            custom_data = kwargs.get(key)
            if isinstance(custom_data, dict):
                ip = custom_data.get("ip", ip)
                email = custom_data.get("email", email)
                success = custom_data.get("success", success)
    return ip, email, success

results = []

for index in index_patterns:
    try:
        response = es.search(index=index, body=query)
        for hit in response["hits"]["hits"]:
            source = hit["_source"]

            # Hent og konverter timestamp
            timestamp_raw = source.get("@timestamp") or source.get("timestamp", {}).get("us")
            if timestamp_raw:
                try:
                    utc_dt = datetime.strptime(timestamp_raw, "%Y-%m-%dT%H:%M:%S.%fZ")
                    utc_dt = utc_dt.replace(tzinfo=pytz.utc)
                    oslo_tz = pytz.timezone("Europe/Oslo")
                    local_dt = utc_dt.astimezone(oslo_tz)
                    timestamp = local_dt.strftime("%Y-%m-%d %H:%M:%S")
                except Exception as e:
                    timestamp = f"Feil i konvertering: {e}"
            else:
                timestamp = "N/A"

            ip, email, success = extract_custom_info(source)

            parsed = {
                "index": hit["_index"],
                "timestamp": timestamp,
                "ip": ip,
                "email": email,
                "success": success,
                "span_name": source.get("span", {}).get("name") or source.get("transaction", {}).get("name", "N/A"),
                "outcome": source.get("event", {}).get("outcome", "N/A")
            }

            results.append(parsed)
    except Exception as e:
        print(f"Feil i {index}: {e}")

df = pd.DataFrame(results)
pd.set_option('display.max_columns', None)

#Uncomment for å få csv fil
#df.to_csv("login_logs.csv", index=False)
#print("Lagret til login_logs.csv")

print(df.to_string(index=False))
