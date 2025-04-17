import React, { useState, useEffect } from "react";
import "../assets/CSS/DataTable.css";
import "../assets/CSS/Sidebar.css";

const DataTable = ({
  inboxData = [],
  archiveData = [],
  inboxColumns = null,
  customHeaderLeft =true,
  archiveColumns = null,
  columns = null,
  title = "",
  itemsPerPageOptions = [5, 10, 25, 50],
  defaultItemsPerPage = 10,
  enableSearch = true,
  enableDownload = true,
  enableFiltering = true,
  enablePagination = true,
  enableSorting = true,
  onRowClick,
  emptyMessage = "No data available",
  actionButtons = [],
  searchTerm = "",
  onSearchChange,
  className = "",
  hideToggle = false,
  dateField = "createdAt",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [filters, setFilters] = useState({});
  const [activeView, setActiveView] = useState("inbox");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState("search");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [activeDatePreset, setActiveDatePreset] = useState(null);

  // Determine if we're in tabbed mode (inbox/archive) or single table mode
  const isTabbed = inboxColumns !== null && archiveColumns !== null;
  
  // Use the appropriate data and columns based on active view and mode
  const data = isTabbed 
    ? (activeView === "inbox" ? inboxData : archiveData)
    : inboxData; // For non-tabbed mode, use inboxData as the single data source
  
  const activeColumns = isTabbed
    ? (activeView === "inbox" ? inboxColumns : archiveColumns)
    : columns; // For non-tabbed mode, use the columns prop

  // Reset to first page when search term changes or view changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    localSearchTerm,
    filters,
    itemsPerPage,
    activeView,
    dateRange,
    activeDatePreset,
  ]);

  // Sync with external search term if provided
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Handle search term changes
  const handleSearchChange = (value) => {
    setLocalSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  // Close filter menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const filterMenu = document.getElementById("filter-menu");
      if (
        filterMenu &&
        !filterMenu.contains(event.target) &&
        !event.target.closest(".filter-button")
      ) {
        setIsFilterMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sorting logic
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle date range changes
  const handleDateRangeChange = (type, value) => {
    setDateRange((prev) => ({
      ...prev,
      [type]: value,
    }));
    // Reset preset when manually selecting dates
    setActiveDatePreset(null);
  };

  // Handle date preset selection
  const handleDatePresetSelect = (preset) => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    switch (preset) {
      case "lastMonth":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "lastWeek":
        start = new Date(now);
        start.setDate(start.getDate() - (now.getDay() + 7));
        end = new Date(start);
        end.setDate(end.getDate() + 6);
        break;
      case "thisMonth":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date();
        break;
      case "thisWeek":
        start = new Date(now);
        start.setDate(start.getDate() - now.getDay());
        end = new Date();
        break;
      default:
        break;
    }

    // Format dates as yyyy-mm-dd for input fields
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setDateRange({
      start: formatDate(start),
      end: formatDate(end),
    });
    setActiveDatePreset(preset);
  };

  // Parse date strings in various formats
  const parseDate = (dateString) => {
    if (!dateString) return null;

    // Try ISO format first
    let date = new Date(dateString);
    if (!isNaN(date.getTime())) return date;

    // Try common formats
    const formats = [
      /(\w{3}) (\d{1,2}), (\d{4})/, // MMM d, yyyy (Apr 4, 2025)
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // M/d/yyyy (4/10/2025)
      /(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)/, // M/d/yyyy h:mm:ss a
      /(\w{3}) (\d{1,2}), (\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)/, // MMM d, yyyy h:mm:ss a
      /(\d{4})-(\d{2})-(\d{2})/, // yyyy-MM-dd
      /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/, // ISO with time
    ];

    for (const format of formats) {
      const match = dateString.match(format);
      if (match) {
        if (format === formats[0]) {
          // MMM d, yyyy
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const month = monthNames.indexOf(match[1]);
          if (month >= 0) {
            return new Date(match[3], month, match[2]);
          }
        } else if (format === formats[1]) {
          // M/d/yyyy
          return new Date(match[3], match[1] - 1, match[2]);
        } else if (format === formats[2]) {
          // M/d/yyyy h:mm:ss a
          let hours = parseInt(match[4]);
          if (match[7] === "PM" && hours < 12) hours += 12;
          if (match[7] === "AM" && hours === 12) hours = 0;
          return new Date(
            match[3],
            match[1] - 1,
            match[2],
            hours,
            match[5],
            match[6]
          );
        } else if (format === formats[3]) {
          // MMM d, yyyy h:mm:ss a
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const month = monthNames.indexOf(match[1]);
          let hours = parseInt(match[4]);
          if (match[7] === "PM" && hours < 12) hours += 12;
          if (match[7] === "AM" && hours === 12) hours = 0;
          return new Date(match[3], month, match[2], hours, match[5], match[6]);
        } else if (format === formats[4]) {
          // yyyy-MM-dd
          return new Date(match[1], match[2] - 1, match[3]);
        } else if (format === formats[5]) {
          // ISO with time
          return new Date(
            match[1],
            match[2] - 1,
            match[3],
            match[4],
            match[5],
            match[6]
          );
        }
      }
    }

    return null;
  };

  // Apply sorting, filtering, and search to data
  const getSortedAndFilteredData = () => {
    let filteredData = [...data];

    // Apply search
    if (localSearchTerm) {
      filteredData = filteredData.filter((item) =>
        activeColumns.some((column) => {
          const value = item[column.key || column.accessor];
          return (
            value !== undefined &&
            value !== null &&
            String(value).toLowerCase().includes(localSearchTerm.toLowerCase())
          );
        })
      );
    }

    // Apply column filters
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        filteredData = filteredData.filter((item) => {
          const value = item[key];
          return (
            value !== undefined &&
            value !== null &&
            String(value).toLowerCase().includes(filters[key].toLowerCase())
          );
        });
      }
    });

    // Apply date range filter if both dates are set
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);

      filteredData = filteredData.filter((item) => {
        if (!item[dateField]) return false;

        const itemDate = parseDate(item[dateField]);
        if (!itemDate) return false;

        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];

        if (valueA === undefined || valueA === null) return 1;
        if (valueB === undefined || valueB === null) return -1;

        // Handle different data types
        if (typeof valueA === "string" && typeof valueB === "string") {
          return sortConfig.direction === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        } else {
          if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
          if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
      });
    }

    return filteredData;
  };

  const processedData = getSortedAndFilteredData();

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({});
    setDateRange({ start: "", end: "" });
    setActiveDatePreset(null);
    setLocalSearchTerm("");
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  // Handle download as CSV
  const downloadCSV = () => {
    const headers = activeColumns.map((col) => col.title || col.header).join(",");
    const rows = processedData
      .map((item) =>
        activeColumns
          .map((col) => {
            const key = col.key || col.accessor;
            const value = item[key];
            return value !== undefined && value !== null
              ? `"${String(value).replace(/"/g, '""')}"`
              : '""';
          })
          .join(",")
      )
      .join("\n");

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `${title.replace(/\s+/g, "_").toLowerCase()}_${activeView}_export.csv`
    );
    a.click();
  };

  // Simple icon components
  const SearchIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  const FilterIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  );

  const CalendarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const DownloadIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );

  const PlusIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  const ChevronUpIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  const ChevronLeftIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  const LockIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  // Check if we should show the toggle
  const showToggle = isTabbed && !hideToggle && archiveData.length > 0;

  return (
    <div className={`data-table-container ${className}`}>
      <div className="table-header">
        <div className="header-top">
          <h2 className="table-title">{title}</h2>
        </div>
        <div className="header-controls header-row-1">
          <div className="left-controls">
                <div className="left-controls">
  {customHeaderLeft && <div className="custom-header-left">{customHeaderLeft}</div>}
</div>
          </div>

          <div className="right-controls">
            <div className="action-buttons">
              {enableFiltering && (
                <div className="filter-container">
                  <button
                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    className="filter-button"
                  >
                    <FilterIcon />
                    <span>Filters</span>
                  </button>

                  {isFilterMenuOpen && (
                    <div id="filter-menu" className="filter-menu">
                      <div className="filter-tabs">
                        <button
                          className={`filter-tab ${activeFilterTab === "search" ? "active" : ""}`}
                          onClick={() => setActiveFilterTab("search")}
                        >
                          <SearchIcon /> Search
                        </button>
                        <button
                          className={`filter-tab ${activeFilterTab === "date" ? "active" : ""}`}
                          onClick={() => setActiveFilterTab("date")}
                        >
                          <CalendarIcon /> Date Range
                        </button>
                      </div>

                      <div className="filter-content">
                        {activeFilterTab === "search" && (
                          <div className="search-tab-content">
                            <h3 className="filter-title">Filter by</h3>
                            <div className="filter-options">
                              {columns.map((column) => (
                                <div key={column.key} className="filter-item">
                                  <label className="filter-label">
                                    {column.title}
                                  </label>
                                  <input
                                    type="text"
                                    value={filters[column.key] || ""}
                                    onChange={(e) =>
                                      handleFilterChange(
                                        column.key,
                                        e.target.value
                                      )
                                    }
                                    className="filter-input"
                                    placeholder={`Filter by ${column.title?.toLowerCase() ?? ""}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {activeFilterTab === "date" && (
                          <div className="date-tab-content">
                            <h3 className="filter-title">Date Range</h3>
                            <div className="date-filter-options">
                              <div className="date-presets">
                                <button
                                  className={`date-preset-item ${activeDatePreset === "lastMonth" ? "active" : ""}`}
                                  onClick={() =>
                                    handleDatePresetSelect("lastMonth")
                                  }
                                >
                                  <LockIcon />
                                  <span>Last Month</span>
                                </button>
                                <button
                                  className={`date-preset-item ${activeDatePreset === "lastWeek" ? "active" : ""}`}
                                  onClick={() =>
                                    handleDatePresetSelect("lastWeek")
                                  }
                                >
                                  <LockIcon />
                                  <span>Last Week</span>
                                </button>
                                <button
                                  className={`date-preset-item ${activeDatePreset === "thisMonth" ? "active" : ""}`}
                                  onClick={() =>
                                    handleDatePresetSelect("thisMonth")
                                  }
                                >
                                  <LockIcon />
                                  <span>This Month</span>
                                </button>
                                <button
                                  className={`date-preset-item ${activeDatePreset === "thisWeek" ? "active" : ""}`}
                                  onClick={() =>
                                    handleDatePresetSelect("thisWeek")
                                  }
                                >
                                  <LockIcon />
                                  <span>This Week</span>
                                </button>
                              </div>

                              <div className="date-range-picker">
                                <div className="date-input-group">
                                  <label>Start Date</label>
                                  <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) =>
                                      handleDateRangeChange(
                                        "start",
                                        e.target.value
                                      )
                                    }
                                    className="date-input"
                                  />
                                </div>
                                <div className="date-input-group">
                                  <label>End Date</label>
                                  <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) =>
                                      handleDateRangeChange(
                                        "end",
                                        e.target.value
                                      )
                                    }
                                    className="date-input"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="filter-actions">
                          <button
                            className="filter-reset"
                            onClick={resetFilters}
                          >
                            Reset All
                          </button>
                          <button
                            className="filter-apply"
                            onClick={() => setIsFilterMenuOpen(false)}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {enableDownload && (
                <button
                  onClick={downloadCSV}
                  className="export-button btn-primary"
                >
                  <DownloadIcon />
                  <span>Export</span>
                </button>
              )}

              {actionButtons.map((button, index) => (
                <button
                  key={index}
                  onClick={button.onClick}
                  className={`export-button btn-primary ${button.className || ""}`}
                  disabled={button.disabled}
                >
                  {button.icon || <PlusIcon />}
                  <span>{button.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>


        {enableSearch && (
          <div className="header-controls header-row-2">
            <div className="search-container">
              <div className="search-icon">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={localSearchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        )}
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {activeColumns.map((column) => (
                <th
                  key={column.key || column.accessor}
                  className={`${
                    enableSorting && column.sortable !== false
                      ? "sortable-header"
                      : ""
                  }`}
                  onClick={() => {
                    if (enableSorting && column.sortable !== false) {
                      requestSort(column.key || column.accessor);
                    }
                  }}
                >
                  <div className="header-content">
                    <span>{column.header || column.title}</span>
                    {enableSorting && column.sortable !== false && (
                      <div className="sort-icons">
                        <div
                          className={`${
                            sortConfig.key ===
                              (column.key || column.accessor) &&
                            sortConfig.direction === "asc"
                              ? "active"
                              : ""
                          }`}
                        >
                          <ChevronUpIcon />
                        </div>
                        <div
                          className={`${
                            sortConfig.key ===
                              (column.key || column.accessor) &&
                            sortConfig.direction === "desc"
                              ? "active"
                              : ""
                          }`}
                        >
                          <ChevronDownIcon />
                        </div>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${onRowClick ? "clickable-row" : ""}`}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {activeColumns.map((column) => (
                    <td key={`${rowIndex}-${column.key || column.accessor}`}>
                      {column.cell
                        ? column.cell(item, rowIndex)
                        : column.render
                          ? column.render(item[column.accessor], item)
                          : item[column.accessor || column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan={activeColumns.length}>{emptyMessage}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {enablePagination && totalPages > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            <span>
              Showing <span className="highlight">{indexOfFirstItem + 1}</span>{" "}
              to{" "}
              <span className="highlight">
                {Math.min(indexOfLastItem, processedData.length)}
              </span>{" "}
              of <span className="highlight">{processedData.length}</span>{" "}
              results
            </span>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="page-size-select"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </select>
          </div>

          <div className="pagination-controls">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button prev"
              aria-label="Previous page"
            >
              <ChevronLeftIcon />
            </button>

            <div className="page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`pagination-button number ${
                      currentPage === pageNum ? "active" : ""
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button next"
              aria-label="Next page"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
