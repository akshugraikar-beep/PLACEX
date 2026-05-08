import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import EmployeeSidebar from "../components/EmployeeSidebar";
import { User, LogOut, ChevronDown, Menu, Bell } from "lucide-react";
import apiClient from "../api/apiClient";
import { Toaster } from "react-hot-toast";

const EmployeeDashboardLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(window.innerWidth >= 1024);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarExpanded(true);
      else setSidebarExpanded(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await apiClient.get("/auth/profile");
        if (response.status === 200) setUserData(response.data);
      } catch {}
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    const titleMap = {
      "/dashboard/employee":               "HR Intelligence Dashboard",
      "/dashboard/employee/candidates":    "Candidate Management",
      "/dashboard/employee/ai-analysis":   "AI Candidate Analysis",
      "/dashboard/employee/shortlisted":   "Shortlisted Candidates",
      "/dashboard/employee/interviews":    "Interview Scheduling",
      "/dashboard/employee/video-call":    "Video Interview Room",
      "/dashboard/employee/hr-analytics":  "HR Analytics & Reports",
      "/dashboard/employee/offer-letter":   "Offer Letter Generator",
      "/dashboard/employee/my-jobs":       "Posted Jobs",
      "/dashboard/employee/post-job":      "Post New Job",
      "/dashboard/employee/applicants":    "Applicants Tracker",
      "/dashboard/employee/insights":      "Company Insights",
      "/dashboard/employee/collaboration": "Institution Collaboration",
      "/dashboard/employee/reports":       "Generate Reports",
      "/dashboard/employee/profile":       "My Profile",
      "/dashboard/employee/settings":      "Settings",
      "/dashboard/employee/performance":   "Performance Overview",
      "/dashboard/employee/skills":        "Skill Development",
      "/dashboard/employee/career":        "Career Progression",
      "/dashboard/employee/learning":      "Learning Resources",
    };
    return titleMap[path] || "HR Portal";
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: { background: "#1e1b4b", color: "#fff", border: "1px solid rgba(124,58,237,0.3)" },
        }}
      />

      {/* Same pattern as student DashboardLayout — min-h-screen flex, natural scroll */}
      <div className="flex hr-layout min-h-screen">
        <EmployeeSidebar isExpanded={sidebarExpanded} setIsExpanded={setSidebarExpanded} />

        {/* Right column — grows and scrolls naturally */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            !isMobile ? (sidebarExpanded ? "ml-64" : "ml-20") : "ml-0"
          }`}
        >
          {/* Sticky topbar */}
          <header className="hr-topbar sticky top-0 z-20 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center min-w-0 flex-1 mr-4">
              {isMobile && (
                <button
                  onClick={() => setSidebarExpanded(true)}
                  className="mr-3 p-1.5 rounded-lg text-slate-400 hover:text-white transition flex-shrink-0"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold hr-text-primary truncate">
                  {getPageTitle()}
                </h1>
                <p className="text-xs hr-text-muted truncate">
                  {userData
                    ? `Welcome back, ${userData.firstName || userData.name || userData.companyName || userData.email}!`
                    : "HR Intelligence Portal — PlaceX"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Bell */}
              <button
                className="relative p-2 rounded-xl transition"
                style={{ background: "var(--hr-input-bg)", border: "var(--hr-input-border)" }}
              >
                <Bell className="w-4 h-4 hr-text-secondary" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
              </button>

              {/* Profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="flex items-center gap-2 p-1.5 rounded-xl transition"
                  style={{ background: "var(--hr-input-bg)", border: "var(--hr-input-border)" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
                  >
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform hidden sm:block ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                    style={{ background: "#0d0d2b", border: "1px solid rgba(124,58,237,0.2)" }}
                  >
                    <div className="px-4 pb-2 pt-1 text-sm">
                      <p className="font-semibold text-white truncate">
                        {userData?.firstName || userData?.name || userData?.companyName || "HR Manager"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{userData?.email || ""}</p>
                    </div>
                    <div className="h-px mx-3 mb-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <button
                      onClick={() => { setDropdownOpen(false); navigate("/dashboard/employee/profile"); }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white transition"
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.12)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 transition"
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main content — grows naturally, no overflow tricks needed */}
          <main className="flex-1 min-h-screen">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboardLayout;
