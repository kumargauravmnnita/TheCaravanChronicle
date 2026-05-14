import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
  FiList,
} from "react-icons/fi";
import {
  getComplaints,
  updateComplaintStatus,
  getComplaintStats,
} from "../../api/complaintAPI";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import StatCard from "../../components/common/StatCard";
import { formatDate, isOverdue, getHoursRemaining } from "../../utils/helpers";
import toast from "react-hot-toast";

const StatusDropdown = ({ complaint, onUpdate }) => {
  const [updating, setUpdating] = useState(false);

  const handleChange = async (e) => {
    setUpdating(true);
    await onUpdate(complaint._id, e.target.value);
    setUpdating(false);
  };

  return (
    <select
      value={complaint.status}
      onChange={handleChange}
      disabled={updating}
      className="text-xs border border-gray-200 rounded-lg px-2 py-1
                 focus:outline-none focus:ring-1 focus:ring-circus-red
                 bg-white disabled:opacity-50 cursor-pointer"
    >
      <option value="Open">Open</option>
      <option value="In Progress">In Progress</option>
      <option value="Resolved">Resolved</option>
      <option value="Escalated">Escalated</option>
      <option value="Closed">Closed</option>
    </select>
  );
};

const StaffDashboard = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
    search: "",
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["all-complaints", filters],
    queryFn: () =>
      getComplaints({
        status: filters.status || undefined,
        category: filters.category || undefined,
        priority: filters.priority || undefined,
        search: filters.search || undefined,
        page: filters.page,
        limit: 10,
      }),
  });

  const { data: stats } = useQuery({
    queryKey: ["complaint-stats"],
    queryFn: getComplaintStats,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateComplaintStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-complaints"]);
      queryClient.invalidateQueries(["complaint-stats"]);
      toast.success("Status updated successfully");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const handleStatusUpdate = async (id, status) => {
    statusMutation.mutate({ id, status });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchInput, page: 1 });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const clearFilters = () => {
    setFilters({ status: "", category: "", priority: "", search: "", page: 1 });
    setSearchInput("");
  };

  const complaints = data?.complaints || [];
  const totalPages = data?.totalPages || 1;

  const getStatCount = (statusName) => {
    const found = stats?.byStatus?.find((s) => s._id === statusName);
    return found?.count || 0;
  };

  return (
    <DashboardLayout>
      {/* Page header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center
                      sm:justify-between gap-3 mb-6"
      >
        <div>
          <h1 className="text-xl md:text-2xl font-circus text-circus-tent">
            Staff Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage and resolve citizen complaints
          </p>
        </div>
        <button
          onClick={() => queryClient.invalidateQueries(["all-complaints"])}
          className="btn-secondary flex items-center gap-2 w-full sm:w-auto
                     justify-center"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard
          label="Total Complaints"
          value={stats?.total || 0}
          icon={<FiList className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          label="Open"
          value={getStatCount("Open")}
          icon={<FiAlertTriangle className="w-5 h-5" />}
          color="red"
        />
        <StatCard
          label="In Progress"
          value={getStatCount("In Progress")}
          icon={<FiClock className="w-5 h-5" />}
          color="yellow"
        />
        <StatCard
          label="Resolved"
          value={stats?.resolved || 0}
          icon={<FiCheckCircle className="w-5 h-5" />}
          color="green"
          sub={`${stats?.overdue || 0} overdue`}
        />
      </div>

      {/* Search + Filter bar */}
      <div className="card mb-4">
        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2
                                  text-gray-400 w-4 h-4"
            />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-field pl-9 text-sm"
            />
          </div>
          <button type="submit" className="btn-primary px-4">
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-1.5 px-3"
          >
            <FiFilter className="w-4 h-4" />
            <span className="hidden sm:block">Filters</span>
          </button>
        </form>

        {/* Collapsible filter row */}
        {showFilters && (
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3
                          border-t border-gray-100"
          >
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
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Priority
              </label>
              <select
                name="priority"
                className="input-field text-sm"
                value={filters.priority}
                onChange={handleFilterChange}
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-circus-red hover:underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Complaints table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-700">
            {data?.total || 0} complaints found
          </h2>
        </div>

        {isLoading ? (
          <Spinner center />
        ) : complaints.length === 0 ? (
          <EmptyState
            icon={<FiList className="w-8 h-8 text-gray-300" />}
            title="No complaints found"
            message="No complaints match your current filters."
          />
        ) : (
          <>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    {[
                      "Title",
                      "Category",
                      "Area",
                      "Priority",
                      "Status",
                      "SLA",
                      "Submitted",
                      "",
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
                      className={`hover:bg-gray-50 transition-colors
                        ${
                          isOverdue(c.slaDeadline, c.status)
                            ? "bg-red-50 hover:bg-red-50"
                            : ""
                        }`}
                    >
                      <td className="py-3 px-3">
                        <Link
                          to={`/complaint/${c._id}`}
                          className="font-medium text-circus-dark
                                     hover:text-circus-red line-clamp-1
                                     block max-w-[160px]"
                        >
                          {c.title}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {c.submittedBy?.name}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-500">
                        {c.category}
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-500">
                        {c.area}
                      </td>
                      <td className="py-3 px-3">
                        <Badge type="priority" value={c.priority} />
                      </td>
                      <td className="py-3 px-3">
                        {/* Inline status dropdown for quick updates */}
                        <StatusDropdown
                          complaint={c}
                          onUpdate={handleStatusUpdate}
                        />
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
                      <td className="py-3 px-3 text-xs text-gray-400">
                        {formatDate(c.createdAt)}
                      </td>
                      <td className="py-3 px-3">
                        <Link
                          to={`/complaint/${c._id}`}
                          className="text-xs text-circus-red hover:underline
                                     whitespace-nowrap"
                        >
                          View
                        </Link>
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
                  Previous
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
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
