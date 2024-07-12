# Invoice Generator API

This project is a FastAPI-based web service that generates PDF invoices based on provided data. It offers a simple and efficient way to create professional-looking invoices programmatically.

## Features

- Generate PDF invoices with customizable details
- Support for different currencies (USD and GBP)
- Flexible unit of work options (hourly, daily, weekly)
- CORS middleware for cross-origin requests
- Health check endpoint

## Requirements

- Python 3.7+
- FastAPI
- ReportLab
- Pydantic
- uvicorn (for running the server)

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/invoice-generator-api.git
   cd invoice-generator-api
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```
   pip install fastapi reportlab pydantic uvicorn
   ```

## Usage

1. Start the server:
   ```
   uvicorn main:app --reload
   ```

2. The API will be available at `http://localhost:8000`

3. To generate an invoice, send a POST request to `/generate_invoice` with the following JSON structure:

   ```json
   {
     "company_name": "Your Company Name",
     "company_address": ["123 Company St", "Suite 456", "City, State 12345"],
     "bank_details": ["Bank: Your Bank", "Account: 1234567890", "Routing: 987654321"],
     "client_name": "Client Company",
     "client_address": ["456 Client Ave", "City, State 54321"],
     "currency": "USD",
     "unit_of_work": "HOURLY",
     "invoice_number": "INV-001",
     "date": "2023-07-12",
     "hours": 40,
     "rate": 100
   }
   ```

4. The API will return a PDF file as the response.

## API Endpoints

- `POST /generate_invoice`: Generate a PDF invoice based on the provided data
- `GET /healthcheck`: Check if the API is running

## Customization

You can easily customize the invoice template by modifying the `generate_invoice` function in the main script. The ReportLab library provides extensive options for PDF generation and styling.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.