import React, { useEffect, useState } from "react";
import "../assets/CSS/Header.css";
import Avtar from "../assets/Img/Avtar.jpg";
import { Link } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import "../assets/CSS/ThemeSwitcher.css";
import { Dropdown } from "bootstrap";
import LogoutConfirmation from "./LogoutConfirmation";

function Header({ toggleSidebar, currentNavTitle }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // Initialize all dropdowns on the page manually
    const dropdownElements = document.querySelectorAll(
      '[data-bs-toggle="dropdown"]'
    );
    dropdownElements.forEach((dropdownToggle) => {
      // Create new dropdown instance for each element
      new Dropdown(dropdownToggle, {
        // Add any needed configuration options
        autoClose: true,
      });
    });

    // Clean up function to dispose dropdowns when component unmounts
    return () => {
      dropdownElements.forEach((dropdownToggle) => {
        const dropdown = Dropdown.getInstance(dropdownToggle);
        if (dropdown) {
          dropdown.dispose();
        }
      });
    };
  }, []); // Empty dependency array means this runs once on mount

  const handleUserDropdownClick = (e) => {
    e.preventDefault();
    // Manually toggle the dropdown
    const dropdownEl = document.getElementById("userDropdown");
    const dropdown = Dropdown.getInstance(dropdownEl);

    if (dropdown) {
      dropdown.toggle();
    } else {
      // If instance doesn't exist yet, create and toggle it
      const newDropdown = new Dropdown(dropdownEl);
      newDropdown.toggle();
    }
  };

  return (
    <header className="dashboard-header" id="header-theme">
      <div className="d-flex align-items-center">
        <button
          id="list-dark"
          className="btn sidebar-toggle"
          onClick={toggleSidebar}
        >
          <i className="bi bi-list"></i>
        </button>

        {/* Display current navigation title */}
        <div className="current-page-title me-3 fw-bold">{currentNavTitle}</div>

        <div className="header-search d-none d-md-block ms-auto">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>

      <div className="header-actions">
        <div className="dropdown d-inline-block d-md-none me-2">
          <button
            className="header-icon dropdown-toggle"
            type="button"
            id="searchDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-search"></i>
          </button>
          <div
            className="dropdown-menu dropdown-menu-end p-2"
            aria-labelledby="searchDropdown"
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="dropdown d-inline-block">
          <button
            className="btn d-flex align-items-center dropdown-toggle"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            onClick={handleUserDropdownClick}
          >
            <div id="theme-dark" className="d-none  d-lg-block me-2 text-end">
              <div className="fw-bold">Kamal Yadav</div>
              <small>Sales Manager</small>
            </div>
            <img src={Avtar} alt="User" className="header-avatar" />
          </button>
          <ul
            className="dropdown-menu  dropdown-menu-end user-dropdown"
            aria-labelledby="userDropdown"
          >
            <li className="dropdown-section-title">MY ACCOUNT</li>
            <li>
              <Link className="dropdown-item" to="/dashboard/profile">
                <i className="bi bi-person me-2"></i>Personal preferences
              </Link>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                <i className="bi bi-gift me-2"></i>
                Referral program
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new Event("open-theme-customizer"));
                }}
              >
                <i className="bi bi-palette me-2"></i>
                Theme
              </a>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>

            <li className="dropdown-section-title">COMPANY OVERVIEW</li>
            <li>
              <a className="dropdown-item" href="#">
                <i className="bi bi-gear me-2"></i>
                Company settings
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>

            <li>
              <a
                className="dropdown-item text-danger"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogoutModal(true);
                  // Close the dropdown
                  const dropdown = Dropdown.getInstance(document.getElementById("userDropdown"));
                  if (dropdown) dropdown.hide();
                }}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Log out
              </a>
            </li>
          </ul>
        </div>
      </div>
      <ThemeSwitcher />
      <LogoutConfirmation 
        show={showLogoutModal} 
        onHide={() => setShowLogoutModal(false)} 
      />
    </header>
  );
}

export default Header;
