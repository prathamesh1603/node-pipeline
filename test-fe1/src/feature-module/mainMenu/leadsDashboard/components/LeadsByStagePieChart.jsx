import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useLeadsDashboardData } from "../hooks/useLeadsDashboardData";
import { useSelector } from "react-redux";
import PieChartLoader from "../../../../core/common/crmComponents/loaders/PieChartLoader";

const LeadsByStagePieChart = ({ stages = [], selectedCompany }) => {
  const { data, isLoading, isError, error } = useLeadsDashboardData({
    groupFields: "currentStatus",
    ofCompany: selectedCompany,
  });

  const leads = data?.data?.data || [];

  const totalLeads = leads.reduce((sum, lead) => sum + lead.count, 0);

  const seriesData = leads.map((lead) =>
    totalLeads > 0
      ? parseFloat(((lead.count / totalLeads) * 100).toFixed(2))
      : 0
  );

  const labels = leads.map((lead) => {
    const stage = stages.find(
      (stage) =>
        stage.id === lead._id?.currentStatus?.id ||
        stage.name === lead._id?.currentStatus?.name
    );
    return stage ? stage?.name : "Unknown Stage";
  });

  const colors = leads.map((lead) => {
    const stage = stages.find(
      (stage) =>
        stage.id === lead._id?.currentStatus?.id ||
        stage.name === lead._id?.currentStatus?.name
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
              Leads By Stages
            </h4>
          </div>
        </div>
        <div className="card-body ">
          {isLoading ? (
            <PieChartLoader />
          ) : isError ? (
            <p>Error loading chart: {error.message}</p>
          ) : totalLeads === 0 ? (
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

export default LeadsByStagePieChart;
