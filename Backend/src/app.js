import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import chatRouter from './routes/chat.routes.js'
import { errorHandler } from './utils/errorHandler.js'
import morgan from 'morgan'
import cors from "cors"


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

app.use(cors({
    origin :  process.env.CLIENT_URL ||'http://localhost:5173' ,
    credentials:true,
    methods:["POST" , "GET" , "PUT" , "DELETE" , "PATCH"]
}))






app.use('/api/auth' , authRouter)
app.use('/api/chats' , chatRouter)





app.use(errorHandler)



export default app