import { io } from "socket.io-client";


export const initializationSocketConnection = () =>{

    const socket = io("http://localhost:3000" , {
        withCredentials : true,
        transports: ["websocket"], 
    })

    
    socket.on("connect" , () =>{
        console.log("connected to Socket.IO server")
    })



}