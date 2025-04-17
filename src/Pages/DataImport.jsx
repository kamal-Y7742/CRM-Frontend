import React, { useState } from 'react';
import { ArrowRight, Check, Database, FileSpreadsheet, Info, Upload, Map, Eye, Flag, HelpCircle, X } from 'lucide-react';
import '../assets/CSS/DataImport.css';

const DataImport = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState({
    people: true,
    organizations: true,
    leads: true,
    deals: false,
    activities: false
  });

  const [file, setFile] = useState(null);
  
  const steps = [
    { id: 1, name: 'File info', icon: <Info size={16} /> },
    { id: 2, name: 'Upload file', icon: <Upload size={16} /> },
    { id: 3, name: 'Map', icon: <Map size={16} /> },
    { id: 4, name: 'Preview', icon: <Eye size={16} /> },
    { id: 5, name: 'Finish', icon: <Flag size={16} /> },
  ];

  // Data type templates and examples
  const dataTypeTemplates = {
    people: {
      templateUrl: '/templates/people-template.xlsx',
      example: [
        ['Tony Turner', 'tony.turner@example.com', '570-809-7123'],
        ['Hashim Handy', 'hashim.hardy@example.com', '240-707-3211'],
        ['Phyllis Yang', 'phyllis.yang@example.com', '313-428-5501']
      ],
      mandatoryFields: [
        { name: 'Person - Name *', required: true },
        { name: 'Person - Email', required: false },
        { name: 'Person - Phone', required: false }
      ]
    },
    organizations: {
      templateUrl: '/templates/organizations-template.xlsx',
      example: [
        ['Moveer Limited', '5, 943 Finch Ave.', 'Manufacturing'],
        ['ABC Inc', '9974 Pleasant St.', 'Technology'],
        ['Silicon Links LLC', '7938 Dewy Place', 'Consulting']
      ],
      mandatoryFields: [
        { name: 'Organization - Name *', required: true },
        { name: 'Organization - Address', required: false },
        { name: 'Organization - Industry', required: false }
      ]
    },
    leads: {
      templateUrl: '/templates/leads-template.xlsx',
      example: [
        ['Moveer Lead', 'Tony Turner', 'Warm', '$50,000'],
        ['ABC Lead', 'Hashim Handy', 'Cold', '$25,000'],
        ['Silicon Lead', 'Phyllis Yang', 'Hot', '$100,000']
      ],
      mandatoryFields: [
        { name: 'Lead - Title *', required: true },
        { name: 'Lead - Status', required: false },
        { name: 'Lead - Value', required: false }
      ]
    },
    deals: {
      templateUrl: '/templates/deals-template.xlsx',
      example: [
        ['Moveer Deal', 'Tony Turner', 'Negotiation', '$50,000', '80%'],
        ['ABC Deal', 'Hashim Handy', 'Proposal', '$25,000', '50%'],
        ['Silicon Deal', 'Phyllis Yang', 'Closed Won', '$100,000', '100%']
      ],
      mandatoryFields: [
        { name: 'Deal - Name *', required: true },
        { name: 'Deal - Amount', required: false },
        { name: 'Deal - Stage', required: false }
      ]
    },
    activities: {
      templateUrl: '/templates/activities-template.xlsx',
      example: [
        ['Meeting', 'Tony Turner', '2023-05-15', 'Product demo'],
        ['Call', 'Hashim Handy', '2023-05-16', 'Follow up'],
        ['Email', 'Phyllis Yang', '2023-05-17', 'Proposal sent']
      ],
      mandatoryFields: [
        { name: 'Activity - Type *', required: true },
        { name: 'Activity - Date', required: false },
        { name: 'Activity - Notes', required: false }
      ]
    }
  };

  const getActiveDataType = () => {
    return Object.keys(selectedTypes).find(type => selectedTypes[type]);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTypeSelect = (type) => {
    setSelectedTypes({
      ...selectedTypes,
      [type]: !selectedTypes[type]
    });
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const ImportTabs = () => (
    <div className="import-tabs">
      <div className={`tab ${currentStep === 0 ? 'active' : ''}`}>New import</div>
      <div className="tab">Import history</div>
    </div>
  );

  const renderStepContent = () => {
    const activeType = getActiveDataType();
    const template = activeType ? dataTypeTemplates[activeType] : null;

    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Select what you'd like to import</h2>
            <div className="selection-options">
              <div className="select-all">Select all that apply</div>
              <div className="import-guide-link">
                <a href="#">Import guide</a>
                {activeType && (
                  <a href={template.templateUrl} className="template-download">
                    <FileSpreadsheet size={18} />
                    Download {activeType} template (.xlsx)
                  </a>
                )}
              </div>
            </div>
            
            <div className="data-types-container">
              <div className={`data-type ${selectedTypes.people ? 'selected' : ''}`} 
                   onClick={() => handleTypeSelect('people')}>
                <div className="data-type-header">
                  <div className="icon-container people">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" fill="#0073ea"/>
                      <path d="M21 20v-3a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v3" stroke="#0073ea" fill="transparent" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="type-label">
                    <span>People</span>
                    {selectedTypes.people && <Check size={18} className="check-icon" />}
                  </div>
                </div>
                <p className="data-type-description">People are the individual contacts you communicate with.</p>
              </div>

              <div className={`data-type ${selectedTypes.organizations ? 'selected' : ''}`} 
                   onClick={() => handleTypeSelect('organizations')}>
                <div className="data-type-header">
                  <div className="icon-container organizations">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="16" rx="2" fill="#0073ea" opacity="0.2"/>
                      <rect x="6" y="8" width="4" height="4" fill="#0073ea"/>
                      <rect x="14" y="8" width="4" height="4" fill="#0073ea"/>
                      <rect x="6" y="14" width="4" height="4" fill="#0073ea"/>
                      <rect x="14" y="14" width="4" height="4" fill="#0073ea"/>
                    </svg>
                  </div>
                  <div className="type-label">
                    <span>Organizations</span>
                    {selectedTypes.organizations && <Check size={18} className="check-icon" />}
                  </div>
                </div>
                <p className="data-type-description">Organizations are a type of contact which include companies or a collective of people.</p>
              </div>

              <div className={`data-type ${selectedTypes.leads ? 'selected' : ''}`} 
                   onClick={() => handleTypeSelect('leads')}>
                <div className="data-type-header">
                  <div className="icon-container leads">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="#0073ea" opacity="0.2"/>
                      <circle cx="12" cy="12" r="5" fill="#0073ea"/>
                      <circle cx="12" cy="12" r="2" fill="white"/>
                    </svg>
                  </div>
                  <div className="type-label">
                    <span>Leads</span>
                    {selectedTypes.leads && <Check size={18} className="check-icon" />}
                  </div>
                </div>
                <p className="data-type-description">Leads are prospects you haven't qualified yet but want to keep track of.</p>
              </div>

              <div className={`data-type ${selectedTypes.deals ? 'selected' : ''}`} 
                   onClick={() => handleTypeSelect('deals')}>
                <div className="data-type-header">
                  <div className="icon-container deals">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="#6e6e6e" fill="transparent" strokeWidth="2"/>
                      <text x="12" y="16" textAnchor="middle" fill="#6e6e6e" fontSize="12">$</text>
                    </svg>
                  </div>
                  <div className="type-label">
                    <span>Deals</span>
                    {selectedTypes.deals && <Check size={18} className="check-icon" />}
                  </div>
                </div>
                <p className="data-type-description">The revenue connected to a company, commonly called an opportunity.</p>
              </div>

              <div className={`data-type ${selectedTypes.activities ? 'selected' : ''}`} 
                   onClick={() => handleTypeSelect('activities')}>
                <div className="data-type-header">
                  <div className="icon-container activities">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="16" rx="2" stroke="#6e6e6e" fill="transparent" strokeWidth="2"/>
                      <line x1="8" y1="2" x2="8" y2="6" stroke="#6e6e6e" strokeWidth="2"/>
                      <line x1="16" y1="2" x2="16" y2="6" stroke="#6e6e6e" strokeWidth="2"/>
                      <line x1="3" y1="10" x2="21" y2="10" stroke="#6e6e6e" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="type-label">
                    <span>Activities</span>
                    {selectedTypes.activities && <Check size={18} className="check-icon" />}
                  </div>
                </div>
                <p className="data-type-description">Activities are meetings, calls and other interactions linked to your leads, deals, people or organizations.</p>
              </div>
            </div>

            {activeType && (
              <>
                <div className="mandatory-fields">
                  <h3>These fields are mandatory for your selected data import</h3>
                  {template.mandatoryFields.map((field, index) => (
                    <div className="field-item" key={index}>
                      <Info size={16} />
                      <span>{field.name} {field.required && <span className="required">*</span>}</span>
                    </div>
                  ))}
                </div>

                <div className="spreadsheet-example">
                  <h3>Spreadsheet example</h3>
                  <div className="spreadsheet-preview">
                    <table>
                      <thead>
                        <tr>
                          {template.mandatoryFields.map((field, index) => (
                            <th key={index}>
                              {field.name} {field.required && <span className="required">*</span>}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {template.example.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        );
        
      case 2:
        return (
          <div className="step-content">
            <h2>Upload your spreadsheet</h2>
            <div 
              className="upload-area" 
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="spreadsheet-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="#2e7d32" fillOpacity="0.1" stroke="#2e7d32" strokeWidth="2"/>
                  <rect x="7" y="7" width="4" height="4" fill="#2e7d32"/>
                  <rect x="7" y="13" width="4" height="4" fill="#2e7d32"/>
                  <rect x="13" y="7" width="4" height="4" fill="#2e7d32"/>
                  <rect x="13" y="13" width="4" height="4" fill="#2e7d32"/>
                  <line x1="7" y1="7" x2="17" y2="7" stroke="#2e7d32" strokeWidth="2"/>
                  <line x1="7" y1="13" x2="17" y2="13" stroke="#2e7d32" strokeWidth="2"/>
                  <line x1="7" y1="19" x2="17" y2="19" stroke="#2e7d32" strokeWidth="2"/>
                  <line x1="7" y1="7" x2="7" y2="19" stroke="#2e7d32" strokeWidth="2"/>
                  <line x1="13" y1="7" x2="13" y2="19" stroke="#2e7d32" strokeWidth="2"/>
                  <line x1="17" y1="7" x2="17" y2="19" stroke="#2e7d32" strokeWidth="2"/>
                </svg>
              </div>
              <div className="upload-button-container">
                <label htmlFor="file-upload" className="upload-button">
                  Upload spreadsheet (.XLSX,.CSV)
                </label>
                <input 
                  id="file-upload" 
                  type="file" 
                  accept=".xlsx,.csv" 
                  onChange={handleFileUpload}
                  className="hidden-input"
                />
              </div>
              <p className="drag-drop-text">Or drag and drop the file here</p>
              {file && (
                <div className="selected-file">
                  <FileSpreadsheet size={16} />
                  <p>{file.name}</p>
                  <button onClick={() => setFile(null)} className="remove-file">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="step-content">
            <h2>Map your columns</h2>
            <p>Match your spreadsheet columns to our fields</p>
            
            <div className="mapping-container">
              <div className="field-mapping">
                <div className="mapping-row header">
                  <div className="source-column">Source Column</div>
                  <div className="destination-field">Maps To</div>
                </div>
                {activeType && template.mandatoryFields.map((field, index) => (
                  <div className="mapping-row" key={index}>
                    <div className="source-column">
                      {field.name.replace(' *', '')}
                    </div>
                    <div className="destination-field">
                      <select>
                        <option value={field.name.toLowerCase().replace(' ', '_')}>
                          {field.name}
                        </option>
                        <option value="other">Other Field</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="step-content">
            <h2>Preview your data</h2>
            <p>Review your mapped data before importing</p>
            
            <div className="data-preview">
              <table>
                <thead>
                  <tr>
                    {activeType && template.mandatoryFields.map((field, index) => (
                      <th key={index}>
                        {field.name} {field.required && <span className="required">*</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeType && template.example.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="data-validation">
              <h3>Validation Results</h3>
              <div className="validation-item success">
                <Check size={16} />
                <span>All required fields are mapped</span>
              </div>
              <div className="validation-item success">
                <Check size={16} />
                <span>No duplicate records found</span>
              </div>
              <div className="validation-item warning">
                <Info size={16} />
                <span>{template.example.length} records to be imported</span>
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="step-content">
            <div className="import-success">
              <div className="success-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#43a047" fillOpacity="0.1" stroke="#43a047" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="#43a047" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Import Successful!</h2>
              <p>Your data has been successfully imported into the system.</p>
              
              <div className="import-summary">
                <h3>Import Summary</h3>
                <div className="summary-item">
                  <span>Records imported:</span>
                  <span className="count">{activeType && template.example.length}</span>
                </div>
                <div className="summary-item">
                  <span>Type:</span>
                  <span className="count">{activeType && activeType.charAt(0).toUpperCase() + activeType.slice(1)}</span>
                </div>
              </div>
              
              <div className="action-buttons">
                <button className="primary-button">View Imported Data</button>
                <button className="secondary-button" onClick={() => setCurrentStep(1)}>
                  Start New Import
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="data-import-container">
      {currentStep === 0 && <ImportTabs />}
      
      {currentStep > 0 && (
        <div className="import-wizard">
          <div className="stepper">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`step ${step.id === currentStep ? 'active' : ''} ${step.id < currentStep ? 'completed' : ''}`}
              >
                <div className="step-icon">
                  {step.id < currentStep ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="#0073ea"/>
                      <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : step.icon}
                </div>
                <div className="step-label">{step.name}</div>
                {step.id < steps.length && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="step-arrow">
                    <path d="M9 18L15 12L9 6" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            ))}
            <div className="help-section">
              <button className="help-button">
                <HelpCircle size={20} />
                Need help?
              </button>
            </div>
          </div>
          
          {renderStepContent()}
          
          <div className="wizard-footer">
            {currentStep > 1 && (
              <button className="back-button" onClick={handleBack}>
                Back
              </button>
            )}
            <button className="cancel-button">
              Cancel
            </button>
            {currentStep < steps.length && (
              <button 
                className="next-button"
                onClick={handleNext}
                disabled={currentStep === 2 && !file}
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                {currentStep < steps.length - 1 && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      )}
      
      {currentStep === 0 && (
        <div className="import-options">
          <div className="import-option">
            <div className="option-icon-container">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" fill="#2e7d32" fillOpacity="0.1" stroke="#2e7d32" strokeWidth="2"/>
                <rect x="7" y="7" width="4" height="4" fill="#2e7d32"/>
                <rect x="7" y="13" width="4" height="4" fill="#2e7d32"/>
                <rect x="13" y="7" width="4" height="4" fill="#2e7d32"/>
                <rect x="13" y="13" width="4" height="4" fill="#2e7d32"/>
                <line x1="7" y1="7" x2="17" y2="7" stroke="#2e7d32" strokeWidth="2"/>
                <line x1="7" y1="13" x2="17" y2="13" stroke="#2e7d32" strokeWidth="2"/>
                <line x1="7" y1="19" x2="17" y2="19" stroke="#2e7d32" strokeWidth="2"/>
                <line x1="7" y1="7" x2="7" y2="19" stroke="#2e7d32" strokeWidth="2"/>
                <line x1="13" y1="7" x2="13" y2="19" stroke="#2e7d32" strokeWidth="2"/>
                <line x1="17" y1="7" x2="17" y2="19" stroke="#2e7d32" strokeWidth="2"/>
              </svg>
            </div>
            <h2>Import from spreadsheet</h2>
            <button className="get-started-button" onClick={() => setCurrentStep(1)}>
              Get started
            </button>
            <div className="download-template">
              <a href="#">Download a sample file (.XLSX, .CSV)</a>
            </div>
          </div>
          
          <div className="import-option">
            <div className="option-icon-container">
              <div className="cloud-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 10h-4V6" stroke="#0073ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 6l-4 4" stroke="#0073ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12v5" stroke="#0073ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 18a4 4 0 100-8 4 4 0 000 8z" stroke="#0073ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 18a6 6 0 100-12 6 6 0 000 12z" stroke="#0073ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12v5" stroke="#0073ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h2>Import from another software</h2>
            <p>Import data from another CRM software through our third-party partner, Import2.</p>
            <button className="alt-import-button">
              Import from another software
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#0073ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataImport;