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
        const changedTransactions = []

        transactions.forEach(el => {
            if(!el.typeTransaction){
                const categoryColor = dataCategories.categories.find(i => i.name === el.category)
                changedTransactions.push({...el._doc, categoryUA: categoryColor.nameUA})
            }
        })

        const sortingTransactionsByDate = changedTransactions.sort((a,b) => {
            const onChangeDate = (date) => {
                return new Date(date.date.replace(/[.]/gi, '-').split('-').reverse().join('-'))
            }
            return onChangeDate(a) - onChangeDate(b)
        })

        const addBalance = () => {
            let balance  = 0;
            return sortingTransactionsByDate.map(el => {
                if(el.typeTransaction) balance += el.sum
                if(!el.typeTransaction) balance -= el.sum
                return {...el, balance}
            })
        }

        return res.json({ status: "success", code: 200, payload: addBalance() });
    }

    async getStats(req, res){
        const { _id } = req.user;
        const {month, year} = req.query;
        const transactions = await WalletModel.find({owner: _id});
        const sortingTransactions = [];
        const data = {}
        const date = []
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
                nameUA: categoryColor.nameUA,
                sum: data[key],
                color: categoryColor.color
            })
        }
        const getData = () => {
            transactions.forEach(el => {
                if(!el.typeTransaction){
                    date.push({
                        month: el.date.slice(3,5),
                        year: el.date.slice(6,10)
                    })
                }
            })
            return date.filter((el,i) => {
                return JSON.stringify(el) !== JSON.stringify(date[i + 1])
            })
        }

        balance.balance = balance.income - balance.consumption
        return res.json({
            status: "success",
            code: 200,
            payload: {
                sortingTransactions,
                balance: balance,
                date: getData()
            }
        });
    }

    async deleteTransaction(req, res){
        try {
            const deletedTransaction = await WalletModel.findByIdAndDelete(
                req.params.transactionId
            );
            return res.json({
                status: "success",
                code: 200,
                payload: { deletedTransaction },
            });
        } catch (error) {
            return res
                .status(404)
                .json({ status: "error", code: 404, message: "Not Found" });
        }
    }
}

module.exports = new Transactions