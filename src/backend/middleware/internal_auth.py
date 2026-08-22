from fastapi import Header, HTTPException
import os

async def verify_internal_key(x_internal_service_key: str = Header(...)):
    expected = os.getenv("INTERNAL_SERVICE_KEY", "mrstay_internal_2026_change_this")
    if x_internal_service_key != expected:
        raise HTTPException(status_code=401, detail="Unauthorized internal call")