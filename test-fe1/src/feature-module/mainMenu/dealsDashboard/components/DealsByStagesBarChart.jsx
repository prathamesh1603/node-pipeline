import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import BarChartLoader from "../../../../core/common/crmComponents/loaders/BarChartLoader";
import { useDealsDashboardData } from "../hooks/useDealsDashboardData";

const DealsByStagesBarChart = ({ selectedCompany }) => {
  const chartRef = useRef(null);

  const { data, isLoading, isError, error } = useDealsDashboardData({
    groupFields: "currentStatus",
    ofCompany: selectedCompany,
  });

  const deals = data?.data?.data || [];
  const totalDeals = deals.reduce((sum, deal) => sum + deal.count, 0);

  useEffect(() => {
    if (chartRef.current) {
      // Map deals data to ApexCharts series format
      const chartData = deals.map((deal) => ({
        x: deal._id?.currentStatus?.name || "Unknown",
        y: deal.count,
      }));

      // Determine the max value and dynamically calculate tickAmount
      const maxCount = Math.max(...deals.map((deal) => deal.count), 10); // Default to 10 if no data
      const limitYAxis = Math.floor(maxCount / 5) || 5;
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
          forceNiceScale: true,
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
  }, [deals]); // Re-render chart when `deals` data changes

  return (
    <div className="col-md-6 d-flex">
      <div className="card flex-fill">
        <div className="card-header border-0 pb-0">
          <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <h4>
              <i className="ti ti-grip-vertical me-1" />
              Deals By Stages
            </h4>
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

export default DealsByStagesBarChart;
