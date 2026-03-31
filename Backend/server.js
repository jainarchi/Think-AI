import "dotenv/config"
import app from './src/app.js'
import connectToDB from "./src/config/db.js"
import http from 'http'
import { initSocket } from "./src/sockets/server.socket.js"


const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app)

initSocket(httpServer)


connectToDB()
.catch((err) =>{
    console.error("MongoDB connection failed:" , err)
    process.exit(1);
})

httpServer.listen(PORT , () =>{
    console.log('server listen on PORT ' , PORT)
})