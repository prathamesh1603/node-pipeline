import React from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment"; // Ensure moment.js is installed

const DateRangePickerComponent = ({ dateRange, setDateRange }) => {
  // Handle date range change
  const handleDateChange = (event, picker) => {
    setDateRange({
      startDate: picker.startDate.format("YYYY-MM-DD"),
      endDate: picker.endDate.format("YYYY-MM-DD"), // No need to add extra day
    });
  };

  // Display text for button
  const displayText =
    dateRange.startDate && dateRange.endDate
      ? `${moment(dateRange.startDate).format("DD MMM YYYY")} - ${moment(
          dateRange.endDate
        ).format("DD MMM YYYY")}`
      : "Select Date Range";

  return (
    <DateRangePicker
      initialSettings={{
        startDate:
          dateRange.startDate ||
          moment().subtract(7, "days").format("YYYY-MM-DD"),
        endDate: dateRange.endDate || moment().format("YYYY-MM-DD"),
        locale: {
          format: "YYYY-MM-DD",
        },
      }}
      onApply={handleDateChange}
    >
      <button className="btn btn-primary">{displayText}</button>
    </DateRangePicker>
  );
};

export default DateRangePickerComponent;
