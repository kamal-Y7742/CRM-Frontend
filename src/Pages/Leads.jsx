import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import DataTable from "../Component/DataTable";
import { 
  setCurrentView,
  fetchLeads,
  addLead,
  updateLead,
  deleteLead,
  archiveLead,
  restoreLead,
  openLeadModal,
  closeLeadModal
} from "../features/Slices/LeadsSlice";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaArchive, FaTrashRestore } from "react-icons/fa";
import ConfirmationModal from "../Component/ConfirmationModal";
import EmailOffcanvas from "../Component/EmailOffcanvas";
// RowActions component
const RowActions = React.memo(
  ({ row, onEdit, onDelete, onArchive, onRestore, isArchive }) => {
    const handleEdit = useCallback(
      (e) => {
        e.stopPropagation();
        onEdit(row);
      },
      [row, onEdit]
    );

    const handleDelete = useCallback(
      (e) => {
        e.stopPropagation();
        onDelete(row.leadId, e);
      },
      [row, onDelete]
    );

    const handleArchive = useCallback(
      (e) => {
        e.stopPropagation();
        onArchive(row.leadId, e);
      },
      [row, onArchive]
    );

    const handleRestore = useCallback(
      (e) => {
        e.stopPropagation();
        onRestore(row.leadId, e);
      },
      [row, onRestore]
    );

    return (
      <div className="d-flex">
        <Button
          variant="outline-primary"
          size="sm"
          className="me-2"
          onClick={handleEdit}
          title="Edit"
        >
          <FaEdit size={14} />
        </Button>
        {isArchive ? (
          <Button
            variant="outline-success"
            size="sm"
            className="me-2"
            onClick={handleRestore}
            title="Restore"
          >
            <FaTrashRestore size={14} />
          </Button>
        ) : (
          <Button
            variant="outline-warning"
            size="sm"
            className="me-2"
            onClick={handleArchive}
            title="Archive"
          >
            <FaArchive size={14} />
          </Button>
        )}
        <Button
          variant="outline-danger"
          size="sm"
          onClick={handleDelete}
          title="Delete"
        >
          <FaTrash size={14} />
        </Button>
      </div>
    );
  }
);

