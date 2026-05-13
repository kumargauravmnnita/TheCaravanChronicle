import { FiInbox } from "react-icons/fi";
const EmptyState = ({ icon, title, message, action }) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 md:py-16 
                    text-center px-4"
    >
      <div
        className="flex justify-center items-center w-16 h-16 md:w-20 md:h-20 
                rounded-full bg-gray-100 mb-4"
      >
        {icon || <FiInbox className="w-8 h-8 text-gray-400" />}
      </div>
      <h3 className="text-base md:text-lg font-circus text-gray-700 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 max-w-xs md:max-w-sm mb-4">
        {message}
      </p>
      {/* Optional action button passed as a prop */}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;
