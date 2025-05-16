import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const LeadReportTable = ({ incomingLeads = [], incomingUsers = [], incomingFilterOptions = null }) => {
  const [users, setUsers] = useState(incomingUsers);
  const [leads, setLeads] = useState(incomingLeads);
  const [filterOptions, setFilterOptions] = useState({
    statuses: [],
    outcomes: [],
    categories: [],
    sources: [],
    ...incomingFilterOptions,
  });

  const [filters, setFilters] = useState({
    userId: "",
    status: "",
    outcome: "",
    category: "",
    source: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

  useEffect(() => {
    if (!incomingLeads.length || !incomingUsers.length || !incomingFilterOptions) {
      const fetchInitialData = async () => {
        try {
          const [usersRes, leadsRes, filtersRes] = await Promise.all([
            axiosInstance.get("/api/users"),
            axiosInstance.get("/api/leads"),
            axiosInstance.get("/api/leads/filters"),
          ]);
          setUsers(usersRes.data);
          setLeads(leadsRes.data);
          setFilterOptions(filtersRes.data);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      };
      fetchInitialData();
    }
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const filteredLeads = leads.filter((lead) => {
    const assignedToId =
      lead.assignedTo && typeof lead.assignedTo === "object"
        ? lead.assignedTo.id
        : lead.assignedTo;

    return (
      (filters.userId === "" || String(assignedToId) === String(filters.userId)) &&
      (filters.status === "" || lead.status === filters.status) &&
      (filters.outcome === "" || lead.outcome === filters.outcome) &&
      (filters.category === "" || lead.category === filters.category) &&
      (filters.source === "" || lead.source === filters.source)
    );
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;

    // Collect selected filters
    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => {
        let label = key;
        if (key === "userId") {
          const user = users.find((u) => String(u.id) === String(value));
          label = `User: ${user ? user.name : value}`;
        } else {
          label = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
        }
        return label;
      });

    // Add title & filters
    doc.setFontSize(12);
    doc.text("Lead Report", 14, 15);
    if (activeFilters.length > 0) {
      doc.setFontSize(10);
      doc.text("Applied Filters:", 14, 25);
      activeFilters.forEach((filterText, index) => {
        doc.text(`- ${filterText}`, 14, 32 + index * 6);
      });
    }

    const startY = 32 + activeFilters.length * 6 + 5;

    const columns = [
      "Lead Name",
      "Email",
      "Phone",
      "Source",
      "Category",
      "Status",
      "Outcome",
      "Assigned To",
      "Created At",
    ];

    const rows = filteredLeads.map((lead) => {
      const user =
        lead.assignedTo && typeof lead.assignedTo === "object"
          ? users.find((u) => String(u.id) === String(lead.assignedTo.id))
          : null;

      return [
        lead.name,
        lead.email,
        lead.phone,
        lead.source || "—",
        lead.category || "—",
        lead.status || "—",
        lead.outcome || "—",
        user ? user.name : "Unassigned",
        lead.createdAt?.slice(0, 10),
      ];
    });

   autoTable(doc, {
  head: [columns],
  body: rows,
  startY,
  theme: "striped",
  headStyles: { fillColor: [49, 130, 206] },
  styles: { fontSize: 8 },
  didDrawPage: (data) => {
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.text(
      `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 40,
      doc.internal.pageSize.height - 10
    );
  },
});


    doc.save("lead-report.pdf");
  };

  const indexOfLast = currentPage * leadsPerPage;
  const indexOfFirst = indexOfLast - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const chartData = filterOptions.statuses
    .map((status) => ({
      status,
      count: filteredLeads.filter((l) => l.status === status).length,
    }))
    .filter((d) => d.count > 0);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lead Report</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {[
          { name: "userId", label: "All Users", options: users.map(u => ({ value: u.id, label: u.name })) },
          { name: "status", label: "All Statuses", options: filterOptions.statuses.map(s => ({ value: s, label: s })) },
          { name: "outcome", label: "All Outcomes", options: filterOptions.outcomes.map(o => ({ value: o, label: o })) },
          { name: "category", label: "All Categories", options: filterOptions.categories.map(c => ({ value: c, label: c })) },
          { name: "source", label: "All Sources", options: filterOptions.sources.map(s => ({ value: s, label: s })) },
        ].map((filter) => (
          <select
            key={filter.name}
            name={filter.name}
            value={filters[filter.name]}
            onChange={handleFilterChange}
            className="border p-2"
          >
            <option value="">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ))}
      </div>

    <button
  onClick={generatePDF}
  className="btn btn-primary mb-3"
>
<i className="fas fa-file-download me-2"></i> Download PDF

</button>



      {/* Chart */}
      {chartData.length > 0 && (
        <div className="w-full h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Lead Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["Lead Name", "Email", "Phone", "Source", "Category", "Status", "Outcome", "Assigned To", "Created At","Completion",].map((col) => (
                <th key={col} className="border px-3 py-2">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
  {currentLeads.map((lead) => {
    const user =
      lead.assignedTo && typeof lead.assignedTo === "object"
        ? users.find((u) => String(u.id) === String(lead.assignedTo.id))
        : null;

    return (
      <tr key={lead.id} className="hover:bg-gray-50">
        <td className="border px-3 py-2">{lead.name}</td>
        <td className="border px-3 py-2">{lead.email}</td>
        <td className="border px-3 py-2">{lead.phone}</td>
        <td className="border px-3 py-2">{lead.source || "—"}</td>
        <td className="border px-3 py-2">{lead.category || "—"}</td>
        <td className="border px-3 py-2">{lead.status || "—"}</td>
        <td className="border px-3 py-2">{lead.outcome || "—"}</td>
        <td className="border px-3 py-2">{user ? user.name : "Unassigned"}</td>
        <td className="border px-3 py-2">{lead.createdAt?.slice(0, 10)}</td>

        {/* ✅ New Column Here */}
       <td className="border px-3 py-2">
        {lead.completedAt ? (
          <>
            <div><strong>Deal Value:</strong> {lead.dealValue ?? "—"}</div>
            <div><strong>Completed At:</strong> {new Date(lead.completedAt).toLocaleDateString()}</div>
          </>
        ) : (
          <span>Not Completed</span>
        )}
      </td>
      </tr>
    );
  })}
</tbody>

        </table>
      </div>

   {/* Pagination */}
{totalPages > 1 && (
  <div className="mt-4 flex justify-center space-x-2">
    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i + 1}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-3 py-1 border rounded font-medium ${
          currentPage === i + 1
            ? "bg-primary text-white border-primary"
            : "bg-light text-dark border-secondary"
        }`}
      >
        {i + 1}
      </button>
    ))}
  </div>
)}

    </div>
  );
};

export default LeadReportTable;
