import { WalletModel } from '../models/Transaction-model.js'

class Transactions{
    async createTransaction(req, res){
        try {
            // const { _id } = req.user;
            const newTransaction = await WalletModel.create(req.body);
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
        res.send('cat is work')
    }

    async getTransactions(req, res){
        res.send('trans is work')
    }

    async getStats(req, res){
        res.send('stats is work')
    }
}

export default new Transactions