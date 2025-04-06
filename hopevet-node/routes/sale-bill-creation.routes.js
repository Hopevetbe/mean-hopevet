import express from "express";
import { SaleBillCreation,ConsultationDetails,MedicineSale,PetStoreSale} from "../models/sales-bill.js";
import {SaleClient} from "../models/saleClient.js";
import {Products} from "../models/product.js";
import {AccountManagement} from "../models/account-management.js";

const router = express.Router();

/***************************Purchase Bill Storage Start *******************************************/

// --------GET ALL PURCHASE-----------//
router.get("/getAllSales", async(req,res)=>{
    try {
        const saleBillList = await SaleBillCreation.find();
        if(!saleBillList){
            return res.status(200).json({message:"No Sales were found"})
        }
        res.status(200).json({message:"fetched successfully", saleList: saleBillList});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

//------------ GET PURCHASE BY ID-----//
router.post("/getSaleById", async(req,res)=>{
        try {
            const salesBill = await SaleBillCreation.find({_id:req.body.id});
            if(!salesBill){
                return res.status(200).json({message:"No Sales were found"})
            }
            res.status(200).json({salesBill:salesBill});
        } catch (error) {
            res.status(500).json({message:'Internal server Error',error:error})
        }
    
    })

//----------CREATE PURCHASE------//
router.post("/addSalesBill", async(req,res)=>{
    try {
        // Create a new Date object
        const currentDate = new Date().toJSON().slice(0,10);
        const clientPhonenumber = await SaleClient.findOne({mobileNumber:req.body.clientInfo.mobileNumber,createdBy: req.doctor._id});
        let client ={};
        if (!clientPhonenumber) {
            // new Account Management
            client = await new SaleClient({
            clientName: req.body.clientInfo.clientName,
            mobileNumber: req.body.clientInfo.mobileNumber,
            address: req.body.clientInfo.address,
            clientGstin: req.body.clientInfo.clientGstin,
            createdDate: currentDate,
            createdBy: req.doctor._id,
        }).save();
        }
        else{
            client = await SaleClient.findOneAndUpdate(
                {mobileNumber:req.body.clientInfo.mobileNumber},
                {$set: req.body},
                {new: true}
                );
            
        }
        // new Account Management
        const purchaseBill = await new SaleBillCreation({
            invoiceInfo: req.body.invoiceInfo,
            clientInfo:client._id,
            clientGSTIN:client.clientGSTIN,
            soldBy: req.body.soldBy,
            medicinesInfo: req.body.medicinesInfo,
            petStoreItems: req.body.petStoreItems,
            consultationDetails: req.body.consultationDetails,
            createdDate: currentDate,
            createdBy: req.doctor._id,
        }).save();
        
        res.status(201).json({message:"sale bill added successfully",salesBill: purchaseBill});

    } catch(error) {
        res.status(500).json({message:'Internal server Error',error})
    }
})

//--------EDIT Purchase-----------//
router.put("/updatedSalesBill/:id", async(req, res)=>{
    try {
        const updatedPurchase = await SaleBillCreation.findOneAndUpdate(
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
router.delete("/deleteSales/:id", async(req,res)=>{
    try {
        const deletePurchase = await SaleBillCreation.findByIdAndDelete({
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
/***************************Consultation Bill Storage Start *******************************************/

// --------GET ALL Consultation-----------//
router.get("/getAllConsultation", async(req,res)=>{
    try {
        const consultations = await ConsultationDetails.find();
        if(!consultations){
            return res.status(200).json({message:"No Consultations were found"})
        }
        res.status(200).json({message:"fetched successfully", consultations: consultations});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

//------------ GET Consultation BY ID-----//
router.post("/getConsultationById", async(req,res)=>{
        try {
            const consultations = await ConsultationDetails.find({_id:req.body.id});
            if(!consultations){
                return res.status(200).json({message:"No Consultations were found"})
            }
            res.status(200).json({consultations:consultations});
        } catch (error) {
            res.status(500).json({message:'Internal server Error',error:error})
        }
    
    })

//----------CREATE CONSULTATION------//
router.post("/addConsultation", async(req,res)=>{
    try {
        // Create a new Date object
        const currentDate = new Date().toJSON().slice(0,10);
        const clientPhonenumber = await SaleClient.findOne({mobileNumber:req.body.consultation.clientInfo.mobileNumber,createdBy: req.doctor._id});
        let client ={};
        if (!clientPhonenumber) {
            // new Account Management
            client = await new SaleClient({
            clientName: req.body.consultation.clientInfo.clientName,
            mobileNumber: req.body.consultation.clientInfo.mobileNumber,
            address: req.body.consultation.clientInfo.address,
            clientGstin: req.body.consultation.clientInfo.clientGstin,
            createdDate: currentDate,
            createdBy: req.doctor._id,
        }).save();
        }
        else{
            client = await SaleClient.findOneAndUpdate(
                {mobileNumber:req.body.consultation.clientInfo.mobileNumber},
                {$set: req.body},
                {new: true}
                );
            
        }
        // new Account Management
        const consultations = await new ConsultationDetails({
            invoiceInfo: req.body.consultation.invoiceInfo,
            clientInfo: client._id,
            clientGSTIN: req.body.consultation.clientGSTIN,
            soldBy: req.body.consultation.soldBy,
            consultationDetails: req.body.consultation.consultationDetails,
            createdBy: req.doctor._id,
            createdDate: currentDate
        }).save();
        const clinic = await AccountManagement.find({createdBy: req.doctor._id,clinicType:'PET_CLINIC'});
   
        
        res.status(201).json({message:"consultations bill generated successfully",consultations: consultations,client,clinic});

    } catch(error) {
        res.status(500).json({message:'Internal server Error',error})
    }
})

/***************************Consulatation End*******************************************/
/***************************Medicine sale Start *******************************************/

// --------GET ALL Medicine Sale -----------//
router.get("/getAllMedicinesSale", async(req,res)=>{
    try {
        const medicineSale = await MedicineSale.find();
        if(!medicineSale){
            return res.status(200).json({message:"No Medicine Sale were found"})
        }
        res.status(200).json({message:"fetched successfully", medicineSale: medicineSale});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

//------------ GET Medicine bill BY ID-----//
router.post("/getMedicineSaleById", async(req,res)=>{
        try {
            const medicineSale = await MedicineSale.find({_id:req.body.id});
            if(!medicineSale){
                return res.status(200).json({message:"No medicine Sale were found"})
            }
            res.status(200).json({medicineSale:medicineSale});
        } catch (error) {
            res.status(500).json({message:'Internal server Error',error:error})
        }
    
    })

//----------CREATE Medicine bill------//
router.post("/addMedicineSales", async(req,res)=>{
    try {
        // Create a new Date object
        const currentDate = new Date().toJSON().slice(0,10);
        req.body.medicinesInfo.forEach(async product => {
            const productBatch = await Products.findOne({_id:product.productInfo});
            productBatch.availableQuantity = (parseInt(productBatch.availableQuantity)-parseInt(product.purchaseQuantity)).toString();
           const productsAdded = await Products.findOneAndUpdate(
                {_id:product.productInfo},
                {$set: productBatch},
                {new: true}
                ); 
        });
        const clientPhonenumber = await SaleClient.findOne({mobileNumber:req.body.clientInfo.mobileNumber,createdBy: req.doctor._id});
        let client ={};
        if (!clientPhonenumber) {
            // new Account Management
            client = await new SaleClient({
            clientName: req.body.clientInfo.clientName,
            mobileNumber: req.body.clientInfo.mobileNumber,
            address: req.body.clientInfo.address,
            clientGstin: req.body.clientInfo.clientGstin,
            createdDate: currentDate,
            createdBy: req.doctor._id,
        }).save();
        }
        else{
            client = await SaleClient.findOneAndUpdate(
                {mobileNumber:req.body.clientInfo.mobileNumber},
                {$set: req.body},
                {new: true}
                );
            
        }
        // new Account Management
        const medicineSale = await new MedicineSale({
            invoiceInfo: req.body.invoiceInfo,
            clientInfo: client._id,
            clientGSTIN: req.body.clientGSTIN,
            soldBy: req.body.soldBy,
            medicinesInfo: req.body.medicinesInfo,
            grandTotal: req.body.grandTotal,
            subtotal: req.body.subtotal,
            totalGst: req.body.totalGst, 
            createdBy: req.doctor._id,
            createdDate: currentDate
        }).save();
        const clinic = await AccountManagement.find({createdBy: req.doctor._id,clinicType:'PET_CLINIC'});
        res.status(201).json({message:"Medicine Sale generated successfully",medicineSale: medicineSale,clinic,client});

    } catch(error) {
        res.status(500).json({message:'Internal server Error',error})
    }
})

/***************************Medicine Sale End*******************************************/
/***************************Pet Store sale Start *******************************************/

// --------GET ALL Pet Store Sale -----------//
router.get("/getAllPetStoreSale", async(req,res)=>{
    try {
        const petStoreSale = await PetStoreSale.find();
        if(!petStoreSale){
            return res.status(200).json({message:"No Medicine Sale were found"})
        }
        res.status(200).json({message:"fetched successfully", petStoreSale: petStoreSale});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

//------------ GET Medicine bill BY ID-----//
router.post("/getPetStoreSaleById", async(req,res)=>{
        try {
            const petStoreSale = await PetStoreSale.find({_id:req.body.id});
            if(!petStoreSale){
                return res.status(200).json({message:"No medicine Sale were found"})
            }
            res.status(200).json({petStoreSale:petStoreSale});
        } catch (error) {
            res.status(500).json({message:'Internal server Error',error:error})
        }
    
    })

//----------CREATE Medicine bill------//
router.post("/addPetStoreSale", async(req,res)=>{
    try {
        // Create a new Date object
        const currentDate = new Date().toJSON().slice(0,10);
        req.body.petStoreItems.forEach(async product => {
            const productBatch = await Products.findOne({_id:product.productInfo});
            productBatch.availableQuantity = (parseInt(productBatch.availableQuantity)-parseInt(product.purchaseQuantity)).toString();
           const productsAdded = await Products.findOneAndUpdate(
                {_id:product.productInfo},
                {$set: productBatch},
                {new: true}
                ); 
        });
        const clientPhonenumber = await SaleClient.findOne({mobileNumber:req.body.clientInfo.mobileNumber,createdBy: req.doctor._id});
        let client ={};
        if (!clientPhonenumber) {
            // new Account Management
            client = await new SaleClient({
            clientName: req.body.clientInfo.clientName,
            mobileNumber: req.body.clientInfo.mobileNumber,
            address: req.body.clientInfo.address,
            clientGstin: req.body.clientInfo.clientGstin,
            createdDate: currentDate,
            createdBy: req.doctor._id,
        }).save();
        }
        else{
            client = await SaleClient.findOneAndUpdate(
                {mobileNumber:req.body.clientInfo.mobileNumber},
                {$set: req.body},
                {new: true}
                );
            
        }
        // new Account Management
        const petStoreSale = await new PetStoreSale({
            invoiceInfo: req.body.invoiceInfo,
            clientInfo: client._id,
            clientGSTIN: req.body.clientGSTIN,
            soldBy: req.body.soldBy,
            petStoreItems: req.body.petStoreItems,
            grandTotal: req.body.grandTotal,
            subtotal: req.body.subtotal,
            totalGst: req.body.totalGst,
            createdBy: req.doctor._id,
            createdDate: currentDate
        }).save();
        const clinic = await AccountManagement.find({createdBy: req.doctor._id,clinicType:'MEDI_STORE'});
        res.status(201).json({message:"Pet Store Items Sale generated successfully",petStoreSale: petStoreSale,clinic,client});

    } catch(error) {
        res.status(500).json({message:'Internal server Error',error})
    }
})
// --------GET ALL Pet Store Sale -----------//
router.get("/getInvoiceNumbersSale", async(req,res)=>{
    try {
        const petStoreSale = await PetStoreSale.find();
        const consultationSale = await ConsultationDetails.find();
        const medicineSale = await MedicineSale.find();
        const petLength = petStoreSale.length+1;
        const consultationLength = consultationSale.length+1;
        const medicineLength = medicineSale.length+1;
        const invoiceNumbers = {
            petInvoiceNumber: `PI-${petLength}`,
            consultationInvoiceNumber: `CI-${consultationLength}`,
            medicineInvoiceNumber:`MI-${medicineLength}`,
        }
        res.status(200).json({message:"fetched successfully", invoiceNumbers: invoiceNumbers});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

/***************************Medicine Sale End*******************************************/

export const salesBillRouter = router;