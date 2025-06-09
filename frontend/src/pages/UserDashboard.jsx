import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import axios from 'axios';
import Column from '../components/Column';
import { DragDropContext } from '@hello-pangea/dnd';
import LeadDetailsModal from '../components/LeadDetailsModal';
import StatusChangeModal from '../components/StatusChangeModal';
import FollowUpConfirmationModal from '../components/FollowUpConfirmationModal';
import Navbar from '../components/Navbar';
import ProfilePage from './ProfilePage';
import Notifications from '../components/Notifications';
import ProposalsView from './ProposalsView';
import { isTokenExpired } from '../utils/authUtils';
import SessionExpired from '../components/SessionExpired';
import { toast } from 'react-toastify';
import BootstrapPagination from '../components/BootstrapPagination';

const statusList = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'PROPOSAL_SENT', 'CLOSED'];

export default function UserDashboard() {
   const userId = localStorage.getItem('userId');
  const [leads, setLeads] = useState({});
  const [allLeads, setAllLeads] = useState([]);

  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [leadBeingMoved, setLeadBeingMoved] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sentProposals, setSentProposals] = useState([]);
  const [receivedProposals, setReceivedProposals] = useState([]);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const role = localStorage.getItem('role');
  const [isStatusModalForced, setIsStatusModalForced] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const fixPath = (path) => path?.replace(/\\/g, '/');

  const [userBadgeCount, setUserBadgeCount] = useState(0);
  const [creatorBadgeCount, setCreatorBadgeCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const isUser = role === 'USER';
  const isCreator = role === 'PROPOSAL_CREATOR';

  const [view, setView] = useState(() => {
    return localStorage.getItem('currentView') || 'home';
  });

  const handleNavigate = (page) => {
    setView(page);
    localStorage.setItem('currentView', page);
  };

  const openModal = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleOpenStatusModal = (lead, status) => {
    setSelectedLead(lead);
    setSelectedStatus(status);
    setShowStatusModal(true);
  };

  const closeModal = () => {
    setSelectedLead(null);
    setShowModal(false);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalForced(false);
    setShowStatusModal(false);
    setSelectedLead(null);
  };

  const handleLeadUpdated = () => {
    // This could be a logic to refresh the lead list, close the modal, etc.
    console.log('Lead category updated successfully!');
    setShowModal(false);  // Optionally close the modal
  };

  const fetchLeads = async () => {

  const userId = localStorage.getItem('userId');

  try {
    const url = `/api/leads/user/${userId}?search=${searchQuery}`;
    const res = await axiosInstance.get(url);

    const all = res.data;
    setAllLeads(all);

    const maxLeadsPerColumn = 6;

    // Group leads by status
    const groupedLeads = statusList.reduce((acc, status) => {
      acc[status] = all.filter((lead) => lead.status === status);
      return acc;
    }, {});

    // Calculate total pages based on the longest list
    const pages = Math.max(
      ...statusList.map((status) =>
        Math.ceil(groupedLeads[status].length / maxLeadsPerColumn)
      )
    );
    setTotalPages(pages);

    // Slice the leads per status based on the current page
    const slicedGrouped = {};
    for (let status of statusList) {
      const leadsOfStatus = groupedLeads[status];
      const startIndex = currentPage * maxLeadsPerColumn;
      const endIndex = startIndex + maxLeadsPerColumn;
      slicedGrouped[status] = leadsOfStatus.slice(startIndex, endIndex);
    }

    setLeads(slicedGrouped);

  } catch (err) {
    console.error('Error fetching leads:', err);
  }
};

  const fetchProposals = async () => {
    try {
    const [sentRes, receivedRes] = await Promise.all([
      axiosInstance.get('/proposals/sent'),
      axiosInstance.get('/proposals/received')
    ]);

  const sent = sentRes.data;
  const received = receivedRes.data;

  setSentProposals(sent);
  setReceivedProposals(received);

    // ✅ Badge logic
  const pendingProposalsForUser = sent.filter(
    (p) => p.proposalFilePath && !p.completed
  );
  const pendingRequestsForCreator = received.filter(
    (p) => !p.proposalFilePath
  );

    setUserBadgeCount(pendingProposalsForUser.length);
    setCreatorBadgeCount(pendingRequestsForCreator.length);
  } catch (err) {
    console.error('Error fetching proposals', err);
  }
};

  
  const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchQuery(value);
  fetchLeads(value); // Fetch leads based on the query
  };

  useEffect(() => {
    fetchProposals();
  }, []);


  useEffect(() => {
    if (view === 'home' || view === 'notifications') {
    fetchLeads();
    }
  }, [view, currentPage, searchQuery]);


  const uploadProposal = async (e, proposalId) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("proposalFile", e.target.proposalFile.files[0]);
    const token = localStorage.getItem('token');

    try {
      await axios.post(`http://localhost:8080/proposals/upload/${proposalId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success("Proposal uploaded");
      fetchProposals();
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const markComplete = async (proposalId) => {
     try {
      await axiosInstance.post(`/proposals/complete/${proposalId}`, {});
      toast.success("Marked as complete");
      fetchProposals();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const movedLead = leads[source.droppableId].find(
      (lead) => lead.id.toString() === draggableId
    );

    // Check if moving FROM "FOLLOW_UP"
    if (movedLead.status === "FOLLOW_UP") {
        setSelectedLead(movedLead);
        setSelectedStatus(destination.droppableId);
        setShowFollowUpModal(true); // Show the intermediate form first
        return;
    }

    // Proceed with normal status change
    setPendingStatusChange(destination.droppableId);
    setLeadBeingMoved(movedLead);
    setSelectedLead(movedLead);
    setSelectedStatus(destination.droppableId);
    setShowStatusModal(true);
  };

  const handleFollowUpSubmit = (formData) => {
  const userId = localStorage.getItem('userId');

  const hasSummary = formData.summary && formData.summary.trim() !== '';
  const hasFollowUpDate = formData.nextFollowUpDate && formData.nextFollowUpDate.trim() !== '';

  if (hasSummary || hasFollowUpDate) {
    axiosInstance.put(`/api/leads/${formData.leadId}/update-followup-date`, {
      followUpDate: hasFollowUpDate ? formData.nextFollowUpDate : null,
      summary: formData.summary,
      userId: userId
    }).then(() => {
      toast.success('Follow-up updated successfully!');
      fetchLeads();

      // 👉 Show status modal only if follow-up date is NOT set
      if (!hasFollowUpDate) {
        if (hasSummary) {
          setIsStatusModalForced(true); // ⛔ prevent closing
        } else {
          setIsStatusModalForced(false);
        }
        setShowStatusModal(true);
      }
    }).catch(() => {
      toast.error('Failed to update follow-up');
    });
  } else {
    // If nothing to update, still show status modal
    setIsStatusModalForced(false);
    setShowStatusModal(true);
  }

  // Hide follow-up modal in both cases
  setShowFollowUpModal(false);
};

  const handleStatusUpdate = async (formData) => {
      
    try {
      if (!selectedLead) throw new Error("No lead selected");
  
      const leadId = selectedLead.id;
      const userId = formData.get('userId') || localStorage.getItem('userId');
      const assignToProposalCreator = formData.get('assignToProposalCreator') === 'true';
      const proposalCreatorId = formData.get('proposalCreatorId');
      const category = formData.get('category'); 
  
      const leadStatusFormData = new FormData();
      leadStatusFormData.append('status', selectedStatus);
      leadStatusFormData.append('note', formData.get('note') || '');
      leadStatusFormData.append('followUpDate', formData.get('followUpDate') || '');
      leadStatusFormData.append('file', formData.get('file'));
      leadStatusFormData.append('closeReason', formData.get('closeReason') || '');
      leadStatusFormData.append('dealValue', formData.get('dealValue') || '');
      leadStatusFormData.append('outcome', formData.get('outcome') || '');
      leadStatusFormData.append('userId', userId);
      leadStatusFormData.append('assignedUserId', userId); // 🔄 For backend compatibility
      leadStatusFormData.append('assignToProposalCreator', assignToProposalCreator);
      leadStatusFormData.append('category', category || ''); // ✅ Append category
  
      if (assignToProposalCreator && proposalCreatorId) {
        leadStatusFormData.append('proposalCreatorId', proposalCreatorId);
        
      }
              
      // Update lead status
      await axiosInstance.put(`/api/leads/${leadId}/status`, leadStatusFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
          },
      });
  
      // Optional: Send proposal request
      if (assignToProposalCreator && proposalCreatorId) {
        const proposalFormData = new FormData();
        proposalFormData.append('proposalCreatorId', proposalCreatorId);
        proposalFormData.append('notes', formData.get('note'));
        proposalFormData.append('proposalFile', formData.get('file'));
  
        await axiosInstance.post(`/proposals/request/${leadId}`, proposalFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'           
          },
        });
      }
  
      toast.success('Status updated successfully!');
      handleCloseStatusModal();
      fetchLeads();
    } catch (error) {
      console.error('Error updating status or requesting proposal:', error);
      toast.error('Something went wrong. Please try again.');
    }
   
  };

   useEffect(() => {
     if (view === 'home' || view === 'notifications') {
    fetchLeads(searchQuery, currentPage); // Initial fetch with pagination

    const interval = setInterval(() => {
      fetchLeads(searchQuery, currentPage); // Fetch leads every 10 seconds with pagination
    }, 10000);

    return () => clearInterval(interval); // Cleanup on unmount
  }
}, [view, searchQuery, currentPage]); // 👈 Added `currentPage` dependency

   useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      setSessionExpired(true);
    }

  const interval = setInterval(() => {
    if (isTokenExpired(token)) {
      setSessionExpired(true);
      clearInterval(interval);
    }
  }, 60000); // check every 60 seconds

  return () => clearInterval(interval);
}, []);

if (sessionExpired) {
  return <SessionExpired />;
}
  
return (
  <div className="container-fluid">
  
  <Navbar
  onNavigate={handleNavigate}
  currentView={view}
  userRole={role} // ✅ Use role from localStorage
  userBadgeCount={userBadgeCount}
  creatorBadgeCount={creatorBadgeCount}
  />

    {view === 'home' && (
      <>
        {/* Search Bar */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

      {/* Drag and Drop Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
          <div
            className="d-flex overflow-auto gap-4 align-items-stretch"
            style={{ minHeight: '500px' }} // or any height that fits your layout
          >
            {statusList.map((status) => (
              <Column
                key={status}
                status={status}
                leads={leads[status] || []}
                onLeadClick={openModal}
              />
            ))}
          </div>
      </DragDropContext>

      <div className="d-flex justify-content-center mt-3">
        <BootstrapPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage} // Assuming you use `setCurrentPage` to update
        />
      </div>

        {/* Lead Detail Modal */}
        <LeadDetailsModal
          show={showModal}
          lead={selectedLead}
          onHide={closeModal}
          onLeadUpdated={handleLeadUpdated}
        />

        {/* Status Change Modal */}
        <StatusChangeModal
          show={showStatusModal}
          lead={selectedLead}
          onClose={handleCloseStatusModal}
          onSubmit={handleStatusUpdate}
          status={selectedStatus}
          forceModal={isStatusModalForced}
        />
      </>
    )}

     <ProposalsView
      view={view}
      role={role}
      sentProposals={sentProposals}
      receivedProposals={receivedProposals}
      markComplete={markComplete}
      uploadProposal={uploadProposal}
      fixPath={fixPath}
    />

    {/* Follow-up Modal (Global) */}
    <FollowUpConfirmationModal
      show={showFollowUpModal}
      lead={selectedLead}
      onClose={() => setShowFollowUpModal(false)}
      onSubmit={handleFollowUpSubmit}
    />

    {/* Profile Page */}
    {view === 'profile' && <ProfilePage />}

    {/* Notifications Page */}
    {view === 'notifications' && <Notifications leads={allLeads} />}
  </div>
);
}