import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema
const brandProductSchema = new mongoose.Schema(
    {
        group:{
            type: String,
            trim: true
        },
        brand:{
            type: String,
            trim: true,
        },
        barcode: {
            type:String,
            trim: true,            
            unique: true,
        },
        itemNumber: String,
        mrp: String,
        purchasePrice: String,
        pack: String,
        clinicType: String, 
        rackNo: String,     
        createdDate:{
            type: String,
        },
        createdBy:{
            type: ObjectId,
            ref : "doctors"
        },
        
    }
)

const BrandProductS = mongoose.model('brandProducts',brandProductSchema);

export {BrandProductS};