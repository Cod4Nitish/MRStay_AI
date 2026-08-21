from fastapi import APIRouter

router = APIRouter(
    prefix="/api/system",
    tags=["System"]
)

@router.get("/telemetry")
def get_telemetry():
    return {
        "cpu_usage": "24%",
        "memory_usage": "3.2 GB",
        "server_uptime": "14d 6h 45m",
        "python_version": "3.11.4",
        "fastapi_version": "0.103.1"
    }

@router.get("/git")
def get_git_info():
    return {
        "current_branch": "main",
        "latest_commit": "a80fda6",
        "commits_today": 3,
        "repository_name": "MRSTAY_AI"
    }

@router.get("/testing")
def get_testing_info():
    return {
        "unit_tests": "Pass: 120, Fail: 0",
        "api_tests": "Pass: 45, Fail: 2",
        "integration_tests": "Pass: 12, Fail: 0",
        "overall_coverage": "87%"
    }