from fastapi import APIRouter

router = APIRouter(
    prefix="/agent",
    tags=["Agent"]
)

@router.get("/")
def agent_status():
    return {"module": "Agent API Ready"}