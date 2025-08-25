import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import DateRangePickerComponent from "../../../../core/common/crmComponents/DateRangePickerComponent";
import {
  getDateRange,
  incrementDateByOne,
} from "../../../../utils/helpers/helper";
import { useDealsDashboardData } from "../hooks/useDealsDashboardData";

const DealsByMonthBarChart = ({ selectedCompany }) => {
  const chartRef = useRef(null);

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const range = getDateRange();
    setDateRange(range);
  }, []);

  const { data, isLoading, isError, error } = useDealsDashboardData({
    dateField: "createdTime",
    groupBy: "monthly",
    "createdTime[gt]": dateRange.startDate,
    "createdTime[lt]": incrementDateByOne(dateRange.endDate),
    ofCompany: selectedCompany,
  });

  const deals = data?.data?.data || [];
  const totalDeals = deals.reduce((sum, deal) => sum + deal.count, 0);

  let month = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  useEffect(() => {
    if (chartRef.current) {
      // Map deals data to ApexCharts series format
      const chartData = deals.map((deal) => ({
        x: month[deal._id?.month] || "Unknown",
        y: deal.count,
      }));

      // Determine the max value and dynamically calculate tickAmount
      const maxCount = Math.max(...deals.map((deal) => deal.count), 10); // Default to 10 if no data
      const limitYAxis = Math.round(maxCount / 5) || 5;
      const tickAmountYAxis = Math.ceil(maxCount / limitYAxis) || 1;

      const options = {
        series: [
          {
            name: "deals",
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
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 700,
            },
          },
        },
        yaxis: {
          min: 0,
          max: maxCount,
          tickAmount: tickAmountYAxis, // Use dynamically calculated tickAmount
          forceNiceScale: true, // Ensure integer tick values
          labels: {
            formatter: function (value) {
              return Math.round(value); // Ensure integer labels
            },
          },
        },
        tooltip: {
          y: {
            formatter: (val) => `${val} deals`,
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
  }, [deals]);

  return (
    <div className="col-md-6 d-flex">
      <div className="card flex-fill">
        <div className="card-header border-0 pb-0">
          <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <h4>
              <i className="ti ti-grip-vertical me-1" />
              Deals By Month
            </h4>
            <DateRangePickerComponent
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
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
            <div id="deals-chart" ref={chartRef} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DealsByMonthBarChart;
