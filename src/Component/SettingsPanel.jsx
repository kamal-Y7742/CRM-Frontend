import React from 'react';
import '../assets/CSS/Sidebar.css';
import { Link } from 'react-router-dom';

const SettingsPanel = ({ isOpen, onClose }) => {
  return (
    <div className={`settings-panel ${isOpen ? 'open' : ''}`} id="settings-cos">
      <div className="settings-header">
        <h5>Settings</h5>
        <button className="btn-close" onClick={onClose}></button>
      </div>

      <div className="settings-option nav-link">
        <Link to="/dashboard/settings/dataimport" style={{textDecoration:"none",color:"white"}}>
          <i className="bi bi-upload"></i>
          <span>Import</span>
        </Link>
      </div>

      <div className="settings-option nav-link">
        <Link to="/dashboard/settings/dataexport" style={{textDecoration:"none",color:"white"}}>
          <i className="bi bi-download"></i>
          <span>Export</span>
        </Link>
      </div>

      <div className="settings-option nav-link">
        <Link to="/dashboard/settings/responsive" style={{textDecoration:"none",color:"white"}}>
          <i className="bi bi-phone"></i>
          <span>Responsive</span>
        </Link>
      </div>
    </div>
  );
};

export default SettingsPanel;
