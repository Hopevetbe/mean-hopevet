import mongoose from "mongoose";
import  jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        name:{
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
        }
    }
)
const generateJwtToken = (id)=>{
    return jwt.sign({id}, process.env.SECRET_KEY)
}
const User = mongoose.model('users',userSchema);

export {User, generateJwtToken};