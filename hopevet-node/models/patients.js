import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema
const petSchema = new mongoose.Schema({
    petName:{
        type: String,
        trim: true
    },
    category:{
        type: String,
        trim: true
    },
    petAge:{
        type: String,
        trim: true
    },
    petAgeDetails:{
        type: String,
        trim:true
    },
    petWeight:{
        type: String,
        trim: true
    },
    // owner:{
    //     type: ObjectId,
    //     ref : "petOwners"
    // }

});
const petOwnerSchema = new mongoose.Schema({
    ownerName:{
        type: String,
        trim: true
    },
    phoneNumber:{
        type: Number,
        unique: true,
        required: true,
    },
    email:{
        type: String,        
        trim: true
    },
    address:{
        type: String,
        trim: true
    },
    petDetails:[petSchema],
    createdDate:{
      type: String,  
    },
    doctor:{
        type: ObjectId,
        ref : "doctors"
    }
});
const medicalRecordsSchema = new mongoose.Schema({
    prescriptionNumber:{
        type: String,
    },
    petOwnerDetails:{
        type: ObjectId,
        ref : "petOwners"
    },
    selectedPet:{
        type: petSchema,
    },
    vaccinationDetails:{
        vaccinated: Boolean,
        vaccinatedDate: String,
        nextVaccination: String,
    },
    visitedDate:{
        type: String,
    },
    medicalRecords:{
        medicine:[{
            medicine: String,
            dosage: String,
            duration: {
                morning: String,
                afternoon: String,
                evening: String,
                night: String, 
            },
        }],
        remarks:String
    },
    createMedicalRecord: Boolean,
    lastVaccinationDetails: String,
    doctor: {
        type: ObjectId,
        ref: "doctors"
    }

})
const Owner = mongoose.model('petOwners',petOwnerSchema);
const PetDetails = mongoose.model('petDetails',petSchema);
const MedicalRecords = mongoose.model('medicalRecords',medicalRecordsSchema);


export {Owner,PetDetails,MedicalRecords};