const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');
dotenv.config();

//import routerss
const studentRouter = require("./routes/Students");

const app = express();
const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose
  .connect(URL)
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

//uploads path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/students", studentRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
