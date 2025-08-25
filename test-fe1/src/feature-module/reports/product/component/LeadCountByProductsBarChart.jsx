import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";

import DateRangePickerComponent from "../../../../core/common/crmComponents/DateRangePickerComponent";
import {
  getDateRange,
  incrementDateByOne,
} from "../../../../utils/helpers/helper";
import BarChartLoader from "../../../../core/common/crmComponents/loaders/BarChartLoader";
import { useLeadsDashboardData } from "../../../mainMenu/leadsDashboard/hooks/useLeadsDashboardData";

const LeadCountByProductsBarChart = ({ selectedCompany }) => {
  const chartRef = useRef(null);

  const [dateRange, setDateRange] = useState(getDateRange());

  const { data, isLoading, isError, error } = useLeadsDashboardData({
    sort: "-createdTime",
    ofCompany: selectedCompany,
    "createdTime[gt]": dateRange.startDate,
    "createdTime[lt]": incrementDateByOne(dateRange.endDate),
    groupFields: "productInterested.name",
  });

  const leads = data?.data?.data || [];

  console.log(data);

  const totalLeads = leads.reduce((sum, lead) => sum + lead.count, 0);

  // Process data for the chart
  const chartData = leads.map((lead) => ({
    x: lead._id.name || "Unknown Product", // Product name or fallback
    y: lead.count || 0, // Count of leads
  }));

  useEffect(() => {
    if (chartRef.current && chartData.length > 0) {
      const maxCount = Math.max(...leads.map((lead) => lead.count), 10); // Default max to 10 if no data
      const options = {
        series: [
          {
            name: "Leads",
            data: chartData,
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
          categories: chartData.map((data) => data.x), // Product names
          labels: {
            style: {
              fontSize: "10px",
            },
          },
        },
        yaxis: {
          min: 0,
          max: maxCount,
          tickAmount: 5,
          labels: {
            formatter: function (value) {
              return Math.round(value); // Integer labels
            },
          },
        },
        tooltip: {
          x: {
            formatter: function (value) {
              return `Product: ${value}`; // Tooltip for x-axis
            },
          },
          y: {
            formatter: function (value) {
              return `${value} Leads`; // Tooltip for y-axis
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
    <div className="col-lg-6 d-flex">
      <div className="card flex-fill">
        <div className="card-header border-0 pb-0 d-flex gap-2">
          <h4>
            <i className="ti ti-grip-vertical me-1" />
            Leads Count by Product
          </h4>
        </div>
        <div className="card-body">
          {totalLeads === 0 ? (
            <p>No data available for this chart.</p>
          ) : (
            <div id="product-leads-chart" ref={chartRef} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadCountByProductsBarChart;
