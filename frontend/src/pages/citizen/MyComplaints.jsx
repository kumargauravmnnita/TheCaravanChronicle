import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getComplaints } from "../../api/complaintAPI";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import { formatDate, isOverdue, getHoursRemaining } from "../../utils/helpers";
import { FiInbox, FiFilter, FiPlusCircle } from "react-icons/fi";

const MyComplaints = () => {
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["my-complaints", filters],
    queryFn: () =>
      getComplaints({
        status: filters.status || undefined,
        category: filters.category || undefined,
        page: filters.page,
        limit: 10,
      }),
  });

  const complaints = data?.complaints || [];
  const totalPages = data?.totalPages || 1;

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center 
                      sm:justify-between gap-3 mb-6"
      >
        <div>
          <h1 className="text-xl md:text-2xl font-circus text-circus-tent">
            My Complaints
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {data?.total || 0} total complaints
          </p>
        </div>
        <div className="flex gap-2">
          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <FiFilter className="text-sm" />
            Filters
          </button>
          <Link to="/submit" className="btn-primary flex items-center gap-2">
            <FiPlusCircle />
            New
          </Link>
        </div>
      </div>

      {/* Filter panel — collapsible */}
      {showFilters && (
        <div className="card mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Status
              </label>
              <select
                name="status"
                className="input-field text-sm"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Category
              </label>
              <select
                name="category"
                className="input-field text-sm"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                <option value="Road Damage">Road Damage</option>
                <option value="Water Leakage">Water Leakage</option>
                <option value="Garbage">Garbage</option>
                <option value="Electrical Issue">Electrical Issue</option>
                <option value="Structural Damage">Structural Damage</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Noise Complaint">Noise Complaint</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() =>
                  setFilters({ status: "", category: "", page: 1 })
                }
                className="text-sm text-circus-red hover:underline"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complaints list */}
      <div className="card">
        {isLoading ? (
          <Spinner center />
        ) : complaints.length === 0 ? (
          <EmptyState
            icon={<FiInbox />}
            title="No complaints found"
            message="No complaints match your current filters."
            action={
              <Link to="/submit" className="btn-primary">
                Submit a Complaint
              </Link>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    {[
                      "Title",
                      "Category",
                      "Status",
                      "Priority",
                      "SLA",
                      "Date",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-3 font-medium text-gray-500 
                                   text-xs uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {complaints.map((c) => (
                    <tr
                      key={c._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <Link
                          to={`/complaint/${c._id}`}
                          className="font-medium text-circus-dark hover:text-circus-red 
                                     line-clamp-1 block max-w-[180px]"
                        >
                          {c.title}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-xs">
                        {c.category}
                      </td>
                      <td className="py-3 px-3">
                        <Badge type="status" value={c.status} />
                      </td>
                      <td className="py-3 px-3">
                        <Badge type="priority" value={c.priority} />
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-xs ${
                            isOverdue(c.slaDeadline, c.status)
                              ? "text-red-500 font-medium"
                              : "text-gray-400"
                          }`}
                        >
                          {getHoursRemaining(c.slaDeadline)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-400 text-xs">
                        {formatDate(c.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className="flex items-center justify-between mt-4 pt-4 
                              border-t border-gray-100"
              >
                <button
                  onClick={() =>
                    setFilters((f) => ({ ...f, page: f.page - 1 }))
                  }
                  disabled={filters.page === 1}
                  className="btn-secondary text-xs px-3 py-1.5 
                             disabled:opacity-40"
                >
                  ← Previous
                </button>
                <span className="text-xs text-gray-500">
                  Page {filters.page} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setFilters((f) => ({ ...f, page: f.page + 1 }))
                  }
                  disabled={filters.page === totalPages}
                  className="btn-secondary text-xs px-3 py-1.5 
                             disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyComplaints;
