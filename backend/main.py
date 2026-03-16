from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timezone
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_methods=["*"],
    allow_headers=["*"],
)

submissions: List[dict] = []


class Submission(BaseModel):
    url: str
    company_name: str
    company_type: str
    colors: List[str]
    products: List[str]


@app.post("/submissions")
def create_submission(submission: Submission):
    entry = {
        "id": len(submissions) + 1,
        "url": submission.url,
        "company_name": submission.company_name,
        "company_type": submission.company_type,
        "colors": submission.colors,
        "products": submission.products,
        "submitted_at": datetime.now(timezone.utc).isoformat(),
        "creative_ready": False,
    }
    submissions.append(entry)
    return entry


@app.get("/submissions")
def get_submissions():
    return list(reversed(submissions))


@app.get("/submissions/{submission_id}")
def get_submission(submission_id: int):
    for s in submissions:
        if s["id"] == submission_id:
            return s
    raise HTTPException(status_code=404)


@app.patch("/submissions/{submission_id}/creative-ready")
def set_creative_ready(submission_id: int):
    for s in submissions:
        if s["id"] == submission_id:
            s["creative_ready"] = True
            return {"ok": True}
    raise HTTPException(status_code=404)


@app.delete("/submissions/{submission_id}")
def delete_submission(submission_id: int):
    global submissions
    submissions = [s for s in submissions if s["id"] != submission_id]
    return {"ok": True}
