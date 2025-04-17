const BASE_URL = import.meta.env.VITE_API_URL;

export const getSystemInfo = async () => {
    let systemInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString()
    };
  
    try {
      // Get IP address
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      systemInfo.ipAddress = ipData.ip;
    } catch (error) {
      console.error('Could not fetch IP address:', error);
      systemInfo.ipAddress = 'unknown';
    }
  
    try {
      // Get approximate location from IP
      if (systemInfo.ipAddress && systemInfo.ipAddress !== 'unknown') {
        const locationResponse = await fetch(`https://ipapi.co/${systemInfo.ipAddress}/json/`);
        const locationData = await locationResponse.json();
        systemInfo = {
          ...systemInfo,
          approximateLocation: {
            city: locationData.city,
            region: locationData.region,
            country: locationData.country_name,
            latitude: locationData.latitude,
            longitude: locationData.longitude
          }
        };
      }
    } catch (error) {
      console.error('Could not fetch location:', error);
    }
  
    return systemInfo;
  };
  class AuthService {
    async login(email, password, rememberMe) {
      try {
        const systemInfo = await getSystemInfo();
  
        const response = await fetch(`${BASE_URL}/admin/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, rememberMe, systemInfo })
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }
  
        const data = await response.json();
  
        // Store tokens in localStorage
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
  
          if (data.refreshToken) {
            localStorage.setItem('refresh_token', data.refreshToken);
          }
  
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        }
  
        return data;
      } catch (error) {
        throw error;
      }
  
  }
  
  logout() {
    // Clear auth data from local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Optional: notify backend about logout
    return API.post('/auth/logout').catch(() => {
      // Silent fail for logout API call
      console.log('Backend logout notification failed');
    });
  }
  
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
  
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }
  
  async forgotPassword(email) {
    return API.post('/auth/forgot-password', { email });
  }
  
  async verifyOtp(email, otp) {
    return API.post('/auth/verify-otp', { email, otp: otp.join('') });
  }
  
  async resetPassword(email, otp, newPassword) {
    return API.post('/auth/reset-password', {
      email,
      otp: otp.join(''),
      newPassword
    });
  }
}

export default new AuthService();