const express = require("express")
const Transactions = require("../../controllers/transactions.js");
const {validateAuth, validateBody} = require('../../middlewares/validation.js')
const { joiTransactionsSchema } = require('../../models/Transaction-model.js')

const Wallet = express.Router();

Wallet.post('/transaction', validateAuth, validateBody(joiTransactionsSchema), Transactions.createTransaction)

Wallet.get('/transaction/categories', validateAuth, Transactions.getCategories)

Wallet.get('/transactions', validateAuth, Transactions.getTransactions)

Wallet.get('/stats', validateAuth, Transactions.getStats)

Wallet.delete("/transaction/:transactionId", validateAuth, Transactions.deleteTransaction);

module.exports = Wallet;