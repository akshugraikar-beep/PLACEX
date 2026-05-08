import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const SimpleAuthPage = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login Form
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register Form
  const [registerData, setRegisterData] = useState({
    fullName: "",
    university: "",
    major: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: loginData.email,
          password: loginData.password,
        }
      );

      const { token, user } = response.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("✅ Login successful!");
      
      // Redirect based on role
      const role = user.role?.toLowerCase();
      if (role === "student") {
        navigate("/dashboard");
      } else if (role === "institution") {
        navigate("/dashboard/institution");
      } else if (role === "company") {
        navigate("/dashboard/company");
      } else if (role === "employee") {
        navigate("/dashboard/employee");
      } else {
        navigate("/dashboard");
      }

      setIsAuthenticated(true);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed";
      toast.error(`❌ ${errorMsg}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!registerData.fullName || !registerData.email || !registerData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register/student`,
        {
          fullName: registerData.fullName,
          university: registerData.university || "Not specified",
          major: registerData.major || "Not specified",
          email: registerData.email,
          password: registerData.password,
          role: "student",
        }
      );

      toast.success("✅ Registration successful! Please login.");
      
      // Reset and switch to login
      setRegisterData({
        fullName: "",
        university: "",
        major: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setIsLogin(true);
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed";
      toast.error(`❌ ${errorMsg}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">PlaceX</h1>
          <p className="text-blue-100">Smarter Placements, Sharper Talent</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {isLogin ? (
            // LOGIN FORM
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                    <Mail size={18} className="text-gray-400 mr-2" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      className="w-full outline-none"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                    <Lock size={18} className="text-gray-400 mr-2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="w-full outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              {/* Toggle to Register */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </>
          ) : (
            // REGISTER FORM
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign Up</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={registerData.fullName}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, fullName: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                {/* University */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Your University"
                    value={registerData.university}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, university: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Major */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Major/Field (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Computer Science"
                    value={registerData.major}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, major: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                    <Mail size={18} className="text-gray-400 mr-2" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, email: e.target.value })
                      }
                      className="w-full outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                    <Lock size={18} className="text-gray-400 mr-2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, password: e.target.value })
                      }
                      className="w-full outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                    <Lock size={18} className="text-gray-400 mr-2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full outline-none"
                    />
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
              </form>

              {/* Toggle to Login */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Login
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-blue-100">
          <p className="text-sm">
            © 2025 PlaceX. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleAuthPage;
