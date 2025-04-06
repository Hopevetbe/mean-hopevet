import express from "express";
import { User, generateJwtToken } from "../models/users.js";
import { Clinic } from "../models/clinic.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/register", async(req,res)=>{
    try {
        // find user is already register
        let user = await User.findOne({email:req.body.email});
        if(user) return res.status(400).json({message:"Email already exist"});
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // new User
        user = await new User({
            name: req.body.name,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            profileImage: req.body.profileImage,
            isAdmin: false,
            password: hashedPassword
        }).save();
        const token = generateJwtToken(user._id);
        res.status(201).json({message:"successfully logged in", token}) 
    } catch (error) {
         res.status(500).json({message:'Internal server Error'})
    }
})
router.post("/login", async(req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        const clinic = await Clinic.findOne({email:req.body.email});
        if(!user && !clinic){
            return res.status(400).json({message:"Invalid user"});
        }
        const comparePassword = user ? user.password : clinic.password;
        const validatePassword = await bcrypt.compare(
            req.body.password,comparePassword
        )
        if(!validatePassword){
            return res.status(400).json({message:"Invalid Password"});
        }
        const id = user ? user._id : clinic._id;
        const token = generateJwtToken(id);
        const data = user ?? clinic;
        res.status(200).json({message:"logged in successfully", token,data}); 
    } catch (error) {
        res.status(500).json({message:'Internal server error',error});
    }
})

export const userRouter = router;