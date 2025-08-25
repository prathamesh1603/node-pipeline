const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
// const rateLimiter = require("./middlewares/rateLimiter");
const leadRoutes = require("./routes/leadRoutes");
const companyRoutes = require("./routes/companyRoutes");
const productRouter = require("./routes/productRouter");
const analyticsRouter = require("./routes/analyticsRouter");
const fileExportRouter = require("./routes/fileExportRouter");
const timelineRoutes = require("./routes/timelineRoutes");
const layoutRouter = require("./routes/layoutRouter");
const ozonetelRoutes = require("./routes/ozonetelRoutes");
const authRouter = require("./routes/authRouter");
const dealRouter = require("./routes/dealRouter");
const roleRouter = require("./routes/roleRouter");
const userRoutes = require("./routes/userRouter");
const accountRouter = require("./routes/accountRouter");
const connectDB = require("./congif/dbconnection");
const cloudinary = require("cloudinary");
const globalErrorHandler = require("./utils/globalErrorHandler");
const hpp = require("hpp");
const logger = require("./logger");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
// const redisClient = require("./redis/redisConnection");
connectDB();
const app = express();

// app.use(helmet())
// app.use(cors({
//     origin : "*",
//     credentials : true
// }));

// List of allowed origins

const allowedOrigins = [
  process.env.FRONTEND_URL, // For local development
  process.env.FRONTEND_URL_LOCAL, // For local development
  process.env.BACKEND_URL, // For local development
  process.env.BACKEND_URL_LOCAL, // For local development
  "*",
];

// Dynamic CORS configuration

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the origin
    } else {
      callback(new Error("Not allowed by CORS")); // Block the origin
    }
  },

  credentials: true, // Allow credentials (cookies)

  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"], // Allowed methods

  // allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

app.use(cors(corsOptions));
// security for mongoquery injection
app.use(mongoSanitize());
// security from html markups
app.use(xss());

app.options("*", cors(corsOptions));
app.get("/test", (req, res) => {
  res.status(200).send({
    status: true,
    msg: "crm is live",
  });
});
// app.use(cors())
// app.use(morgan('combined'));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Define a morgan custom format with detailed information
const morganFormat =
  ":method :url :status :res[content-length] - :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        try {
          // Splitting the message into its components
          const messageParts = message.trim().split(" ");
          const method = messageParts[0];
          const url = messageParts[1];
          const status = parseInt(messageParts[2], 10);
          const contentLength = messageParts[3];
          const responseTime = parseFloat(messageParts[5].replace("ms", ""));

          const logObject = {
            method,
            url,
            status,
            contentLength: contentLength === "-" ? 0 : contentLength,
            responseTime: `${responseTime} ms`,
            timestamp: new Date().toISOString(),
          };

          // Logging based on status and response time
          if (status >= 500) {
            logger.error(JSON.stringify(logObject));
          } else if (status >= 400) {
            logger.warn(JSON.stringify(logObject));
          } else if (responseTime > 1000) {
            // Slow response threshold
            logger.warn(
              JSON.stringify({ ...logObject, warning: "Slow response" })
            );
          } else {
            logger.info(JSON.stringify(logObject));
          }
        } catch (err) {
          // Catch and log any error that occurs during parsing or logging
          logger.error({
            message: "Failed to log request",
            error: err.message,
            stack: err.stack,
            originalLogMessage: message,
          });
        }
      },
    },
  })
);
// app.use(rateLimiter);
app.use(hpp());
app.use(hpp({ whitelist: ["createdTime"] }));
// redisClient()
// Routes
// app.options("*", cors())

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET
// });

//app.use("/api", apiRoutes);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/role", roleRouter);
app.use("/api/v1/lead", leadRoutes);
app.use("/api/v1/deal", dealRouter);
app.use("/api/v1/account", accountRouter);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/file-export", fileExportRouter);
app.use("/api/v1/timeline", timelineRoutes);
app.use("/api/v1/system-call", ozonetelRoutes);
app.use("/api/v1/layout", layoutRouter);

app.all("*", (req, res) => {
  res.status(404).send({
    status: false,
    msg: "No route found",
  });
});

app.use(globalErrorHandler);

module.exports = app;
