import express from "express"
import Transactions from "../../controllers/transactions.js";
import { validateBody } from '../../middlewares/validation.js'
import { joiTransactionsSchema } from '../../models/Transaction-model.js'

const Wallet = express.Router();

Wallet.post('/transaction',validateBody(joiTransactionsSchema), Transactions.createTransaction)

Wallet.get('/transaction/categories', Transactions.getCategories)

Wallet.get('/transactions', Transactions.getTransactions)

Wallet.get('/stats', Transactions.getStats)

export default Wallet;