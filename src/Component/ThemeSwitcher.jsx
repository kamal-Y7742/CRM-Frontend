import React, { useState, useEffect } from 'react';
import { Offcanvas } from 'bootstrap';
import '../assets/CSS/ThemeSwitcher.css';

const ThemeSwitcher = () => {
  const [themeSettings, setThemeSettings] = useState({
    layoutMode: localStorage.getItem('layoutMode') || 'light',
    sidebarColor: localStorage.getItem('sidebarColor') || '#ffffff',
    headerColor: localStorage.getItem('headerColor') || '#ffffff',
    buttonColor: localStorage.getItem('buttonColor') || '#007bff',
  });
  
  // Don't store the offcanvas instance in state to avoid React re-renders affecting it
  let offcanvasInstance = null;
  
  useEffect(() => {
  // Listen for custom event from Header
  const handleOpenCustomizer = () => {
    const offcanvasElement = document.getElementById('themeCustomizer');
    if (!offcanvasElement) return;

    offcanvasInstance = Offcanvas.getInstance(offcanvasElement) || new Offcanvas(offcanvasElement, {
      backdrop: true,
      keyboard: true,
      scroll: false
    });

    offcanvasInstance.show(); // show instead of toggle to avoid accidental hide
  };

  window.addEventListener('open-theme-customizer', handleOpenCustomizer);

  return () => {
    window.removeEventListener('open-theme-customizer', handleOpenCustomizer);
  };
}, []);

  useEffect(() => {
    // Apply saved theme on initial load
    applyTheme(themeSettings);
    
    // Clean up
    return () => {
      if (offcanvasInstance) {
        offcanvasInstance.dispose();
        offcanvasInstance = null;
      }
    };
  }, []);
  
  // Apply theme changes to DOM and save to localStorage
  const applyTheme = (settings) => {
    // Apply layout mode
    document.body.className = document.body.className
      .replace(/layout-light|layout-dark|layout-system|layout-bw/g, '')
      .trim();
    document.body.classList.add(`layout-${settings.layoutMode}`);
    
    // Apply color settings using CSS variables
    document.documentElement.style.setProperty('--sidebar-bg-color', settings.sidebarColor);
    document.documentElement.style.setProperty('--header-bg-color', settings.headerColor);
    document.documentElement.style.setProperty('--button-bg-color', settings.buttonColor);
    
    
    // Save to localStorage
    localStorage.setItem('layoutMode', settings.layoutMode);
    localStorage.setItem('sidebarColor', settings.sidebarColor);
    localStorage.setItem('headerColor', settings.headerColor);
    localStorage.setItem('buttonColor', settings.buttonColor);
    
    // This would be where you save to backend
    saveThemeToBackend(settings);
  };
  
  // Function to save theme settings to backend
  const saveThemeToBackend = (settings) => {
    // Example API call
    fetch('/api/user/theme-settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })
      .then(response => response.json())
      .then(data => console.log('Theme saved to backend:', data))
      .catch(error => console.error('Error saving theme:', error));
  };
  
  // Handle layout mode change
  const handleLayoutChange = (mode) => {
    const newSettings = { ...themeSettings, layoutMode: mode };
    setThemeSettings(newSettings);
    applyTheme(newSettings);
  };
  
  // Handle color changes
  const handleColorChange = (setting, color) => {
    const newSettings = { ...themeSettings, [setting]: color };
    setThemeSettings(newSettings);
    applyTheme(newSettings);
  };
  
  // Toggle the offcanvas
  const toggleThemeCustomizer = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    const offcanvasElement = document.getElementById('themeCustomizer');
    if (!offcanvasElement) return;
    
    // Get instance or create new one
    offcanvasInstance = Offcanvas.getInstance(offcanvasElement) || new Offcanvas(offcanvasElement, {
      backdrop: true,
      keyboard: true,
      scroll: false
    });
    
    offcanvasInstance.toggle();
  };
  
  return (
    <>
      {/* Theme Switcher Toggle Button */}
      {/* <button 
        className="btn theme-toggle-btn" 
        onClick={toggleThemeCustomizer}
        title="Customize Theme"
      >
        <i className="bi bi-palette"></i>
      </button> */}
      
      {/* Offcanvas Theme Customizer - Opens from right side */}
      <div 
        className="offcanvas offcanvas-end" 
        tabIndex="-1" 
        id="themeCustomizer" 
        aria-labelledby="themeCustomizerLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="themeCustomizerLabel">Theme Customizer</h5>
          <button 
            type="button" 
            className="btn-close" 
            data-bs-dismiss="offcanvas" 
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="theme-section">
            <h6>Layout Mode</h6>
            <div className="layout-options">
              <div 
                className={`layout-option ${themeSettings.layoutMode === 'light' ? 'active' : ''}`}
                onClick={() => handleLayoutChange('light')}
              >
                <div className="layout-preview light-preview">
                  <div className="preview-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="preview-content"></div>
                </div>
                <span>Light</span>
              </div>
              
              <div 
                className={`layout-option ${themeSettings.layoutMode === 'dark' ? 'active' : ''}`}
                onClick={() => handleLayoutChange('dark')}
              >
                <div className="layout-preview dark-preview">
                  <div className="preview-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="preview-content"></div>
                </div>
                <span>Dark</span>
              </div>
              
              <div 
                className={`layout-option ${themeSettings.layoutMode === 'system' ? 'active' : ''}`}
                onClick={() => handleLayoutChange('system')}
              >
                <div className="layout-preview system-preview">
                  <div className="preview-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="preview-content">
                    <div className="system-dark"></div>
                  </div>
                </div>
                <span>System Default</span>
              </div>
              
              <div 
                className={`layout-option ${themeSettings.layoutMode === 'bw' ? 'active' : ''}`}
                onClick={() => handleLayoutChange('bw')}
              >
                <div className="layout-preview bw-preview">
                  <div className="preview-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                  <div className="preview-content"></div>
                </div>
                <span>Black & White</span>
              </div>
            </div>
          </div>
          
          <div className="theme-section">
            <h6>Sidebar Color</h6>
            <div className="color-picker">
              <input 
                type="color" 
                value={themeSettings.sidebarColor}
                onChange={(e) => handleColorChange('sidebarColor', e.target.value)}
                className="form-control form-control-color"
                title="Choose sidebar color"
              />
            </div>
          </div>
          
          <div className="theme-section">
            <h6>Header Color</h6>
            <div className="color-picker">
              <input 
                type="color" 
                value={themeSettings.headerColor}
                onChange={(e) => handleColorChange('headerColor', e.target.value)}
                className="form-control form-control-color"
                title="Choose header color"
              />
            </div>
          </div>
          
          <div className="theme-section">
            <h6>Button Color</h6>
            <div className="color-picker">
              <input 
                type="color" 
                value={themeSettings.buttonColor}
                onChange={(e) => handleColorChange('buttonColor', e.target.value)}
                className="form-control form-control-color"
                title="Choose button color"
              />
            </div>
          </div>
          
          <button 
            className="btn btn-primary w-100 mt-4"
            onClick={() => applyTheme(themeSettings)}
          >
            Apply Theme
          </button>
          
          <button 
            className="btn btn-outline-secondary w-100 mt-2"
            onClick={() => {
              const defaultSettings = {
                layoutMode: 'light',
                sidebarColor: '#ffffff',
                headerColor: '#ffffff',
                buttonColor: '#007bff',
              };
              setThemeSettings(defaultSettings);
              applyTheme(defaultSettings);
            }}
          >
            Reset to Default
          </button>
        </div>
      </div>
    </>
  );
};

export default ThemeSwitcher;