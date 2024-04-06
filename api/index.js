import express from "express" 
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from "./routes/user.route.js"

const app = express()
dotenv.config()

const connect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Connected to MongoDb!");
    } catch (err) {
        console.log(err);
    }
}

app.use("/api/user",userRouter)

app.listen(3000,()=>{
    connect()
    console.log("Backend server is running!");
})