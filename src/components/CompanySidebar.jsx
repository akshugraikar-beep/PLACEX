import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, BarChart3, Plus, UserCheck, TrendingUp,
  Building2, FileText, Settings, LogOut, ChevronLeft, ChevronRight,
  Moon, Sun, Search, Briefcase, X, Brain, Shield, Calendar,
  MessageSquare, Star, User,
} from "lucide-react";

const CompanySidebar = ({ isExpanded, setIsExpanded }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [openSections, setOpenSections] = useState({ talent: true, recruitment: false, intelligence: false });
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && isExpanded) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, isExpanded]);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const dark = saved === "dark";
    setIsDarkMode(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const sidebarStructure = [
    { icon: LayoutDashboard, label: "HR Dashboard", path: "/dashboard/company", type: "link" },
    {
      icon: Users, label: "Talent", type: "section", sectionKey: "talent",
      children: [
        { icon: Users, label: "Candidate Management", path: "/dashboard/company/candidates", type: "link" },
        { icon: UserCheck, label: "Applicants Tracker", path: "/dashboard/company/applicants", type: "link" },
        { icon: Brain, label: "AI Analysis", path: "/dashboard/company/ai-analysis", type: "link" },
        { icon: Star, label: "Shortlisted", path: "/dashboard/company/shortlisted", type: "link" },
      ],
    },
    {
      icon: Briefcase, label: "Recruitment", type: "section", sectionKey: "recruitment",
      children: [
        { icon: Briefcase, label: "My Jobs", path: "/dashboard/company/my-jobs", type: "link" },
        { icon: Plus, label: "Post New Job", path: "/dashboard/company/post-job", type: "link" },
        { icon: Calendar, label: "Interviews", path: "/dashboard/company/interviews", type: "link" },
      ],
    },
    {
      icon: BarChart3, label: "Intelligence", type: "section", sectionKey: "intelligence",
      children: [
        { icon: TrendingUp, label: "HR Analytics", path: "/dashboard/company/hr-analytics", type: "link" },
        { icon: FileText, label: "Reports", path: "/dashboard/company/reports", type: "link" },
        { icon: TrendingUp, label: "Company Insights", path: "/dashboard/company/insights", type: "link" },
      ],
    },
    { icon: Building2, label: "Collaboration", path: "/dashboard/company/collaboration", type: "link" },
    { icon: User, label: "Profile", path: "/dashboard/company/profile", type: "link" },
    { icon: Settings, label: "Settings", path: "/dashboard/company/settings", type: "link" },
    { icon: isDarkMode ? Sun : Moon, label: isDarkMode ? "Light Mode" : "Dark Mode", onClick: toggleDarkMode, type: "button" },
    { icon: LogOut, label: "Logout", onClick: handleLogout, type: "button" },
  ];

  const toggleSidebar = () => setIsExpanded((prev) => !prev);

  const NavItem = ({ item }) => (
    <div className="relative group px-3">
      <NavLink
        to={item.path}
        end={item.path === "/dashboard/company"}
        className={({ isActive }) =>
          `flex items-center gap-3 py-2.5 rounded-xl mb-1 transition-all duration-200 ${isExpanded ? "px-3" : "justify-center"} ${
            isActive
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
              : "text-slate-400 dark:text-slate-400 hover:bg-white/5 hover:text-white"
          }`
        }
        onClick={() => isMobile && setIsExpanded(false)}
      >
        <item.icon className="w-4 h-4 flex-shrink-0" />
        {isExpanded && <span className="text-sm font-medium truncate">{item.label}</span>}
      </NavLink>
      {!isExpanded && !isMobile && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50 border border-white/10">
          {item.label}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isExpanded && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setIsExpanded(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-[width,transform] duration-300 ease-out ${
          isMobile
            ? `w-72 ${isExpanded ? "translate-x-0" : "-translate-x-full"}`
            : isExpanded ? "w-64" : "w-20"
        }`}
        style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #0d0d2b 100%)', borderRight: '1px solid rgba(124,58,237,0.15)' }}
      >
        {/* Brand */}
        <div className="flex items-center justify-between flex-shrink-0 p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {isExpanded ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 14px rgba(124,58,237,0.5)' }}>
                <span className="text-white font-black text-sm">P</span>
              </div>
              <div>
                <span className="text-white font-bold text-base">PlaceX</span>
                <p className="text-xs text-slate-600">HR Portal</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 14px rgba(124,58,237,0.5)' }}>
              <span className="text-white font-black text-sm">P</span>
            </div>
          )}
          <button onClick={toggleSidebar} className="text-slate-500 hover:text-white transition-colors flex-shrink-0" aria-label="Toggle sidebar">
            {isMobile ? <X size={18} /> : isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Search */}
        {isExpanded && (
          <div className="p-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-3.5 h-3.5" />
              <input
                type="text" placeholder="Search menu..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-slate-300 placeholder-slate-600 pl-9 pr-3 py-2 rounded-xl text-xs outline-none focus:ring-1 focus:ring-violet-500"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              />
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden pt-3 pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent' }}>
          {sidebarStructure.map((item) => {
            if (item.type === "section") {
              const isOpen = openSections[item.sectionKey];
              const filteredChildren = item.children.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase()));
              if (searchQuery && filteredChildren.length === 0) return null;
              return (
                <div key={item.label} className="px-3 mb-1">
                  <button
                    className={`w-full flex items-center gap-3 py-2.5 rounded-xl mb-1 transition-all ${isExpanded ? "px-3" : "justify-center"} text-slate-500 hover:text-slate-300`}
                    onClick={() => setOpenSections(s => ({ ...s, [item.sectionKey]: !s[item.sectionKey] }))}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {isExpanded && (
                      <>
                        <span className="text-xs font-semibold uppercase tracking-wider flex-1 text-left">{item.label}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                      </>
                    )}
                  </button>
                  {isExpanded && (
                    <div className={`pl-4 border-l overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                      style={{ borderColor: 'rgba(124,58,237,0.2)' }}>
                      {filteredChildren.map(child => (
                        <NavLink key={child.label} to={child.path}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 py-2 px-3 rounded-xl mb-0.5 text-sm transition-all ${
                              isActive ? "bg-violet-600/20 text-violet-300 border border-violet-500/20" : "text-slate-500 hover:text-slate-300 hover:bg-white/4"
                            }`
                          }
                          onClick={() => isMobile && setIsExpanded(false)}
                        >
                          <child.icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{child.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (item.type === "link" && item.label.toLowerCase().includes(searchQuery.toLowerCase())) {
              return <NavItem key={item.label} item={item} />;
            }

            if (item.type === "button" && item.label.toLowerCase().includes(searchQuery.toLowerCase())) {
              return (
                <div key={item.label} className="relative group px-3">
                  <button
                    onClick={() => { item.onClick?.(); if (isMobile) setIsExpanded(false); }}
                    className={`w-full flex items-center gap-3 py-2.5 rounded-xl mb-1 text-slate-500 hover:text-white hover:bg-white/5 transition-all ${isExpanded ? "px-3" : "justify-center"}`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {isExpanded && <span className="text-sm font-medium truncate">{item.label}</span>}
                  </button>
                  {!isExpanded && !isMobile && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50 border border-white/10">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </nav>

        {/* Footer user badge */}
        {isExpanded && (
          <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-slate-300 truncate">HR Manager</p>
                <p className="text-xs text-slate-600 truncate">PlaceX Portal</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default CompanySidebar;
