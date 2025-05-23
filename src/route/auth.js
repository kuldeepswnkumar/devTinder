
const express = require("express")
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { userValidationData } = require('../utils/validation')


const authRoute = express.Router()

authRoute.post('/signup', async (req, res) => {

    userValidationData(req)
    const { firstName, lastName, emailId, password } = req.body

    const passwordHash = await bcrypt.hash(password, 10)
    const userObj = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash
    })


    try {
        await userObj.save();
        res.send("User Added Successfully!")
    } catch (error) {
        res.status(400).send("Something went to wrong!" + error.message)
    }
})



authRoute.post('/login', async (req, res) => {
    const { emailId, password } = req.body

    try {
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid Credentials!")
        }
        const varifiedPassword = await user.validateUserPassword(password);
        if (!varifiedPassword) {
            throw new Error("Invalid Credentials!")
        } else {
            const jwtToken = await user.getJWT(); //Here using schema method
            res.cookie('token', jwtToken)
            res.send("Login Successfully")
        }
    } catch (error) {
        res.status(400).send("Something went to wrong!" + error.message)
    }
})

authRoute.post('/logout', async (req, res) => {
    res.cookie("token", null,
        { expires: new Date(Date.now()) }
    )
    res.send("User logout successfully!")
})

module.exports = authRoute