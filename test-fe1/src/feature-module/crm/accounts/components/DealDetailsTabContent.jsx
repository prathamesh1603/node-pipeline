import React from "react";
import { Link } from "react-router-dom";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import { Typography, Box } from "@mui/material";

const DealDetailsTabContent = ({ timelineData }) => {
  // Group timeline data by date
  const groupByDate = (data) => {
    return data.reduce((acc, entry) => {
      const date = new Date(entry.date).toLocaleDateString(); // Extract date string
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {});
  };

  const reversedTimelineData = [...timelineData].reverse();
  const groupedTimelineData = groupByDate(reversedTimelineData);

  return (
    <div className="col-xl-9">
      <div className="card mb-3">
        <div className="card-body pb-0">
          <ul className="nav nav-tabs nav-tabs-bottom" role="tablist">
            <li className="nav-item" role="presentation">
              <Link
                to="#"
                data-bs-toggle="tab"
                data-bs-target="#timeline"
                className="nav-link active"
              >
                <i className="ti ti-alarm-minus me-1" />
                Timeline
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Tab Content */}
      <div className="tab-content pt-0">
        <div className="tab-pane active show" id="timeline">
          <div className="card">
            <div className="card-header">
              <h4 className="fw-semibold">Timeline</h4>
            </div>
            <div>
              <Timeline
                sx={{
                  [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.2,
                  },
                }}
              >
                {Object.keys(groupedTimelineData).map((date, dateIndex) => (
                  <React.Fragment
                    key={dateIndex}
                    className="timeline-date-group" // Added custom class
                  >
                    <div className="d-flex justify-content-start mt-3 fw-bold text-primary">
                      {date}
                    </div>

                    <Box className="timeline-entry">
                      {/* Display Timeline Entries for the Date */}
                      {groupedTimelineData[date].map((entry, index) => (
                        <TimelineItem key={entry._id || index}>
                          <TimelineOppositeContent
                            sx={{ m: "auto 0" }}
                            align="right"
                            variant="body2"
                            color="text.secondary"
                          >
                            {new Date(entry.date).toLocaleTimeString()}
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <TimelineDot color="primary" />
                            {index < groupedTimelineData[date].length - 1 && (
                              <TimelineConnector />
                            )}
                          </TimelineSeparator>
                          <TimelineContent sx={{ py: "12px", px: 2 }}>
                            <Box>
                              <div className="text-capitalize">
                                {entry.actionMsg &&
                                entry.actionMsg.includes(", ") ? (
                                  <ul className="custom-list">
                                    {entry.actionMsg
                                      .split(", ")
                                      .map((item, index) => (
                                        <li
                                          key={index}
                                          dangerouslySetInnerHTML={{
                                            __html: item,
                                          }}
                                        ></li>
                                      ))}
                                  </ul>
                                ) : (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        entry.actionMsg ||
                                        "No activity available.",
                                    }}
                                  ></span>
                                )}
                              </div>

                              {entry.by && (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  By: {entry.by.name} ({entry.by.email})
                                </Typography>
                              )}
                              {entry.to && (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Assigned to: {entry.to.name} ({entry.to.email}
                                  )
                                </Typography>
                              )}
                            </Box>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Box>
                  </React.Fragment>
                ))}
              </Timeline>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailsTabContent;
