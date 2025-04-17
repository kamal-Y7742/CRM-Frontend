import React, { useEffect, useState, memo } from 'react';
import DataTable from '../Component/DataTable';
import { fetchLoginHistory } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from 'react-bootstrap'

const LoginHistory = () => {
  const dispatch = useDispatch();
  const { loginHistory: loginHistoryResponse, historyLoading } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loginHistoryResponse?.loginHistory?.length) {
      dispatch(fetchLoginHistory());
    }
  }, [dispatch, loginHistoryResponse?.loginHistory?.length]);

  const transformedData = loginHistoryResponse?.loginHistory?.map(item => ({
    id: item.id,
    timestamp: item.loginTime,
    ipAddress: item.ipAddress || 'N/A',
    location: item.latitude && item.longitude 
      ? `Lat: ${item.latitude}, Long: ${item.longitude}`
      : 'Unknown',
    duration: item.duration || (item.logoutTime ? 'Active' : 'Still active'),
    loginType: item.loginType,
    status: item.logoutTime ? 'Logged out' : 'Active'
  })) || [];

  console.log(transformedData,'transformedData')

  const columns = React.useMemo(() => [

    {
      header: "Created At",
      accessor: "timestamp",
      key: "timestamp",
      title: "Created At",
      cell: (row) => {
        try {
          const dateUTC = new Date(row.timestamp);
          if (isNaN(dateUTC)) return "N/A";
    
          // Convert to IST (UTC + 5:30)
          const istOffset = 5.5 * 60; // in minutes
          const istTime = new Date(dateUTC.getTime() + istOffset * 60000);
    
          const day = String(istTime.getDate()).padStart(2, "0");
          const month = String(istTime.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
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
      key: "ipAddress",
      title: "IP Address",
      sortable: true,
      cell: (row) => (
        <span><p>{row?.ipAddress || 'N/A'}</p>
        </span>
      ),
    },
    {
      key: "location",
      title: "Location",
      render: (value) => value || "Unknown",
    },
    {
      key: "duration",
      title: "duration",
      cell: (row) => (
        <span><p>{row?.duration || 'N/A'}</p>
        </span>
      ),
    },
   

    {
      key: "status",
      title: "Status",
      sortable: true,
      cell: (row) => {
        const status = row?.status?.toLowerCase();
    
        // Determine the variant based on status
        let variant;
        if (status === 'active') {
          variant = 'success';
        } else if (status === 'logout') {
          variant = 'secondary';
        } else {
          variant = 'danger';
        }
    
        return (
          <Badge bg={variant} className="text-capitalize px-3 py-2 rounded-pill">
            {status || 'N/A'}
          </Badge>
        );
      },
    }
    
  ], []);

  return (
    <div className="container-fluid">
     
            <DataTable
              inboxData={transformedData || []}
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
              hideToggle={true}
              enableDownload={false}
              enableFiltering={false}
              enablePagination={true}
              enableSorting={true}
            />
          
    </div>
  );
};

export default memo(LoginHistory);