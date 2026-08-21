from fastapi import APIRouter

router = APIRouter(
    prefix="/api/agent",
    tags=["Agent"]
)

@router.get("/status")
def get_agent_status():
    return {
        "agents": [
            {
                "name": "Reception Agent",
                "status": "In Progress",
                "progress": 65
            },
            {
                "name": "Sales Agent",
                "status": "Not Started",
                "progress": 0
            },
            {
                "name": "Lead Agent",
                "status": "Not Started",
                "progress": 0
            },
            {
                "name": "RAG Engine",
                "status": "In Progress",
                "progress": 70
            }
        ]
    }