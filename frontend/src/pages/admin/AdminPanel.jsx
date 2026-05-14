import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiUsers,
  FiShield,
  FiUserX,
  FiSearch,
  FiUser,
  FiAlertTriangle,
} from "react-icons/fi";
import { getAllUsers, updateUserRole, deactivateUser } from "../../api/userAPI";
import { getComplaintStats } from "../../api/complaintAPI";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import Spinner from "../../components/common/Spinner";
import ConfirmModal from "../../components/common/ConfirmModal";
import EmptyState from "../../components/common/EmptyState";
import { formatDate } from "../../utils/helpers";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

const roleBadge = {
  admin: "bg-purple-100 text-purple-800",
  staff: "bg-blue-100 text-blue-800",
  citizen: "bg-green-100 text-green-800",
};

const AdminPanel = () => {
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "",
    userId: null,
    userName: "",
    newRole: "",
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: getAllUsers,
  });

  const { data: stats } = useQuery({
    queryKey: ["complaint-stats"],
    queryFn: getComplaintStats,
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
      toast.success("User role updated successfully");
    },
    onError: () => toast.error("Failed to update role"),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id) => deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
      toast.success("User deactivated successfully");
    },
    onError: () => toast.error("Failed to deactivate user"),
  });

  const handleRoleChange = (userId, userName, newRole) => {
    setConfirmModal({
      isOpen: true,
      type: "role",
      userId,
      userName,
      newRole,
    });
  };

  const handleDeactivate = (userId, userName) => {
    setConfirmModal({
      isOpen: true,
      type: "deactivate",
      userId,
      userName,
      newRole: "",
    });
  };

  const handleConfirm = () => {
    if (confirmModal.type === "role") {
      roleMutation.mutate({
        id: confirmModal.userId,
        role: confirmModal.newRole,
      });
    } else if (confirmModal.type === "deactivate") {
      deactivateMutation.mutate(confirmModal.userId);
    }
    setConfirmModal({
      isOpen: false,
      type: "",
      userId: null,
      userName: "",
      newRole: "",
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const countByRole = (role) => users.filter((u) => u.role === role).length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-circus text-circus-tent">
          Admin Panel
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage circus citizens, staff and complaints
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard
          label="Total Users"
          value={users.length}
          icon={<FiUsers className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          label="Staff Members"
          value={countByRole("staff")}
          icon={<FiShield className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          label="Citizens"
          value={countByRole("citizen")}
          icon={<FiUser className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          label="Overdue Issues"
          value={stats?.overdue || 0}
          icon={<FiAlertTriangle className="w-5 h-5" />}
          color="red"
        />
      </div>

      {/* User management table */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2
                                  text-gray-400 w-4 h-4"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 text-sm"
            />
          </div>
          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field text-sm sm:w-40"
          >
            <option value="">All Roles</option>
            <option value="citizen">Citizens</option>
            <option value="staff">Staff</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {isLoading ? (
          <Spinner center />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={<FiUsers className="w-8 h-8 text-gray-300" />}
            title="No users found"
            message="No users match your search."
          />
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["User", "Email", "Area", "Role", "Joined", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-3 font-medium
                                   text-gray-500 text-xs uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Name + status */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {/* Avatar circle with initials */}
                        <div
                          className="w-7 h-7 rounded-full bg-circus-red
                                        flex items-center justify-center
                                        text-white text-xs font-medium
                                        flex-shrink-0"
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p
                            className="font-medium text-circus-dark
                                        text-xs md:text-sm"
                          >
                            {u.name}
                          </p>
                          {!u.isActive && (
                            <p className="text-xs text-red-500">Deactivated</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-500">
                      {u.email}
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-500">
                      {u.area}
                    </td>
                    {/* Role badge */}
                    <td className="py-3 px-3">
                      <span className={`badge ${roleBadge[u.role]}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-400">
                      {formatDate(u.createdAt)}
                    </td>
                    {/* Actions */}
                    <td className="py-3 px-3">
                      {/* Don't show actions for current logged-in admin */}
                      {u._id !== currentUser._id ? (
                        <div className="flex items-center gap-2">
                          {/* Role change dropdown */}
                          <select
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(u._id, u.name, e.target.value)
                            }
                            className="text-xs border border-gray-200 rounded-lg
                                       px-2 py-1 focus:outline-none
                                       focus:ring-1 focus:ring-circus-red
                                       bg-white cursor-pointer"
                          >
                            <option value="citizen">Citizen</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                          </select>
                          {/* Deactivate button — only for active users */}
                          {u.isActive && (
                            <button
                              onClick={() => handleDeactivate(u._id, u.name)}
                              className="p-1.5 text-gray-400 hover:text-red-500
                                         transition-colors rounded"
                              title="Deactivate user"
                            >
                              <FiUserX className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          You
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.type === "role"
            ? `Change role to ${confirmModal.newRole}?`
            : "Deactivate user?"
        }
        message={
          confirmModal.type === "role"
            ? `${confirmModal.userName} will be assigned the role of ${confirmModal.newRole}.`
            : `${confirmModal.userName}'s account will be deactivated. They will not be able to login.`
        }
        onConfirm={handleConfirm}
        onCancel={() =>
          setConfirmModal({
            isOpen: false,
            type: "",
            userId: null,
            userName: "",
            newRole: "",
          })
        }
        confirmText={
          confirmModal.type === "role" ? "Change Role" : "Deactivate"
        }
        danger={confirmModal.type === "deactivate"}
      />
    </DashboardLayout>
  );
};

export default AdminPanel;
