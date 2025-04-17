import React, { useState } from "react";
import { Card, Form, Button, Badge, Modal } from "react-bootstrap";
import DataTable from "../Component/DataTable";

const UserPrivileges = () => {
  // CRM Modules with permissions
  const crmModules = [
    {
      module: "Dashboard",
      icon: "📊",
      permissions: [{ key: "dashboard_read", label: "View Dashboard" }],
    },
    {
      module: "Leads",
      icon: "📋",
      permissions: [
        { key: "leads_read", label: "View Leads" },
        { key: "leads_create", label: "Create Leads" },
        { key: "leads_update", label: "Edit Leads" },
        { key: "leads_delete", label: "Delete Leads" },
      ],
    },
    {
      module: "Contacts",
      icon: "👥",
      permissions: [
        { key: "contacts_read", label: "View Contacts" },
        { key: "contacts_create", label: "Create Contacts" },
        { key: "contacts_update", label: "Edit Contacts" },
        { key: "contacts_delete", label: "Delete Contacts" },
      ],
    },
    {
      module: "Accounts",
      icon: "🏢",
      permissions: [
        { key: "accounts_read", label: "View Accounts" },
        { key: "accounts_create", label: "Create Accounts" },
        { key: "accounts_update", label: "Edit Accounts" },
        { key: "accounts_delete", label: "Delete Accounts" },
      ],
    },
    {
      module: "Opportunities",
      icon: "💼",
      permissions: [
        { key: "opportunities_read", label: "View Opportunities" },
        { key: "opportunities_create", label: "Create Opportunities" },
        { key: "opportunities_update", label: "Edit Opportunities" },
        { key: "opportunities_delete", label: "Delete Opportunities" },
      ],
    },
    {
      module: "Reports",
      icon: "📈",
      permissions: [
        { key: "reports_read", label: "View Reports" },
        { key: "reports_create", label: "Create Reports" },
        { key: "reports_export", label: "Export Reports" },
      ],
    },
    {
      module: "Administration",
      icon: "⚙️",
      permissions: [
        { key: "users_manage", label: "Manage Users" },
        { key: "roles_manage", label: "Manage Roles" },
        { key: "settings_manage", label: "System Settings" },
      ],
    },
  ];

  // Sample user data with permissions
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@crm.com",
      role: "Administrator",
      status: "active",
      lastLogin: "2025-04-10T09:15:00",
      permissions: crmModules.reduce((acc, module) => {
        module.permissions.forEach((perm) => {
          acc[perm.key] = true;
        });
        return acc;
      }, {}),
    },
    {
      id: 2,
      name: "Sales Manager",
      email: "manager@crm.com",
      role: "Manager",
      status: "active",
      lastLogin: "2025-04-09T14:30:00",
      permissions: {
        dashboard_read: true,
        leads_read: true,
        leads_create: true,
        leads_update: true,
        leads_delete: false,
        contacts_read: true,
        contacts_create: true,
        contacts_update: true,
        contacts_delete: false,
        accounts_read: true,
        accounts_create: true,
        accounts_update: true,
        accounts_delete: false,
        opportunities_read: true,
        opportunities_create: true,
        opportunities_update: true,
        opportunities_delete: false,
        reports_read: true,
        reports_create: false,
        reports_export: true,
        users_manage: false,
        roles_manage: false,
        settings_manage: false,
      },
    },
    {
      id: 3,
      name: "Sales Agent",
      email: "agent@crm.com",
      role: "User",
      status: "active",
      lastLogin: "2025-04-08T11:45:00",
      permissions: {
        dashboard_read: true,
        leads_read: true,
        leads_create: true,
        leads_update: true,
        leads_delete: false,
        contacts_read: true,
        contacts_create: true,
        contacts_update: true,
        contacts_delete: false,
        accounts_read: true,
        accounts_create: false,
        accounts_update: false,
        accounts_delete: false,
        opportunities_read: true,
        opportunities_create: true,
        opportunities_update: true,
        opportunities_delete: false,
        reports_read: true,
        reports_create: false,
        reports_export: false,
        users_manage: false,
        roles_manage: false,
        settings_manage: false,
      },
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState("");

  // Create permission payload for API dispatch
  const createPermissionPayload = (user) => {
    return {
      userId: user.id,
      userEmail: user.email,
      role: user.role,
      permissions: user.permissions,
      timestamp: new Date().toISOString(),
      updatedBy: "current_user_id",
      changes: Object.keys(user.permissions).reduce((acc, key) => {
        const originalUser = users.find((u) => u.id === user.id);
        if (
          originalUser &&
          originalUser.permissions[key] !== user.permissions[key]
        ) {
          acc[key] = {
            oldValue: originalUser.permissions[key],
            newValue: user.permissions[key],
          };
        }
        return acc;
      }, {}),
    };
  };

  // Process permission changes
  const dispatchPermissionUpdate = (payload) => {
    console.log("Dispatching permission update:", payload);
    // In a real app, this would be an API call
    return Promise.resolve();
  };

  const handlePermissionChange = (userId, permissionKey, value) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const updatedUser = {
            ...user,
            permissions: {
              ...user.permissions,
              [permissionKey]: value,
            },
          };

          if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(updatedUser);
          }

          return updatedUser;
        }
        return user;
      })
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;

    const payload = createPermissionPayload(selectedUser);
    try {
      await dispatchPermissionUpdate(payload);
      alert(`Permissions saved successfully for ${selectedUser.name}`);
    } catch (error) {
      console.error("Failed to save permissions:", error);
      alert("Failed to save permissions. Please try again.");
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;

    const updatedUser = {
      ...selectedUser,
      role: newRole,
    };

    setUsers(
      users.map((user) => (user.id === selectedUser.id ? updatedUser : user))
    );
    setSelectedUser(updatedUser);

    const payload = {
      userId: selectedUser.id,
      newRole: newRole,
      previousRole: selectedUser.role,
      timestamp: new Date().toISOString(),
      updatedBy: "current_user_id",
    };

    try {
      console.log("Role changed payload:", payload);
      setShowRoleModal(false);
      setNewRole("");
      alert("Role updated successfully");
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("Failed to update role. Please try again.");
    }
  };

  // Columns for main users table
  const userColumns = [
    {
      key: "id",
      title: "ID",
      sortable: true,
      width: "80px",
    },
    {
      key: "name",
      title: "User",
      sortable: true,
      render: (value, row) => (
        <div className="d-flex align-items-center">
          <div>
            <div className="font-weight-600">{value}</div>
            <div className="text-muted small">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      title: "Role",
      sortable: true,
      render: (value) => (
        <Badge
          pill
          className={`
            ${
              value === "Administrator"
                ? "bg-danger"
                : value === "Manager"
                  ? "bg-warning"
                  : "bg-primary"
            }
            text-white
          `}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value) => (
        <Badge
          pill
          className={value === "active" ? "bg-success" : "bg-secondary"}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "lastLogin",
      title: "Last Active",
      sortable: true,
      render: (value) => (
        <div className="text-nowrap">
          {new Date(value).toLocaleDateString()}
          <div className="text-muted small">
            {new Date(value).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      sortable: false,
      render: (_, row) => (
        <Button
          variant={selectedUser?.id === row.id ? "primary" : "outline-primary"}
          size="sm"
          onClick={() =>
            setSelectedUser(selectedUser?.id === row.id ? null : row)
          }
          className="px-3"
        >
          {selectedUser?.id === row.id ? "Close" : "Manage"}
        </Button>
      ),
    },
  ];

  // Columns for permissions table
  const permissionColumns = [
    {
      key: "module",
      title: "Module",
      width: "200px",
      render: (_, row) => (
        <div className="d-flex align-items-center">
          <span className="me-2 fs-5">{row.icon}</span>
          <strong>{row.module}</strong>
        </div>
      ),
    },
    {
      key: "permissions",
      title: "Permissions",
      render: (_, row) => (
        <div className="d-flex flex-wrap gap-3">
          {row.permissions.map((permission) => (
            <Form.Check
              key={permission.key}
              type="switch"
              id={`perm-${selectedUser?.id}-${permission.key}`}
              label={permission.label}
              checked={selectedUser?.permissions[permission.key] || false}
              onChange={(e) =>
                handlePermissionChange(
                  selectedUser?.id,
                  permission.key,
                  e.target.checked
                )
              }
              className="me-3"
            />
          ))}
        </div>
      ),
    },
  ];

  // Prepare data for permissions DataTable
  const permissionsTableData = crmModules.map((module) => ({
    ...module,
    id: module.module.toLowerCase().replace(/\s+/g, "-"),
  }));

  return (
    <div className="container-fluid">
      {/* Main Users Table */}
      <Card className=" border-0 p-0">
        <Card.Body className="p-0">
          <DataTable
            inboxData={users}
            columns={userColumns}
            defaultItemsPerPage={10}
            itemsPerPageOptions={[5, 10, 25, 50]}
            enableSearch={true}
            hideToggle={true}
            enableDownload={true}
            enableFiltering={true}
            enablePagination={true}
            enableSorting={true}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            className="border-0"
          />
        </Card.Body>
      </Card>

      {/* Permissions DataTable */}
      {selectedUser && (
        <Card className="shadow border-0">
          <Card.Header className="bg-white border-0 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">{selectedUser.name}</h5>
                <div className="d-flex align-items-center">
                  <Badge
                    pill
                    bg={
                      selectedUser.status === "active" ? "success" : "secondary"
                    }
                    className="me-2"
                  >
                    {selectedUser.status}
                  </Badge>
                  <span className="text-muted">{selectedUser.email}</span>
                  <span className="ms-3 text-muted">
                    Role: {selectedUser.role}
                  </span>
                </div>
              </div>
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowRoleModal(true)}
                  className="me-2"
                >
                  Change Role
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card.Header>
          <DataTable
            inboxData={permissionsTableData}
            columns={permissionColumns}
            hideToggle={true}
            enablePagination={false}
            enableDownload={false}
            enableSearch={false}
            enableFiltering={false}
            enableSorting={false}
            className="border-0"
          />
          <div className="d-flex justify-content-end mt-4 border-top pt-3">
            <Button
              variant="outline-secondary"
              className="me-2 px-4"
              onClick={() => setSelectedUser(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="px-4"
              onClick={handleSavePermissions}
            >
              Save Permissions
            </Button>
          </div>
        </Card>
      )}

      {/* Role Change Modal */}
      <Modal
        show={showRoleModal}
        onHide={() => setShowRoleModal(false)}
        centered
      >
        <Modal.Header closeButton className="border-0 pb-2">
          <Modal.Title>Change User Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select New Role</Form.Label>
            <Form.Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="">Select a role</option>
              <option value="Administrator">Administrator</option>
              <option value="Manager">Manager</option>
              <option value="User">Standard User</option>
              <option value="Custom">Custom Role</option>
            </Form.Select>
          </Form.Group>
          {newRole === "Custom" && (
            <Form.Group className="mb-3">
              <Form.Label>Custom Role Name</Form.Label>
              <Form.Control type="text" placeholder="Enter custom role name" />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="outline-secondary"
            onClick={() => setShowRoleModal(false)}
            className="px-4"
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRoleChange} className="px-4">
            Update Role
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserPrivileges;
