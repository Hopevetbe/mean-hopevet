import express from "express";
import {MedicineSale,PetStoreSale,ConsultationDetails} from "../models/sales-bill.js";
import {PurchaseBillCreation} from "../models/purchase-bill.js";
import {MedicalRecords} from "../models/patients.js";
import {Products} from "../models/product.js";
const router = express.Router();

// --------GET ALL PURCHASE-----------//
// router.get("/getTodayAndYesterdayCounts", async(req,res)=>{
//     try {
//         // Get today's count
//        // const todayStart = new Date().toJSON().slice(0,10);
//         const startDate = '2024-03-01'; // Assuming 'YYYY-MM-DD' format
//         const endDate = '2024-03-31'; // Assuming 'YYYY-MM-DD' format
//        // todayStart.setDate(todayStart.getDate());
//        // todayStart.setHours(0, 0, 0, 0);

//         // const yesterdayStart = new Date(todayStart);
//         // yesterdayStart.setDate(todayStart.getDate() - 1);

//         // const yesterdayEnd = new Date(todayStart);
//         // yesterdayEnd.setMilliseconds(yesterdayEnd.getMilliseconds() - 1);
//         console.log(startDate,endDate);
//         const saleCountToday= MedicineSale.find({ 
//             createdDate: startDate});
//            // console.log(saleCountToday);
//        // const saleCountToday= ConsultationDetails.countDocuments({ createdDate: todayStart })
//         // const saleBillList = await SaleBillCreation.find();
//         if(!saleCountToday){
//             return res.status(200).json({message:"No Sales were found"})
//         }
//         res.status(200).json({message:"fetched successfully", saleCountToday: saleCountToday});
//     } catch (error) {
//         res.status(500).json({message:'Internal server Error',error:error})
//     }
// })
router.get("/getAllCounters", async(req,res)=>{
    try {
        // const currentDate = new Date();
        // const todayStart = new Date().toJSON().slice(0,10);
        // const endDate = currentDate.setDate(currentDate.getDate() - 1);
        // const yesterdayEnd = endDate.toJSON().slice(0,10);
        // console.log(yesterdayEnd);
        // Define start and end dates
        const startDate = '2024-03-01'; // Assuming 'YYYY-MM-DD' format
        const endDate = '2024-03-31'; // Assuming 'YYYY-MM-DD' format
        const counting = await MedicineSale.find({createdDate:{
            $gte: startDate, // Greater than or equal to start date
            
            $lte: endDate 
        }});
        if(!counting){
            return res.status(200).json({message:"No counting were found"})
        }
        res.status(200).json({message:"fetched successfully", counting: counting});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})
router.post("/getTodayAndYesterdayCounts", async(req,res)=>{
    try {
        const todayDate = req.body.todayDate; // Assuming 'YYYY-MM-DD' format
        const yesterdayDate = req.body.yesterdayDate; // Assuming 'YYYY-MM-DD' format
        const threeMonthsDate = req.body.threeMonthDate;
        const medicineSaleToday = await MedicineSale.find({createdDate:todayDate,createdBy:req.doctor._id});
        const medicineSaleYesterday = await MedicineSale.find({createdDate:yesterdayDate,createdBy:req.doctor._id});
        
        const petStoreSaleToday = await PetStoreSale.find({createdDate:todayDate,createdBy:req.doctor._id});
        const petStoreSaleYesterday = await PetStoreSale.find({createdDate:yesterdayDate,createdBy:req.doctor._id});
       

        const consultationAmountToday = await ConsultationDetails.find({createdDate:todayDate,createdBy:req.doctor._id});
        const consultationAmountYesterday = await ConsultationDetails.find({createdDate:yesterdayDate,createdBy:req.doctor._id});
        

        const purchaseToday = await PurchaseBillCreation.find({createdDate:todayDate,createdBy:req.doctor._id});
        const purchaseYesterday = await PurchaseBillCreation.find({createdDate:yesterdayDate,createdBy:req.doctor._id});
        
        
        const casesToday = await MedicalRecords.find({visitedDate:todayDate,doctor:req.doctor._id});
        const casesYesterday = await MedicalRecords.find({visitedDate:yesterdayDate,doctor:req.doctor._id});
        
        let medicineSaleTodayAmount=0;
        if(medicineSaleToday && medicineSaleToday.length>0){
            medicineSaleToday.forEach((medicine)=>{
                medicineSaleTodayAmount += parseInt(medicine.grandTotal);
            });
        }
        let medicineSaleYesterdayAmount=0;
        if(medicineSaleYesterday && medicineSaleYesterday.length>0){
            medicineSaleYesterday.forEach((medicine)=>{
                medicineSaleYesterdayAmount += parseInt(medicine.grandTotal);
            });
        }
        let petStoreSaleTodayAmount=0;
        if(petStoreSaleToday && petStoreSaleToday.length>0){
            petStoreSaleToday.forEach((medicine)=>{
                petStoreSaleTodayAmount += parseInt(medicine.grandTotal);
            });
        }
        let petStoreSaleYesterdayAmount=0;
        if(petStoreSaleYesterday && petStoreSaleYesterday.length>0){
            petStoreSaleYesterday.forEach((medicine)=>{
                petStoreSaleYesterdayAmount += parseInt(medicine.grandTotal);
            });
        }
        let consultationTodayAmount=0;
        if(consultationAmountToday && consultationAmountToday.length>0){
            consultationAmountToday.forEach((medicine)=>{
                consultationTodayAmount += medicine.consultationDetails.totalPrice;
            });
        }
        let consultationYesterdayAmount=0;
        if(consultationAmountYesterday && consultationAmountYesterday.length>0){
            consultationAmountYesterday.forEach((medicine)=>{
                consultationYesterdayAmount += medicine.consultationDetails.totalPrice;
            });
        }
        let purchaseTodayAmount=0;
        if(purchaseToday && purchaseToday.length>0){
            purchaseToday.forEach((medicine)=>{
                purchaseTodayAmount += parseInt(medicine.totalBillAmount);
            });
        }
        let purchaseYesterdayAmount=0;
        if(purchaseYesterday && purchaseYesterday.length>0){
            purchaseYesterday.forEach((medicine)=>{
                purchaseYesterdayAmount += parseInt(medicine.totalBillAmount);
            });
        }

        let totalCasesToday=0;
        let totalVaccinationToday = 0;
        if(casesToday && casesToday.length>0){
            casesToday.forEach((medicine)=>{
                if(medicine.medicalRecords.medicine.length >0){
                totalCasesToday += 1;
                if(medicine.vaccinationDetails.vaccinated) totalVaccinationToday +=1;
                }
            });
        }
        let totalCasesYesterday=0;
        let totalVaccinationYesterday = 0;
        if(casesYesterday && casesYesterday.length>0){
            casesYesterday.forEach((medicine)=>{
                if(medicine.medicalRecords.medicine.length >0){
                    totalCasesYesterday += 1;
                    if(medicine.vaccinationDetails.vaccinated) totalVaccinationYesterday +=1;
                }
            });
        }
        const medicineSale ={medicineSaleTodayAmount,medicineSaleYesterdayAmount};
        const petStoreSale ={petStoreSaleTodayAmount,petStoreSaleYesterdayAmount};
        const purchase ={purchaseTodayAmount,purchaseYesterdayAmount};
        const consultationAmount ={consultationTodayAmount,consultationYesterdayAmount};
        const cases ={totalCasesToday,totalVaccinationToday,totalCasesYesterday,totalVaccinationYesterday};
        const stocks = await Products.find({expDate:{
            $gte: todayDate,            
            $lte: threeMonthsDate 
        },createdBy:req.doctor._id}).sort({ expDate: 1 });
        const counting = {
            medicineSale,petStoreSale,consultationAmount,purchase,cases,stocks
        }


        if(!counting){
            return res.status(200).json({message:"No counting were found"})
        }
        res.status(200).json({message:"fetched successfully", counting: counting});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})
// Reports
router.post("/getAllReports", async(req,res)=>{
    try {
       console.log(req.body);
        const startDate = req.body.startDate; // Assuming 'YYYY-MM-DD' format
        const endDate = req.body.endDate; // Assuming 'YYYY-MM-DD' format
        let counting={};
        if(req.body.reportType === 'Petstore_Purchase_Report'){
           const firstFilter = await PurchaseBillCreation.find({createdDate:{
                $gte: startDate,            
                $lte: endDate 
            },createdBy:req.doctor._id}).populate('purchaseBillInfo.supplier', "companyName mobileNumber");
           counting = firstFilter.filter((item)=>item.purchaseBillInfo.purchaseType === 'MEDI_STORE'); 
        }
        if(req.body.reportType === 'Medicine_Purchase_Report'){
            const firstFilter = await PurchaseBillCreation.find({createdDate:{
                 $gte: startDate,            
                 $lte: endDate 
             },createdBy:req.doctor._id}).populate('purchaseBillInfo.supplier', "companyName mobileNumber");
             counting = firstFilter.filter((item)=>item.purchaseBillInfo.purchaseType === 'PET_CLINIC');
         }
        if(req.body.reportType === 'Medicine_Sales_Report'){
            counting = await MedicineSale.find({createdDate:{
                $gte: startDate,            
                $lte: endDate 
            },createdBy:req.doctor._id}).populate('clientInfo medicinesInfo.productInfo',"clientName mobileNumber itemName gst");
        }
        if(req.body.reportType === 'Petstore_Sales_Report'){            
            counting = await PetStoreSale.find({createdDate:{
                $gte: startDate,            
                $lte: endDate 
            },createdBy:req.doctor._id}).populate('clientInfo petStoreItems.productInfo',"clientName mobileNumber itemName gst");
        }
        if(req.body.reportType === 'Customer_Report' || req.body.reportType === 'Vaccination_Report'){            
            counting = await MedicalRecords.find({visitedDate:{
                $gte: startDate,            
                $lte: endDate 
            },doctor:req.doctor._id}).populate('petOwnerDetails',"ownerName phoneNumber");
        }
        if(req.body.reportType === 'Stock_Report'){            
            counting = await Products.find({createdBy:req.doctor._id});
        }
        if(!counting){
            return res.status(200).json({message:"No counting were found"})
        }
        res.status(200).json({message:"fetched successfully", counting: counting, reportType: req.body.reportType});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})
// Stocks
router.get("/getNearestExpiryItem", async(req,res)=>{
    try {
       const stocks = await Products.find({createdBy:req.doctor._id}).sort({ expDate: 1 });
        if(!stocks){
            return res.status(200).json({message:"No stocks were found"})
        }
        res.status(200).json({message:"fetched successfully", stocks: stocks});
    } catch (error){
        res.status(500).json({message:'Internal server Error',error:error})
    }
})
export const countersRouter = router;