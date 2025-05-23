const express = require('express')
const { userAuth } = require('../middlewares/userAuth')
const { validateEditUser } = require('../utils/validation')


const profileRoute = express.Router()


profileRoute.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (error) {
        res.status(400).send("Something went to wrong!" + error.message)
    }
})

profileRoute.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateEditUser(req)) {
            throw new Error('Invalid Editable User')
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])
        await loggedInUser.save()
        res.json({ message: "Profile Edited Successfully!", data: loggedInUser })
    } catch (error) {
        res.status(400).send("Something went to wrong!" + error.message)
    }
})

module.exports = profileRoute;