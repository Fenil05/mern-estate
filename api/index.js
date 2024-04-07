import express from "express" 
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import listingRouter from "./routes/listing.route.js"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
dotenv.config()
app.use(express.json())
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(cookieParser())


const connect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Connected to MongoDb!");
    } catch (err) {
        console.log(err);
    }
}

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error!"
    return res.status(statusCode).send({
        success:false,
        statusCode,
        message
    })
})

app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)
app.use("/api/listing",listingRouter)

app.listen(3000,()=>{
    connect()
    console.log("Backend server is running!");
})