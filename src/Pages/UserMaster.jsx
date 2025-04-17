import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import DataTable from "../Component/DataTable";

const UserMaster = () => {
  // Separate data for inbox and archive views
  const [inboxUsers, setInboxUsers] = useState([
    {
      id: 1,
      username: "john_doe",
      designation: "Manager",
      department: "IT",
      status: "Active",
    },
    {
      id: 2,
      username: "jane_smith",
      designation: "Developer",
      department: "Engineering",
      status: "Active",
    },
  ]);

  const [archiveUsers, setArchiveUsers] = useState([
    {
      id: 3,
      username: "mike_johnson",
      designation: "HR Specialist",
      department: "Human Resources",
      status: "Archived",
    },
    {
      id: 4,
      username: "sarah_williams",
      designation: "Finance Director",
      department: "Finance",
      status: "Archived",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    userType: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    designation: "",
    department: "",
    status: "Active",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Add new user to inbox
    const newUser = {
      id:
        Math.max(
          ...inboxUsers.map((u) => u.id),
          ...archiveUsers.map((u) => u.id)
        ) + 1,
      username: formData.username,
      designation: formData.designation,
      department: formData.department,
      status: "Active",
    };

    setInboxUsers([...inboxUsers, newUser]);

    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      designation: "",
      department: "",
    });
    setValidated(false);
    setShowModal(false);
  };

  // Archive a user
  const archiveUser = (user) => {
    // Remove from inbox
    setInboxUsers(inboxUsers.filter((u) => u.id !== user.id));
    // Add to archive with updated status
    setArchiveUsers([...archiveUsers, { ...user, status: "Archived" }]);
  };

  // Restore a user from archive
  const restoreUser = (user) => {
    // Remove from archive
    setArchiveUsers(archiveUsers.filter((u) => u.id !== user.id));
    // Add to inbox with updated status
    setInboxUsers([...inboxUsers, { ...user, status: "Active" }]);
  };

  const handleRowClick = (row) => {
    console.log("Selected user:", row);
  };

  const openUserModal = () => {
    setShowModal(true);
  };

  const columns = [
    {
      key: "id",
      title: "ID",
      sortable: true,
    },
    {
      key: "username",
      title: "Username",
      sortable: true,
    },
    {
      key: "designation",
      title: "Designation",
      sortable: true,
    },
    {
      key: "department",
      title: "Department",
      sortable: true,
    },
    {
      key: "actions",
      title: "Actions",
      sortable: false,
      render: (_, item) => (
        <div className="action-buttons-cell">
          {/* Show archive button in inbox view */}
      

        </div>
      ),
    },
  ];

  const actionButtons = [
    {
      label: "Add User",
      onClick: openUserModal,
      icon: (
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="17" y1="11" x2="23" y2="11"></line>
        </svg>
      ),
      className: "add-user-button",
    },
  ];

  return (
    <div className="container-fluid">
      <DataTable
        inboxData={inboxUsers}
        archiveData={archiveUsers}
        columns={columns}
        onRowClick={handleRowClick}
        defaultItemsPerPage={10}
        itemsPerPageOptions={[5, 10, 25, 50]}
        enableSearch={true}
        enableDownload={true}
        hideToggle={true}
        enableFiltering={true}
        enablePagination={true}
        enableSorting={true}
        actionButtons={actionButtons}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        className="border-0"
      />

      {/* Add User Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {/* User Type Dropdown at the top */}
            <Row>
            <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>User Type</Form.Label>
              <Form.Select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select User Type</option>
                <option value="Admin">Admin</option>
                <option value="General">General</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a user type.
              </Form.Control.Feedback>
            </Form.Group>
            </Col>
            <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder="Enter username"
              />
              <Form.Control.Feedback type="invalid">
                Username is required.
              </Form.Control.Feedback>
            </Form.Group>
            </Col>
            </Row>
            {/* New Email Field */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter email"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email address.
              </Form.Control.Feedback>
            </Form.Group>

            {/* New Mobile Field */}
            <Form.Group className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                required
                placeholder="Enter mobile number"
              />
              <Form.Control.Feedback type="invalid">
                Mobile number is required.
              </Form.Control.Feedback>
            </Form.Group>
            <Row>
            <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={8}
                placeholder="Enter password"
              />
              <Form.Control.Feedback type="invalid">
                Password is required and must be at least 8 characters.
              </Form.Control.Feedback>
            </Form.Group>
            </Col>
            <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm password"
              />
              <Form.Control.Feedback type="invalid">
                Please confirm your password.
              </Form.Control.Feedback>
            </Form.Group>
            </Col>
            </Row>

            <Row>
              <Col md={6}>
                {/* Updated Designation to Dropdown */}
                <Form.Group className="mb-3">
                  <Form.Label>Designation</Form.Label>
                  <Form.Select
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Designation</option>
                    <option value="Manager">Manager</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Senior Developer">Senior Developer</option>
                    <option value="Developer">Developer</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Executive">Executive</option>
                    <option value="Director">Director</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a designation.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a department.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* New Status Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a status.
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save User
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserMaster;
