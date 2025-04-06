import express from "express";
import { v4 as uuidv4 } from 'uuid';
import { Owner,PetDetails,MedicalRecords } from "../models/patients.js";
import {AccountManagement} from "../models/account-management.js";
import {Doctor} from "../models/doctors.js";

const router = express.Router();

function generatePrescriptionNumber() {
  return `RX-${uuidv4()}`;
}


/***************************Owner Storage Start *******************************************/

// --------GET ALL OWNERS-----------//
router.get("/getAllPetOwners", async(req,res)=>{
    try {
        const allOwners = await Owner.find({doctor: req.doctor._id});
        if(!allOwners){
            return res.status(200).json({message:"No Owners were found"})
        }
        res.status(200).json({message:"fetched successfully", petOwnerList: allOwners});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

//------------ GET OWNER BY ID-----//
router.post("/getOwnerById", async(req,res)=>{
        try {
            const owner = await Owner.findOne({_id:req.body.id});
            const ownerPetDetails = await PetDetails.find({owner: req.body.id});
            if(!owner){
                return res.status(200).json({message:"No Owners were found"})
            }
            res.status(200).json({ownerDetails:owner,ownerPetDetails: ownerPetDetails});
        } catch (error) {
            res.status(500).json({message:'Internal server Error',error:error})
        }
    
    })

//----------CREATE OWNERS------//
router.post("/addPetOwner", async(req,res)=>{
    try {
        // Create a new Date object
        const currentDate = new Date().toJSON().slice(0,10);
        // new Account Management
        const petOwner = await new Owner({
            ownerName: req.body.ownerDetails.ownerName,
            phoneNumber: req.body.ownerDetails.phoneNumber,
            address: req.body.ownerDetails.address,
            email: req.body.ownerDetails.email,
            petDetails: req.body.petDetails,
            createdDate: currentDate,
            doctor: req.doctor._id,
        }).save();
        
        res.status(201).json({message:"pet owner added successfully",data: petOwner});

    } catch(error) {
        res.status(500).json({message:'Internal server Error',error})
    }
})

//--------EDIT OWNER-----------//
router.put("/updatedPetOwner/:id", async(req, res)=>{
    try {
        const updatedPet = await Owner.findOneAndUpdate(
            {_id:req.params.id},
            {$set: req.body},
            {new: true}
            )
            if(!updatedPet){
                return res.status(200).json({message:"something went wrong"})
            }
            res.status(200).json({data:updatedPet});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})
//------ DELETE OWNER-------//
router.delete("/deletePetOwner/:id", async(req,res)=>{
    try {
        const deletePetOwner = await Owner.findByIdAndDelete({
            _id: req.params.id
        })
        if(!deletePetOwner){
            return res.status(200).json({message:"something went wrong"})
        }
        res.status(200).json({message:"data deleted successfully"});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

/***************************Owner Storage End*******************************************/

/********************MEDICAL RECORD START ***********************************/
    //-----------GET ALL MEDICAL RECORDS-----------//
router.get("/getAllMedicalRecords", async(req,res)=>{
    try {
        const allMedicalRecords = await MedicalRecords.find({doctor: req.doctor._id});
        if(!allMedicalRecords){
            return res.status(200).json({message:"No Medical Records were found"})
        }
        res.status(200).json({message:"fetched successfully", medicalRecordsList: allMedicalRecords});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})

//------------ GET MEDICAL RECORDS BY PET ID-----//
router.post("/getMedicalRecordsByPetId", async(req,res)=>{
    try {
        let filters = {};

         if(req.body.id){
            filters['selectedPet._id'] = req.body.id;
            filters['createMedicalRecord'] = true;
         } 
        const petMedicalRecords = await MedicalRecords.find(filters);
        if(!petMedicalRecords){
            return res.status(200).json({message:"No Medical Records were found"})
        }
        res.status(200).json({petMedicalRecords:petMedicalRecords});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }

})
//----------CREATE Medical Records------//
router.post("/addMedicalRecord", async(req,res)=>{
    try {
        // Create a new Date object
        const visitedDate = new Date().toJSON().slice(0,10);
        // new Account Management
        const medicalRecord = await new MedicalRecords({
            prescriptionNumber: req.body.prescriptionNumber,
            petOwnerDetails: req.body.ownerid,
            selectedPet: req.body.selectedPet,
            vaccinationDetails: req.body.vaccinationDetails,
            medicalRecords: req.body.medicalRecords,
            createMedicalRecord: req.body.createMedicalRecord,
            visitedDate: visitedDate,
            doctor: req.doctor._id,
        }).save();
        
        res.status(201).json({message:"medical records added successfully",data: medicalRecord});

    } catch(error) {
        res.status(500).json({message:'Internal server Error',error})
    }
})
/********************MEDICAL RECORD END***********************************/

/***************************Create Prescription***************************************/
router.post("/createPrescription", async(req,res)=>{
    try {
        // Create a new Date object
        const currentDate = new Date().toJSON().slice(0,10);
        const ownerPhonenumber = await Owner.findOne({phoneNumber:req.body.ownerDetails.phoneNumber,doctor: req.doctor._id});
        let petOwner ={};
        if (!ownerPhonenumber) {
            // new Account Management
        petOwner = await new Owner({
            ownerName: req.body.ownerDetails.ownerName,
            phoneNumber: req.body.ownerDetails.phoneNumber,
            address: req.body.ownerDetails.address,
            email: req.body.ownerDetails.email,
            petDetails: req.body.petDetails,
            createdDate: currentDate,
            doctor: req.doctor._id,
        }).save();
        }
        else{
            petOwner = await Owner.findOneAndUpdate(
                {phoneNumber:req.body.ownerDetails.phoneNumber},
                {$set: req.body},
                {new: true}
                );
            
        }
        const selectedPet = petOwner.petDetails[req.body.selectedPetIndex];
        let filters = {};

         
            filters['selectedPet._id'] = selectedPet._id;
            filters['createMedicalRecord'] = true;
          
        const petMedicalRecords = await MedicalRecords.find(filters);
        const lastVaccination= petMedicalRecords.length? petMedicalRecords[petMedicalRecords.length-1].vaccinationDetails.vaccinatedDate:'';
        // Create a new Date object
        const visitedDate = new Date().toJSON().slice(0,10);
        // new Account Management
        const prescriptionDetails = await new MedicalRecords({
            prescriptionNumber: generatePrescriptionNumber(),
            petOwnerDetails: petOwner._id,
            selectedPet: selectedPet,
            vaccinationDetails: {},
            medicalRecords: {},            
            createMedicalRecord: req.body.createMedicalRecord,
            lastVaccinationDetails:lastVaccination,
            visitedDate: visitedDate,
            
            doctor: req.doctor._id,
        }).save();
        res.status(201).json({message:"medical records added successfully",data: prescriptionDetails,petOwner});

    } catch(error) {
        res.status(500).json({message:'Internal server Error',error})
    }
})
router.put("/updatePrescription/:id", async(req, res)=>{
    try {
        const updatePrescription = await MedicalRecords.findOneAndUpdate(
            {_id:req.params.id},
            {$set: req.body},
            {new: true}
            )
            const clinic = await AccountManagement.find({createdBy: req.doctor._id,clinicType:'PET_CLINIC'});
            const doctor = await Doctor.findOne({_id:req.doctor._id});
            if(!updatePrescription){
                return res.status(200).json({message:"something went wrong"})
            }
            res.status(200).json({data:updatePrescription,clinic,doctor});
    } catch (error) {
        res.status(500).json({message:'Internal server Error',error:error})
    }
})


// router.get("/getAllPatients", async(req,res)=>{
//     try {
//         const allPatients = await Patients.find().populate("doctor", "name email mobileNumber");
//         if(!allPatients){
//             return res.status(200).json({message:"No Patients were found"})
//         }
//         res.status(200).json({message:"fetched successfully", patientList: allPatients});
//     } catch (error) {
//         res.status(500).json({message:'Internal server Error',error:error})
//     }
// })

// router.get("/getPatientsById", async(req,res)=>{
//     try {
//         const patient = await Patients.find({doctor: req.user._id});
//         if(!patient){
//             return res.status(200).json({message:"No Patients were found"})
//         }
//         res.status(200).json({data:patient});
//     } catch (error) {
//         res.status(500).json({message:'Internal server Error',error:error})
//     }

// })
// router.put("/editPatient/:id", async(req, res)=>{
//     try {
//         const updatedPatient = await Patients.findOneAndUpdate(
//             {_id:req.params.id},
//             {$set: req.body},
//             {new: true}
//             )
//             if(!updatedPatient){
//                 return res.status(200).json({message:"something went wrong"})
//             }
//             res.status(200).json({data:updatedPatient});
//     } catch (error) {
//         res.status(500).json({message:'Internal server Error',error:error})
//     }
// })
// router.post("/addPatient", async(req,res)=>{
//     try {
//         const currentDate = new Date().toJSON().slice(0,10);
//         const petData = req.body;
//         const newPet = new Patients(petData);
//         const savedPet = await newPet.save();
//         // const patient = await new Patients({...req.body, createdDate:currentDate, doctor: req.user._id}).save();
//         console.log(savedPet);
//         res.status(201).json({message:"patients added successfully",data: savedPet});

//     } catch(error) {
//         res.status(500).json({message:'Internal server Error',error})
//     }
// })
// router.post("/createPatient", async(req,res)=>{
//     try {
//         // Create a new Date object
//         const currentDate = new Date().toJSON().slice(0,10);
//         // new Account Management
//         const pet = await new AccountManagement({
//             legalName: req.body.legalName,
//             tradeName: req.body.tradeName,
//             address: req.body.address,
//             panNo: req.body.panNo,
//             gstn: req.body.gstn,
//             email: req.body.email,
//             mobileNumber: req.body.mobileNumber,
//             clinicType: req.body.clinicType,
//             createdDate: currentDate,
//             createdBy: req.doctor._id,
//         }).save();
//         res.status(201).json({message:"successfully added clinic", medistore}) 
//     } catch (error) {
//          res.status(500).json({message:'Internal server Error',error})
//     }
// })

// router.delete("/deletePatient/:id", async(req,res)=>{
//     try {
//         const deletePatient = await Patients.findByIdAndDelete({
//             _id: req.params.id
//         })
//         if(!deletePatient){
//             return res.status(200).json({message:"something went wrong"})
//         }
//         res.status(200).json({message:"data deleted successfully"});
//     } catch (error) {
//         res.status(500).json({message:'Internal server Error',error:error})
//     }
// })

export const patientRouter = router;