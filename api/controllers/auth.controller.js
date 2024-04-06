import User from "../models/user.model.js"
import bcrypt from "bcrypt"

export const signup = async(req,res) => {
    const {username,email,password} = req.body
    const hashedPassword = bcrypt.hashSync(password,10)

    const newUser = new User({
        username,
        email,
        password:hashedPassword
    })
    try {
        await newUser.save()
        res.status(200).send("User has been created!")
    } catch (err) {
        res.status(500).send(err.message)
    }
}