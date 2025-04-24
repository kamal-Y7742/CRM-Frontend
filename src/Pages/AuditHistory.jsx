import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistory } from '../features/Slices/HistorySlice';
import DataTable from '../Component/DataTable';

const HistoryAll = () => {
  const dispatch = useDispatch();
  const { auditHistory, loading, error, totalRecords, totalPages, currentPage } = useSelector((state) => state.history);
  console.log(auditHistory, 'auditHistory')
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);
  
  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      sortable: true,
    },
    {
      header: 'User',
      accessor: 'createdBy',
      sortable: true,
    },
    {
      header: 'Action',
      accessor: 'mode',
      sortable: true,
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

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-body">
        <DataTable
            inboxData={auditHistory || []}
            columns={columns}
            defaultItemsPerPage={10}
            itemsPerPageOptions={[5, 10, 25, 50]}
            enableSearch={true}
            searchTerm={searchTerm}
            // onSearchChange={setSearchChange}
            className="border-0"
            striped={true}
            hover={true}
            responsive={true}
            emptyStateMessage="No audit history found"
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