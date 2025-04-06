import mongoose from "mongoose";
import  jwt from "jsonwebtoken";
const { ObjectId } = mongoose.Schema
const clinicSchema = new mongoose.Schema(
    {
        legalName:{
            type: String,
            required: true,
            trim: true
        },
        tradeName:{
            type: String,
            required: true,
            trim: true
        },
        address:{
            type: String,
            required: true,
            trim: true
        },
        panNo:{
            type: String,
            required: true,
            trim: true
        },
        gstn:{
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
        mobileNumber:{
            type: Number,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
        profileImage:{
            type: String,
        },
        isAdmin:{
            type: Boolean,
        },
        createdDate:{
            type: String,
        },
        createdBy:{
            type: ObjectId,
            ref : "users"
        }
    }
)

const generateJwtTokenForClinic = (id)=>{
    return jwt.sign({id}, process.env.SECRET_KEY)
}
const Clinic = mongoose.model('clinics',clinicSchema);

export {Clinic, generateJwtTokenForClinic};