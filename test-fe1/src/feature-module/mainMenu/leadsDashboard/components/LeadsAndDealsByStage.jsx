import React, { useState } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";

const LeadsAndDealsByStage = () => {
  const [chartOptions] = useState({
    series: [
      {
        data: [400, 220, 448],
        color: "#FC0027",
      },
    ],
    chart: {
      type: "bar",
      height: 150,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Conversation", "Follow Up", "Inpipeline"],
      min: 0,
      max: 500,
      tickAmount: 5,
    },
  });

  const [chartOptions2] = useState({
    series: [
      {
        data: [400, 220, 448],
        color: "#77D882",
      },
    ],
    chart: {
      type: "bar",
      height: 150,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Conversation", "Follow Up", "Inpipeline"],
      min: 0,
      max: 500,
      tickAmount: 5,
    },
  });

  return (
    <>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header border-0 pb-0">
            <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <h4>
                <i className="ti ti-grip-vertical me-1" />
                Leads By Stage
              </h4>
              <div className="d-flex align-items-center flex-wrap row-gap-2">
                <div className="dropdown me-2">
                  <Link
                    className="dropdown-toggle"
                    data-bs-toggle="dropdown"
                    to="#"
                  >
                    Marketing Pipeline
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link to="#" className="dropdown-item">
                      Marketing Pipeline
                    </Link>
                    <Link to="#" className="dropdown-item">
                      Sales Pipeline
                    </Link>
                    <Link to="#" className="dropdown-item">
                      Email
                    </Link>
                    <Link to="#" className="dropdown-item">
                      Chats
                    </Link>
                    <Link to="#" className="dropdown-item">
                      Operational
                    </Link>
                  </div>
                </div>
                <div className="dropdown">
                  <Link
                    className="dropdown-toggle"
                    data-bs-toggle="dropdown"
                    to="#"
                  >
                    Last 3 months
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link to="#" className="dropdown-item">
                      Last 3 months
                    </Link>
                    <Link to="#" className="dropdown-item">
                      Last 6 months
                    </Link>
                    <Link to="#" className="dropdown-item">
                      Last 12 months
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div id="last-chart">
              <Chart
                options={chartOptions}
                series={chartOptions.series}
                type={chartOptions.chart.type}
                height={chartOptions.chart.height}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header border-0 pb-0">
            <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <h4>
                <i className="ti ti-grip-vertical me-1" />
                Won Deals Stage
              </h4>
              <div className="d-flex align-items-center flex-wrap row-gap-2">
                <div className="dropdown me-2">
                  <Link
                    className="dropdown-toggle"
                    data-bs-toggle="dropdown"
                    to="#"
                  >
                    Marketing Pipeline
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link to="#" className="dropdown-item">
                      Marketing Pipeline
                    </Link>
                    <Link to="#" className="dropdown-item">
                      Sales Pipeline
                    </Link>
                    <Link to="#" className="dropdown-item">
                      Email
                    </Link>
                    <Link to="#" className="dropdown-item">
                      Chats
                    </Link>
                    <Link to="#" className="dropdown-item">
                      Operational
                    </Link>
                  </div>
                </div>
                <div className="dropdown">
                  <Link
                    className="dropdown-toggle"
                    data-bs-toggle="dropdown"
                    to="#"
                  >
                    Last 3 months
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link to="#" className="dropdown-item">
                      Last 3 months
                    </Link>
                    <Link to="#" className="dropdown-item">
                      Last 6 months
                    </Link>
                    <Link to="#" className="dropdown-item">
                      Last 12 months
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body ">
            <div id="won-chart">
              {" "}
              <Chart
                options={chartOptions2}
                series={chartOptions2.series}
                type={chartOptions2.chart.type}
                height={chartOptions2.chart.height}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadsAndDealsByStage;
