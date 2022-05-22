const Mailgen = require('mailgen')

class EmailService {
    constructor(env, sender) {
        this.sender = sender
        switch (env) {
            case 'development':
                this.link = 'http://localhost:3001'
                break
            case 'test':
                this.link = 'http://localhost:5000'
                break
            case 'production':
                this.link = 'http://wallet-codowriters.netlify.app'
                break
            default:
                this.link = 'http://localhost:3000'
        }
    }

    createEmailTemplate(username, verifyToken) {
        const mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'eWallet',
                link: this.link
            }
        })
        const email = {
            body: {
                name: username,
                intro: 'Welcome! We\'re very excited to have you on board with eWallet.',
                action: {
                    instructions: 'To confirm your email and get started with your personal online wallet, please click here:',
                    button: {
                        color: '#22BC66', // Optional action button color
                        text: 'Confirm your email',
                        link: `${this.link}/api/users/verify/${verifyToken}`
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };
        return mailGenerator.generate(email)
    }

    async sendVerifyEmail(email, username, verificationToken) {
        const emailBody = this.createEmailTemplate(username, verificationToken)
        const msg = {
            to: email,
            subject: 'Verification email',
            html: emailBody
        }
        try {
            const result = await this.sender.send(msg)
            console.log(result)
            return true
        } catch (error) {
            console.error(error.message)
            return false
        }
    }
}

module.exports = EmailService