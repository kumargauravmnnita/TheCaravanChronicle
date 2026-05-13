import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authAPI";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";
import CircusLogo from "../../components/common/CircusLogo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      login(data, data.token);
      toast.success(`Welcome back, ${data.name}!`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    /*
      min-h-screen — fills full viewport height
      px-4 — horizontal padding so content doesn't touch screen edges on mobile
    */
    <div
      className="min-h-screen bg-circus-cream flex items-center 
                    justify-center px-4 py-8"
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <CircusLogo size={72} />
          <h1 className="text-2xl md:text-3xl font-circus text-circus-tent mt-3">
            Circus of Wonders
          </h1>
          <p className="text-gray-500 text-sm mt-1">Grounds Manager Portal</p>
        </div>

        {/* Card */}
        <div className="card">
          <h2 className="text-lg md:text-xl font-circus text-circus-dark mb-5">
            Welcome Back, Citizen
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              {/* Password field with show/hide toggle */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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

            <button
              type="submit"
              className="btn-primary w-full py-2.5 mt-2 flex items-center 
                         justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Enter the Circus"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            New citizen?{" "}
            <Link
              to="/register"
              className="text-circus-red hover:underline font-medium"
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Demo credentials hint */}
        <div
          className="mt-4 p-3 bg-yellow-50 border border-yellow-200 
                        rounded-lg text-xs text-yellow-800 text-center"
        >
          Register an account then ask admin to promote your role if needed
        </div>
      </div>
    </div>
  );
};

export default Login;
