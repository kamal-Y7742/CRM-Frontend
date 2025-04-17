import React, { useState, useEffect, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import {
  fetchOrganizations,
  addOrganization,
  updateOrganization,
  deleteOrganization,
  openOrganizationModal,
  closeOrganizationModal,
} from "../features/Slices/OrganisationSlice";
import DataTable from "../Component/DataTable";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmationModal from "../Component/ConfirmationModal";

// Memoized table row action buttons component
const RowActions = memo(({ row, onEdit, onDelete }) => {
  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    onEdit(row);
  }, [row, onEdit]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(row.organizationId || row.id, e);
  }, [row, onDelete]);

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
});

RowActions.displayName = 'RowActions';

// Memoized organisation form modal
const OrganisationFormModal = memo(({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  onChange, 
  isEdit, 
  validated,
  isLoading 
}) => {
  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit ? "Edit Organisation" : "Add Organisation"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="organization_desc"
              value={formData.organization_desc}
              onChange={onChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a description.
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              className="me-2"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 
                (isEdit ? "Updating..." : "Saving...") : 
                (isEdit ? "Update" : "Save")}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
});

OrganisationFormModal.displayName = 'OrganisationFormModal';

// Main Organisation component
const Organisation = () => {
  const dispatch = useDispatch();
  const { 
    organisations = { organizations: [] }, 
    status, 
    error, 
    isModalOpen,
    operationStatus,
    currentOrganization
  } = useSelector((state) => state.organisation);
  

  const [selectedId, setSelectedId] = useState(null);
  console.log(currentOrganization,'currentOrganization')

  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    organization_desc: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (currentOrganization) {
      setFormData({
        organization_desc: currentOrganization.organization_desc || "",
      });
      setSelectedId(currentOrganization.organizationId || currentOrganization.id);
    } else {
      setFormData({ organization_desc: "" });
      setSelectedId(null);
    }
  }, [currentOrganization]);  
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOrganizations());
    }
  }, [dispatch, status]);



  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
  
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
  
    try {
      if (selectedId) {
        await dispatch(
          updateOrganization({
            organisation_Id: selectedId,
            organization_desc: formData.organization_desc,
          })
        ).unwrap();
      } else {
        await dispatch(addOrganization(formData)).unwrap();
      }
      
      setValidated(false);
    } catch (error) {
      console.error("Operation failed:", error);
    }
  }, [dispatch, selectedId, formData]);

  const handleRowClick = useCallback((row) => {
    dispatch(openOrganizationModal(row));
    setSelectedId(row.organizationId || row.id); 
  }, [dispatch]);

  const handleAddClick = useCallback(() => {
    dispatch(openOrganizationModal());
  }, [dispatch]);

  const handleDeleteClick = useCallback((organizationId, e) => {
    e?.stopPropagation(); 
    setItemToDelete(organizationId);
    setShowConfirmModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (itemToDelete) {
      try {
        await dispatch(deleteOrganization(itemToDelete)).unwrap();
        setShowConfirmModal(false);
        setItemToDelete(null);
      } catch (error) {
        toast.error(error?.message || "Failed to delete organisation");
      }
    }
  }, [dispatch, itemToDelete]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeOrganizationModal());
  }, [dispatch]);

  // Memoized column definitions
  const columns = React.useMemo(() => [
    {
      header: "S.No",
      key: "serial",
      title: "Serial No",
      cell: (_, index) => index + 1,
      width: 80,
    },
    {
      header: "Description",
      accessor: "organization_desc",
      key: "organization_desc",
      title: "Description",
      cell: (row) => row?.organization_desc || "N/A",
      minWidth: 200,
    },
    // {
    //   header: "ID",
    //   accessor: "organizationId",
    //   key: "id",
    //   title: "ID",
    //   cell: (row) => row.organizationId || row.id || "N/A",
    //   width: 80,
    // },
    {
      header: "Created At",
      accessor: "createdAt",
      key: "createdAt",
      title: "Created At",
      cell: (row) => {
        try {
          const dateUTC = new Date(row.createdAt);
          if (isNaN(dateUTC)) return "N/A";
    
          // Convert to IST (UTC + 5:30)
          const istOffset = 5.5 * 60; 
          const istTime = new Date(dateUTC.getTime() + istOffset * 60000);
    
          const day = String(istTime.getDate()).padStart(2, "0");
          const month = String(istTime.getMonth() + 1).padStart(2, "0"); 
          const year = istTime.getFullYear();
    
          let hours = istTime.getHours();
          const minutes = String(istTime.getMinutes()).padStart(2, "0");
          const ampm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12 || 12;
    
          return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
        } catch {
          return "N/A";
        }
      },
      width: 180,
    },
    {
      header: "Status",
      accessor: "mode",
      key: "mode",
      title: "Status",
      cell: (row) => {
        const mode = row?.mode || "normal";
        let badgeClass = "badge ";
        
        switch(mode) {
          case "added":
            badgeClass += "bg-success";
            break;
          case "modified":
            badgeClass += "bg-warning text-dark";
            break;
          default:
            badgeClass += "bg-secondary";
        }
        
        return <span className={badgeClass}>{mode}</span>;
      },
      width: 100,
    },
    {
      header: "Actions",
      key: "actions",
      title: "Actions",
      sortable: false,
      width: 120,
      cell: (row) => (
        <RowActions 
          row={row} 
          onEdit={handleRowClick} 
          onDelete={handleDeleteClick} 
        />
      ),
    },
  ], [handleRowClick, handleDeleteClick]);

  // Memoized action buttons
  const actionButtons = React.useMemo(() => [
    {
      label: "Add Organisation",
      variant: "primary",
      onClick: handleAddClick,
    },
  ], [handleAddClick]);

  // Memoized table data - properly get the array from the nested structure
  const tableData = React.useMemo(() => {
    if (organisations?.organizations && Array.isArray(organisations.organizations)) {
      return organisations.organizations;
    }
    return [];
  }, [organisations]);

  // Show loading state when fetching organisations initially
  if (status === "loading" && tableData.length === 0) {
    return <div className="text-center py-4">Loading organisations...</div>;
  }

  if (status === "failed") {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container-fluid">
      <DataTable
        inboxData={tableData}
        archiveData={[]}
        columns={columns}
        onRowClick={handleRowClick}
        defaultItemsPerPage={10}
        itemsPerPageOptions={[5, 10, 25, 50]}
        enableSearch={true}
        hideToggle={true}
        enableDownload={false}
        enableFiltering={false}
        enablePagination={true}
        enableSorting={true}
        actionButtons={actionButtons}
        loading={operationStatus === 'loading' && status !== 'loading'}
      />

      {/* Organisation Form Modal */}
      <OrganisationFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
        isEdit={!!selectedId}
        validated={validated}
        isLoading={operationStatus === 'loading'}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this organisation?"
        confirmText={operationStatus === 'loading' ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        variant="danger"
        disabled={operationStatus === 'loading'}
      />
    </div>
  );
};

export default memo(Organisation);