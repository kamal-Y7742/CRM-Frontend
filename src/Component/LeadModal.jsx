import React, { useEffect, useState, useRef } from 'react';
import '../assets/CSS/LeadModal.css';
import '../assets/CSS/Sidebar.css';

const LeadModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+1', // Default country code (US)
    countryFlag: 'us',
    company: '',
    location: '',
    country: 'United States', // Default country
    status: 'new'
  });
  
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const modalRef = useRef(null);

  // Add body class to prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.classList.add('backdrop-blur');
    } else {
      document.body.classList.remove('modal-open');
      document.body.classList.remove('backdrop-blur');
    }
    
    // Close modal on escape key
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    // Handle click outside modal
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && 
          event.target.classList.contains('modal-overlay')) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('modal-open');
      document.body.classList.remove('backdrop-blur');
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const formatPhoneNumber = (value, countryCode) => {
    // Strip non-numeric characters
    let phone = value.replace(/\D/g, '');
    
    // Format based on country
    if (countryCode === '+1') { // USA
      if (phone.length > 0) {
        phone = phone.match(new RegExp('.{1,3}', 'g')).join('-');
      }
    } else if (countryCode === '+44') { // UK
      if (phone.length > 0) {
        phone = phone.length > 6 ? 
          `${phone.slice(0, 5)}-${phone.slice(5)}` : phone;
      }
    } else if (countryCode === '+91') { // India
      if (phone.length > 5) {
        phone = `${phone.slice(0, 5)}-${phone.slice(5)}`;
      }
    }
    
    return phone;
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    // Format the phone number based on selected country
    const formattedPhone = formatPhoneNumber(value, formData.countryCode);
    
    setFormData(prev => ({
      ...prev,
      phone: formattedPhone
    }));
  };

  const handleCountryChange = (country) => {
    setFormData(prev => ({
      ...prev,
      countryCode: country.phoneCode,
      countryFlag: country.code.toLowerCase(),
      country: country.name,
      // Reset phone number when country changes
      phone: ''
    }));
  };

  const handleLocationInput = (e) => {
    const input = e.target.value;
    setFormData(prev => ({ ...prev, location: input }));
    
    // Mock location search - in a real app, this would call an API
    if (input.length > 2) {
      // Simulate API call with mock data
      const mockLocations = [
        { id: 1, name: `${input} City, New York`, image: '/api/placeholder/30/20' },
        { id: 2, name: `${input} Town, California`, image: '/api/placeholder/30/20' },
        { id: 3, name: `${input} Village, Texas`, image: '/api/placeholder/30/20' },
        { id: 4, name: `${input} District, Florida`, image: '/api/placeholder/30/20' }
      ];
      setLocationSuggestions(mockLocations);
      setShowLocationSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleCompanyInput = (e) => {
    const input = e.target.value;
    setFormData(prev => ({ ...prev, company: input }));
    
    // Mock company search - in a real app, this would call an API
    if (input.length > 1) {
      // Simulate API call with mock data
      setTimeout(() => {
        const mockCompanies = [
          { id: 1, name: `${input} Inc.`, logo: '/api/placeholder/24/24' },
          { id: 2, name: `${input} Technologies`, logo: '/api/placeholder/24/24' },
          { id: 3, name: `${input} Group`, logo: '/api/placeholder/24/24' },
          { id: 4, name: `${input} Solutions`, logo: '/api/placeholder/24/24' },
          { id: 5, name: `${input} International`, logo: '/api/placeholder/24/24' }
        ];
        setCompanySuggestions(mockCompanies);
        setShowCompanySuggestions(true);
      }, 300);
    } else {
      setCompanySuggestions([]);
      setShowCompanySuggestions(false);
    }
  };

  const selectLocation = (location) => {
    setFormData(prev => ({ ...prev, location: location.name }));
    setShowLocationSuggestions(false);
  };

  const selectCompany = (company) => {
    setFormData(prev => ({ ...prev, company: company.name }));
    setShowCompanySuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      countryCode: '+1',
      countryFlag: 'us',
      company: '',
      location: '',
      country: 'United States',
      status: 'new'
    });
  };

  // Simple icon components
  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  return (
    <div className="modal-overlay ">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          {/* <h3>Add New Lead</h3> */}
          <button className="close-button" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="Enter name" 
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-dropdown">
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Enter email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
                <div className="dropdown">
                  <button type="button" className="dropdown-toggle">
                    Work
                    <span className="arrow-down">▼</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <div className="phone-input-container">
                <div className="country-selector">
                  <button type="button" className="country-selector-btn">
                    <img 
                      src={`/api/placeholder/24/16`} 
                      alt={formData.countryFlag} 
                      className="country-flag" 
                    />
                    <span>{formData.countryCode}</span>
                    <span className="arrow-down">▼</span>
                  </button>
                  <div className="country-dropdown">
                    <div className="country-search">
                      <input type="text" placeholder="Search countries..." />
                      <SearchIcon />
                    </div>
                    {/* <div className="country-list">
                      {countryData.map(country => (
                        <div 
                          key={country.code} 
                          className="country-option"
                          onClick={() => handleCountryChange(country)}
                        >
                          <img 
                            src={`/api/placeholder/24/16`} 
                            alt={country.code} 
                            className="country-flag" 
                          />
                          <span>{country.name}</span>
                          <span className="country-code">{country.phoneCode}</span>
                        </div>
                      ))}
                    </div> */}
                  </div>
                </div>
                <input 
                  type="tel" 
                  id="phone" 
                  placeholder="Enter phone number" 
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="input-field"
                />
                <div className="dropdown">
                  <button type="button" className="dropdown-toggle">
                    Work
                    <span className="arrow-down">▼</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <div className="company-input-container">
                <div className="input-with-icon">
                  <SearchIcon />
                  <input 
                    type="text" 
                    id="company" 
                    placeholder="Search for company" 
                    value={formData.company}
                    onChange={handleCompanyInput}
                    onFocus={() => formData.company.length > 1 && setShowCompanySuggestions(true)}
                    className="input-field with-icon"
                  />
                </div>
                {showCompanySuggestions && (
                  <div className="company-suggestions">
                    {companySuggestions.map(company => (
                      <div 
                        key={company.id} 
                        className="company-option"
                        onMouseDown={() => selectCompany(company)}
                      >
                        <img src={company.logo} alt="" className="company-logo" />
                        <span>{company.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <div className="location-input-container">
                <div className="input-with-icon">
                  <SearchIcon />
                  <input 
                    type="text" 
                    id="location" 
                    placeholder="Search for location" 
                    value={formData.location}
                    onChange={handleLocationInput}
                    onFocus={() => formData.location.length > 2 && setShowLocationSuggestions(true)}
                    className="input-field with-icon"
                  />
                </div>
                {showLocationSuggestions && (
                  <div className="location-suggestions">
                    {locationSuggestions.map(location => (
                      <div 
                        key={location.id} 
                        className="location-option"
                        onMouseDown={() => selectLocation(location)}
                      >
                        <img src={location.image} alt="" className="location-image" />
                        <span>{location.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* <div className="form-group">
              <label htmlFor="country">Country</label>
              <div className="country-input">
                <img 
                  src={`/api/placeholder/24/16`} 
                  alt={formData.countryFlag} 
                  className="country-flag" 
                />
                <select 
                  id="country"
                  value={formData.country}
                  onChange={(e) => {
                    const selected = countryData.find(c => c.name === e.target.value);
                    if (selected) {
                      handleCountryChange(selected);
                    }
                  }}
                  className="input-field"
                >
                  {countryData.map(country => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
             */}
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select 
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="value">Value</label>
              <div className="currency-input">
                <input 
                  type="number" 
                  id="value" 
                  placeholder="Enter value" 
                  className="input-field"
                />
                <div className="dropdown">
                  <button type="button" className="dropdown-toggle">
                    Indian Rupee
                    <span className="arrow-down">▼</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-button">Add Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
