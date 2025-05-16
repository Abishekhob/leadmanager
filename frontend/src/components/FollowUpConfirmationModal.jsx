import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function FollowUpConfirmationModal({ show, lead, onClose, onSubmit }) {
  const [summary, setSummary] = useState('');
  const [needFollowUp, setNeedFollowUp] = useState(false);
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    const formData = {
      leadId: lead?.id || null, // Ensure lead exists
      summary: summary?.trim() || "", // Prevent undefined issues
      needFollowUp,
      nextFollowUpDate: needFollowUp && nextFollowUpDate ? nextFollowUpDate : null, // Conditionally include date
    };
  
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Follow-Up Summary</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleFormSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>How did the follow-up go?</Form.Label>
            <Form.Control
  as="textarea"
  value={summary}
  onChange={(e) => setSummary(e.target.value)}
  placeholder="Add follow-up details"
/>
          </Form.Group>

          <Form.Check
            type="checkbox"
            label="Schedule another follow-up?"
            checked={needFollowUp}
            onChange={(e) => setNeedFollowUp(e.target.checked)}
          />

          {needFollowUp && (
            <Form.Group className="mt-3">
              <Form.Label>Next Follow-Up Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                required
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {needFollowUp ? 'Submit' : 'Next'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}