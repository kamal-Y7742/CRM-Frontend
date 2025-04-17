import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  openDepartmentModal,
  closeDepartmentModal,
} from "../features/Slices/DepartmentSlice";
import DataTable from "../Component/DataTable";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmationModal from "../Component/ConfirmationModal";

const Department = () => {
  const dispatch = useDispatch();
  const { 
    departments, 
    status, 
    error, 
    isModalOpen,
    currentDepartment,
    operationStatus
  } = useSelector((state) => state.department);
  console.log(departments,'departments')

  const [selectedId, setSelectedId] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    department_desc: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  React.useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  React.useEffect(() => {
    if (currentDepartment) {
      setFormData({
        department_desc: currentDepartment.department_desc || "",
      });
      setSelectedId(currentDepartment.departmentId || currentDepartment.id);
    } else {
      setFormData({ department_desc: "" });
      setSelectedId(null);
    }
  }, [currentDepartment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
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
          updateDepartment({
            department_Id: selectedId,
            department_desc: formData.department_desc,
          })
        ).unwrap();
      } else {
        await dispatch(addDepartment(formData)).unwrap();
      }
      
      setValidated(false);
      dispatch(closeDepartmentModal());
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleRowClick = (row) => {
    dispatch(openDepartmentModal(row));
  };

  const handleAddClick = () => {
    dispatch(openDepartmentModal());
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await dispatch(deleteDepartment(itemToDelete)).unwrap();
      } catch (error) {
        toast.error(error.message || "Failed to delete department");
      }
    }
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  const columns = [
    {
      header: "S.No",
      key: "serial",
      title: "Serial No",
      cell: (_, index) => index + 1,
      width: 80,
    },
    {
      header: "Description",
      accessor: "department_desc",
      key: "department_desc",
      title: "Description",
      cell: (row) => row?.department_desc || "N/A",
      minWidth: 200,
    },
    {
      header: "Status",
      accessor: "mode",
      key: "mode",
      title: "Status",
      cell: (row) => {
        if (!row.mode) return "Synced";
        return row.mode === "added" ? "New" : 
               row.mode === "modified" ? "Modified" : "Synced";
      },
      width: 120,
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
      header: "Actions",
      key: "actions",
      title: "Actions",
      sortable: false,
      width: 120,
      cell: (row) => (
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
            disabled={operationStatus === 'loading'}
          >
            <FaEdit size={14} />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row.departmentId || row.id);
            }}
            title="Delete"
            disabled={operationStatus === 'loading'}
          >
            <FaTrash size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const tableData = Array.isArray(departments?.departments)
    ? departments.departments
    : [];

    console.log(tableData,'tableData')
  const actionButtons = [
    {
      label: "Add Department",
      variant: "primary",
      onClick: handleAddClick,
      disabled: operationStatus === 'loading'
    },
  ];

  if (status === "loading") {
    return <div className="text-center py-4">Loading departments...</div>;
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
        hideToggle={true}
        enableDownload={false}
        enableFiltering={false}
        enablePagination={true}
        enableSorting={true}
        actionButtons={actionButtons}
        loading={operationStatus === 'loading'}
      />

      <Modal
        show={isModalOpen}
        onHide={() => {
          setSelectedId(null);
          setFormData({ department_desc: "" });
          dispatch(closeDepartmentModal());
        }}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedId ? "Edit Department" : "Add Department"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="department_desc"
                value={formData.department_desc}
                onChange={handleChange}
                required
                disabled={operationStatus === 'loading'}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a description.
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => {
                  setSelectedId(null);
                  setFormData({ department_desc: "" });
                  dispatch(closeDepartmentModal());
                }}
                disabled={operationStatus === 'loading'}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={operationStatus === 'loading'}
              >
                {operationStatus === 'loading' ? (
                  <span>Processing...</span>
                ) : selectedId ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <ConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this department?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={operationStatus === 'loading'}
      />
    </div>
  );
};

export default Department;