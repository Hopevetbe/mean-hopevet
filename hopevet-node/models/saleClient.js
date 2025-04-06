import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema
const saleClientSchema = new mongoose.Schema(
    {
        clientName:{
            type: String,
        },
        mobileNumber:{
            type: String,
            trim: true,
            unique:true,
        },
        address:{
            type: String,
            trim: true
        },
        clientGstin:{
            type: String,
            trim: true
        },
        createdDate:{
            type: String,
        },
        createdBy:{
            type: ObjectId,
            ref : "doctors"
        },
    }
)

const SaleClient = mongoose.model('saleClient',saleClientSchema);

export {SaleClient};