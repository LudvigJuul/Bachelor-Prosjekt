from elasticsearch import Elasticsearch
import pyfiglet

print(pyfiglet.figlet_format("Delete Logs", font="slant"))

# Koble til Elasticsearch
es = Elasticsearch("http://localhost:9200")

# Brukeren får mulighet til å bekrefte sletting
bekreft = input("Vil du slette ALLE gamle logger? (Y/N): ").strip().lower()

if bekreft != "y":
    print("Avbrutt. Ingen logger er slettet.")
    exit()

# Definer hvilke indekser du ønsker å rydde
indekser = [
    ".ds-logs-apm.error-default-*",
    ".ds-traces-apm.rum-default-*",
    ".ds-metrics-apm.service_destination.1m-default-*"
]

# Kjør slettespørring på alle indekser
slett_query = {
    "query": {
        "match_all": {}
    }
}

for index in indekser:
    try:
        response = es.delete_by_query(index=index, body=slett_query, ignore_unavailable=True)
        slettet = response.get("deleted", 0)
        print(f"🧹 Slettet {slettet} dokumenter fra {index}")
    except Exception as e:
        print(f"⚠️  Feil ved sletting i {index}: {e}")
