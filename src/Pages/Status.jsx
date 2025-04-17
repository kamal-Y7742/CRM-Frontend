import React, { useState, useEffect, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import {
  fetchStatuses,
  addStatus,
  updateStatus,
  deleteStatus,
  openStatusModal,
  closeStatusModal,
} from "../features/Slices/StatusSlice";
import DataTable from "../Component/DataTable";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmationModal from "../Component/ConfirmationModal";

const RowActions = memo(({ row, onEdit, onDelete }) => {
  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    onEdit(row);
  }, [row, onEdit]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(row.statusId || row.id, e);
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

const StatusFormModal = memo(({ 
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
          {isEdit ? "Edit Status" : "Add Status"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="status_desc"
              value={formData.status_desc}
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

StatusFormModal.displayName = 'StatusFormModal';

const Status = () => {
  const dispatch = useDispatch();
  const { 
    statuss, 
    status, 
    error, 
    isModalOpen,
    operationStatus,
    currentStatus 
  } = useSelector((state) => state.status);
  console.log(statuss,'statuses')

  const [selectedId, setSelectedId] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    status_desc: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchStatuses());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (currentStatus) {
      setFormData({
        status_desc: currentStatus.status_desc || "",
      });
      setSelectedId(currentStatus.statusId || currentStatus.id);
    } else {
      setFormData({ status_desc: "" });
      setSelectedId(null);
    }
  }, [currentStatus]);

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
          updateStatus({
            status_Id: selectedId,
            status_desc: formData.status_desc,
          })
        ).unwrap();
      } else {
        await dispatch(addStatus(formData)).unwrap();
      }
      
      setValidated(false);
      setFormData({ status_desc: "" });
      
    } catch (error) {
      console.error("Operation failed:", error);
    }
  }, [dispatch, selectedId, formData]);

  const handleRowClick = useCallback((row) => {
    dispatch(openStatusModal(row));
  }, [dispatch]);

  const handleAddClick = useCallback(() => {
    dispatch(openStatusModal());
  }, [dispatch]);

  const handleDeleteClick = useCallback((id, e) => {
    e?.stopPropagation();
    setItemToDelete(id);
    setShowConfirmModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (itemToDelete) {
      try {
        await dispatch(deleteStatus(itemToDelete)).unwrap();
        setShowConfirmModal(false);
        setItemToDelete(null);
      } catch (error) {
        toast.error(error?.message || "Failed to delete status");
      }
    }
  }, [dispatch, itemToDelete]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeStatusModal());
  }, [dispatch]);

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
      accessor: "status_desc",
      key: "status_desc",
      title: "Description",
      cell: (row) => row?.status_desc || "N/A",
      minWidth: 200,
    },
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

  const actionButtons = React.useMemo(() => [
    {
      label: "Add Status",
      variant: "primary",
      onClick: handleAddClick,
    },
  ], [handleAddClick]);

  const tableData = React.useMemo(() => {
    if (statuss?.statuss
      && Array.isArray(statuss.statuss
      )) {
      return statuss.statuss
      ;
    }
    return [];
  }, [statuss]);

  if (status === "loading" && tableData.length === 0) {
    return <div className="text-center py-4">Loading statuses...</div>;
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

      <StatusFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
        isEdit={!!selectedId}
        validated={validated}
        isLoading={operationStatus === 'loading'}
      />

      <ConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this status?"
        confirmText={operationStatus === 'loading' ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        variant="danger"
        disabled={operationStatus === 'loading'}
      />
    </div>
  );
};

export default memo(Status);