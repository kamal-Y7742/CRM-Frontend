import React, { useState } from "react";

function ThemeSettings({ isOpen, onClose }) {
  const [layoutMode, setLayoutMode] = useState("light");
  const [sidebarColor, setSidebarColor] = useState("#ffffff");
  const [headerColor, setHeaderColor] = useState("#ffffff");
  const [buttonColor, setButtonColor] = useState("#007bff");

  const saveTheme = async () => {
    // Send to backend here
    const settings = { layoutMode, sidebarColor, headerColor, buttonColor };
    await fetch("/api/save-theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    onClose(); // close drawer
  };

  return (
    <div className={`theme-settings-drawer ${isOpen ? "open" : ""}`}>
      <div className="drawer-header">
        <h5>Theme Settings</h5>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="drawer-content">
        <div className="section">
          <h6>Layout Mode</h6>
          <div className="layout-options">
            {["light", "dark", "system", "bw"].map((mode) => (
              <div
                key={mode}
                className={`layout-option ${layoutMode === mode ? "selected" : ""}`}
                onClick={() => setLayoutMode(mode)}
              >
                <img src={`/images/${mode}.png`} alt={mode} />
                <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <label>Sidebar Color</label>
          <input type="color" value={sidebarColor} onChange={(e) => setSidebarColor(e.target.value)} />
        </div>
        <div className="section">
          <label>Header Color</label>
          <input type="color" value={headerColor} onChange={(e) => setHeaderColor(e.target.value)} />
        </div>
        <div className="section">
          <label>Button Color</label>
          <input type="color" value={buttonColor} onChange={(e) => setButtonColor(e.target.value)} />
        </div>

        <button className="btn btn-primary w-100 mt-3" onClick={saveTheme}>
          Save Theme
        </button>
      </div>
    </div>
  );
}

export default ThemeSettings;
