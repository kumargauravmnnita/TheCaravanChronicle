import { useQuery } from "@tanstack/react-query";
import { getPublicStats } from "../api/complaintAPI";
import { Link } from "react-router-dom";
import CircusLogo from "../components/common/CircusLogo";
import Spinner from "../components/common/Spinner";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiAlertTriangle,
  FiTrendingUp,
  FiList,
} from "react-icons/fi";
import { formatDate } from "../utils/helpers";

const PublicStatCard = ({ icon, label, value, color }) => {
  const colors = {
    green: "border-green-200 bg-green-50 text-green-700",
    red: "border-red-200 bg-red-50 text-red-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
    orange: "border-orange-200 bg-orange-50 text-orange-700",
  };

  return (
    <div className={`rounded-xl border-2 p-4 md:p-5 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <p className="text-xs font-medium uppercase tracking-wide opacity-75">
          {label}
        </p>
      </div>
      <p className="text-2xl md:text-3xl font-circus">{value}</p>
    </div>
  );
};

const PublicPortal = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["public-stats"],
    queryFn: getPublicStats,
    refetchInterval: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-circus-cream">
      {/* Header */}
      <header
        className="bg-circus-tent text-white px-4 md:px-8 py-4
                         flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <CircusLogo size={40} />
          <div>
            <h1
              className="font-circus text-base md:text-lg text-circus-gold
                           leading-none"
            >
              Circus of Wonders
            </h1>
            <p className="text-xs text-gray-300 leading-none mt-0.5">
              Public Transparency Portal
            </p>
          </div>
        </div>
        <Link to="/login" className="text-sm text-circus-gold hover:underline">
          Citizen Login
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Title */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-circus text-circus-tent mb-2">
            Grounds Status Report
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
            Live statistics on citizen complaints and resolutions across the
            Circus of Wonders grounds.
          </p>
          <p className="text-xs text-gray-400 mt-2">Updates every 5 minutes</p>
        </div>

        {isLoading ? (
          <Spinner center />
        ) : (
          <>
            {/* Resolution rate highlight */}
            <div
              className="bg-circus-tent text-white rounded-2xl p-6 md:p-8
                            text-center mb-6 md:mb-8"
            >
              <p className="text-sm text-gray-300 mb-1 uppercase tracking-wide">
                Overall Resolution Rate
              </p>
              <p className="text-5xl md:text-6xl font-circus text-circus-gold">
                {stats?.resolutionRate || 0}%
              </p>
              <p className="text-sm text-gray-300 mt-2">
                {stats?.resolved} of {stats?.total} complaints resolved
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
              <PublicStatCard
                icon={<FiList className="w-5 h-5" />}
                label="Total Complaints"
                value={stats?.total || 0}
                color="blue"
              />
              <PublicStatCard
                icon={<FiCheckCircle className="w-5 h-5" />}
                label="Resolved"
                value={stats?.resolved || 0}
                color="green"
              />
              <PublicStatCard
                icon={<FiAlertCircle className="w-5 h-5" />}
                label="Open"
                value={stats?.open || 0}
                color="red"
              />
              <PublicStatCard
                icon={<FiClock className="w-5 h-5" />}
                label="In Progress"
                value={stats?.inProgress || 0}
                color="yellow"
              />
              <PublicStatCard
                icon={<FiAlertTriangle className="w-5 h-5" />}
                label="Escalated"
                value={stats?.escalated || 0}
                color="orange"
              />
              <PublicStatCard
                icon={<FiTrendingUp className="w-5 h-5" />}
                label="Overdue"
                value={stats?.overdue || 0}
                color="purple"
              />
            </div>

            {/* Category breakdown */}
            <div className="card mb-6">
              <h3 className="text-base font-circus text-circus-dark mb-4">
                Complaints by Category
              </h3>
              <div className="space-y-3">
                {stats?.byCategory?.map((cat) => (
                  <div key={cat._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{cat._id}</span>
                      <span className="font-medium text-circus-dark">
                        {cat.count}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-circus-red h-2 rounded-full
                                   transition-all duration-500"
                        style={{
                          width: `${Math.round(
                            (cat.count / stats.total) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently resolved */}
            {stats?.recentResolved?.length > 0 && (
              <div className="card">
                <h3 className="text-base font-circus text-circus-dark mb-4">
                  Recently Resolved
                </h3>
                <div className="space-y-2">
                  {stats.recentResolved.map((c) => (
                    <div
                      key={c._id}
                      className="flex items-start justify-between
                                 py-2 border-b border-gray-50 last:border-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-sm font-medium text-circus-dark
                                      truncate"
                        >
                          {c.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {c.category} · {c.area}
                        </p>
                      </div>
                      <span
                        className="text-xs text-green-600 font-medium
                                       ml-3 flex-shrink-0"
                      >
                        {formatDate(c.resolvedAt)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer
        className="text-center py-6 text-xs text-gray-400 border-t
                         border-gray-200 mt-8"
      >
        Circus of Wonders — Grounds Manager
        <span className="mx-2">·</span>
        <Link to="/login" className="text-circus-red hover:underline">
          Staff Login
        </Link>
      </footer>
    </div>
  );
};

export default PublicPortal;
