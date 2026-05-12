export const getStatusColor = (status) => {
  const colors = {
    Open: "bg-blue-100 text-blue-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Resolved: "bg-green-100 text-green-800",
    Escalated: "bg-red-100 text-red-800",
    Closed: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export const getPriorityColor = (priority) => {
  const colors = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-orange-100 text-orange-800",
    Critical: "bg-red-100 text-red-800",
  };
  return colors[priority] || "bg-gray-100 text-gray-800";
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const isOverdue = (slaDeadline, status) => {
  if (status === "Resolved" || status === "Closed") return false;
  return new Date(slaDeadline) < new Date();
};

export const getHoursRemaining = (slaDeadline) => {
  const diff = new Date(slaDeadline) - new Date();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 0) return "Overdue";
  if (hours < 24) return `${hours}h remaining`;
  return `${Math.floor(hours / 24)}d remaining`;
};
