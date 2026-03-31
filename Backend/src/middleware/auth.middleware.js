import "dotenv/config"
import jwt from 'jsonwebtoken'
import redis from "../config/cache.js"


export const authUser = async (req , res , next) =>{
    const token = req.cookies.token

    if(!token){
        return res.status(400)
        .json({
            message : "Unauthorized",
            success : false,
            err : "Token not found",
        
        })
    }


    const isTokenBlacklisted = await redis.get(token)

    if(isTokenBlacklisted){
        return res.status(400)
        .json({
            message : "Invalid token",
            success : false,
            err: "Invalid token"
        })
    }


    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch(err){
        return res.status(400)
        .json({
            message : "Invalid token",
            success : false,
            err : "Invalid token"
        })
    }
}