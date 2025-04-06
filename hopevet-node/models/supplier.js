import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema
const supplierSchema = new mongoose.Schema(
    {
        companyName:{
            type: String,
            trim: true,
            unique:true,
        },
        address:{
            type: String,
            trim: true
        },
        city:{
            type: String,
            trim: true
        },
        state:{
            type: String,
            trim: true
        },
        country:{
            type: String,
            trim: true
        },
        pincode:{
            type: String,
            trim: true
        },
        email:{
            type: String,
            trim: true
        },
        mobileNumber:{
            type: Number,
            required: true,
        },
        gstin: String,
        createdDate:{
            type: String,
        },
        createdBy:{
            type: ObjectId,
            ref : "doctors"
        },
    }
)

const Suppliers = mongoose.model('suppliers',supplierSchema);

export {Suppliers};