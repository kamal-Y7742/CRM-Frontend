import React, { useEffect, useState } from 'react';

const DebugEnv = () => {
  const [envVars, setEnvVars] = useState({});
  
  useEffect(() => {
    // Collect all environment variables with VITE_ prefix
    const viteEnvVars = {};
    Object.keys(import.meta.env).forEach(key => {
      if (key.startsWith('VITE_')) {
        viteEnvVars[key] = import.meta.env[key];
      }
    });
    
    setEnvVars({
      VITE_API_URL: import.meta.env.VITE_API_URL || 'Not defined',
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD,
      allViteVars: viteEnvVars
    });
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px', margin: '20px' }}>
      <h3>Environment Variables Debug:</h3>
      <div>
        <strong>VITE_API_URL:</strong> {envVars.VITE_API_URL}
      </div>
      <div>
        <strong>Mode:</strong> {envVars.mode}
      </div>
      <div>
        <strong>Is Development:</strong> {envVars.dev ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>Is Production:</strong> {envVars.prod ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>All VITE_ Variables:</strong>
        <pre>{JSON.stringify(envVars.allViteVars, null, 2)}</pre>
      </div>
      <div>
        <strong>Manually constructed URL:</strong> 
        {import.meta.env.VITE_API_URL ? 
          `${import.meta.env.VITE_API_URL}/designations` : 
          'Cannot construct URL - VITE_API_URL is missing'}
      </div>
    </div>
  );
};

export default DebugEnv;