import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitComplaint } from "../../api/complaintAPI";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { FiUpload, FiX } from "react-icons/fi";

const CATEGORIES = [
  "Road Damage",
  "Water Leakage",
  "Garbage",
  "Electrical Issue",
  "Structural Damage",
  "Sanitation",
  "Noise Complaint",
  "Other",
];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

const CIRCUS_AREAS = [
  "Main Ring",
  "Big Top",
  "Animal Quarters",
  "Performers Tent",
  "Food Court",
  "Parking Grounds",
  "Storage Area",
  "General",
];

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    area: "",
    location: "",
    priority: "Medium",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const mutation = useMutation({
    mutationFn: submitComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries(["my-complaints"]);
      queryClient.invalidateQueries(["my-complaints-all"]);
      toast.success(
        "Complaint submitted! The Ringmaster has been notified. 🎪",
      );
      navigate("/my-complaints");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Submission failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.area) {
      toast.error("Please select an area");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("area", formData.area);
    data.append("location", formData.location);
    data.append("priority", formData.priority);

    images.forEach((image) => {
      data.append("images", image);
    });

    mutation.mutate(data);
  };

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-circus text-circus-tent">
          Submit a Complaint
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Report an issue in the circus grounds
        </p>
      </div>

      {/* Form card */}
      <div className="max-w-2xl">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complaint Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                className="input-field"
                placeholder="Brief title of the issue"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </div>

            {/* Category + Priority — side by side on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  className="input-field"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  className="input-field"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Area + Location — side by side on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area <span className="text-red-500">*</span>
                </label>
                <select
                  name="area"
                  className="input-field"
                  value={formData.area}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select area</option>
                  {CIRCUS_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specific Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  className="input-field"
                  placeholder="e.g. Near Tent 3 entrance"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                className="input-field resize-none"
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                maxLength={1000}
              />
              {/* Character counter */}
              <p className="text-xs text-gray-400 text-right mt-1">
                {formData.description.length}/1000
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photos (optional — max 5)
              </label>

              {/* Custom file upload button */}
              <label
                className="flex items-center gap-2 cursor-pointer 
                                border-2 border-dashed border-gray-300 rounded-lg 
                                p-4 hover:border-circus-red transition-colors
                                text-gray-500 hover:text-circus-red"
              >
                <FiUpload className="text-lg flex-shrink-0" />
                <span className="text-sm">
                  Click to upload images (JPG, PNG, WEBP)
                </span>
                {/* Hidden actual file input — the label above triggers it */}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Image previews grid */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-16 sm:h-20 object-cover rounded-lg 
                                   border border-gray-200"
                      />
                      {/* Remove button — appears on hover */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 
                                   text-white rounded-full w-5 h-5 flex items-center 
                                   justify-center text-xs hover:bg-red-600
                                   opacity-0 group-hover:opacity-100 
                                   transition-opacity"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="btn-primary flex items-center justify-center 
                           gap-2 py-2.5 flex-1"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Spinner size="sm" />
                ) : (
                  "Submit Complaint"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary py-2.5 flex-1 sm:flex-none sm:px-6"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubmitComplaint;
