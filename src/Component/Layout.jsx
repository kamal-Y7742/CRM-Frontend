import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../assets/CSS/Layout.css";
import SettingsPanel from "./SettingsPanel";
import { useSelector } from "react-redux";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [currentNavTitle, setCurrentNavTitle] = useState("Dashboard");
  const location = useLocation();
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);


  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Update current navigation title based on location
  useEffect(() => {
    const routeTitles = {
      "/dashboard": "Dashboard",
      "/dashboard/leads": "Leads",
      "/dashboard/deals": "Deals",
      "/dashboard/contacts": "Contacts",
      "/dashboard/calendar": "Calendar",
      "/dashboard/reports": "Reports",
      "/dashboard/settings": "Settings",
      "/dashboard/profile": "Profile",
      "/dashboard/mail": "MailInbox",
      "/dashboard/userMaster": "User Master",
      "/dashboard/userprivileges": "User Privileges",
      "/dashboard/program-master/designation": "Designation",
      "/dashboard/program-master/department": "Department",
      "/dashboard/program-master/status": "Status",
      "/dashboard/program-master/organisation": "Organisation",
      "/dashboard/program-master/currency": "Currency",
      "/dashboard/program-master/scope": "Scope",
      "/dashboard/program-master/sectoral-scope": "Sectoral-Scope",
      "/dashboard/program-master/country": "Country",
      "/dashboard/program-master/region": "Region",
      "/dashboard/reports/login-history": "login-history",
      "/dashboard/reports/history": "History",
      "/dashboard/settings/dataimport": "Data Import",
    };

    // Find the matching route or use the default
    const matchingRoute = Object.keys(routeTitles).find(
      (route) =>
        location.pathname === route ||
        (route !== "/dashboard" && location.pathname.startsWith(route))
    );

    setCurrentNavTitle(
      matchingRoute ? routeTitles[matchingRoute] : "Dashboard"
    );
  }, [location]);

  useEffect(() => {
    // Check for saved theme settings
    const layoutMode = localStorage.getItem("layoutMode") || "light";
    const sidebarColor = localStorage.getItem("sidebarColor") || "#ffffff";
    const headerColor = localStorage.getItem("headerColor") || "#ffffff";
    const buttonColor = localStorage.getItem("buttonColor") || "#007bff";

    // Apply layout mode
    document.body.classList.add(`layout-${layoutMode}`);

    // Apply color settings using CSS variables
    document.documentElement.style.setProperty(
      "--sidebar-bg-color",
      sidebarColor
    );
    document.documentElement.style.setProperty(
      "--header-bg-color",
      headerColor
    );
    document.documentElement.style.setProperty(
      "--button-bg-color",
      buttonColor
    );

    // This is optional as we're already using localStorage
    fetchUserThemeSettings();

    // Handle responsive behavior
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);

      // Auto close sidebar on mobile
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      } else if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchUserThemeSettings = () => {
    // Example API call
    fetch("/api/user/theme-settings")
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          // Apply theme settings from backend
          document.body.className = document.body.className
            .replace(/layout-light|layout-dark|layout-system|layout-bw/g, "")
            .trim();
          document.body.classList.add(`layout-${data.layoutMode}`);

          document.documentElement.style.setProperty(
            "--sidebar-bg-color",
            data.sidebarColor
          );
          document.documentElement.style.setProperty(
            "--header-bg-color",
            data.headerColor
          );
          document.documentElement.style.setProperty(
            "--button-bg-color",
            data.buttonColor
          );

          // Update localStorage
          localStorage.setItem("layoutMode", data.layoutMode);
          localStorage.setItem("sidebarColor", data.sidebarColor);
          localStorage.setItem("headerColor", data.headerColor);
          localStorage.setItem("buttonColor", data.buttonColor);
        }
      })
      .catch((error) => {
        console.error("Error fetching theme settings:", error);
        // Continue with localStorage values if API fails
      });
  };

  return (
    <div className="dashboard-container layout">
      <Sidebar
        isOpen={sidebarOpen}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        openSettings={() => setSettingsOpen(true)}

      />

      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <div
        className={`main-content ${!isMobile && sidebarOpen ? "" : "expanded"}`}
      >
        <Header
          toggleSidebar={toggleSidebar}
          currentNavTitle={currentNavTitle}
        />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
