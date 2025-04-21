const express = require('express');

const app = express()

app.use('/', (req, res) => {
    res.send("Welcome back Dashboard!!")
})
app.use('/hello', (req, res) => {
    res.send("Welcome back hello!!")
})
app.use('/test', (req, res) => {
    res.send("Hello World!!")
})


//Server created
app.listen(7777, () => {
    console.log("Server is running on port no 7777...")
})