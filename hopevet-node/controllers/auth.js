import jwt from "jsonwebtoken";
import { User } from "../models/users.js";


const isAuthenticated = async(req, res, next)=>{
    let token;
        if(req.headers){
            try {
                token = req.headers["x-auth-token"];
                const decode = jwt.verify(token, process.env.SECRET_KEY);
                req.user = await User.findById(decode.id).select("-password");
                next()
            } catch (error) {
                return res.status(400).json({message:"Unauthorization"})
            }
        }
        if(!token){
            return res.status(400).json({message:"Access Denied"})
        }
    
}
export {isAuthenticated}