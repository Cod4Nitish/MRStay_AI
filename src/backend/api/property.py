from fastapi import APIRouter

router = APIRouter(
    prefix="/property",
    tags=["Property"]
)

@router.get("/")
def property_status():
    return {"module": "Property API Ready"}
