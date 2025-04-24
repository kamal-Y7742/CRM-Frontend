import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllHistory } from '../features/Slices/AllHistorySlice';
import DataTable from '../Component/DataTable';

const HistoryAll = () => {
  const dispatch = useDispatch();

  const { completeHistory, loading, error } = useSelector((state) => state.allhistory);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAllHistory());
  }, [dispatch]);

  const columns = [
    {
      header: "S.No",
      key: "serial",
      title: "Serial No",
      cell: (_, index) => index + 1,
      width: 60,
    },
    {
      header: "mode",
      accessor: "mode",
      key: "mode",
      title: "mode",
      cell: (row) => row?.mode || "N/A",
      minWidth: 180,
    },
  
    {
      header: "changes",
      accessor: "changes",
      key: "changes",
      title: "changes",
      cell: (row) => row?.changes || "N/A",
      minWidth: 180,
    },
  
    {
      header: "SDscription",
      accessor: "description",
      key: "description",
      title: "Description",
      cell: (row) => row?.description || "N/A",
      minWidth: 180,
    },
    {
      header: "ModifiedBy",
      accessor: "modifiedBy",
      key: "modifiedBy",
      title: "ModifiedBy",
      cell: (row) => row?.modifiedBy || "N/A",
      minWidth: 180,
    },
    {
      header: "programName",
      accessor: "programName",
      key: "programName",
      title: "programName",
      cell: (row) => row?.programName || "N/A",
      minWidth: 180,
    },
  
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      sortable: true,
      cell: (row) => new Date(row.timestamp).toLocaleString(),
    },
    {
      header: 'Error Description',
      accessor: 'error_desc',
      sortable: false,
    },
  ];

  if (loading) {
    return <div className="text-center py-4">Loading all history records...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-body">
          <DataTable
            inboxData={completeHistory?.history || []}
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
            emptyStateMessage="No  history found"
            hideToggle={true}
            enableDownload={false}
            enableFiltering={false}
            enablePagination={true}
            enableSorting={true}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(HistoryAll);
