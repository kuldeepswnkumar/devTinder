const express = require('express')
const { userAuth } = require('../middlewares/userAuth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const userRoute = express.Router()

const USER_SAFE_DATA = "firstName lastName photoUrl gender age skills"

userRoute.get('/user/request/received', userAuth, async (req, res) => {
    try {
        //Verify the loggedin User
        const loggedInUser = req.user;

        const connectionUserRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate('fromUserId', ["firstName", "lastName", "photoUrl", "gender", "skills"])

        if (!connectionUserRequest) {
            return res.status(400).json({ message: "Pending connection not found!!" })
        }

        res.json({ message: "Get pending request.", data: connectionUserRequest })

    } catch (error) {
        res.status(404).send("Something went wrong " + error.message)
    }
})

userRoute.get('/user/connection', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequestData = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate('fromUserId', USER_SAFE_DATA).populate('toUserId', USER_SAFE_DATA)

        const data = connectionRequestData.map((currData) => {
            if (currData.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return currData.toUserId
            }
            return currData.fromUserId;
        })

        res.json({ data })
    } catch (error) {
        res.status(404).send("Something went wrong " + error.message)
    }
})

userRoute.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let skip = (page - 1) * limit;

        const connectionRequestData = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUsersInFeed = new Set()
        connectionRequestData.forEach((req) => (
            hideUsersInFeed.add(req.fromUserId),
            hideUsersInFeed.add(req.toUserId)
        ))

        const user = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersInFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)

        res.send(user)
    } catch (error) {
        res.status(404).send("Something went wrong " + error.message)
    }
})

module.exports = userRoute