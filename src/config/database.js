const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://kuldeepswnkumar:Dj5YLqPHY2vW6MHE@cluster0.vp27w26.mongodb.net/devTinder')
}

module.exports = connectDB;

// connectDB().then(() => {
//     console.log("Database connected successfully!!")
// }).catch((err) => {
//     console.log("Database connection failed!")
// })