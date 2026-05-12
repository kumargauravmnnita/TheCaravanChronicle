const Spinner = ({ size = "md", center = false }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={
        center
          ? "flex justify-center items-center min-h-[200px]"
          : "flex justify-center items-center"
      }
    >
      <div
        className={`${sizes[size]} border-gray-200 border-t-circus-red rounded-full animate-spin`}
      />
    </div>
  );
};

export default Spinner;
