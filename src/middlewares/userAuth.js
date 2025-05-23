const jwt = require('jsonwebtoken')
const User = require('../models/user')


const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            throw new Error("Token is not valid!!!!")
        }
        const decodedData = await jwt.verify(token, 'KULDEEP@123')
        const { _id } = decodedData;
        const user = await User.findById(_id)
        if (!user) {
            throw new Error("User don't exist in DB!!!!")
        }
        req.user = user;
        next()
    } catch (error) {
        res.status(404).send("Something went wrong " + error.message)
    }
}

module.exports = {
    userAuth
}