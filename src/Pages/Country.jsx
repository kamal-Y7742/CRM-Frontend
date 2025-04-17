import React, { useState, useEffect, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import {
  fetchCountries,
  addCountry,
  updateCountry,
  deleteCountry,
  openCountryModal,
  closeCountryModal,
} from "../features/Slices/CountrySlice";
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
    onDelete(row.countryID || row.id, e);
  }, [row, onDelete]);

  return (
    <div className="d-flex">
      <Button variant="outline-primary" size="sm" className="me-2" onClick={handleEdit} title="Edit">
        <FaEdit size={14} />
      </Button>
      <Button variant="outline-danger" size="sm" onClick={handleDelete} title="Delete">
        <FaTrash size={14} />
      </Button>
    </div>
  );
});

const CountryFormModal = memo(({ isOpen, onClose, onSubmit, formData, onChange, isEdit, validated, isLoading }) => {
  return (
    <Modal show={isOpen} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Edit Country" : "Add Country"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Country Name</Form.Label>
            <Form.Control
              type="text"
              name="country_desc"
              value={formData.country_desc}
              onChange={onChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a country name.
            </Form.Control.Feedback>
          </Form.Group>
         
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (isEdit ? "Updating..." : "Saving...") : (isEdit ? "Update" : "Save")}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
});

const Country = () => {
  const dispatch = useDispatch();
  const { 
    countries = { countries: [] },
    status = 'idle',
    error = null,
    isModalOpen = false,
    operationStatus = 'idle',
    currentCountry = null
  } = useSelector((state) => state.country || {});

  const [selectedId, setSelectedId] = useState(null);
  console.log(selectedId,'selectedId')
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    country_desc: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  console.log(itemToDelete,'itemToDelete')

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCountries());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (currentCountry) {
      setFormData({
        country_desc: currentCountry.country_desc || "",
      });
      setSelectedId(currentCountry.countryID || currentCountry.id);
    } else {
      setFormData({ country_desc: ""});
      setSelectedId(null);
    }
  }, [currentCountry]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        await dispatch(updateCountry({
          country_Id: selectedId,
          country_desc: formData.country_desc    
             })).unwrap();
      } else {
        await dispatch(addCountry(formData)).unwrap();
      }
      setValidated(false);
    } catch (error) {
      console.error("Operation failed:", error);
    }
  }, [dispatch, selectedId, formData]);

  const handleRowClick = useCallback((row) => {
    dispatch(openCountryModal(row));
  }, [dispatch]);

  const handleAddClick = useCallback(() => {
    dispatch(openCountryModal());
  }, [dispatch]);

  const handleDeleteClick = useCallback((id, e) => {
    e?.stopPropagation();
    setItemToDelete(id);
    setShowConfirmModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (itemToDelete) {
      try {
        await dispatch(deleteCountry(itemToDelete)).unwrap();
        setShowConfirmModal(false);
        setItemToDelete(null);
      } catch (error) {
        toast.error(error?.message || "Failed to delete country");
      }
    }
  }, [dispatch, itemToDelete]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeCountryModal());
  }, [dispatch]);

  const columns = React.useMemo(() => [
    { header: "S.No", key: "serial", cell: (_, index) => index + 1, width: 80 },
    { header: "Country Name", accessor: "country_desc", minWidth: 200 },
    {
      header: "Regions",
      key: "regions",
      cell: (row) =>
        row.regions && row.regions.length > 0
          ? row.regions.map(r => r.region_desc).join(", ")
          : "N/A",
      minWidth: 200
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
      cell: (row) => {
        const mode = row?.mode || "normal";
        return (
          <span className={`badge ${mode === "added" ? "bg-success" : mode === "modified" ? "bg-warning text-dark" : "bg-secondary"}`}>
            {mode}
          </span>
        );
      },
      width: 100
    },
    {
      header: "Actions",
      key: "actions",
      cell: (row) => (
        <RowActions row={row} onEdit={handleRowClick} onDelete={handleDeleteClick} />
      ),
      width: 120
    }
  ], [handleRowClick, handleDeleteClick]);
  
  const actionButtons = React.useMemo(() => [{
    label: "Add Country",
    variant: "primary",
    onClick: handleAddClick
  }], [handleAddClick]);

  const tableData = React.useMemo(() => countries.countries || [], [countries]);

  if (status === "loading" && tableData.length === 0) {
    return <div className="text-center py-4">Loading countries...</div>;
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
        loading={operationStatus === 'loading' && status !== 'loading'}
      />

      <CountryFormModal
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
        message="Are you sure you want to delete this country?"
        confirmText={operationStatus === 'loading' ? "Deleting..." : "Delete"}
      />
    </div>
  );
};

export default memo(Country);