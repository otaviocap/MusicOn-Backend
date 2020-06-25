import Users from '../models/User.js'
import Crypto from 'crypto'
import secret from '../secret.js'
import User from '../models/User.js';

//index, show, store, update, destroy
async function index(req, res) {
    let query;
    if (req.body.key === secret.key) {
        query = await Users.find({});
    } else {
        query = await Users.find({}, {username: 1});
    }
    return res.status(200).json(query)
}

async function show(req, res) {
    if (req.params.input) {
        let userExists;
        if (req.params.input.match(/\S+@\S+\.\S+/g)) {
            userExists = await Users.findOne({"email":req.params.input})
        } else {
            userExists = await User.findById(req.params.input)
        }
        if (userExists) {
            return res.json(userExists)
        }
        return res.status(404).json({
            message: "User not found"
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

        const userExists = await Users.findOne({email: email})
        if (userExists) {
            console.log(`The email ${email} is already in use`)
            return res.status(409).json({
                message: `The email ${email} is already in use`
            })
        }

        const hashedPassword = Crypto.createHash('sha256').update(password).digest("hex")
        
        console.log(`Created user ${username}`)
        const user = await Users.create({
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
async function update(req, res) {
    if (req.params.email) {
        if (req.body.key === secret.key) {
            const oldEmail = req.params.email
            const userExists = await Users.findOne({email: oldEmail})
            if (!userExists) {
                return res.status(404).json({
                    message: "User not found"
                })
            }
            const { email, password, username} = req.body
            let hashedPassword = undefined
            if (password) {
                hashedPassword = Crypto.createHash('sha256').update(password).digest("hex")
            }
            if (email && email !== oldEmail) {
                const emailInUse = await Users.findOne({email})
                if (emailInUse) {
                    return res.status(409).json({
                        message: "Email already in use"
                    }) 
                }
            }

            const userUpdated = await Users.updateOne({email: oldEmail}, {email, username, "password": hashedPassword}, {omitUndefined: true}, (err, result) => {
                if (err) console.log(err)
            })

            return res.status(200).json({
                message: "User update successful",
            })

        }
        return res.status(403).json({
            message: "Please provide the correct key"
        })
    }
    return res.status(400).json({
        message: "Email is required to update"
    })
}

async function destroy(req, res) {
    if (req.params.email) {
        if (req.body.key === secret.key) {
            const { email } = req.params
            const userExists = await Users.findOne({email})
            if (userExists) {
                Users.deleteOne({email}, (err) => {
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
