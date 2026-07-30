# FastAPI entry point
from fastapi import FastAPI

app = FastAPI(title="MRStay AI")

@app.get("/health")
def health():
    return {"status": "ok"}
