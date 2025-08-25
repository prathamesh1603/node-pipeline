import axios from "axios";
import React from "react";
import Select from "react-select";
import { Button } from "antd";
import { MdCancel } from "react-icons/md";

const ReportsModal = ({
  reportDataFilter,
  setReportDataFilter,
  handleDownload,
}) => {
  const fileTypeOptions = [{ value: "excel", label: "Download as Excel" }];

  const handleFileTypeChange = (selectedOption) => {
    setReportDataFilter((prev) => ({
      ...prev,
      format: selectedOption.value,
    }));
  };

  const isDateSelected = reportDataFilter.fromDate && reportDataFilter.toDate;

  return (
    <div className="modal custom-modal fade" id="download_report" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Download Report</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <MdCancel size={50} />
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label className="form-label">
                  File Type <span className="text-danger">*</span>
                </label>
                <Select
                  classNamePrefix="react-select"
                  options={fileTypeOptions}
                  value={fileTypeOptions.find(
                    (option) => option.value === reportDataFilter.format
                  )}
                  onChange={handleFileTypeChange}
                  placeholder="Select File Type"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">From Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={reportDataFilter.fromDate}
                  onChange={(e) =>
                    setReportDataFilter((prev) => ({
                      ...prev,
                      fromDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">To Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={reportDataFilter.toDate}
                  onChange={(e) =>
                    setReportDataFilter((prev) => ({
                      ...prev,
                      toDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="modal-btn d-flex justify-content-end align-items-center gap-2">
                <Button
                  type="default" // Use "default" for a secondary/cancel button
                  className="btn-light"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Button>
                <Button
                  type="primary" // Use "primary" for the main action button
                  onClick={handleDownload}
                  data-bs-dismiss="modal"
                  disabled={!isDateSelected} // Disable button if dates are not selected
                >
                  Download Now
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsModal;
