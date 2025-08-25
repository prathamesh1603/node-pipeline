import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { useLeadsDashboardData } from "../hooks/useLeadsDashboardData";
import BarChartLoader from "../../../../core/common/crmComponents/loaders/BarChartLoader";

const LeadsByStagesBarChart = ({ selectedCompany }) => {
  const chartRef = useRef(null);

  const { data, isLoading, isError, error } = useLeadsDashboardData({
    groupFields: "currentStatus",
    ofCompany: selectedCompany,
  });

  const leads = data?.data?.data || [];
  const totalLeads = leads.reduce((sum, lead) => sum + lead.count, 0);

  useEffect(() => {
    if (chartRef.current) {
      // Map leads data to ApexCharts series format
      const chartData = leads.map((lead) => ({
        x: lead._id?.currentStatus?.name || "Unknown",
        y: lead.count,
      }));

      const maxCount = Math.max(...leads.map((lead) => lead.count), 10); // Default to 10 if no data
      const limitYAxis = Math.floor(maxCount / 5) || 5;
      const tickAmountYAxis = Math.ceil(maxCount / limitYAxis) || 1;

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
            formatter: (val) => `${val} leads`,
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
  }, [leads]); // Re-render chart when `leads` data changes

  return (
    <div className="col-md-6 d-flex">
      <div className="card flex-fill">
        <div className="card-header border-0 pb-0">
          <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <h4>
              <i className="ti ti-grip-vertical me-1" />
              Leads By Stages
            </h4>
          </div>
        </div>
        <div className="card-body">
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

export default LeadsByStagesBarChart;
