import mongoose from "mongoose";
import Joi from 'joi'

const {Schema, model} = mongoose

const TransactionSchema = new Schema({
    typeTransaction: {
        type: Boolean,
        required: true
    },
    sum: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category:{
        type: String
    }
}, {versionKey: false,timestamps:true})

const joiTransactionsSchema = Joi.object({
    typeTransaction:Joi.boolean().required(),
    sum: Joi.number().required(),
    date: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string()
});

const WalletModel = model('transactions', TransactionSchema)

export {joiTransactionsSchema, WalletModel}
