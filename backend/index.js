import express from 'express'

import dotenv from "dotenv"
dotenv.config()
import connectdb from './config/db.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import cors from 'cors'
import userRouter from './routes/user.routes.js'
import geminiResponse from './gemini.js'


const app = express()
app.use(cors({
    origin: ["https://assistant-vdqz.onrender.com"],
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())
// Add this to allow cookies to be sent from the browser
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Credentials', 'true');
//     next();
// });
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)



const port = process.env.PORT || 5000

app.listen(port,()=>{
    connectdb()
    console.log("server started")
})
