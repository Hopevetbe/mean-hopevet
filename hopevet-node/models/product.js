import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema
const productSchema = new mongoose.Schema(
    {
        itemName:{
            type: String,
            trim: true
        },
        batch:{
            type: String,
            trim: true,
            unique: true,
        },
        barcode:String,
        gst: String,
        sch: String,
        mktBy: String,
        availableQuantity: String,
        hsn: String,
        mrp: String,
        expDate: String,
        pack: String,
        unitPrice: String, 
        itemType: String,
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

const Products = mongoose.model('products',productSchema);

export {Products};