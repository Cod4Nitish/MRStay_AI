from fastapi import APIRouter

router = APIRouter(
    prefix="/lead",
    tags=["Lead"]
)

@router.get("/")
def lead_status():
    return {"module": "Lead API Ready"}