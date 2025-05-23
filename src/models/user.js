const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email" + value)
            }
        }

    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        validate(value) {
            if (['male', 'female', 'other'].includes(value)) {
                throw new Error("Gender data not valid")
            }
        }
    },
    gender: {
        type: String
    },
    photoUrl: {
        type: String,
        required: true,
        default: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
    },
    about: {
        type: String,
        default: "This is my about section"
    },
    skills: [String]
}, { timestamps: true })


userSchema.methods.getJWT = async function () {
    let user = this;
    const token = await jwt.sign({ _id: user._id }, "KULDEEP@123", { expiresIn: "7d" })
    return token;
}

userSchema.methods.validateUserPassword = function (userInputPassword) {
    const user = this;
    const passwordHash = user.password;
    const validUserPassword = bcrypt.compare(userInputPassword, passwordHash)
    return validUserPassword;
}

module.exports = mongoose.model('User', userSchema)