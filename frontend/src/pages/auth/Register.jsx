import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authAPI";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";

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

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    area: "General",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        area: formData.area,
      });
      login(data, data.token);
      toast.success(`Welcome to the circus, ${data.name}! 🎪`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-circus-cream flex items-center 
                    justify-center px-4 py-8"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl md:text-6xl mb-3">🎪</div>
          <h1 className="text-2xl md:text-3xl font-circus text-circus-tent mb-1">
            Join the Circus
          </h1>
          <p className="text-gray-500 text-sm">Create your citizen account</p>
        </div>

        <div className="card">
          <h2 className="text-lg md:text-xl font-circus text-circus-dark mb-5">
            Register as a Citizen
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + Area — side by side on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="input-field"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Area
                </label>
                <select
                  name="area"
                  className="input-field"
                  value={formData.area}
                  onChange={handleChange}
                >
                  {CIRCUS_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="input-field"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password + Confirm — side by side on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="input-field pr-10"
                    placeholder="Min 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 
                               text-gray-400 hover:text-gray-600 text-xs"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="input-field"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-2.5 mt-2 flex items-center 
                         justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Join the Circus 🎪"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already a citizen?{" "}
            <Link
              to="/login"
              className="text-circus-red hover:underline font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
