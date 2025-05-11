const express = require('express');
const connectDB = require('./config/database')
const User = require('./models/user')

const app = express()

app.post('/signup', async (req, res) => {
    const userObj = new User({
        firstName: "Kuldeep",
        lastName: "Gupta",
        emailId: "kuldeep@gmail.com",
        password: "kuldeep123",
        age: 25,
        gender: "male"
    })

    try {
        await userObj.save();
        res.send("User Added Successfully!")
    } catch (error) {
        res.status(400).send("Something went to wrong!")
    }
})


connectDB().then(() => {
    console.log("Database connected successfully!!")
    app.listen(7777, () => {
        console.log("Server is running on port no 7777...")
    })
}).catch((err) => {
    console.log("Database connection failed!")
})


//Server created
