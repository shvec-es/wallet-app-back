const Joi = require("joi");

const repeatVerifySchema = Joi.object({
    email: Joi.string().email().required(),
})

const validateRepeatVerification = async (req, res, next) => {
    try {
        const value = await repeatVerifySchema.validateAsync(req.body)
    } catch (err) {
        return res.status(400).json({message: err.message.replace(/"/g, '')})
    }
    next()
}

module.exports = validateRepeatVerification