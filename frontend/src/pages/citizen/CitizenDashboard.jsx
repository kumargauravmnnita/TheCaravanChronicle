import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiPlusCircle, FiList, FiClock, FiCheckCircle } from "react-icons/fi";
import {
  FiClipboard,
  FiAlertCircle,
  FiLoader,
  FiCheckCircle,
} from "react-icons/fi";
import { getComplaints } from "../../api/complaintAPI";
import useAuthStore from "../../store/authStore";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import { formatDate, isOverdue } from "../../utils/helpers";

const CitizenDashboard = () => {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["my-complaints"],
    queryFn: () => getComplaints({ limit: 5 }),
  });

  const complaints = data?.complaints || [];
  const total = data?.total || 0;

  const { data: allData } = useQuery({
    queryKey: ["my-complaints-all"],
    queryFn: () => getComplaints({ limit: 100 }),
  });

  const allComplaints = allData?.complaints || [];
  const openCount = allComplaints.filter((c) => c.status === "Open").length;
  const inProgressCount = allComplaints.filter(
    (c) => c.status === "In Progress",
  ).length;
  const resolvedCount = allComplaints.filter(
    (c) => c.status === "Resolved",
  ).length;

  return (
    <DashboardLayout>
      {/* Page header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center 
                      sm:justify-between gap-3 mb-6"
      >
        <div>
          <h1 className="text-xl md:text-2xl font-circus text-circus-tent">
            Welcome, {user?.name}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {user?.area} · Citizen Portal
          </p>
        </div>
        <Link
          to="/submit"
          className="btn-primary flex items-center gap-2 
                                      w-full sm:w-auto justify-center"
        >
          <FiPlusCircle />
          New Complaint
        </Link>
      </div>

      {/* Stats row — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard
          label="Total Submitted"
          value={allComplaints.length}
          icon={<FiClipboard />}
          color="blue"
        />
        <StatCard
          label="Open"
          value={openCount}
          icon={<FiAlertCircle />}
          color="red"
        />
        <StatCard
          label="In Progress"
          value={inProgressCount}
          icon={<FiLoader />}
          color="yellow"
        />
        <StatCard
          label="Resolved"
          value={resolvedCount}
          icon={<FiCheckCircle />}
          color="green"
        />
      </div>

      {/* Recent complaints table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-circus text-circus-dark">
            Recent Complaints
          </h2>
          <Link
            to="/my-complaints"
            className="text-sm text-circus-red hover:underline"
          >
            View all →
          </Link>
        </div>

        {isLoading ? (
          <Spinner center />
        ) : complaints.length === 0 ? (
          <EmptyState
            icon={<FiInbox />}
            title="No complaints yet"
            message="You haven't submitted any complaints. The circus is running smoothly!"
            action={
              <Link to="/submit" className="btn-primary">
                Submit First Complaint
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th
                    className="text-left py-2 px-4 md:px-2 font-medium 
                                 text-gray-500 text-xs uppercase tracking-wide"
                  >
                    Title
                  </th>
                  <th
                    className="text-left py-2 px-2 font-medium text-gray-500 
                                 text-xs uppercase tracking-wide hidden sm:table-cell"
                  >
                    Category
                  </th>
                  <th
                    className="text-left py-2 px-2 font-medium text-gray-500 
                                 text-xs uppercase tracking-wide"
                  >
                    Status
                  </th>
                  <th
                    className="text-left py-2 px-2 font-medium text-gray-500 
                                 text-xs uppercase tracking-wide hidden md:table-cell"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {complaints.map((complaint) => (
                  <tr
                    key={complaint._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 md:px-2">
                      <Link
                        to={`/complaint/${complaint._id}`}
                        className="font-medium text-circus-dark hover:text-circus-red 
                                   transition-colors line-clamp-1"
                      >
                        {complaint.title}
                      </Link>
                      {/* Show category below title on mobile */}
                      <p className="text-xs text-gray-400 sm:hidden mt-0.5">
                        {complaint.category}
                      </p>
                    </td>
                    <td className="py-3 px-2 text-gray-500 hidden sm:table-cell">
                      {complaint.category}
                    </td>
                    <td className="py-3 px-2">
                      <Badge type="status" value={complaint.status} />
                      {/* Show overdue warning */}
                      {isOverdue(complaint.slaDeadline, complaint.status) && (
                        <span className="block text-xs text-red-500 mt-0.5">
                          ⚠ Overdue
                        </span>
                      )}
                    </td>
                    <td
                      className="py-3 px-2 text-gray-400 text-xs 
                                   hidden md:table-cell"
                    >
                      {formatDate(complaint.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CitizenDashboard;
