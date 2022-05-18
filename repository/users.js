const { User } = require("../models/User-model");

const findById = async (id) => {
    return await User.findById(id)
}

const findByEmail = async (email) => {
    return await User.findOne({email})
}

const findByVerifyToken = async (verificationToken) => {
    return await User.findOne({ verificationToken })
}

const create = async (body) => {
    const user = new User(body)
    return await user.save()
}

const updateToken = async (id, token) => {
    return await User.updateOne({_id: id}, {token})
}

const updateVerify = async (id, status) => {
    return await User.updateOne(
        { _id: id },
        {
            verified: status,
            verificationToken: null
        }
    )
}

module.exports = { findById, findByEmail, create, updateToken, findByVerifyToken, updateVerify }