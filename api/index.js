import express from "express" 
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"

const app = express()
dotenv.config()
app.use(express.json())

const connect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Connected to MongoDb!");
    } catch (err) {
        console.log(err);
    }
}

app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)

app.listen(3000,()=>{
    connect()
    console.log("Backend server is running!");
})