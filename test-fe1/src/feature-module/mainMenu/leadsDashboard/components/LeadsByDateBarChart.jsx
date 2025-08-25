import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";

import { useLeadsDashboardData } from "../hooks/useLeadsDashboardData";
import DateRangePickerComponent from "../../../../core/common/crmComponents/DateRangePickerComponent";
import {
  getDateRange,
  incrementDateByOne,
} from "../../../../utils/helpers/helper";
import BarChartLoader from "../../../../core/common/crmComponents/loaders/BarChartLoader";

const LeadsByDateBarChart = ({ selectedCompany }) => {
  const chartRef = useRef(null);

  const [dateRange, setDateRange] = useState(getDateRange());

  const { data, isLoading, isError, error } = useLeadsDashboardData({
    groupBy: "daily",
    sort: "-createdTime",
    ofCompany: selectedCompany,
    "createdTime[gt]": dateRange.startDate,
    "createdTime[lt]": incrementDateByOne(dateRange.endDate),
  });

  const leads = data?.data?.data || [];

  const totalLeads = leads.reduce((sum, lead) => sum + lead.count, 0);

  // Process data for the chart
  const chartData = leads.map((lead) => ({
    x: `${lead._id.day}-${lead._id.month}-${lead._id.year}` || "Unknown Date",
    y: lead.count || 0, // Use count for y-axis
  }));

  useEffect(() => {
    if (chartRef.current && chartData.length > 0) {
      const maxCount = Math.max(...leads.map((lead) => lead.count), 10); // Default to 10 if no data
      const limitYAxis = Math.round(maxCount / 5) || 5;
      const tickAmountYAxis = Math.ceil(maxCount / limitYAxis) || 1;

      // Sample or evenly distribute data points for the x-axis
      const maxBars = 10; // Limit the number of bars to 10
      let sampledData = chartData;

      if (chartData.length > maxBars) {
        const step = Math.ceil(chartData.length / maxBars); // Step to select data points
        sampledData = chartData.filter((_, index) => index % step === 0);
      }

      const uniqueDates = sampledData.map((data) => data.x); // Extract dates for x-axis

      const options = {
        series: [
          {
            name: "Leads",
            data: sampledData,
          },
        ],
        chart: {
          type: "bar",
          height: 275,
        },
        plotOptions: {
          bar: {
            borderRadius: 5,
            columnWidth: "40%",
          },
        },
        colors: ["#00918E"],
        xaxis: {
          type: "category",
          categories: uniqueDates, // Use sampled dates as categories
          labels: {
            rotate: -45,
            formatter: function (val) {
              return val.length > 0 ? val : "Unknown"; // Handle empty categories
            },
            style: {
              fontSize: "10px",
            },
          },
        },
        yaxis: {
          min: 0,
          max: maxCount,
          tickAmount: tickAmountYAxis,
          forceNiceScale: true, // Ensure integer tick values
          labels: {
            formatter: function (value) {
              return Math.round(value); // Ensure integer labels
            },
          },
        },
        tooltip: {
          x: {
            formatter: function (value) {
              return `Date: ${value}`; // Custom tooltip for x-axis
            },
          },
          y: {
            formatter: function (value) {
              return `${value} Leads`; // Custom tooltip for y-axis
            },
          },
        },
      };

      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      // Cleanup on unmount
      return () => {
        chart.destroy();
      };
    }
  }, [chartData]);

  return (
    <div className="col-md-6 d-flex">
      <div className="card flex-fill">
        <div className="card-header border-0 pb-0">
          <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <h4>
              <i className="ti ti-grip-vertical me-1" />
              Leads By Date
            </h4>
            <div className="d-flex align-items-center flex-wrap row-gap-2">
              <DateRangePickerComponent
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>
          </div>
        </div>
        <div className="card-body ">
          {isLoading ? (
            <BarChartLoader />
          ) : isError ? (
            <p>Error loading chart: {error.message}</p>
          ) : totalLeads === 0 ? (
            <p>No data available for this chart.</p>
          ) : (
            <div id="deals-chart" ref={chartRef} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadsByDateBarChart;
