import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getComplaintById } from "../../api/complaintAPI";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";
import { formatDate, isOverdue, getHoursRemaining } from "../../utils/helpers";
import {
  FiArrowLeft,
  FiMapPin,
  FiClock,
  FiUser,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: complaint,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["complaint", id],
    queryFn: () => getComplaintById(id),
  });

  if (isLoading)
    return (
      <DashboardLayout>
        <Spinner center />
      </DashboardLayout>
    );

  if (error)
    return (
      <DashboardLayout>
        <div className="text-center py-16 text-red-500">
          Complaint not found
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 
                   hover:text-circus-red mb-5 transition-colors"
      >
        <FiArrowLeft />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title card */}
          <div className="card">
            <div className="flex flex-wrap items-start gap-2 mb-3">
              <Badge type="status" value={complaint.status} />
              <Badge type="priority" value={complaint.priority} />
              {isOverdue(complaint.slaDeadline, complaint.status) && (
                <span className="badge bg-red-100 text-red-700 flex items-center gap-1">
                  <FiAlertTriangle className="w-3 h-3" />
                  Overdue
                </span>
              )}
            </div>
            <h1 className="text-lg md:text-xl font-circus text-circus-dark mb-2">
              {complaint.title}
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {/* Images */}
          {complaint.images?.length > 0 && (
            <div className="card">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Attached Photos
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {complaint.images.map((img, i) => (
                  <a
                    key={i}
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={img.url}
                      alt={`Complaint image ${i + 1}`}
                      className="w-full h-28 sm:h-36 object-cover rounded-lg
                                 hover:opacity-90 transition-opacity cursor-pointer
                                 border border-gray-100"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Status History Timeline */}
          <div className="card">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Status History
            </h3>
            <div className="space-y-3">
              {complaint.statusHistory?.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-circus-red mt-1" />
                    {i < complaint.statusHistory.length - 1 && (
                      <div className="w-0.5 bg-gray-200 flex-1 mt-1" />
                    )}
                  </div>
                  <div className="pb-3 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge type="status" value={entry.status} />
                      <span className="text-xs text-gray-400">
                        {formatDate(entry.changedAt)}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-xs text-gray-500 mt-1">{entry.note}</p>
                    )}
                    {entry.changedBy && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        by {entry.changedBy.name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Complaint Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-gray-400 w-20 flex-shrink-0">
                  Category
                </span>
                <span className="text-gray-700 font-medium">
                  {complaint.category}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <FiMapPin className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700">{complaint.area}</p>
                  <p className="text-gray-500 text-xs">{complaint.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FiUser className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700">{complaint.submittedBy?.name}</p>
                  <p className="text-gray-500 text-xs">
                    {complaint.submittedBy?.email}
                  </p>
                </div>
              </div>
              {complaint.assignedTo && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 w-20 flex-shrink-0 text-xs">
                    Assigned to
                  </span>
                  <span className="text-gray-700 text-xs">
                    {complaint.assignedTo.name}
                  </span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <FiClock className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">
                    Submitted {formatDate(complaint.createdAt)}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${
                      isOverdue(complaint.slaDeadline, complaint.status)
                        ? "text-red-500 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    SLA: {getHoursRemaining(complaint.slaDeadline)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {complaint.resolutionNote && (
            <div className="card border-l-4 border-green-400">
              <h3
                className="text-sm font-medium text-green-700 mb-1
                             flex items-center gap-1.5"
              >
                <FiCheckCircle className="w-4 h-4" />
                Resolution Note
              </h3>
              <p className="text-sm text-gray-600">
                {complaint.resolutionNote}
              </p>
              {complaint.resolvedAt && (
                <p className="text-xs text-gray-400 mt-1">
                  Resolved on {formatDate(complaint.resolvedAt)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComplaintDetail;
