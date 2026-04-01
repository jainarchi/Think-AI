import { io } from "socket.io-client";


export const initializationSocketConnection = () =>{

    const socket = io(import.meta.env.VITE_BACKEND_URL , {
        withCredentials : true,
        transports: ["websocket"], 
    })

    
    socket.on("connect" , () =>{
        console.log("connected to Socket.IO server")
    })



}