import React, { useState } from "react";
import DataTable from "../Component/DataTable";
import { fetchLoginHistory } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

const History = () => {
  const dispatch = useDispatch();
  const { loginHistory, historyLoading } = useSelector((state) => state.auth);
  console.log(loginHistory,'loginHistory')

  const { token } = useSelector((state) => state.auth);
  console.log(token,'token')
  const isAuthenticated = !!token;

  useEffect(() => {
    console.log('Authentication token:', token);
    console.log('Is authenticated:', isAuthenticated);
  }, [token, isAuthenticated]);

   useEffect(() => {
      if (status === "idle") {
        dispatch(fetchLoginHistory());
      }
    }, [dispatch, status]);

  const columns = [
    {
      key: "timestamp",
      title: "Login Time",
      sortable: true,
      width: "150px",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: "ipAddress",
      title: "IP Address",
      sortable: true,
    },
    {
      key: "location",
      title: "Location",
      render: (value) => value || "Unknown",
    },
    {
      key: "device",
      title: "Device",
      render: (device) => (
        <div>
          {device?.browser && <span>{device.browser}</span>}
          {device?.os && (
            <span className="text-muted ms-2">({device.os})</span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value) => (
        <span className={`badge bg-${value === "success" ? "success" : "danger"}`}>
          {value === "success" ? "Successful" : "Failed"}
        </span>
      ),
    },
    {
      key: "userAgent",
      title: "User Agent",
      render: (value) => (
        <small className="text-muted" style={{ fontSize: "0.8rem" }}>
          {value}
        </small>
      ),
    },
  ];


  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="container-fluid">
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <h5 className="mb-0">Login History</h5>
        <p className="text-muted mb-0">
          Recent login activities for your account
        </p>
      </div>
      <div className="card-body">
        {historyLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <DataTable
            inboxData={loginHistory}
            columns={columns}
            defaultItemsPerPage={10}
            itemsPerPageOptions={[5, 10, 25, 50]}
            enableSearch={true}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            className="border-0"
            striped={true}
            hover={true}
            responsive={true}
            emptyStateMessage="No login history found"
          />
        )}
      </div>
    </div>
  </div>
  );
};

export default History;
