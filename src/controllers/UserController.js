import User from '../models/User.js'
import Crypto from 'crypto'
import secret from '../secret.js'

//index, show, store, update, destroy
async function index(req, res) {
    
}

async function show(req, res) {
    if (req.params.email) {
        if (req.body.key === secret.key) {
            const { email } = req.params
            const userExists = await User.findOne({email})
            if (userExists) {
                return res.json(userExists)
            }
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(403).json({
            message: "Please provide the correct key"
        })
    }
    return res.status(400).json({
        message: "Email is required to search"
    })
}


async function store(req, res) {
    const body = req.body;
    if (body.username && body.email && body.password) {
        const { username, email, password } = body

        const userExists = await User.findOne({email: email})
        if (userExists) {
            console.log(`The user ${username} already exists in the database`)
            return res.status(409).json({
                message: `The user ${username} already exists in the database`
            })
        }

        const hashedPassword = Crypto.createHash('sha256').update(password).digest("hex")
        
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })


        return res.status(201).json(user)
    }
    return res.status(400).json({
        username: body.username ? true : false,
        email: body.email ? true : false,
        password: body.password ? true : false
    })
}
async function update(req, res) {}

async function destroy(req, res) {
    if (req.params.email) {
        if (req.body.key === secret.key) {
            const { email } = req.params
            const userExists = await User.findOne({email})
            if (userExists) {
                User.deleteOne({email}, (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
                console.log(`Deleted user with the email: ${email}`)
                return res.json({
                    message: "Delete was successful"
                })
            }
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(403).json({
            message: "Please provide the correct key"
        })
    }
    return res.status(400).json({
        message: "Email is required to delete"
    })
}

export default {
    index,
    show,
    store,
    update,
    destroy
}
