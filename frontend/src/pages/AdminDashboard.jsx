import React, { useEffect, useState } from 'react';
import Column from '../components/Column';
import LeadDetailsModal from '../components/LeadDetailsModal';
import CreateLeadModal from '../components/leads/CreateLeadModal';
import { DragDropContext } from '@hello-pangea/dnd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminNavbar from '../components/AdminNavbar';
import { isTokenExpired } from '../utils/authUtils';
import SessionExpired from '../components/SessionExpired';
import axiosInstance from '../axiosInstance';

const statusList = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'PROPOSAL_SENT', 'CLOSED', 'UNASSIGNED'];

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [leadsByStatus, setLeadsByStatus] = useState({});
  const [selectedLead, setSelectedLead] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerColumn = 5;

  const [sessionExpired, setSessionExpired] = useState(false);

  const toggleLeadSelection = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const assignSelectedLeadsRandomly = async () => {
   
    setIsAssigning(true);

    try {
      await axiosInstance.put('/api/leads/assign-random', selectedLeads);
        

      toast.success('Selected leads assigned randomly!');
      setSelectedLeads([]);
      fetchLeads(); // Refresh leads
    } catch (error) {
      console.error('Assignment failed', error);
      toast.error('Random assignment failed');
    } finally {
      setIsAssigning(false);
    }
  };

  const fetchLeads = () => {
   
    axiosInstance
      .get('/api/leads')
      .then((response) => {
        const grouped = {};
        statusList.forEach((status) => (grouped[status] = []));

        response.data.forEach((lead) => {
          const status = lead.assignedTo == null ? 'UNASSIGNED' : lead.status;
          if (!grouped[status]) grouped[status] = [];
          grouped[status].push(lead);
        });

        // Prioritize selected category
        if (selectedCategory) {
          Object.keys(grouped).forEach((status) => {
            const hotLeads = grouped[status].filter((l) => l.category === selectedCategory);
            const otherLeads = grouped[status].filter((l) => l.category !== selectedCategory);
            grouped[status] = [...hotLeads, ...otherLeads];
          });
        }

        setLeadsByStatus(grouped);
      })
      .catch((err) => {
        console.error('Failed to fetch leads:', err);
        if (err.response && err.response.status === 401) {
          window.location.href = '/';
        }
      });
  };

  useEffect(() => {
    fetchLeads();
  }, [selectedCategory]);

  const handleDragEnd = (result) => {
    console.log(result);
  };

  const filterLeads = (leads) => {
    if (!searchTerm.trim()) return leads;
    return leads.filter((lead) => {
      const keyword = searchTerm.toLowerCase();
      return (
        (lead.name && lead.name.toLowerCase().includes(keyword)) ||
        (lead.email && lead.email.toLowerCase().includes(keyword)) ||
        (lead.company && lead.company.toLowerCase().includes(keyword))
      );
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      setSessionExpired(true);
    }

    // Optional: auto-logout on expiry after token duration
    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        setSessionExpired(true);
        clearInterval(interval);
      }
    }, 60000); // check every 10s

    return () => clearInterval(interval);
  }, []);

  if (sessionExpired) {
    return <SessionExpired />;
  }


  const totalPages = Math.max(
    ...statusList.map(
      (status) =>
        Math.ceil(filterLeads(leadsByStatus[status] || []).length / leadsPerColumn)
    )
  );

  return (
    <div className="container-fluid">
      <AdminNavbar />

      <div className="text-end m-3">
        <button
          className="btn btn-warning me-2"
          onClick={assignSelectedLeadsRandomly}
          disabled={selectedLeads.length === 0 || isAssigning}
        >
          🎯 {isAssigning ? 'Assigning...' : 'Assign Selected Randomly'}
        </button>
        <button className="btn btn-success" onClick={() => setShowCreateModal(true)}>
          + Create Lead
        </button>
      </div>

      <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <label className="me-2">Filter by Category:</label>
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select w-auto d-inline-block"
          >
            <option value="">All</option>
            <option value="HOT">Hot</option>
            <option value="WARM">Warm</option>
            <option value="COLD">Cold</option>
          </select>
        </div>

        <div className="mt-2 mt-md-0">
          <input
            type="text"
            placeholder="Search by name, email, or any keyword"
            className="form-control"
            style={{ width: '300px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row">
          {statusList.map((status) => (
            <div
              key={status}
              className="col-12 col-md-6 col-lg-4 col-xl-2 mb-2"
              style={{ height: '490px' }} // ✅ fixed height for the column
            >
              <Column
                status={status}
                leads={filterLeads(leadsByStatus[status] || []).slice(
                  (currentPage - 1) * leadsPerColumn,
                  currentPage * leadsPerColumn
                )}
                onLeadClick={(lead) => setSelectedLead(lead)}
                selectedLeads={selectedLeads}
                toggleLeadSelection={toggleLeadSelection}
                containerHeight={600} // ✅ pass height as prop (optional)
              />
            </div>
          ))}
        </div>
      </DragDropContext>

      <div className="d-flex justify-content-center my-3 flex-wrap gap-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          First
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            return (
              page === 1 || // Always show first
              page === totalPages || // Always show last
              Math.abs(currentPage - page) <= 1 // Show nearby pages
            );
          })
          .reduce((acc, page, i, arr) => {
            if (i > 0 && page - arr[i - 1] > 1) {
              acc.push('ellipsis');
            }
            acc.push(page);
            return acc;
          }, [])
          .map((item, index) =>
            item === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="btn btn-light disabled">
                ...
              </span>
            ) : (
              <button
                key={item}
                className={`btn ${
                  item === currentPage ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setCurrentPage(item)}
              >
                {item}
              </button>
            )
          )}

        <button
          className="btn btn-outline-secondary"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop />

      {selectedLead && (
        <LeadDetailsModal
          show={true}
          lead={selectedLead}
          onHide={() => setSelectedLead(null)}
          onLeadUpdated={fetchLeads}
        />
      )}

      <CreateLeadModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onLeadCreated={fetchLeads}
      />
    </div>
  );
}
