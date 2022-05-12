const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config()

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'))

// Routes

app.use('/api/auth', (req, res) => {
  res.send('/api/auth')
})

// /Routes

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
