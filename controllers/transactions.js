import { WalletModel } from '../models/Transaction-model.js'

class Transactions{
    async createTransaction(req, res){
        try {
            const { _id } = req.user;
            if(req.body.typeTransaction && !req.body.category){
                req.body.category = "other"
            }
            console.log(req.body)
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
        const { _id } = req.user;
        const transactions = await WalletModel.find({owner: _id});
        const categories = [];
        transactions.forEach(el => {
            if(!categories.includes(el.category) && el.category !== undefined) categories.push(el.category)
        })
        return res.json({ status: "success", code: 200, payload: { categories } });
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
        const balance = {
            income: 0,
            consumption: 0,
            balance: 0
        }
        for(const trans of transactions){
            const currDate = trans.date.slice(3,trans.date.length)
            if(`${month}.${year}` === currDate) {
                sortingTransactions.push(trans)
                if(trans.typeTransaction) balance.income += trans.sum;
                if(!trans.typeTransaction) balance.consumption += trans.sum;
            }

        }
        sortingTransactions.push(balance)
        balance.balance = balance.income - balance.consumption
        return res.json({ status: "success", code: 200, payload: { sortingTransactions } });
    }
}

export default new Transactions