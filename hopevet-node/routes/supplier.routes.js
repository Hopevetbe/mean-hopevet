import express from "express";
import { Suppliers } from "../models/supplier.js";

const router = express.Router();


router.post("/createSupplier", async(req,res)=>{
    try {
        // Create a new Date object
        const currentDate = new Date().toJSON().slice(0,10);
        // new Account Management
        const supplier = await new Suppliers({
            companyName: req.body.supplier.companyName,
            address: req.body.supplier.address,
            city: req.body.supplier.city,
            state: req.body.supplier.state,
            country: req.body.supplier.country,
            pincode: req.body.supplier.pincode,
            email: req.body.supplier.email,
            mobileNumber: req.body.supplier.mobileNumber,
            gstin: req.body.supplier.gstin,
            createdDate: currentDate,
            createdBy:req.doctor._id,
        }).save();
        const suppliers = await Suppliers.find({createdBy:req.doctor._id});
        res.status(201).json({message:"successfully added", suppliers}) 
    } catch (error) {
         res.status(500).json({message:'Internal server Error',error})
    }
})
router.get("/getAllSuppliers", async(req,res)=>{
    try {
        const suppliers = await Suppliers.find({createdBy: req.doctor._id});
        if(!suppliers){
            return res.status(200).json({message:"No Suppliers were found"})
        }
        res.status(200).json({message:"fetched successfully", suppliers: suppliers});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})


router.delete("/deleteSupplier/:id", async(req,res)=>{
    try {
        const deleteSupplier = await Suppliers.findByIdAndDelete({
            _id: req.params.id
        })
        if(!deleteSupplier){
            return res.status(200).json({message:"something went wrong"})
        }
        res.status(200).json({message:"data deleted successfully"});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})
router.put("/updatedSupplier/:id", async(req, res)=>{
    try {
        const updatedSupplier = await Suppliers.findOneAndUpdate(
            {_id:req.params.id},
            {$set: req.body},
            {new: true}
            )
            if(!updatedSupplier){
                return res.status(200).json({message:"something went wrong"})
            }
            res.status(200).json({data:updatedSupplier});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

export const supplierRouter = router;