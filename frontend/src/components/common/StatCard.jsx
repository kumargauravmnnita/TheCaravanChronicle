const StatCard = ({ label, value, icon, color = "red", sub }) => {
  const colors = {
    red: "bg-red-50 text-circus-red",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div
      className="card flex items-start gap-4 hover:shadow-card-hover 
                    transition-shadow duration-200"
    >
      {/* Icon box */}
      <div
        className={`p-2 md:p-3 rounded-lg text-xl md:text-2xl 
                       flex-shrink-0 ${colors[color]}`}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-xs md:text-sm text-gray-500 font-medium truncate">
          {label}
        </p>
        <p className="text-xl md:text-2xl font-circus text-circus-dark mt-0.5">
          {value}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

export default StatCard;
