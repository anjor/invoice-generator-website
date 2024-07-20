from fastapi import FastAPI, HTTPException, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
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
