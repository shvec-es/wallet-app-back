import express from "express"
import logger from "morgan"
import cors from "cors"
import swaggerRouter from './routes/swagger/index.js'
import Wallet from './routes/Wallet/Wallet.js'
import authRouter from './routes/api/auth.js'
import usersRouter from "./routes/api/users.js";

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

export default app;
