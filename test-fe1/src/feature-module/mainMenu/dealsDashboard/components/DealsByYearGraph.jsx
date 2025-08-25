import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useDealsDashboardData } from "../hooks/useDealsDashboardData";

const DealsByYearGraph = ({ selectedCompany }) => {
  const { data, isLoading, isError, error } = useDealsDashboardData({
    groupBy: "yearly",
    ofCompany: selectedCompany,
  });

  const deals = data?.data?.data || [];
  const totalDeals = deals.reduce((sum, deal) => sum + deal.count, 0);

  // Extract counts for each month
  const monthlyCounts = Array(12).fill(0); // Default to 0 for all months
  deals.forEach((deal) => {
    if (deal.month >= 1 && deal.month <= 12) {
      monthlyCounts[deal.month - 1] = deal.count;
    }
  });

  // Determine maximum count for dynamic Y-axis scaling
  const maxCount = Math.max(...monthlyCounts);
  const limitYAxis = Math.round(maxCount / 5) || 5;
  const tickAmountYAxis = Math.ceil(maxCount / limitYAxis) || 1;

  // Chart options and series
  const chartOptions4 = {
    series: [
      {
        name: "deals",
        data: monthlyCounts, // Use the extracted monthly counts
      },
    ],
    options: {
      colors: ["#4A00E5"],
      chart: {
        height: 273,
        type: "area",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      // title: {
      //   text: "deals By Month",
      //   align: "left",
      // },
      xaxis: {
        categories: [
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
        ],
      },
      yaxis: {
        min: 0,
        max: Math.ceil(maxCount + maxCount * 0.1), // Add a 10% buffer to the maximum value
        tickAmount: tickAmountYAxis, // Use dynamically calculated tickAmount
        forceNiceScale: true, // Ensure integer tick values
        labels: {
          formatter: function (value) {
            return Math.round(value); // Ensure integer labels
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} deals`,
        },
      },
    },
  };

  return (
    <div className="col-md-6 d-flex">
      <div className="card w-100">
        <div className="card-header border-0 pb-0">
          <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <h4>
              <i className="ti ti-grip-vertical me-1" />
              Deals By Year
            </h4>
          </div>
        </div>
        <div className="card-body">
          {isLoading ? (
            <p>Loading chart...</p>
          ) : isError ? (
            <p>Error loading chart: {error.message}</p>
          ) : totalDeals === 0 ? (
            <p>No data available for this chart.</p>
          ) : (
            <Chart
              options={chartOptions4.options}
              series={chartOptions4.series}
              type="area"
              height={chartOptions4.options.chart.height}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DealsByYearGraph;
