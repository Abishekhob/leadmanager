import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axiosInstance from "../axiosInstance";
import { toast } from 'react-toastify';

export default function StatusChangeModal({ show, lead, onClose, onSubmit, status, forceModal }) {
  const [note, setNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [file, setFile] = useState(null);
  const [closeReason, setCloseReason] = useState('');
  const [dealValue, setDealValue] = useState('');
  const [outcome, setOutcome] = useState('');
  const [assignToCreator, setAssignToCreator] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState('');
  const [proposalCreators, setProposalCreators] = useState([]);
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('');

  const MAX_FILE_SIZE_MB = 4;

  useEffect(() => {
    if (status === 'CONTACTED' || status === 'PROPOSAL_SENT' || status === 'FOLLOW_UP') {
      axiosInstance.get('/api/users/proposal-creators')
        .then((response) => {
          setProposalCreators(response.data);
        })
        .catch((error) => {
          console.error('Failed to fetch proposal creators:', error);
        });
    }
  }, [status]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('note', note);
    formData.append('summary', summary.trim());
    formData.append('followUpDate', followUpDate);
    formData.append('closeReason', closeReason);
    formData.append('dealValue', dealValue);
    formData.append('outcome', outcome);
    formData.append('category', category);
    formData.append('assignToProposalCreator', assignToCreator);
    formData.append('userId', localStorage.getItem('userId'));

    if (assignToCreator && selectedCreator) {
      formData.append('proposalCreatorId', selectedCreator);
    }

    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`File size should not exceed ${MAX_FILE_SIZE_MB} MB`);
        return;
      }
      formData.append('file', file);
    }

    onSubmit(formData);
    clearFields();
  };

  const clearFields = () => {
    setNote('');
    setFollowUpDate('');
    setFile(null);
    setCloseReason('');
    setDealValue('');
    setOutcome('');
    setCategory('');
    setAssignToCreator(false);
    setSelectedCreator('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File size should not exceed ${MAX_FILE_SIZE_MB} MB`);
      return;
    }
    setFile(selectedFile);
  };

  useEffect(() => {
  if (show && lead?.category) {
    setCategory(lead.category);
  }
}, [show, lead]);


  const shouldShowProposalOption = status === 'CONTACTED' || status === 'PROPOSAL_SENT' || status === 'FOLLOW_UP';

  return (
    <Modal
  show={show}
  onHide={forceModal ? () => {} : onClose}
  backdrop={forceModal ? "static" : true}
  keyboard={!forceModal}
  centered
>

      <Modal.Header closeButton>
        <Modal.Title>Update Status: {status}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleFormSubmit}>
        <Modal.Body>
          {(status === 'CONTACTED' || status === 'FOLLOW_UP') && (
            <Form.Group className="mb-3">
              <Form.Label>Lead Category</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select Category</option>
                <option value="HOT">Hot</option>
                <option value="WARM">Warm</option>
                <option value="COLD">Cold</option>
              </Form.Select>
            </Form.Group>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>Note</Form.Label>
            <Form.Control
              as="textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note"
            />
          </Form.Group>

         {status === 'FOLLOW_UP' && (
          <Form.Group className="mb-3">
            <Form.Label>Follow-Up Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </Form.Group>
        )}


          {status === 'CLOSED' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Outcome</Form.Label>
                <Form.Select value={outcome} onChange={(e) => setOutcome(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="WON">WON</option>
                  <option value="LOST">LOST</option>
                </Form.Select>
              </Form.Group>

              {outcome === 'WON' && (
                <Form.Group className="mb-3">
                  <Form.Label>Deal Value (₹)</Form.Label>
                  <Form.Control
                    type="text"
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    required
                  />
                </Form.Group>
              )}

              {outcome === 'LOST' && (
                <Form.Group className="mb-3">
                  <Form.Label>Reason for Losing</Form.Label>
                  <Form.Control
                    type="text"
                    value={closeReason}
                    onChange={(e) => setCloseReason(e.target.value)}
                    required
                  />
                </Form.Group>
              )}
            </>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Attach File (optional)</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>

          {shouldShowProposalOption && (
            <>
              <hr />
              <Form.Check
                type="checkbox"
                label="I want someone else to prepare the proposal"
                checked={assignToCreator}
                onChange={(e) => setAssignToCreator(e.target.checked)}
              />

              {assignToCreator && (
                <Form.Group className="mt-3">
                  <Form.Label>Assign to Proposal Creator</Form.Label>
                  <Form.Select
                    value={selectedCreator}
                    onChange={(e) => setSelectedCreator(e.target.value)}
                    required
                  >
                    <option value="">Select Creator</option>
                    {proposalCreators.map((creator) => (
                      <option key={creator.id} value={creator.id}>
                        {creator.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { onClose(); clearFields(); }}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Confirm
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
