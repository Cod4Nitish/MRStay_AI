from fastapi import Header, HTTPException
import hmac
import os

async def verify_internal_key(x_internal_service_key: str = Header(...)):
    # Fail closed: without a configured key there is no shared secret to check against.
    expected = os.getenv("INTERNAL_SERVICE_KEY", "")
    if not expected:
        raise HTTPException(status_code=503, detail="Internal service key is not configured")
    if not hmac.compare_digest(x_internal_service_key, expected):
        raise HTTPException(status_code=401, detail="Unauthorized internal call")
