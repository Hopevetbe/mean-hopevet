import express from "express";
import { Clinic } from "../models/clinic.js";
import bcrypt from "bcrypt";

const router = express.Router();
// file upload 

router.post("/createClinic", async(req,res)=>{
    try {
        // find clinic is already register
        let clinic = await Clinic.findOne({email:req.body.email});
        if(clinic) return res.status(400).json({message:"Email already exist"});
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // Create a new Date object
        const currentDate = new Date().toJSON().slice(0,10);
        // new Clinic
        clinic = await new Clinic({
            legalName: req.body.legalName,
            tradeName: req.body.tradeName,
            address: req.body.address,
            panNo: req.body.panNo,
            gstn: req.body.gstn,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            profileImage: req.body.profileImage,
            isAdmin: false,
            password: hashedPassword,
            createdDate: currentDate,
            createdBy: req.user._id,
        }).save();
        res.status(201).json({message:"successfully added clinic", clinic}) 
    } catch (error) {
         res.status(500).json({message:'Internal server Error',error:error})
    }
})
// router.post("/login", async(req,res)=>{
//     try {
//         const user = await User.findOne({email:req.body.email})
//         if(!user){
//             return res.status(400).json({message:"Invalid user"});
//         }
//         const validatePassword = await bcrypt.compare(
//             req.body.password,user.password
//         )
//         if(!validatePassword){
//             return res.status(400).json({message:"Invalid Password"});
//         }
//         const token = generateJwtToken(user._id);
//         res.status(200).json({message:"logged in successfully", token,user});
//     } catch (error) {
        
//     }
// })
router.get("/getAllClinic", async(req,res)=>{
    try {
        const allClinic = await Clinic.find().populate("createdBy", "legalName tradeName address panNO gstn email mobileNumber profileImage isAdmin");
        if(!allClinic){
            return res.status(200).json({message:"No Clinics were found"})
        }
        res.status(200).json({message:"fetched successfully", clinicList: allClinic});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

router.get("/getClinicById", async(req,res)=>{
    try {
        const clinic = await Clinic.find({createdBy: req.user._id});
        if(!clinic){
            return res.status(200).json({message:"No Clinics were found"})
        }
        res.status(200).json({clinicList:clinic});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }

})
router.delete("/deleteClinic/:id", async(req,res)=>{
    try {
        const deleteClinic = await Clinic.findByIdAndDelete({
            _id: req.params.id
        })
        if(!deleteClinic){
            return res.status(200).json({message:"something went wrong"})
        }
        res.status(200).json({message:"data deleted successfully"});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})
router.put("/updatedClinic/:id", async(req, res)=>{
    try {
        const updatedClinic = await Clinic.findOneAndUpdate(
            {_id:req.params.id},
            {$set: req.body},
            {new: true}
            )
            if(!updatedClinic){
                return res.status(200).json({message:"something went wrong"})
            }
            res.status(200).json({data:updatedClinic});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

export const clinicRouter = router;