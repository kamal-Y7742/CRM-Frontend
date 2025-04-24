import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
  openUserModal,
  closeUserModal,
  fetchDepartments,
  fetchDesignations,
} from "../features/Slices/UserMasterSlice";
import DataTable from "../Component/DataTable";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmationModal from "../Component/ConfirmationModal";

const UserMaster = () => {
  const dispatch = useDispatch();
  const {
    users,
    status,
    error,
    isModalOpen,
    designations,
    departments,
    currentUser,
    operationStatus,
  } = useSelector((state) => state.userMaster);

  const [validated, setValidated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({
    userType: "",
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    designation: "",
    department: "",
    status: "Active",
  });

  // Fetch users on component mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
      dispatch(fetchDesignations());
      dispatch(fetchDepartments());
    }
  }, [dispatch, status]);

  // Update form when current user changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        id: currentUser.id,
        userType: currentUser.userType || "",
        name: currentUser.name || "",
        email: currentUser.email || "",
        mobile: currentUser.mobile || "",
        password: "", // Reset password fields for security
        confirmPassword: "",
        designation: currentUser.designation || "",
        department: currentUser.department || "",
        status: currentUser.status || "Active",
      });
    } else {
      // Reset form for new user
      setFormData({
        userType: "",
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        designation: "",
        department: "",
        status: "Active",
      });
    }
  }, [currentUser]);

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

    // Check passwords match only if admin and fields are visible
    if (
      formData.userType === "Admin" &&
      formData.password !== formData.confirmPassword
    ) {
      alert("Passwords do not match!");
      return;
    }

    if (currentUser) {
      // Update existing user
      dispatch(updateUser(formData));
    } else {
      // Add new user
      dispatch(addUser(formData));
    }

    setValidated(false);
  };

  const handleRowClick = (row) => {
    dispatch(openUserModal(row));
  };

  // Fixed: Renamed to handleAddUser to avoid recursion
  const handleAddUser = () => {
    dispatch(openUserModal());
  };

  const handleDeleteClick = (id, e) => {
    e?.stopPropagation();
    setUserToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete));
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };

  const handleCloseModal = () => {
    dispatch(closeUserModal());
    setValidated(false);
  };

  // Table columns
  const columns = [
    {
      key: "id",
      title: "ID",
      sortable: true,
    },
    {
      key: "username",
      title: "name",
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
      key: "status",
      title: "Status",
      sortable: true,
    },
    {
      key: "actions",
      title: "Actions",
      sortable: false,
      render: (_, row) => (
        <div className="d-flex">
          <Button
            variant="outline-primary"
            size="sm"
            className="me-2"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(row);
            }}
            title="Edit"
          >
            <FaEdit size={14} />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={(e) => handleDeleteClick(row.id, e)}
            title="Delete"
          >
            <FaTrash size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const actionButtons = [
    {
      label: "Add User",
      onClick: handleAddUser, 
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

  // Get table data from Redux state
  const tableData = users?.users?.length > 0 ? users.users : [];

  // Show loading state when fetching users initially
  if (status === "loading" && tableData.length === 0) {
    return <div className="text-center py-4">Loading users...</div>;
  }

  if (status === "failed") {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container-fluid">
      <DataTable
        inboxData={tableData}
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
        loading={operationStatus === "loading" && status !== "loading"}
      />

      {/* User Modal */}
      <Modal
        show={isModalOpen}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentUser ? "Edit User" : "Add New User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {/* User Type Dropdown */}
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
                    name="name"
                    value={formData.name}
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

            {/* Email and Mobile */}
            <Row>
              <Col md={6}>
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
              </Col>
              <Col md={6}>
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
              </Col>
            </Row>

            {/* Password fields - only shown for Admin user type */}
            {formData.userType === "Admin" && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!currentUser} // Required only for new users
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
                      required={!currentUser} // Required only for new users
                      placeholder="Confirm password"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please confirm your password.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            )}

            {/* Designation and Department */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Designation</Form.Label>
                  <Form.Select
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Designation</option>
                    {designations?.designations?.map((designation) => (
                      <option
                        key={designation.designationId}
                        value={designation.designation_desc}
                      >
                        {designation.designation_desc}
                      </option>
                    ))}
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
                    {departments?.departments?.map((department) => (
                      <option
                        key={department.departmentId}
                        value={department.department_desc}
                      >
                        {department.department_desc}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a department.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Status */}
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
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
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={operationStatus === "loading"}
              >
                {operationStatus === "loading"
                  ? currentUser
                    ? "Updating..."
                    : "Saving..."
                  : currentUser
                    ? "Update User"
                    : "Save User"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this user?"
        confirmText={operationStatus === "loading" ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        variant="danger"
        disabled={operationStatus === "loading"}
      />
    </div>
  );
};

export default UserMaster;
