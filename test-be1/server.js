// const cluster = require('cluster');
const os = require("os");
const app = require("./app"); // Main application setup

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `*******************Worker ${process.pid} started on port ${PORT}************\n`
  );
});
