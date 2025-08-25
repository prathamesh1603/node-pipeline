import React, { useEffect, useState } from "react";
import DateRangePickerComponent from "../../../../core/common/crmComponents/DateRangePickerComponent";
import Chart from "react-apexcharts";
import { getDateRange } from "../../../../utils/helpers/helper";

const DealsBySourceChart = ({ user, selectedCompany }) => {
  const [dateRange, setDateRange] = useState(getDateRange());

  const [chartConfig] = useState({
    series: [44, 55, 41, 17],
    chart: {
      type: "donut",
    },
    colors: ["#0092E4", "#4A00E5", "#E41F07", "#FFA201"],
    labels: ["Campaigns", "Google", "Referrals", "Paid Social"],
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      formatter: function (val, opts) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });

  return (
    <div className="col-md-5 d-flex">
      <div className="card shadow flex-fill">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap row-gap-2">
          <h4>Deals by Source</h4>
          <DateRangePickerComponent
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>
        <div className="card-body">
          <Chart
            options={chartConfig}
            series={chartConfig.series}
            type="donut"
          />
        </div>
      </div>
    </div>
  );
};

export default DealsBySourceChart;
