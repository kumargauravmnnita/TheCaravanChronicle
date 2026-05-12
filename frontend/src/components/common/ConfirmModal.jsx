const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  danger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center 
                    justify-center z-50 p-4"
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5 md:p-6
                      animate-fade-in"
      >
        <h3 className="text-base md:text-lg font-circus text-circus-dark mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="btn-secondary text-xs md:text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`text-xs md:text-sm px-4 py-2 rounded-lg font-medium 
                        text-white transition-colors
                        ${
                          danger
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-circus-red hover:bg-circus-darkred"
                        }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
