const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  //reference to the User model
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['interested', 'ignored', 'accepted', 'rejected'],
            message: `{VALUE} is not valid status type`
        }
    }
}, { timestamps: true })

connectionRequestSchema.pre('save', function () {
    const connectionRequest = this
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself!")
    }
})

//set indexing on user id
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema)
