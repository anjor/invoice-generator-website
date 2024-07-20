from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from reportlab.platypus.flowables import HRFlowable


from io import BytesIO

from data_types import InvoiceRequest


def generate_invoice(invoice_data: InvoiceRequest):
    company_name = invoice_data.company_name
    company_address = invoice_data.company_address
    bank_details = invoice_data.bank_details
    client_name = invoice_data.client_name
    client_address = invoice_data.client_address
    currency = invoice_data.currency
    currency_symbol = "$" if currency == "USD" else "£"
    unit_of_work = invoice_data.unit_of_work
    invoice_number = invoice_data.invoice_number
    date = invoice_data.date
    hours = invoice_data.hours
    rate = invoice_data.rate

    if unit_of_work == "DAILY":
        unit_header = "Number of Days"
        rate_header = "Daily Rate"
    elif unit_of_work == "WEEKLY":
        unit_header = "Number of Weeks"
        rate_header = "Weekly Rate"
    else:
        unit_header = "Number of Hours"
        rate_header = "Hourly Rate"

    total_amount = hours * rate

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    # Define color scheme
    blue_color = colors.Color(0, 0.3, 0.5)  # Dark blue for title and amount due

    # Add company name
    title_style = ParagraphStyle(
        "Title", parent=styles["Title"], textColor=blue_color, spaceAfter=6
    )
    elements.append(Paragraph(company_name, title_style))

    # Add horizontal line under the title
    elements.append(
        HRFlowable(width="100%", thickness=1, color=colors.black, spaceAfter=6)
    )

    # Create a right-aligned style for invoice details
    right_style = ParagraphStyle(
        "RightAlign", parent=styles["Normal"], alignment=TA_RIGHT
    )

    # Create a table for company address and invoice details
    data = [
        [
            Paragraph(company_address[0], styles["Normal"]),
            Paragraph(f"Invoice Number: {invoice_number}", right_style),
        ],
        [
            Paragraph(company_address[1], styles["Normal"]),
            Paragraph(f"Date: {date}", right_style),
        ],
    ]

    # Add remaining address lines if any
    for line in company_address[2:]:
        data.append([Paragraph(line, styles["Normal"]), ""])

    address_table = Table(data, colWidths=[doc.width / 2] * 2)
    address_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )

    # Add the address table to the elements list
    elements.append(address_table)
    elements.append(Spacer(1, 12))

    # Add horizontal line after the company address
    elements.append(
        HRFlowable(width="100%", thickness=1, color=colors.black, spaceAfter=6)
    )

    # Add client information
    client_info = (
        f"<b>Billed to:</b><br/>{client_name}<br/>{'<br/>'.join(client_address)}"
    )
    elements.append(Paragraph(client_info, styles["Normal"]))
    elements.append(Spacer(1, 12))

    # Add table with invoice details
    data = [
        ["Description", unit_header, rate_header, "Total Amount"],
        [
            "Consulting Services",
            hours,
            f"{currency_symbol}{rate:.2f}",
            f"{currency_symbol}{total_amount:.2f}",
        ],
    ]
    table = Table(data)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ]
        )
    )
    elements.append(table)
    elements.append(Spacer(1, 24))

    # Create styles for bank details and amount due
    left_style = ParagraphStyle("LeftAlign", parent=styles["Normal"], alignment=TA_LEFT)
    right_style_large = ParagraphStyle(
        "RightAlignLarge",
        parent=styles["Normal"],
        alignment=TA_RIGHT,
        fontSize=14,
        fontName="Helvetica-Bold",
        textColor=blue_color,
    )

    # Create a table for bank details and amount due
    bank_details_text = "<br/>".join(bank_details)
    amount_due_text = f"Amount Due: {currency_symbol}{total_amount:.2f}"
    bottom_table = Table(
        [
            [
                Paragraph(bank_details_text, left_style),
                Paragraph(amount_due_text, right_style_large),
            ]
        ],
        colWidths=[doc.width / 2] * 2,
    )
    bottom_table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]))
    elements.append(bottom_table)

    doc.build(elements)
    buffer.seek(0)
    return buffer
