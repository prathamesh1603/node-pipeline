import React, { useEffect, useState } from "react";
import { useLeadsDashboardData } from "../../../mainMenu/leadsDashboard/hooks/useLeadsDashboardData";
import DateRangePickerComponent from "../../../../core/common/crmComponents/DateRangePickerComponent";
import {
  getDateRange,
  incrementDateByOne,
  isSuperAdmin,
} from "../../../../utils/helpers/helper";
import Chart from "react-apexcharts";
import BarChartLoader from "../../../../core/common/crmComponents/loaders/BarChartLoader";

const LeadsBySourceChart = ({ user, selectedCompany }) => {
  const [dateRange, setDateRange] = useState(getDateRange());

  const { data, isLoading, isError, error } = useLeadsDashboardData({
    groupFields: "source",
    "createdTime[gt]": dateRange.startDate,
    "createdTime[lt]": incrementDateByOne(dateRange.endDate),
    ofCompany: isSuperAdmin(user) ? selectedCompany : null,
  });

  const [chartOptions1] = useState({
    series: [44, 55, 41, 17],
    chart: {
      type: "donut",
    },
    colors: ["#0092E4", "#4A00E5", "#E41F07", "#FFA201"],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
  });

  const leads = data?.data?.data || [];

  return (
    <>
      {isLoading ? (
        <BarChartLoader />
      ) : (
        <div className="col-md-5 d-flex">
          <div className="card shadow flex-fill">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap row-gap-2">
              <h4>Leads by Source</h4>

              <DateRangePickerComponent
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>
            <div className="card-body">
              <div id="leads-analysis">
                <Chart
                  options={chartOptions1}
                  series={chartOptions1.series}
                  type="donut"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeadsBySourceChart;
