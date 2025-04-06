import express from "express";
import { PurchaseBillCreation } from "../models/purchase-bill.js";
import { Products} from "../models/product.js";
import { AccountManagement } from "../models/account-management.js";
import {Suppliers}from "../models/supplier.js";

const router = express.Router();

/***************************Purchase Bill Storage Start *******************************************/

// --------GET ALL PURCHASE-----------//
router.get("/getAllPurchase", async(req,res)=>{
    try {
        const purchaseBillList = await PurchaseBillCreation.find({createdBy: req.doctor._id});
        if(!purchaseBillList){
            return res.status(200).json({message:"No Purchase were found"})
        }
        res.status(200).json({message:"fetched successfully", purchaseList: purchaseBillList});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

//------------ GET PURCHASE BY ID-----//
router.post("/getPurchaseById", async(req,res)=>{
        try {
            const purchaseBill = await PurchaseBillCreation.find({_id:req.body.id});
            if(!purchaseBill){
                return res.status(200).json({message:"No Purchase were found"})
            }
            res.status(200).json({purchaseBill:purchaseBill});
        } catch (error) {
            res.status(500).json({message:'Internal server Error',error:error})
        }
    
    })

//----------CREATE PURCHASE------//
router.post("/addPurchaseBill", async(req,res)=>{
    try {
        // Create a new Date object
        const currentDate = new Date().toJSON().slice(0,10);
        req.body.itemsList.forEach(async (item) => {
            if(req.body.purchaseBillInfo.purchaseType === 'BOTH') return;
            //create product
        const productBatch = await Products.findOne({batch:item.batch});
        let productsAdded ={};
        if (!productBatch) {
            const totalQuantity = item.pack? (parseInt(item.quantity.billingQuantity) + parseInt(item.quantity.freeQuantity))*parseInt(item.pack):(parseInt(item.quantity.billingQuantity) + parseInt(item.quantity.freeQuantity));
            const unitPrice = item.pack? parseInt(item.mrp)/parseInt(item.pack):parseInt(item.mrp) ;
            // new Account Management
            productsAdded = await new Products({
                itemName: item.itemName,
                barcode:item.barcode,
                batch: item.batch,
                mktBy: item.mktBy,
                availableQuantity:totalQuantity.toString(),
                hsn: item.hsn,
                mrp: item.mrp,
                expDate: item.expDate,
                pack: item.pack,
                gst:item.gst,
                sch:item.sch,
                rackNo:item.rackNo,
                unitPrice: unitPrice.toString(), 
                itemType: item.itemType,
                createdDate:currentDate,
                createdBy:req.doctor._id,
        }).save();
        }
        else{
            productsAdded = await Products.findOneAndUpdate(
                {batch:item.batch},
                {$set: { availableQuantity: (parseInt(productBatch.availableQuantity) + (parseInt(item.quantity.billingQuantity) + parseInt(item.quantity.freeQuantity))).toString() }},
                {new: true}
                );            
        }
        });
        
        // new Account Management
        const purchaseBill = await new PurchaseBillCreation({
            purchaseBillInfo: req.body.purchaseBillInfo,
            itemsList: req.body.itemsList,
            totalBillAmount: req.body.totalBillAmount,
            createdDate: currentDate,
            createdBy:req.doctor._id,
        }).save();
        const clinic = await AccountManagement.find({createdBy: req.doctor._id,clinicType:req.body.purchaseBillInfo.purchaseType});
        const supplier = await Suppliers.findOne({_id:req.body.purchaseBillInfo.supplier});
        
        res.status(201).json({message:"purchase bill added successfully",purchaseBill: purchaseBill,clinic,supplier});

    } catch(error) {
        res.status(500).json({message:'Internal server Error',error})
    }
})

//--------EDIT Purchase-----------//
router.put("/updatedPurchase/:id", async(req, res)=>{
    try {
        const updatedPurchase = await PurchaseBillCreation.findOneAndUpdate(
            {_id:req.params.id},
            {$set: req.body},
            {new: true}
            )
            if(!updatedPurchase){
                return res.status(200).json({message:"something went wrong"})
            }
            res.status(200).json({data:updatedPurchase});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})
//------ DELETE PURCHASE-------//
router.delete("/deletePurchase/:id", async(req,res)=>{
    try {
        const deletePurchase = await PurchaseBillCreation.findByIdAndDelete({
            _id: req.params.id
        })
        if(!deletePurchase){
            return res.status(200).json({message:"something went wrong"})
        }
        res.status(200).json({message:"data deleted successfully"});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

/***************************Purchase Bill Storage End*******************************************/
/**
 * Get all products
 */
router.get("/getAllProducts", async(req,res)=>{
    try {
        const productsList = await Products.find({createdBy: req.doctor._id});
        if(!productsList){
            return res.status(200).json({message:"No Products were found"})
        }
        res.status(200).json({message:"fetched successfully", productsList: productsList});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

export const purchaseBillRouter = router;