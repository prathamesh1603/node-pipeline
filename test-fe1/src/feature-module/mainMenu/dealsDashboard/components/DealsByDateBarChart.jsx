import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";

import DateRangePickerComponent from "../../../../core/common/crmComponents/DateRangePickerComponent";
import {
  getDateRange,
  incrementDateByOne,
} from "../../../../utils/helpers/helper";
import BarChartLoader from "../../../../core/common/crmComponents/loaders/BarChartLoader";
import { useDealsDashboardData } from "../hooks/useDealsDashboardData";

const DealsByDateBarChart = ({ selectedCompany }) => {
  const chartRef = useRef(null);

  const [dateRange, setDateRange] = useState(getDateRange());

  const { data, isLoading, isError, error } = useDealsDashboardData({
    sort: "-createdTime",
    groupBy: "daily",
    ofCompany: selectedCompany,
    "createdTime[gte]": dateRange.startDate,
    "createdTime[lte]": incrementDateByOne(dateRange.endDate),
  });

  const deals = data?.data?.data || [];

  const totalDeals = deals.reduce((sum, deal) => sum + deal.count, 0);

  // Process data for the chart
  const chartData = deals.map((deal) => ({
    x: `${deal._id.day}-${deal._id.month}-${deal._id.year}` || "Unknown Date",
    y: deal.count || 0, // Use count for y-axis
  }));

  useEffect(() => {
    if (chartRef.current && chartData.length > 0) {
      const maxCount = Math.max(...deals.map((deal) => deal.count), 10); // Default to 10 if no data
      const limitYAxis = Math.round(maxCount / 5) || 5;
      const tickAmountYAxis = Math.ceil(maxCount / limitYAxis) || 1;

      const maxBars = 10;
      let sampledData = chartData;

      if (chartData.length > maxBars) {
        const step = Math.ceil(chartData.length / maxBars); // Step to select data points
        sampledData = chartData.filter((_, index) => index % step === 0);
      }

      const uniqueDates = sampledData.map((data) => data.x); // Extract dates for x-axis

      const options = {
        series: [
          {
            name: "deals",
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
          categories: uniqueDates,
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
          // title: {
          //   text: "deal Count",
          // },
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
            format: "dd-MM-yyyy", // Adjust formatting as needed
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
              Deals By Date
            </h4>
            <div className="d-flex align-items-center flex-wrap row-gap-2">
              <DateRangePickerComponent
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>
          </div>
        </div>
        <div className="card-body">
          {isLoading ? (
            <BarChartLoader />
          ) : isError ? (
            <p>Error loading chart: {error.message}</p>
          ) : totalDeals === 0 ? (
            <p>No data available for this chart.</p>
          ) : (
            <div id="deals-chart" ref={chartRef} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DealsByDateBarChart;
