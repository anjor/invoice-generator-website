import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';

function InvoiceGenerator() {
  const [formData, setFormData] = useState({
    company_name: '',
    company_address: ['', '', ''],
    bank_details: ['', '', ''],
    client_name: '',
    client_address: ['', '', ''],
    currency: 'USD',
    unit_of_work: 'HOURLY',
    invoice_number: '',
    date: '',
    hours: '',
    rate: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e, index, field) => {
    const { name, value } = e.target;
    if (field) {
      const newArray = [...formData[field]];
      newArray[index] = value;
      setFormData({ ...formData, [field]: newArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post('http://localhost:8000/generate_invoice', formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invoice.pdf');
      document.body.appendChild(link);
      link.click();
      setSuccess(true);
    } catch (error) {
      setError('An error occurred while generating the invoice.');
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Invoice Generator</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Invoice generated successfully!</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Company Address</Form.Label>
              {formData.company_address.map((address, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  value={address}
                  onChange={(e) => handleChange(e, index, 'company_address')}
                  className="mb-2"
                  required
                />
              ))}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bank Details</Form.Label>
              {formData.bank_details.map((detail, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  value={detail}
                  onChange={(e) => handleChange(e, index, 'bank_details')}
                  className="mb-2"
                  required
                />
              ))}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Currency</Form.Label>
              <Form.Select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Unit of Work</Form.Label>
              <Form.Select
                name="unit_of_work"
                value={formData.unit_of_work}
                onChange={handleChange}
              >
                <option value="HOURLY">Hourly</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Client Name</Form.Label>
              <Form.Control
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Client Address</Form.Label>
              {formData.client_address.map((address, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  value={address}
                  onChange={(e) => handleChange(e, index, 'client_address')}
                  className="mb-2"
                  required
                />
              ))}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Invoice Number</Form.Label>
              <Form.Control
                type="text"
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Hours/Days/Weeks</Form.Label>
                  <Form.Control
                    type="number"
                    name="hours"
                    value={formData.hours}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Rate</Form.Label>
                  <Form.Control
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Generate Invoice
        </Button>
      </Form>
    </Container>
  );
}

export default InvoiceGenerator;
