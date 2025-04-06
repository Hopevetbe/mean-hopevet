import mongoose from "mongoose";
import  jwt from "jsonwebtoken";

const doctorSchema = new mongoose.Schema(
    {
        userName:{
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        doctorName:{
            type: String,
            required: true,
            trim: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        registeredMobileNumber:{
            type: Number,
        },
        password:{
            type: String,
            required: true,
        },
        createdDate:{
            type:String,
        },
        isAdmin:{
            type: Boolean,
        }
    }
)
const generateJwtToken = (id)=>{
    return jwt.sign({id}, process.env.SECRET_KEY)
}
const Doctor = mongoose.model('doctors',doctorSchema);

export {Doctor, generateJwtToken};