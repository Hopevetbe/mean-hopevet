import express from "express";
import { BrandProductS } from "../models/product-brands.js";
import {ProductGroup,ProductBrand,ProductPack} from "../models/master.js";
const router = express.Router();


router.post("/createBrandProduct", async(req,res)=>{
    try {
        // Create a new Date object
        const currentDate = new Date().toJSON().slice(0,10);
        const productGroup = await ProductGroup.findOne({groupName:req.body.product.group});
        const productBrand = await ProductBrand.findOne({brandName:req.body.product.brand});
        const productPack = await ProductPack.findOne({pack:req.body.product.pack});
        if (!productGroup) await new ProductGroup({groupName:req.body.product.group}).save();
        if (!productBrand) await new ProductBrand({brandName:req.body.product.brand}).save();
        if (!productPack) await new ProductPack({pack:req.body.product.pack}).save();
        // new Account Management
        const brandProduct = await new BrandProductS({
            group: req.body.product.group,
            brand: req.body.product.brand,
            barcode: req.body.product.barcode,
            itemNumber: req.body.product.itemNumber,
            mrp: req.body.product.mrp,
            purchasePrice: req.body.product.purchasePrice,
            pack: req.body.product.pack,
            clinicType: req.body.product.clinicType,
            rackNo: req.body.product.rackNo,
            createdDate: currentDate,
            createdBy:req.doctor._id,
        }).save();
        const allBrands = await BrandProductS.find({createdBy:req.doctor._id});
        res.status(201).json({message:"successfully added", allBrands}) 
    } catch (error) {
         res.status(500).json({message:'Internal server Error',error})
    }
})
router.get("/getAllMasters", async(req,res)=>{
    try {
        const productGroup = await ProductGroup.find();
        const productBrand = await ProductBrand.find();
        const productPack = await ProductPack.find();
        const allMasters = {
            groups: productGroup ?? [],
            brands: productBrand ?? [],
            packs: productPack ?? [],
        }
        res.status(200).json({message:"fetched successfully", allMasters});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})
router.get("/getAllBrandProducts", async(req,res)=>{
    try {
        const allBrands = await BrandProductS.find({createdBy: req.doctor._id});
        if(!allBrands){
            return res.status(200).json({message:"No Brands were found"})
        }
        res.status(200).json({message:"fetched successfully", brandList: allBrands});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})


router.delete("/deleteProductBrand/:id", async(req,res)=>{
    try {
        const deleteproduct = await BrandProductS.findByIdAndDelete({
            _id: req.params.id
        })
        if(!deleteproduct){
            return res.status(200).json({message:"something went wrong"})
        }
        res.status(200).json({message:"data deleted successfully"});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})
router.put("/updatedProductBrand/:id", async(req, res)=>{
    try {
        const updatedProductBrand = await BrandProductS.findOneAndUpdate(
            {_id:req.params.id},
            {$set: req.body},
            {new: true}
            )
            if(!updatedProductBrand){
                return res.status(200).json({message:"something went wrong"})
            }
            res.status(200).json({data:updatedProductBrand});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

export const productBrandRouter = router;