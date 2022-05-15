import express from "express"
import Transactions from "../../controllers/transactions.js";
import {validateAuth, validateBody} from '../../middlewares/validation.js'
import { joiTransactionsSchema } from '../../models/Transaction-model.js'

const Wallet = express.Router();

Wallet.post('/transaction', validateAuth, validateBody(joiTransactionsSchema), Transactions.createTransaction)

Wallet.get('/transaction/categories', validateAuth, Transactions.getCategories)

Wallet.get('/transactions', validateAuth, Transactions.getTransactions)

Wallet.get('/stats', validateAuth, Transactions.getStats)

export default Wallet;