// LeadFormModal component
const LeadFormModal = React.memo(
  ({
    isOpen,
    onClose,
    onSubmit,
    formData,
    onChange,
    onPhoneChange,
    onCountryChange,
    onCompanyInput,
    onLocationInput,
    onSelectCompany,
    onSelectLocation,
    isEdit,
    validated,
    isLoading,
    errors,
    locationSuggestions,
    showLocationSuggestions,
    companySuggestions,
    showCompanySuggestions,
  }) => {
    // SVG Icons
    const SearchIcon = () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    );

    const InfoIcon = () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    );

    return (
      <Modal show={isOpen} onHide={onClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Lead" : "Add New Lead"}</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={onSubmit}>
          <Modal.Body className="modal-body-scroll">
            <Row>
              <Col lg={6}>
                <h6 className="mb-3">CONTACT INFORMATION</h6>

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    Contact person
                    <span className="ms-1">
                      <InfoIcon />
                    </span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="contactPerson"
                    placeholder="Enter name"
                    value={formData.contactPerson}
                    onChange={onChange}
                    isInvalid={validated && !!errors.contactPerson}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.contactPerson || "Name is required"}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    Organization
                    <span className="ms-1">
                      <InfoIcon />
                    </span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="organization"
                    placeholder="Enter organization"
                    value={formData.organization}
                    onChange={onChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    id="title"
                    placeholder="Enter title"
                    value={formData.title}
                    onChange={onChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    Value
                    <span className="ms-1">
                      <InfoIcon />
                    </span>
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      id="value"
                      placeholder="Enter value"
                      value={formData.value}
                      onChange={onChange}
                      isInvalid={validated && !!errors.value}
                    />
                    <InputGroup.Text as="div" className="p-0">
                      <Form.Select className="border-0 rounded-0 rounded-end">
                        <option>Indian Rupee</option>
                        <option>US Dollar</option>
                        <option>Euro</option>
                      </Form.Select>
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.value}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    Labels
                    <span className="ms-1">
                      <InfoIcon />
                    </span>
                  </Form.Label>
                  <Form.Select
                    id="labels"
                    value={formData.labels}
                    onChange={onChange}
                  >
                    <option value="">Select labels</option>
                    <option value="hot">Hot</option>
                    <option value="cold">Cold</option>
                    <option value="warm">Warm</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    Expected close date
                    <span className="ms-1">
                      <InfoIcon />
                    </span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="expectedCloseDate"
                    placeholder="MM/DD/YYYY"
                    value={formData.expectedCloseDate}
                    onChange={onChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Source channel</Form.Label>
                  <Form.Select
                    id="sourceChannel"
                    value={formData.sourceChannel}
                    onChange={onChange}
                  >
                    <option value="">Select source channel</option>
                    <option value="website">Website</option>
                    <option value="social">Social Media</option>
                    <option value="referral">Referral</option>
                    <option value="email">Email Campaign</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Source channel ID</Form.Label>
                  <Form.Control
                    type="text"
                    id="sourceChannelID"
                    placeholder="Enter source channel ID"
                    value={formData.sourceChannelID}
                    onChange={onChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Service Type</Form.Label>
                  <Form.Control
                    type="text"
                    id="serviceType"
                    placeholder="Enter service type"
                    value={formData.serviceType}
                    onChange={onChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Scope of Service Type</Form.Label>
                  <Form.Select
                    id="scopeOfServiceType"
                    value={formData.scopeOfServiceType}
                    onChange={onChange}
                  >
                    <option value="">Select scope</option>
                    <option value="full">Full Service</option>
                    <option value="partial">Partial Service</option>
                    <option value="consulting">Consulting Only</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col lg={6}>
                <h6 className="mb-3">PERSON</h6>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <InputGroup>
                    <InputGroup.Text as="div" className="p-0">
                      <Form.Select
                        className="border-0 rounded-0 rounded-start"
                        value={formData.countryCode}
                        onChange={(e) => {
                          const selected = {
                            phoneCode: e.target.value,
                            code: "us",
                            name: "United States",
                          };
                          onCountryChange(selected);
                        }}
                      >
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+91">+91</option>
                      </Form.Select>
                    </InputGroup.Text>
                    <Form.Control
                      type="tel"
                      id="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={onPhoneChange}
                      isInvalid={validated && !!errors.phone}
                    />
                    <InputGroup.Text as="div" className="p-0">
                      <Form.Select className="border-0 rounded-0 rounded-end">
                        <option>Work</option>
                        <option>Mobile</option>
                        <option>Home</option>
                      </Form.Select>
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="email"
                      id="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={onChange}
                      isInvalid={validated && !!errors.email}
                      required
                    />
                    <InputGroup.Text as="div" className="p-0">
                      <Form.Select className="border-0 rounded-0 rounded-end">
                        <option>Work</option>
                        <option>Personal</option>
                      </Form.Select>
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.email || "Valid email is required"}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Company</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <SearchIcon />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      id="company"
                      placeholder="Search for company"
                      value={formData.company}
                      onChange={onCompanyInput}
                      onFocus={() =>
                        formData.company.length > 1 &&
                        showCompanySuggestions(true)
                      }
                      isInvalid={validated && !!errors.company}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.company}
                    </Form.Control.Feedback>
                  </InputGroup>
                  {showCompanySuggestions && (
                    <div className="position-absolute w-100 bg-white border rounded mt-1 shadow-sm z-3">
                      {companySuggestions.map((company) => (
                        <div
                          key={company.id}
                          className="p-2 border-bottom d-flex align-items-center cursor-pointer hover-bg-light"
                          onMouseDown={() => onSelectCompany(company)}
                        >
                          <img
                            src={company.logo}
                            alt=""
                            className="me-2"
                            style={{ width: "24px", height: "24px" }}
                          />
                          <span>{company.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Proposal Value</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      id="proposalValue"
                      placeholder="Enter proposal value"
                      value={formData.proposalValue}
                      onChange={onChange}
                      isInvalid={validated && !!errors.proposalValue}
                    />
                    <InputGroup.Text as="div" className="p-0">
                      <Form.Select className="border-0 rounded-0 rounded-end">
                        <option>Indian Rupee</option>
                        <option>US Dollar</option>
                        <option>Euro</option>
                      </Form.Select>
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.proposalValue}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>ESPL Proposal No.</Form.Label>
                  <Form.Control
                    type="text"
                    id="esplProposalNo"
                    placeholder="Enter proposal number"
                    value={formData.esplProposalNo}
                    onChange={onChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Project Location</Form.Label>
                  <Form.Control
                    type="text"
                    id="projectLocation"
                    placeholder="Enter project location"
                    value={formData.projectLocation}
                    onChange={onChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Organization Country</Form.Label>
                  <Form.Control
                    type="text"
                    id="organizationCountry"
                    placeholder="Enter organization country"
                    value={formData.organizationCountry}
                    onChange={onChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Proposal Sent Date</Form.Label>
                  <Form.Control
                    type="text"
                    id="proposalSentDate"
                    placeholder="MM/DD/YYYY"
                    value={formData.proposalSentDate}
                    onChange={onChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    id="status"
                    value={formData.status}
                    onChange={onChange}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading
                ? isEdit
                  ? "Updating..."
                  : "Saving..."
                : isEdit
                  ? "Update"
                  : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
);

// Main Leads component
const Leads = () => {
  const dispatch = useDispatch();
  const { 
    leads, 
    status, 
    error, 
    isModalOpen, 
    operationStatus,
    currentView,
    currentLead 
  } = useSelector((state) => state.leads);

  const [selectedId, setSelectedId] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    contactPerson: "",
    email: "",
    phone: "",
    countryCode: "+1",
    countryFlag: "us",
    company: "",
    organization: "",
    title: "",
    location: "",
    country: "United States",
    organizationCountry: "",
    status: "new",
    value: "",
    proposalValue: "",
    labels: "",
    expectedCloseDate: "",
    sourceChannel: "",
    sourceChannelID: "",
    serviceType: "",
    scopeOfServiceType: "",
    esplProposalNo: "",
    projectLocation: "",
    proposalSentDate: "",
  });
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [showEmailOffcanvas, setShowEmailOffcanvas] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  // Set active view (inbox/archive) and fetch leads
  const setActiveView = (view) => {
    dispatch(setCurrentView(view));
    dispatch(fetchLeads({ isArchived: view === 'archive' }));
  };

  // Fetch leads when view changes
  useEffect(() => {
    dispatch(fetchLeads({ isArchived: currentView === 'archive' }));
  }, [dispatch, currentView]);

  const handleEmailClick = useCallback((e, row) => {
    e.stopPropagation(); // Prevent row click from happening
    setSelectedLead(row);
    setShowEmailOffcanvas(true);
  }, []);

  // Handle close email offcanvas
  const handleCloseEmailOffcanvas = useCallback(() => {
    setShowEmailOffcanvas(false);
  }, []);

  // Update form when current lead changes
  useEffect(() => {
    if (currentLead) {
      setFormData({
        ...currentLead,
        countryCode: currentLead.countryCode || "+1",
        countryFlag: currentLead.countryFlag || "us",
      });
      setSelectedId(currentLead.leadId);
    } else {
      setFormData({
        contactPerson: "",
        email: "",
        phone: "",
        countryCode: "+1",
        countryFlag: "us",
        company: "",
        organization: "",
        title: "",
        location: "",
        country: "United States",
        organizationCountry: "",
        status: "new",
        value: "",
        proposalValue: "",
        labels: "",
        expectedCloseDate: "",
        sourceChannel: "",
        sourceChannelID: "",
        serviceType: "",
        scopeOfServiceType: "",
        esplProposalNo: "",
        projectLocation: "",
        proposalSentDate: "",
      });
      setSelectedId(null);
    }
  }, [currentLead]);

  // Form field handlers
  const handleChange = useCallback(
    (e) => {
      const { id, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));

      if (errors[id]) {
        setErrors((prev) => ({
          ...prev,
          [id]: null,
        }));
      }
    },
    [errors]
  );

  const handlePhoneChange = useCallback((e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  }, []);

  const handleCountryChange = useCallback((country) => {
    setFormData((prev) => ({
      ...prev,
      countryCode: country.phoneCode,
      countryFlag: country.code.toLowerCase(),
      country: country.name,
      phone: "",
    }));
  }, []);

  const handleLocationInput = useCallback((e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, location: value }));
    
    if (value.length > 2) {
      // Simulate API call for location suggestions
      setLocationSuggestions([
        { id: 1, name: `${value}, USA` },
        { id: 2, name: `${value}, Canada` },
      ]);
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  }, []);

  const handleCompanyInput = useCallback((e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, company: value }));
    
    if (value.length > 2) {
      // Simulate API call for company suggestions
      setCompanySuggestions([
        { id: 1, name: `${value} Inc.`, logo: "" },
        { id: 2, name: `${value} LLC`, logo: "" },
      ]);
      setShowCompanySuggestions(true);
    } else {
      setShowCompanySuggestions(false);
    }
  }, []);

  const selectLocation = useCallback(
    (location) => {
      setFormData((prev) => ({ ...prev, location: location.name }));
      setShowLocationSuggestions(false);
    },
    []
  );

  const selectCompany = useCallback((company) => {
    setFormData((prev) => ({ ...prev, company: company.name }));
    setShowCompanySuggestions(false);
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.contactPerson) newErrors.contactPerson = "Name is required";
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setValidated(true);

      if (validateForm()) {
        try {
          if (selectedId) {
            await dispatch(
              updateLead({
                id: selectedId,
                leadData: formData,
              })
            ).unwrap();
            // toast.success("Lead updated successfully");
          } else {
            await dispatch(addLead(formData)).unwrap();
            // toast.success("Lead created successfully");
          }

          setValidated(false);
          dispatch(closeLeadModal());
        } catch (error) {
          toast.error(error?.message || "Operation failed");
        }
      }
    },
    [dispatch, selectedId, formData, validateForm]
  );

  // Row click handlers
  const handleRowClick = useCallback(
    (row) => {
      dispatch(openLeadModal(row));
    },
    [dispatch]
  );

  const handleAddClick = useCallback(() => {
    dispatch(openLeadModal());
  }, [dispatch]);

  const handleDeleteClick = useCallback((id, e) => {
    e?.stopPropagation();
    setItemToDelete(id);
    setConfirmAction("delete");
    setShowConfirmModal(true);
  }, []);

  const handleArchiveClick = useCallback((id, e) => {
    e?.stopPropagation();
    setItemToDelete(id);
    setConfirmAction("archive");
    setShowConfirmModal(true);
  }, []);

  const handleRestoreClick = useCallback((id, e) => {
    e?.stopPropagation();
    setItemToDelete(id);
    setConfirmAction("restore");
    setShowConfirmModal(true);
  }, []);

  // Confirm action handler
  const handleConfirmAction = useCallback(async () => {
    if (itemToDelete) {
      try {
        switch (confirmAction) {
          case "delete":
            await dispatch(deleteLead(itemToDelete)).unwrap();
            // toast.success("Lead deleted successfully");
            break;
          case "archive":
            await dispatch(archiveLead(itemToDelete)).unwrap();
            // toast.success("Lead archived successfully");
            break;
          case "restore":
            await dispatch(restoreLead(itemToDelete)).unwrap();
            // toast.success("Lead restored successfully");
            break;
          default:
            break;
        }
        setShowConfirmModal(false);
        setItemToDelete(null);
        setConfirmAction(null);
      } catch (error) {
        toast.error(error?.message || "Operation failed");
      }
    }
  }, [dispatch, itemToDelete, confirmAction]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeLeadModal());
  }, [dispatch]);

  // Memoized column definitions
  const inboxColumns = useMemo(
    () => [
      {
        header: "S.No",
        key: "serial",
        title: "Serial No",
        cell: (_, index) => index + 1,
        width: 60,
      },
      {
        header: "Title",
        accessor: "title",
        key: "title",
        title: "Title",
        cell: (row) => row?.title || "N/A",
        minWidth: 180,
      },
      {
        header: "Company",
        accessor: "company",
        key: "company",
        title: "Company",
        cell: (row) => row?.company || "N/A",
        minWidth: 160,
      },
      {
        header: "Contact Person",
        accessor: "contactPerson",
        key: "contactPerson",
        title: "Contact Person",
        cell: (row) => row?.contactPerson || "N/A",
        minWidth: 160,
      },
      {
        header: "Phone",
        accessor: "phone",
        key: "phone",
        title: "Phone",
        cell: (row) => row?.phone ? `${row.countryCode || ""} ${row.phone}` : "N/A",
        minWidth: 140,
      },
      {
        header: "Email",
        accessor: "email",
        key: "email",
        title: "Email",
        cell: (row) => (
          <div 
            className="email-cell cursor-pointer text-primary" 
            onClick={(e) => handleEmailClick(e, row)}
          >
            {row?.email || "N/A"}
          </div>
        ),
        minWidth: 180,
      },
      {
        header: "ESPL Proposal No",
        accessor: "esplProposalNo",
        key: "esplProposalNo",
        title: "ESPL Proposal No",
        cell: (row) => row?.esplProposalNo || "N/A",
        minWidth: 160,
      },
      {
        header: "Proposal Sent Date",
        accessor: "proposalSentDate",
        key: "proposalSentDate",
        title: "Proposal Sent",
        cell: (row) => row?.proposalSentDate || "N/A",
        minWidth: 140,
      },
      {
        header: "Expected Close Date",
        accessor: "expectedCloseDate",
        key: "expectedCloseDate",
        title: "Expected Close",
        cell: (row) => row?.expectedCloseDate || "N/A",
        minWidth: 140,
      },
      {
        header: "Proposal Value",
        accessor: "proposalValue",
        key: "proposalValue",
        title: "Value ($)",
        cell: (row) => `$${row?.proposalValue?.toLocaleString()}` || "N/A",
        minWidth: 130,
      },
      {
        header: "Scope of Service",
        accessor: "scopeOfServiceType",
        key: "scopeOfServiceType",
        title: "Scope of Service",
        cell: (row) => row?.scopeOfServiceType || "N/A",
        minWidth: 180,
      },
      {
        header: "Service Type",
        accessor: "serviceType",
        key: "serviceType",
        title: "Service Type",
        cell: (row) => row?.serviceType || "N/A",
        minWidth: 150,
      },
      {
        header: "Source Channel",
        accessor: "sourceChannel",
        key: "sourceChannel",
        title: "Source",
        cell: (row) => row?.sourceChannel || "N/A",
        minWidth: 120,
      },
      {
        header: "Project Location",
        accessor: "projectLocation",
        key: "projectLocation",
        title: "Location",
        cell: (row) => row?.projectLocation || "N/A",
        minWidth: 150,
      },
      {
        header: "Country",
        accessor: "organizationCountry",
        key: "organizationCountry",
        title: "Country",
        cell: (row) => row?.organizationCountry || "N/A",
        minWidth: 120,
      },
      {
        header: "Priority",
        accessor: "labels",
        key: "valueLabels",
        title: "Priority",
        cell: (row) => row?.labels || "N/A",
        minWidth: 120,
      },
      {
        header: "Status",
        accessor: "status",
        key: "status",
        title: "Status",
        cell: (row) => {
          const status = row?.status?.toLowerCase() || "new";
          let badgeClass = "badge ";

          switch (status) {
            case "new":
              badgeClass += "bg-primary";
              break;
            case "contacted":
              badgeClass += "bg-info text-dark";
              break;
            case "qualified":
              badgeClass += "bg-success";
              break;
            case "proposal":
              badgeClass += "bg-warning text-dark";
              break;
            case "negotiation":
              badgeClass += "bg-secondary";
              break;
            default:
              badgeClass += "bg-light text-dark";
          }

          return <span className={badgeClass}>{status}</span>;
        },
        width: 120,
      },
      {
        header: "Actions",
        key: "actions",
        title: "Actions",
        sortable: false,
        width: 180,
        cell: (row) => (
          <RowActions
            row={row}
            onEdit={handleRowClick}
            onDelete={handleDeleteClick}
            onArchive={handleArchiveClick}
            onRestore={handleRestoreClick}
            isArchive={false}
          />
        ),
      },
    ],
    [handleRowClick, handleDeleteClick, handleArchiveClick, handleRestoreClick]
  );

  const archiveColumns = useMemo(
    () => [
      {
        header: "S.No",
        key: "serial",
        title: "Serial No",
        cell: (_, index) => index + 1,
        width: 80,
      },
      {
        header: "Name",
        accessor: "name",
        key: "name",
        title: "Name",
        cell: (row) => row?.name || "N/A",
        minWidth: 150,
      },
      {
        header: "Company",
        accessor: "company",
        key: "company",
        title: "Company",
        cell: (row) => row?.company || "N/A",
        minWidth: 150,
      },
      {
        header: "Email",
        accessor: "email",
        key: "email",
        title: "Email",
        cell: (row) => row?.email || "N/A",
        minWidth: 200,
      },
      {
        header: "Phone",
        accessor: "phone",
        key: "phone",
        title: "Phone",
        cell: (row) =>
          row?.phone ? `${row.countryCode || ""} ${row.phone}` : "N/A",
        width: 150,
      },
      {
        header: "Status",
        accessor: "status",
        key: "status",
        title: "Status",
        cell: (row) => {
          const status = row?.status?.toLowerCase() || "new";
          let badgeClass = "badge ";

          switch (status) {
            case "new":
              badgeClass += "bg-primary";
              break;
            case "contacted":
              badgeClass += "bg-info text-dark";
              break;
            case "qualified":
              badgeClass += "bg-success";
              break;
            case "proposal":
              badgeClass += "bg-warning text-dark";
              break;
            case "negotiation":
              badgeClass += "bg-secondary";
              break;
            default:
              badgeClass += "bg-light text-dark";
          }

          return <span className={badgeClass}>{status}</span>;
        },
        width: 120,
      },
      {
        header: "Actions",
        key: "actions",
        title: "Actions",
        sortable: false,
        width: 180,
        cell: (row) => (
          <RowActions
            row={row}
            onEdit={handleRowClick}
            onDelete={handleDeleteClick}
            onArchive={handleArchiveClick}
            onRestore={handleRestoreClick}
            isArchive={true}
          />
        ),
      },
    ],
    [handleRowClick, handleDeleteClick, handleArchiveClick, handleRestoreClick]
  );

  // Memoized action buttons
  const actionButtons = useMemo(
    () => [
      {
        label: "Add Lead",
        variant: "primary",
        onClick: handleAddClick,
      },
    ],
    [handleAddClick]
  );

  // Show loading state when fetching leads initially
  if (status === "loading" && leads?.length === 0) {
    return <div className="text-center py-4">Loading leads...</div>;
  }

  if (status === "failed") {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <>
      <div className="container-fluid">
      <div className="table-container">
          <DataTable
            inboxData={leads || []}
            archiveData={leads.archive || []}
            inboxColumns={inboxColumns}
            columns={currentView === 'inbox' ? inboxColumns : archiveColumns}
            // archiveColumns={archiveColumns}
            // onRowClick={handleRowClick}
            defaultItemsPerPage={10}
            itemsPerPageOptions={[5, 10, 25, 50]}
            enableSearch={true}
            enableDownload={true}
            enableFiltering={true}
            hideToggle={true}
            enablePagination={true}
            enableSorting={true}
            actionButtons={actionButtons}
            loading={operationStatus === "loading" && status !== "loading"}
            customHeaderLeft={
              <div className="toggle-buttons-container mt-4">
                <button
                  onClick={() => setActiveView("inbox")}
                  className={`toggle-button left ${currentView === "inbox" ? "active" : ""}`}
                >
                  <i className="bi bi-inbox"></i> Inbox
                </button>
                <button
                  onClick={() => setActiveView("archive")}
                  className={`toggle-button right ${currentView === "archive" ? "active" : ""}`}
                >
                  <i className="bi bi-archive"></i> Archive
                </button>
              </div>
            }
          />

          {/* Lead Form Modal */}
          <LeadFormModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
            formData={formData}
            onChange={handleChange}
            onPhoneChange={handlePhoneChange}
            onCountryChange={handleCountryChange}
            onCompanyInput={handleCompanyInput}
            onLocationInput={handleLocationInput}
            onSelectCompany={selectCompany}
            onSelectLocation={selectLocation}
            isEdit={!!selectedId}
            validated={validated}
            isLoading={operationStatus === "loading"}
            errors={errors}
            locationSuggestions={locationSuggestions}
            showLocationSuggestions={showLocationSuggestions}
            companySuggestions={companySuggestions}
            showCompanySuggestions={showCompanySuggestions}
          />

          {/* Confirmation Modal */}
          <ConfirmationModal
            show={showConfirmModal}
            onHide={() => setShowConfirmModal(false)}
            onConfirm={handleConfirmAction}
            title={`Confirm ${confirmAction || ""}`}
            message={`Are you sure you want to ${confirmAction || ""} this lead?`}
            confirmText={
              operationStatus === "loading" ? "Processing..." : confirmAction
            }
            cancelText="Cancel"
            variant="danger"
            disabled={operationStatus === "loading"}
          />

            {/* Email Offcanvas Component */}
            <EmailOffcanvas 
            show={showEmailOffcanvas} 
            handleClose={handleCloseEmailOffcanvas} 
            leadData={selectedLead}
          />
        </div>
      </div>
    </>
  );
};

export default memo(Leads);