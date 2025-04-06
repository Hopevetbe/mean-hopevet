import express from "express";
import { Doctor, generateJwtToken } from "../models/doctors.js";
import bcrypt from "bcrypt";
import { AccountManagement } from "../models/account-management.js";

const router = express.Router();

// Initial user creation

router.post("/createDoctor", async(req,res)=>{
    try {
        // find doctor is already register
    //     const filter={};
    //     if(req.body.email){
    //         filter['email'] = req.body.email;
    //    //  let doctor = await Doctor.findOne({email:req.body.email});
    //     }
    //     if(req.body.userName){
    //         filter['userName'] = req.body.userName;
            
    //     }
        let doctorEmail = await Doctor.findOne({email:req.body.email});
        
        if(doctorEmail) return res.status(400).json({message:"Email already exist"});
        let doctorUserName = await Doctor.findOne({userName:req.body.userName});
        
        if(doctorUserName) return res.status(400).json({message:"User Name already exist"});
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const currentDate = new Date().toJSON().slice(0,10);
        // new Doctor
        doctorEmail = await new Doctor({
            userName: req.body.userName,
            doctorName:req.body.doctorName,
            email: req.body.email,
            registeredMobileNumber: req.body.mobileNumber,
            createdDate: currentDate,
            isAdmin: false,
            password: hashedPassword
        }).save();
        const PETCLINIC = await new AccountManagement({
            legalName: '',
            tradeName: '',
            address: '',
            panNo: '',
            gstn: '',
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            clinicType: 'PET_CLINIC',
            createdDate: currentDate,
            createdBy: doctorEmail._id,
        }).save();
        const medistore = await new AccountManagement({
            legalName: '',
            tradeName: '',
            address: '',
            panNo: '',
            gstn: '',
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            clinicType: 'MEDI_STORE',
            createdDate: currentDate,
            createdBy: doctorEmail._id,
        }).save();
        const token = generateJwtToken(doctorEmail._id);
        res.status(201).json({message:"successfully logged in", token,doctorEmail,medistore,PETCLINIC}) 
    } catch (error) {
         res.status(500).json({message:'Internal server Error',error})
    }
})
router.post("/doctorLogin", async(req,res)=>{
    try {
    //     const filter={};
    //     if(req.body.email){
    //         filter['email'] = req.body.email;
    //    //  
    //     }
    //     if(req.body.userName){
    //         filter['userName'] = req.body.userName;
            
    //     }
        const doctorEmail = await Doctor.findOne({email:req.body.email});
        const doctorUserName = await Doctor.findOne({userName:req.body.email});
        //const doctor = await Doctor.findOne(filter);
        if(!doctorEmail && !doctorUserName){
            return res.status(400).json({message:"Invalid user"});
        }
        const doctor = doctorEmail ?? doctorUserName;
        const comparePassword = doctor.password;
        const validatePassword = await bcrypt.compare(
            req.body.password,comparePassword
        )
        if(!validatePassword){
            return res.status(400).json({message:"Invalid Password"});
        }
        const id = doctor._id;
        const token = generateJwtToken(id);
        const data = doctor;
        res.status(200).json({message:"logged in successfully", token,data}); 
    } catch (error) {
        res.status(500).json({message:'Internal server error',error});
    }
})
//--------EDIT Doctor-----------//
router.put("/updatedDoctor/:id", async(req, res)=>{
    try {
        const updatedDoctor = await Doctor.findOneAndUpdate(
            {_id:req.params.id},
            {$set: req.body},
            {new: true}
            )
            if(!updatedDoctor){
                return res.status(200).json({message:"something went wrong"})
            }
            res.status(200).json({data:updatedDoctor});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})
//------ DELETE Doctor-------//
router.delete("/deleteDoctor/:id", async(req,res)=>{
    try {
        const deleteDoctor = await Doctor.findByIdAndDelete({
            _id: req.params.id
        })
        if(!deleteDoctor){
            return res.status(200).json({message:"something went wrong"})
        }
        res.status(200).json({message:"data deleted successfully"});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})
router.get("/getAllDoctor", async(req,res)=>{
    try {
        const doctorList = await Doctor.find();
        if(!doctorList){
            return res.status(200).json({message:"No Doctor were found"})
        }
        res.status(200).json({message:"fetched successfully", DoctorList: doctorList});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

export const doctorRouter = router;