from fastapi import FastAPI, HTTPException, Response, Depends, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session
from typing import List
from data_types import InvoiceRequest, WaitlistRequest
from invoice import generate_invoice
from db import get_db, WaitlistEntry, create_tables

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Create database tables
create_tables()

# API Key setup
API_KEY = os.getenv("API_KEY")
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key == API_KEY:
        return api_key
    raise HTTPException(status_code=403, detail="Could not validate API Key")


@app.post("/join_waitlist")
async def join_waitlist(
    waitlist_request: WaitlistRequest, db: Session = Depends(get_db)
):
    try:
        new_entry = WaitlistEntry(email=waitlist_request.email)
        db.add(new_entry)
        db.commit()
        return {"message": "Successfully joined the waitlist"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Email already exists or other error occurred"
        )


@app.get("/get_waitlist", response_model=List[str])
async def get_waitlist(
    db: Session = Depends(get_db), api_key: str = Depends(get_api_key)
):
    entries = db.query(WaitlistEntry).all()
    return [entry.email for entry in entries]


@app.post("/generate_invoice")
async def create_invoice(invoice_request: InvoiceRequest):
    try:
        pdf_buffer = generate_invoice(invoice_request)
        return Response(
            pdf_buffer.getvalue(),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=invoice.pdf"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/healthcheck")
async def healthcheck():
    return {"message": "I am alive!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
