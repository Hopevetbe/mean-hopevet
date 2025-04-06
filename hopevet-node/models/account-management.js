import mongoose from "mongoose";
import  jwt from "jsonwebtoken";
const { ObjectId } = mongoose.Schema
const accountManagamentSchema = new mongoose.Schema(
    {
        legalName:{
            type: String,
            trim: true
        },
        tradeName:{
            type: String,
            trim: true
        },
        address:{
            type: String,
            trim: true
        },
        panNo:{
            type: String,
            trim: true
        },
        gstn:{
            type: String,
            trim: true
        },
        email:{
            type: String,
            required: true,
            trim: true
        },
        mobileNumber:{
            type: Number,
            required: true,
        },
        clinicType:{
            type: String,
        },
        createdDate:{
            type: String,
        },
        createdBy:{
            type: ObjectId,
            ref : "doctors"
        }
    }
)

const generateJwtTokenForAccount = (id)=>{
    return jwt.sign({id}, process.env.SECRET_KEY)
}
const AccountManagement = mongoose.model('accountManagement',accountManagamentSchema);

export {AccountManagement, generateJwtTokenForAccount};