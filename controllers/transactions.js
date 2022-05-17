const { WalletModel } = require('../models/Transaction-model.js')
const dataCategories = require('../data/categories.json')

class Transactions{
    async createTransaction(req, res){
        try {
            const { _id } = req.user;
            if(!req.body.typeTransaction && !req.body.category){
                req.body.category = "Other expences"
            }
            const newTransaction = await WalletModel.create({...req.body, owner: _id});
            return res
                .status(201)
                .json({ status: "success", code: 201, payload: { newTransaction } });
        } catch (error) {
            return res
                .status(400)
                .json({ status: "error", code: 400, message: "Bad request" });
        }
    }

    async getCategories(req, res){
        return res.json({ status: "success", code: 200, payload: dataCategories.categories });
    }

    async getTransactions(req, res){
        const { _id } = req.user;
        const transactions = await WalletModel.find({owner: _id});
        return res.json({ status: "success", code: 200, payload: { transactions } });
    }

    async getStats(req, res){
        const { _id } = req.user;
        const {month, year} = req.query;
        const transactions = await WalletModel.find({owner: _id});
        const sortingTransactions = [];
        const data = {}
        const balance = {
            income: 0,
            consumption: 0,
            balance: 0
        }
        for(const trans of transactions){
            const currDate = trans.date.slice(3,trans.date.length)
            if(`${month}.${year}` === currDate) {
                if(trans.typeTransaction) balance.income += trans.sum;
                if(!trans.typeTransaction) {
                    if(!data[trans.category]) data[trans.category] = 0
                    data[trans.category] += trans.sum
                    balance.consumption += trans.sum
                }
            }
        }
        for(const key in data){
            const categoryColor = dataCategories.categories.find(i => i.name === key)
            sortingTransactions.push({
                name: categoryColor.name,
                sum: data[key],
                color: categoryColor.color
            })
        }
        balance.balance = balance.income - balance.consumption
        return res.json({ status: "success", code: 200, payload: { sortingTransactions, balance: balance } });
    }
}

module.exports = new Transactions