import React, { useState, useEffect } from "react";
import DateRangePickerComponent from "../../../../core/common/crmComponents/DateRangePickerComponent";
import { useLeadsDashboardData } from "../../../mainMenu/leadsDashboard/hooks/useLeadsDashboardData";
import Chart from "react-apexcharts";
import {
  getDateRange,
  incrementDateByOne,
} from "../../../../utils/helpers/helper";

const LeadsByYearBarChart = ({ selectedCompany }) => {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const range = getDateRange();
    setDateRange(range);
  }, []);

  const { data, isLoading, isError, error } = useLeadsDashboardData({
    groupBy: "yearly",
    "createdTime[gt]": dateRange.startDate,
    "createdTime[lt]": incrementDateByOne(dateRange.endDate),
    ofCompany: selectedCompany,
  });

  // Prepare chart data based on the response
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Reports",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 275,
      },
      colors: ["#00918E"],
      plotOptions: {
        bar: {
          borderRadiusApplication: "around",
          columnWidth: "50%",
        },
      },
      xaxis: {
        type: "category",
        categories: [],
      },
      yaxis: {
        min: 0,
        max: 10, // Default max value
        tickAmount: 5, // Default tick amount
      },
    },
  });

  useEffect(() => {
    if (data?.data?.data) {
      const leads = data.data.data;

      // Dynamically calculate max count and tick amount
      const maxCount = Math.max(...leads.map((lead) => lead.count), 10); // Default to 10 if no data
      const tickAmount = Math.ceil(maxCount / 5); // Aim for ~5 ticks

      // Extract months and counts from leads
      const months = [
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
      ];
      const chartSeries = months.map((month, index) => {
        const monthData = leads.find((item) => item.month === index + 1);
        return { x: month, y: monthData ? monthData.count : 0 };
      });

      setChartData((prev) => ({
        ...prev,
        series: [{ name: "Reports", data: chartSeries.map((item) => item.y) }],
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            categories: months,
          },
          yaxis: {
            ...prev.options.yaxis,
            max: maxCount,
            tickAmount: tickAmount,
          },
        },
      }));
    }
  }, [data]);

  return (
    <div className="col-md-7 d-flex">
      <div className="card shadow flex-fill">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap row-gap-2">
          <h4>Leads by Year</h4>

          <DateRangePickerComponent
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>
        <div className="card-body">
          {isLoading && <p>Loading...</p>}
          {isError && <p>Error: {error.message}</p>}
          {!isLoading && !isError && (
            <div id="leads-report">
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadsByYearBarChart;
