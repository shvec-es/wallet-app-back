const express = require("express")
const logger = require("morgan")
const cors = require("cors")
const swaggerRouter = require('./routes/swagger/index.js')
const Wallet = require('./routes/Wallet/Wallet.js')
const authRouter = require('./routes/api/auth.js')
const usersRouter = require("./routes/api/users.js")

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'))

// Routes
app.use('/api/auth', authRouter);

app.use('/api/users', usersRouter);

app.use('/wallet', Wallet)

app.use('/docs', swaggerRouter)

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
