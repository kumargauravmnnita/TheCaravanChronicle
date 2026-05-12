import { getStatusColor, getPriorityColor } from "../../utils/helpers";

const Badge = ({ type, value }) => {
  const colorClass =
    type === "status" ? getStatusColor(value) : getPriorityColor(value);

  return <span className={`badge ${colorClass}`}>{value}</span>;
};

export default Badge;
