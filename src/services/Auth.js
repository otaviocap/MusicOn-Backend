import Users from '../models/User.js';
import Crypto from 'crypto';


async function login(req, res) {
    if (req.body.email && req.body.password) {
        const { email, password } = req.body
        const userExists = await Users.findOne({email})
        const hashedPassword = Crypto.createHash('sha256').update(password).digest("hex")
        if (userExists) {
            if (userExists.password === hashedPassword) {
                return res.status(200).json({
                    _id: userExists._id,
                })
            }
        }
        return res.status(404).json({
            message: "The email and the password doesn't match any account"
        })
    }
    return res.status(400).json({
        message: "Email and Password is required to log in"
    })
}

export default {
    login
}