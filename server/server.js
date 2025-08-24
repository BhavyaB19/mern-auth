import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express()
const port = process.env.PORT || 4000

connectDB()

const allowedOrigins = ['http://localhost:5173']

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials:true, origin: allowedOrigins}))

//API Endpoints
app.get('/', (req, res) => res.send("API is running..."))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)


app.listen(port, () => console.log(`Listening on port ${port}`))