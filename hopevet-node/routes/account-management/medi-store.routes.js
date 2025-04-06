import express from "express";
import { AccountManagement } from "../../models/account-management.js";

const router = express.Router();


router.post("/createMediStore", async(req,res)=>{
    try {
        // Create a new Date object
        const currentDate = new Date().toJSON().slice(0,10);
        // new Account Management
        const medistore = await new AccountManagement({
            legalName: req.body.legalName,
            tradeName: req.body.tradeName,
            address: req.body.address,
            panNo: req.body.panNo,
            gstn: req.body.gstn,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            clinicType: req.body.clinicType,
            createdDate: currentDate,
            createdBy: req.doctor._id,
        }).save();
        res.status(201).json({message:"successfully added clinic", medistore}) 
    } catch (error) {
         res.status(500).json({message:'Internal server Error',error})
    }
})
router.get("/getAllClinic", async(req,res)=>{
    try {
        const allClinic = await AccountManagement.find().populate("createdBy", "legalName tradeName address panNO gstn email mobileNumber clinicType");
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
        const clinic = await AccountManagement.find({createdBy: req.doctor._id});
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
        const deleteClinic = await AccountManagement.findByIdAndDelete({
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
        const updatedClinic = await AccountManagement.findOneAndUpdate(
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

export const accountsManagementRouter = router;