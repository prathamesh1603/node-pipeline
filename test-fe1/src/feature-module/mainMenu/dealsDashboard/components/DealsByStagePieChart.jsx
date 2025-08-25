import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import PieChartLoader from "../../../../core/common/crmComponents/loaders/PieChartLoader";
import { useDealsDashboardData } from "../hooks/useDealsDashboardData";

const DealsByStagePieChart = ({ stages = [], selectedCompany }) => {
  const { data, isLoading, isError, error } = useDealsDashboardData({
    groupFields: "currentStatus",
    ofCompany: selectedCompany,
  });

  const deals = data?.data?.data || [];

  const totalDeals = deals.reduce((sum, deal) => sum + deal.count, 0);

  const seriesData = deals.map((deal) =>
    totalDeals > 0
      ? parseFloat(((deal.count / totalDeals) * 100).toFixed(2))
      : 0
  );

  const labels = deals.map((deal) => {
    const stage = stages.find(
      (stage) =>
        stage.id === deal._id?.currentStatus?.id ||
        stage.name === deal._id?.currentStatus?.name
    );
    return stage ? stage?.name : "Unknown Stage";
  });

  const colors = deals.map((deal) => {
    const stage = stages.find(
      (stage) =>
        stage.id === deal._id?.currentStatus?.id ||
        stage.name === deal._id?.currentStatus?.name
    );
    return stage ? stage?.color : "#ccc";
  });

  const chartOptions3 = {
    series: seriesData,
    options: {
      chart: {
        type: "pie",
        width: 400,
        height: 300,
      },
      legend: {
        position: "bottom",
      },
      labels: labels,
      colors: colors,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 275,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      tooltip: {
        y: {
          formatter: (val) => `${val}%`,
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
              Deals By Stages
            </h4>
          </div>
        </div>
        <div className="card-body ">
          {isLoading ? (
            <PieChartLoader />
          ) : isError ? (
            <p>Error loading chart: {error.message}</p>
          ) : totalDeals === 0 ? (
            <p>No data available for this chart.</p>
          ) : (
            <div className="d-flex justify-content-center align-items-center">
              <Chart
                options={chartOptions3.options}
                series={chartOptions3.series}
                type="pie"
                width={chartOptions3.options.chart.width}
                height={chartOptions3.options.chart.height}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealsByStagePieChart;
