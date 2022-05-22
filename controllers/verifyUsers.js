const repositoryUsers = require('../repository/users')

const EmailService = require("../service/email/service");
const SenderSendgrid = require("../service/email/sender");
const HttpCode = require("../lib/constants")

const verifyUser = async (req, res) => {
    const verifyToken = req.params.token
    const userFromToken = await repositoryUsers.findByVerifyToken(verifyToken)
    
    if (userFromToken) {
        await repositoryUsers.updateVerify(userFromToken.id, true)
        await userFromToken.save();
        res
        // .status(HttpCode.OK)
        // .json({ status: 'success', code: HttpCode.OK, data: { message: 'success' } })
        .redirect('http://wallet-codowriters.netlify.app')
        
    } else {
        res
        .status(HttpCode.BAD_REQUEST)
        .json({ status: 'success', code: HttpCode.OK, data: {message: 'invalid token'} })
    }
}

const repeatEmailForVerifyUser = async (req, res, next) => {
 
    const { email } = req.body
    const user = await repositoryUsers.findByEmail(email)
    if (user) {
        const { name, email, verificationToken, verified } = user

        if (verified === true) {
            return res
                    .status(HttpCode.CONFLICT)
                    .json({
                        status: 'error',
                        code: HttpCode.CONFLICT,
                        data: { message: "This email has already been verified" }
                    })
        }

        const emailService = new EmailService(process.env.NODE_ENV, new SenderSendgrid())
        const isVerifyEmailSent = await emailService.sendVerifyEmail(email, name, verificationToken)

        if (isVerifyEmailSent) {
                return res.status(HttpCode.OK).json({
                status: 'OK',
                code: HttpCode.OK,
                data: { isVerifyEmailSent: isVerifyEmailSent }
            })
        }
        return res
        .status(HttpCode.UE)
        .json({
            status: 'error',
            code: HttpCode.UE,
            data: { message: "Could not send an email" }
        })
    } else {
        return res
        .status(HttpCode.NOT_FOUND)
        .json({
            status: 'error',
            code: HttpCode.NOT_FOUND,
            data: { message: "User with this email was not found" }
        })
    }
}

module.exports = {
    verifyUser,
    repeatEmailForVerifyUser
}