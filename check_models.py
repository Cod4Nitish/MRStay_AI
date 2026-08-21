from google import genai

client = genai.Client(
    api_key="AQ.Ab8RN6JEgamEquD25kBULRRfmRX98TKsxNf5S4Xw9fSAUaAatQ"
)

print("Available Models:\n")

for model in client.models.list():
    print(model.name)