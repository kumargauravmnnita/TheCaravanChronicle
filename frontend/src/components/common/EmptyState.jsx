const EmptyState = ({ icon, title, message, action }) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 md:py-16 
                    text-center px-4"
    >
      <div className="text-5xl md:text-6xl mb-4">{icon || ""}</div>
      <h3 className="text-base md:text-lg font-circus text-gray-700 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 max-w-xs md:max-w-sm mb-4">
        {message}
      </p>
      {}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;
