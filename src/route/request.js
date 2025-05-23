const express = require('express')
const { userAuth } = require('../middlewares/userAuth')
const ConnectRequest = require('../models/connectionRequest')

const requestRoute = express.Router()

// make is status and userId is dynamic
requestRoute.post('/request/send/:status/:userId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        if (!['interested', 'ignored'].includes(status)) {
            throw new Error("Invalid stauts type")
        }

        const existingConnectionRequest = await ConnectRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if (existingConnectionRequest) {
            return res.status(400).send("Connection Request Already Exist")
        }

        const connectionRequestObj = new ConnectRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequestObj.save()
        res.json({ message: "Connect sent successfully", data: data });
        res.send("Connection sent successfully")

    } catch (error) {
        res.status(404).send("Something went wrong " + error.message)
    }
})

requestRoute.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {

        const { status, requestId } = req.params
        const loggedInUser = req.user
        const allowedStatus = ['accepted', 'rejected']
        if (!allowedStatus) {
            return res.status(400).json({ message: "Stuatus not allowed!!" })
        }

        const connectionReviewRequest = await ConnectRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if (!connectionReviewRequest) {
            return res.status(400).json({ message: "Connection request not found!!" })
        }

        connectionReviewRequest.status = status

        const data = await connectionReviewRequest.save()

        res.json({ message: "Connection accepted successfully", data: data })
    } catch (error) {
        res.status(404).send("Something went wrong " + error.message)
    }
})

module.exports = requestRoute;