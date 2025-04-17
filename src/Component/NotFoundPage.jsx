import React from 'react';
import '../assets/CSS/NotFoundPage.css'; 

import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-wrapper d-flex align-items-center justify-content-center">
      <div className="floating-shape"></div>
      <div className="error-card text-center shadow-lg p-5 rounded-4 bg-white position-relative z-2">
        <h1 className="error-code mb-3">404</h1>
        <p className="error-message mb-4">Sorry, the page you’re looking for doesn’t exist.</p>
        <button className="custom-btn" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
