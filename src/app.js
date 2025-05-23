const express = require('express');
const connectDB = require('./config/database')
const cookieParser = require("cookie-parser")
const authRoute = require('./route/auth')
const profileRoute = require('./route/profile')
const requestRoute = require('./route/request')
const userRoute = require('./route/user')

const app = express()
//express.json() middleware use to convert JSON obj into JS Obj and pass to the body
app.use(express.json())
app.use(cookieParser())

app.use('/', authRoute)
app.use('/', profileRoute)
app.use('/', requestRoute)
app.use('/', userRoute)


connectDB().then(() => {
    console.log("Database connected successfully!!")
    app.listen(7777, () => {
        console.log("Server is running on port no 7777...")
    })
}).catch((err) => {
    console.log("Database connection failed!")
})


//Server created
