import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../assets/CSS/Sidebar.css";
import Avtar from "../assets/Img/Avtar.jpg";

function Sidebar({ isOpen, isMobile, toggleSidebar, openSettings }) {
  const location = useLocation();
  const [programMasterOpen, setProgramMasterOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // For mobile devices, we want to close the sidebar when a link is clicked
  const handleLinkClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  const toggleProgramMaster = () => {
    setOpenSubmenu(openSubmenu === "programMaster" ? null : "programMaster");
  };
  const toggleReports = () => {
    setOpenSubmenu(openSubmenu === "reports" ? null : "reports");
  };

  
  return (
    <div
      id="Sidebar-theme"
      className={`sidebar ${isOpen ? "open" : "closed"} ${isMobile ? "mobile" : ""}`}
    >
      <div className="sidebar-header">
        <div className="logo">
          {isOpen && <span className="logo-text">CRM Dashboard</span>}
        </div>
        {isMobile && (
          <button className="btn close-sidebar-btn" onClick={toggleSidebar}>
            <i className="bi bi-x-lg"></i>
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link
              to="/dashboard"
              className={`nav-link ${isActive("/dashboard") && !isActive("/dashboard/leads") && !isActive("/dashboard/deals") && !isActive("/dashboard/contacts") && !isActive("/dashboard/calendar") && !isActive("/dashboard/reports") && !isActive("/dashboard/settings") ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              <i className="bi bi-speedometer2"></i>
              {isOpen && <span>Dashboard</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/dashboard/leads"
              className={`nav-link ${isActive("/dashboard/leads") ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              <i className="bi bi-funnel"></i>
              {isOpen && <span>Leads</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/dashboard/deals"
              className={`nav-link ${isActive("/dashboard/deals") ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              <i className="bi bi-currency-dollar"></i>
              {isOpen && <span>Deals</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/dashboard/mail"
              className={`nav-link ${isActive("/dashboard/mail") ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              <i className="bi bi-envelope-fill"></i>
              {isOpen && <span>Sales Inbox</span>}
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/dashboard/contacts"
              className={`nav-link ${isActive("/dashboard/contacts") ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              <i className="bi bi-person"></i>
              {isOpen && <span>Contacts</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/dashboard/calendar"
              className={`nav-link ${isActive("/dashboard/calendar") ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              <i className="bi bi-calendar"></i>
              {isOpen && <span>Calendar</span>}
            </Link>
          </li>

          {/* Program Master Menu with Submenu */}
          <li className="nav-item submenu-container">
            <div
              className={`nav-link ${isActive("/dashboard/program-master") ? "active" : ""}`}
              onClick={toggleProgramMaster}
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-database-gear"></i>
              {isOpen && (
                <div className="d-flex justify-content-between align-items-center w-100">
                  <span>Program Master</span>
                  <i
                    className={`bi ${openSubmenu === "programMaster" ? "bi-chevron-down" : "bi-chevron-right"}`}
                  ></i>
                </div>
              )}
            </div>
            {isOpen && openSubmenu === "programMaster" && (
              <ul className="submenu">
                {/* <li>
                  <Link
                    to="/dashboard/program-master/name"
                    className={`submenu-link ${isActive("/dashboard/program-master/name") ? "active" : ""}`}
                    onClick={handleLinkClick}
                  >
                    <i className="bi bi-tag"></i>
                    <span>Name</span>
                  </Link>
                </li> */}
                <li>
                  <Link
                    to="/dashboard/program-master/designation"
                    className={`submenu-link ${isActive("/dashboard/program-master/designation") ? "active" : ""}`}
                    onClick={handleLinkClick}
                  >
                    <i className="bi bi-person-badge"></i>
                    <span>Designation</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/program-master/department"
                    className={`submenu-link ${isActive("/dashboard/program-master/department") ? "active" : ""}`}
                    onClick={handleLinkClick}
                  >
                    <i className="bi bi-diagram-3"></i>
                    <span>Department</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/program-master/status"
                    className={`submenu-link ${isActive("/dashboard/program-master/status") ? "active" : ""}`}
                    onClick={handleLinkClick}
                  >
                    <i className="bi bi-toggle-on"></i>
                    <span>Status</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/program-master/organisation"
                    className={`submenu-link ${isActive("/dashboard/program-master/organisation") ? "active" : ""}`}
                    onClick={handleLinkClick}
                  >
                    <i className="bi bi-building"></i>
                    <span>Organisation</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/program-master/currency"
                    className={`submenu-link ${isActive("/dashboard/program-master/currency") ? "active" : ""}`}
                    onClick={handleLinkClick}
                  >
                    <i className="bi bi-cash-coin"></i>
                    <span>Currency</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/program-master/scope"
                    className={`submenu-link ${isActive("/dashboard/program-master/scope") ? "active" : ""}`}
                    onClick={handleLinkClick}
                  >
                    <i className="bi bi-bullseye"></i>
                    <span>Scope</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/program-master/sectoral-scope"
                    className={`submenu-link ${isActive("/dashboard/program-master/sectoralscope") ? "active" : ""}`}
                    onClick={handleLinkClick}
                  >
                    <i className="bi bi-pie-chart"></i>
                    <span>Sectoral Scope</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/program-master/country"
                    className={`submenu-link ${isActive("/dashboard/program-master/country") ? "active" : ""}`}
                    onClick={handleLinkClick}
                  >
                    <i className="bi bi-globe"></i>
                    <span>Country</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/program-master/region"
                    className={`submenu-link ${isActive("/dashboard/program-master/region") ? "active" : ""}`}
                    onClick={handleLinkClick}
                  >
                    <i className="bi bi-map"></i>
                    <span>Region</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Reports Menu with Submenu */}
          <li className="nav-item submenu-container">
            <div
              className={`nav-link ${isActive("/dashboard/reports") ? "active" : ""}`}
              onClick={toggleReports}
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-bar-chart"></i>
              {isOpen && (
                <div className="d-flex justify-content-between align-items-center w-100">
                  <span>Reports</span>
                  <i
                    className={`bi ${openSubmenu === "reports" ? "bi-chevron-down" : "bi-chevron-right"}`}
                  ></i>
                </div>
              )}
            </div>
            {isOpen && openSubmenu === "reports" && (

              
              <ul className="submenu">
                <li>
                  <Link
                    to="/dashboard/reports/login-history"
                    className={`submenu-link ${isActive("/dashboard/reports/login-history") ? "active" : ""}`}
                    onClick={handleLinkClick}
                  >
                    <i className="bi bi-clock-history"></i>
                    <span>Login History</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/reports/history"
                    className={`submenu-link ${isActive("/dashboard/reports/audit-history") ? "active" : ""}`}
                    onClick={handleLinkClick}
                  >
                    <i className="bi bi-file-earmark-text"></i>
                    <span>Audit History</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li className="nav-item">
            <Link
              to="/dashboard/userMaster"
              className={`nav-link ${isActive("/dashboard/userMaster") ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              <i className="bi bi-person-gear"></i>
              {isOpen && <span>User Master</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/dashboard/userprivileges"
              className={`nav-link ${isActive("/dashboard/userprivileges") ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              <i className="bi bi-shield-check"></i>
              {isOpen && <span>User Privileges</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${isActive("/dashboard/settings") ? "active" : ""}`}
              onClick={() => {
                openSettings();
                if (isMobile) toggleSidebar();
              }}
            >
              <i className="bi bi-gear"></i>
              {isOpen && <span>Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        {isOpen && (
          <div className="user-info">
            <img src={Avtar} alt="User" className="user-avatar" />
            <div className="user-details">
              <h6 className="mb-0">Kamal Yadav</h6>
              <small>Sales Manager</small>
            </div>
          </div>
        )}
        {!isOpen && (
          <div className="user-info-collapsed">
            <img src={Avtar} alt="User" className="user-avatar-small" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
