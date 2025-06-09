import React, { useEffect, useState } from 'react';
import LeadReportTable from './LeadReportTable';

import AdminNavbar from '../AdminNavbar';
import axiosInstance from '../../axiosInstance';



const ReportPage = () => {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    statuses: [],
    outcomes: [],
    categories: [],
    sources: [],
  });

  const [filters, setFilters] = useState({
    userId: '',
    status: '',
    outcome: '',
    category: '',
    source: '',
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersRes, leadsRes, filtersRes] = await Promise.all([
          axiosInstance.get('/api/users/non-admin-users'),
          axiosInstance.get('/api/leads'),
          axiosInstance.get('/api/leads/filters'),
        ]);
        setUsers(usersRes.data);
        setLeads(leadsRes.data);
        setFilterOptions(filtersRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const assignedToId =
      lead.assignedTo && typeof lead.assignedTo === 'object'
        ? lead.assignedTo.id
        : lead.assignedTo;
    return (
      (filters.userId === '' || String(assignedToId) === String(filters.userId)) &&
      (filters.status === '' || lead.status === filters.status) &&
      (filters.outcome === '' || lead.outcome === filters.outcome) &&
      (filters.category === '' || lead.category === filters.category) &&
      (filters.source === '' || lead.source === filters.source)
    );
  });

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h1 className="mb-4">Reports Dashboard</h1>

        <LeadReportTable
          users={users}
          filterOptions={filterOptions}
          filters={filters}
          setFilters={setFilters}
          filteredLeads={filteredLeads}
        />

      
      </div>
    </>
  );
};

export default ReportPage;
