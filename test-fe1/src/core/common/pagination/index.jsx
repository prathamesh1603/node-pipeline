import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const PaginationControls = ({
  totalPages = 1,
  onPageChange,
  isFetching = false,
  totalCount = 5,
  currentPageDataCount = 2,
  moduleName,
  initialPage = 1, // Optional: Start from a specific page
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      onPageChange(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const previousPage = currentPage - 1;
      setCurrentPage(previousPage);
      onPageChange(previousPage);
    }
  };

  return (
    <div className="pagination-controls mt-3 d-flex flex-column flex-md-row justify-content-between align-items-center">
      <div className="text-dark mb-2 mb-md-0">
        Showing <span className="fw-bold">{currentPageDataCount}</span> of{" "}
        <span className="fw-bold">{totalCount}</span> {moduleName} for page{" "}
        <strong> {currentPage}</strong>
      </div>
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-outline-dark"
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || isFetching}
          aria-label="Previous Page"
        >
          <FaArrowLeft />
        </button>
        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          className="btn btn-outline-dark"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || isFetching}
          aria-label="Next Page"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
