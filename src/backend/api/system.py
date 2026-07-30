from fastapi import APIRouter

router = APIRouter(
    prefix="/system",
    tags=["System"]
)

@router.get("/")
def system_status():
    return {"module": "System API Ready"}