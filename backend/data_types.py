from typing import List
from pydantic import BaseModel, EmailStr


class WaitlistRequest(BaseModel):
    email: EmailStr


class InvoiceRequest(BaseModel):
    company_name: str
    company_address: List[str]
    bank_details: List[str]
    client_name: str
    client_address: List[str]
    currency: str = "USD"
    unit_of_work: str = "HOURLY"
    invoice_number: str
    date: str
    hours: float
    rate: float
