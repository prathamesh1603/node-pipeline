import React from "react";
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
import { capitalizeWord } from "../../../utils/helpers/helper";

const DisplayTimeline = ({ timeline, selectedData: data, moduleName }) => {
  // Ensure actionStack exists in the timelineData
  const timelineData = timeline?.actionStack || [];

  // Group timeline data by date
  const groupByDate = (data) => {
    return (
      data?.length > 0 &&
      data?.reduce((acc, entry) => {
        const date = new Date(entry?.date).toLocaleDateString(); // Extract date string
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(entry);
        return acc;
      }, {})
    );
  };

  const reversedTimelineData =
    timelineData?.length > 0 && [...timelineData]?.reverse();
  const groupedTimelineData = groupByDate(reversedTimelineData);

  return (
    <>
      {timelineData?.length > 0 ? (
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="d-lg-flex justify-content-between align-items-center">
                <h5 className="card-title ">
                  Timeline Details for {moduleName.slice(0, -1)}
                  <span className="ms-1">
                    {capitalizeWord(data?.firstName)} {data?.lastName}
                  </span>
                </h5>

                <div className="d-flex gap-2 justify-content-between mb-1 text-capitalize">
                  <strong>Last Updated By:</strong>
                  <div className="d-flex flex-column align-items-start">
                    <span>{data?.lastUpdationBy?.name || "N/A"}</span>

                    <span className="text-muted">
                      {new Date(data?.lastActivityDate).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <Timeline
                  sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                      flex: 0.2,
                    },
                  }}
                >
                  {Object.keys(groupedTimelineData).map((date, dateIndex) => (
                    <div key={dateIndex} className="timeline-date-group">
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
                                    Assigned to: {entry.to.name} (
                                    {entry.to.email})
                                  </Typography>
                                )}
                              </Box>
                            </TimelineContent>
                          </TimelineItem>
                        ))}
                      </Box>
                    </div>
                  ))}
                </Timeline>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Timeline Details</h5>
              <p className="card-text">
                No description found for this timeline. Select data to view more
                details.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DisplayTimeline;
