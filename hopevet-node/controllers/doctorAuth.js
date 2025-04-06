import jwt from "jsonwebtoken";
import { Doctor } from "../models/doctors.js";


const isDoctorAuthenticated = async(req, res, next)=>{
    let token;
        if(req.headers){
            try {
                token = req.headers["x-auth-token"];
                const decode = jwt.verify(token, process.env.SECRET_KEY);
                req.doctor = await Doctor.findById(decode.id).select("-password");
                next()
            } catch (error) {
                return res.status(400).json({message:"Unauthorization"})
            }
        }
        if(!token){
            return res.status(400).json({message:"Access Denied"})
        }
    
}
export {isDoctorAuthenticated}