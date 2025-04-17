import React, { useState, useEffect, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form, ListGroup, Badge } from "react-bootstrap";
import {
  fetchRegions,
  addRegion,
  updateRegion,
  deleteRegion,
  openRegionModal,
  closeRegionModal,
} from "../features/Slices/RegionSlice";
import DataTable from "../Component/DataTable";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus, FaMinus, FaEye } from "react-icons/fa";
import ConfirmationModal from "../Component/ConfirmationModal";
import { fetchCountries } from "../features/Slices/CountrySlice";

const RowActions = memo(({ row, onEdit, onDelete, onView }) => {
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
      onDelete(row.countryId, e);
    },
    [row, onDelete]
  );

  const handleView = useCallback(
    (e) => {
      e.stopPropagation();
      onView(row);
    },
    [row, onView]
  );

  return (
    <div className="d-flex">
      <Button
        variant="outline-info"
        size="sm"
        className="me-2"
        onClick={handleView}
        title="View Regions"
      >
        <FaEye size={14} />
      </Button>
      <Button
        variant="outline-danger"
        size="sm"
        onClick={handleDelete}
        title="Delete All Regions"
      >
        <FaTrash size={14} />
      </Button>
    </div>
  );
});

const RegionFormModal = memo(
  ({
    isOpen,
    onClose,
    onSubmit,
    isEdit,
    validated,
    isLoading,
    countries,
    selectedCountry,
    setSelectedCountry,
    regionInputs,
    setRegionInputs,
    handleAddInput,
    handleRemoveInput,
    editMode,
  }) => {
    return (
      <Modal show={isOpen} onHide={onClose} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? "Edit Regions" : "Add Multiple Regions"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Select
                name="countryId"
                value={selectedCountry || ""}
                onChange={(e) => setSelectedCountry(e.target.value)}
                required
                disabled={isEdit}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option
                    key={country.countryId || country.countryID}
                    value={country.countryId || country.countryID}
                  >
                    {country.country_desc}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a country.
              </Form.Control.Feedback>
            </Form.Group>

            {selectedCountry && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Label>Regions</Form.Label>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleAddInput}
                    disabled={isLoading}
                  >
                    <FaPlus /> Add Region Field
                  </Button>
                </div>

                {regionInputs.map((input, index) => (
                  <Form.Group key={index} className="mb-3">
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        value={input.value}
                        onChange={(e) => {
                          const newInputs = [...regionInputs];
                          newInputs[index].value = e.target.value;
                          setRegionInputs(newInputs);
                        }}
                        required
                        placeholder={`Region name ${index + 1}`}
                      />
                      {regionInputs.length > 1 && (
                        <Button
                          variant="outline-danger"
                          className="ms-2"
                          onClick={() => handleRemoveInput(index)}
                        >
                          <FaMinus />
                        </Button>
                      )}
                      {isEdit && input.id && (
                        <Badge bg="info" className="ms-2">
                          ID: {input.id}
                        </Badge>
                      )}
                    </div>
                  </Form.Group>
                ))}

                <div className="d-flex justify-content-end mt-3">
                  <Button variant="secondary" className="me-2" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading
                      ? isEdit
                        ? "Updating..."
                        : "Saving..."
                      : isEdit
                        ? "Update"
                        : "Save All Regions"}
                  </Button>
                </div>
              </>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
);

const ViewRegionsModal = memo(
  ({ show, onHide, countryData, onEditRegion, onDeleteRegion }) => {
    if (!countryData) return null;

    return (
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Regions for {countryData.country_desc}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {countryData.regions.map((region) => (
              <ListGroup.Item
                key={region.regionID}
                className="d-flex justify-content-between align-items-center"
              >
                <div>{region.region_desc}</div>
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => onEditRegion(region)}
                  >
                    <FaEdit size={14} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDeleteRegion(region.regionID)}
                  >
                    <FaTrash size={14} />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
);

const Region = () => {
  const dispatch = useDispatch();
  const {
    regions = { regions: [] },
    status = "idle",
    error = null,
    isModalOpen = false,
    operationStatus = "idle",
    currentRegion = null,
  } = useSelector((state) => state.region || {});

  const countriesData = useSelector(
    (state) => state.country?.countries?.countries || []
  );

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [validated, setValidated] = useState(false);
  const [regionInputs, setRegionInputs] = useState([{ value: "" }]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [groupedRegions, setGroupedRegions] = useState([]);
  const [viewModalData, setViewModalData] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCountries());
      dispatch(fetchRegions());
    }
  }, [dispatch, status]);

  // Group regions by country
  useEffect(() => {
    if (regions.regions && regions.regions.length > 0) {
      const grouped = [];
      const countryMap = new Map();

      // Group regions by countryId
      regions.regions.forEach((region) => {
        const countryId = region.countryId || region.countryID;
        if (!countryMap.has(countryId)) {
          const country = countriesData.find(
            (c) => (c.countryId || c.countryID) == countryId
          );
          countryMap.set(countryId, {
            countryId,
            country_desc: country ? country.country_desc : "Unknown",
            regions: [],
          });
        }
        countryMap.get(countryId).regions.push(region);
      });

      // Convert map to array
      countryMap.forEach((value) => {
        grouped.push(value);
      });

      setGroupedRegions(grouped);
    }
  }, [regions.regions, countriesData]);

  useEffect(() => {
    if (currentRegion) {
      if (Array.isArray(currentRegion.regions)) {
        // Editing multiple regions
        setSelectedCountry(currentRegion.countryId);
        setRegionInputs(
          currentRegion.regions.map((region) => ({
            value: region.region_desc,
            id: region.regionID,
          }))
        );
        setEditMode(true);
      } else {
        // Editing a single region
        setSelectedCountry(currentRegion.countryId || currentRegion.countryID);
        setRegionInputs([
          { 
            value: currentRegion.region_desc || "", 
            id: currentRegion.regionID 
          }
        ]);
        setEditMode(false);
      }
    } else {
      setSelectedCountry(null);
      setRegionInputs([{ value: "" }]);
      setEditMode(false);
    }
  }, [currentRegion]);

  const handleAddInput = useCallback(() => {
    setRegionInputs([...regionInputs, { value: "" }]);
  }, [regionInputs]);

  const handleRemoveInput = useCallback(
    (index) => {
      if (regionInputs.length > 1) {
        const newInputs = [...regionInputs];
        newInputs.splice(index, 1);
        setRegionInputs(newInputs);
      }
    },
    [regionInputs]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      
      if (!selectedCountry) {
        setValidated(true);
        toast.error("Please select a country");
        return;
      }
      
      const hasEmptyInput = regionInputs.some((input) => !input.value.trim());
      if (hasEmptyInput) {
        setValidated(true);
        toast.error("Please fill all region fields");
        return;
      }

      try {
        if (currentRegion) {
          if (editMode) {
            // Update multiple regions
            const regionsToUpdate = regionInputs.map(input => ({
              regionID: input.id,
              region_desc: input.value,
              countryId: parseInt(selectedCountry)
            })).filter(r => r.regionID); // Only update existing regions
            
            // Add any new regions
            const newRegions = regionInputs
              .filter(input => !input.id)
              .map(input => ({
                region_desc: input.value
              }));
            
            if (regionsToUpdate.length > 0) {
              const updatePayload = {
                regions: regionsToUpdate
              };
              
              await dispatch(updateRegion(updatePayload)).unwrap();
            }
            
            if (newRegions.length > 0) {
              // Format for adding new regions
              const addPayload = {
                countryId: parseInt(selectedCountry),
                regions: newRegions
              };
              
              await dispatch(addRegion(addPayload)).unwrap();
            }
            
            toast.success("Regions updated successfully");
          } else {
            // Update single region
            await dispatch(
              updateRegion({
                regionID: currentRegion.regionID,
                region_desc: regionInputs[0].value,
                countryId: parseInt(selectedCountry),
              })
            ).unwrap();
            toast.success("Region updated successfully");
          }
        } else {
          // Create multiple regions
          const regionsData = regionInputs.map(input => ({
            region_desc: input.value
          }));
          
          // Create payload
          const payload = {
            countryId: parseInt(selectedCountry),
            regions: regionsData
          };
          
          await dispatch(addRegion(payload)).unwrap();
          toast.success(`${regionInputs.length} region(s) added successfully`);
        }
        
        setRegionInputs([{ value: "" }]);
        setSelectedCountry(null);
        setValidated(false);
        setEditMode(false);
        dispatch(closeRegionModal());
      } catch (error) {
        toast.error(error.message || "Operation failed");
      }
    },
    [dispatch, selectedCountry, regionInputs, currentRegion, editMode]
  );

  const handleRowClick = useCallback(
    (row) => {
      setViewModalData(row);
      setShowViewModal(true);
    },
    []
  );

  const handleEditRegion = useCallback(
    (region) => {
      setShowViewModal(false);
      dispatch(openRegionModal(region));
    },
    [dispatch]
  );

  const handleEditAllRegions = useCallback(
    (countryData) => {
      setShowViewModal(false);
      dispatch(openRegionModal({
        ...countryData,
        regions: countryData.regions
      }));
    },
    [dispatch]
  );

  const handleAddClick = useCallback(() => {
    dispatch(openRegionModal());
  }, [dispatch]);

  const handleDeleteClick = useCallback((countryId, e) => {
    e?.stopPropagation();
    setItemToDelete(countryId);
    setShowConfirmModal(true);
  }, []);

  const handleDeleteRegion = useCallback((regionId) => {
    setItemToDelete(regionId);
    setShowConfirmModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (itemToDelete) {
      try {
        // Check if it's a region ID or country ID
        const isRegionId = regions.regions.some(r => r.regionID === itemToDelete);
        
        if (isRegionId) {
          // Delete specific region
          await dispatch(deleteRegion(itemToDelete)).unwrap();
          toast.success("Region deleted successfully");
          
          // Update view modal if open
          if (showViewModal && viewModalData) {
            const updatedRegions = viewModalData.regions.filter(
              r => r.regionID !== itemToDelete
            );
            
            if (updatedRegions.length === 0) {
              setShowViewModal(false);
            } else {
              setViewModalData({
                ...viewModalData,
                regions: updatedRegions
              });
            }
          }
        } else {
          // Delete all regions for a country
          const regionsToDelete = regions.regions
            .filter(r => (r.countryId || r.countryID) == itemToDelete)
            .map(r => r.regionID);
          
          for (const regionId of regionsToDelete) {
            await dispatch(deleteRegion(regionId)).unwrap();
          }
          
          toast.success(`All regions deleted for the country`);
          
          if (showViewModal) {
            setShowViewModal(false);
          }
        }
        
        setShowConfirmModal(false);
        setItemToDelete(null);
      } catch (error) {
        toast.error(error?.message || "Failed to delete region(s)");
      }
    }
  }, [dispatch, itemToDelete, regions.regions, showViewModal, viewModalData]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeRegionModal());
    setSelectedCountry(null);
    setRegionInputs([{ value: "" }]);
    setValidated(false);
    setEditMode(false);
  }, [dispatch]);

  const columns = React.useMemo(
    () => [
      {
        header: "S.No",
        key: "serial",
        cell: (_, index) => index + 1,
        width: 80,
      },
      { 
        header: "Country", 
        accessor: "country_desc", 
        minWidth: 200 
      },
      {
        header: "Number of Regions",
        key: "regionCount",
        cell: (row) => row.regions.length,
        width: 150,
      },
      {
        header: "Regions Preview",
        key: "regionsPreview",
        cell: (row) => {
          // Show first 2 regions with a "+X more" if there are more
          const regions = row.regions;
          if (regions.length <= 2) {
            return regions.map(r => r.region_desc).join(", ");
          } else {
            return `${regions[0].region_desc}, ${regions[1].region_desc} +${regions.length - 2} more`;
          }
        },
        minWidth: 250,
      },
      {
        header: "Last Updated",
        key: "lastUpdated",
        cell: (row) => {
          try {
            const dates = row.regions.map(r => new Date(r.updatedAt || r.createdAt)).filter(d => !isNaN(d));
            if (dates.length === 0) return "N/A";
      
            const latestDateUTC = new Date(Math.max(...dates.map(d => d.getTime())));
      
            // Convert to IST
            const istOffset = 5.5 * 60; // minutes
            const istTime = new Date(latestDateUTC.getTime() + istOffset * 60000);
      
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
        cell: (row) => (
          <RowActions
            row={row}
            onEdit={handleEditAllRegions}
            onDelete={handleDeleteClick}
            onView={handleRowClick}
          />
        ),
        width: 150,
      },
    ],
    [handleRowClick, handleDeleteClick, handleEditAllRegions]
  );

  const actionButtons = React.useMemo(
    () => [
      {
        label: "Add Regions",
        variant: "primary",
        onClick: handleAddClick,
      },
    ],
    [handleAddClick]
  );

  if (status === "loading" && regions.regions?.length === 0) {
    return <div className="text-center py-4">Loading regions...</div>;
  }

  if (status === "failed") {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container-fluid">
      <DataTable
        inboxData={groupedRegions}
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
        loading={operationStatus === "loading" && status !== "loading"}
      />

      <RegionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isEdit={!!currentRegion}
        validated={validated}
        isLoading={operationStatus === "loading"}
        countries={countriesData}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        regionInputs={regionInputs}
        setRegionInputs={setRegionInputs}
        handleAddInput={handleAddInput}
        handleRemoveInput={handleRemoveInput}
        editMode={editMode}
      />

      <ViewRegionsModal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        countryData={viewModalData}
        onEditRegion={handleEditRegion}
        onDeleteRegion={handleDeleteRegion}
      />

      <ConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this region?"
        confirmText={operationStatus === "loading" ? "Deleting..." : "Delete"}
      />
    </div>
  );
};

export default memo(Region);