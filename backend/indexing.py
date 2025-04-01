from elasticsearch import Elasticsearch
import pandas as pd
from datetime import datetime
import pytz
import json

es = Elasticsearch("http://localhost:9200")

# Søk etter alt som er en span og inneholder "login" et sted
query = {
    "query": {
        "query_string": {
            "query": "login"
        }
    },
    "size": 50
}

index_patterns = [
    "apm-*",
    ".ds-*"
]

def extract_custom_info(source):
    ip = email = success = "N/A"

    # 1. Prøv direkte fra error.custom
    error_custom = source.get("error", {}).get("custom")
    if error_custom:
        ip = error_custom.get("ip", ip)
        email = error_custom.get("email", email)
        success = error_custom.get("success", success)

    # 2. Let gjennom stacktrace etter både kwargs.custom og kwargs.extra
    stacktrace = source.get("error", {}).get("log", {}).get("stacktrace", [])
    for frame in stacktrace:
        vars_dict = frame.get("vars", {}).get("kwargs", {})

        for key in ["custom", "extra"]:
            custom = vars_dict.get(key)
            if isinstance(custom, dict):
                ip = custom.get("ip", ip)
                email = custom.get("email", email)
                success = custom.get("success", success)

    return ip, email, success


results = []

for index in index_patterns:
    try:
        response = es.search(index=index, body=query)
        for hit in response["hits"]["hits"]:
            source = hit["_source"]

            #if "logs-apm" in hit["_index"]:
                #print(json.dumps(source, indent=2))

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
print(df)
