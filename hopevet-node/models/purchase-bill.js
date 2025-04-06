import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema
const purchaseBillSchema = new mongoose.Schema({
    purchaseType:{
        type: String,
        trim: true
    },
    billDate:{
        type: String,
        trim: true
    },
    supplier:{
       // type: String,
       type: ObjectId,
       ref : "suppliers"
    },
    paymentTerms:{
        type: String
    },
    dueDate:{
        type: String
    },
    placeOfSupply:{
        type: String  
    },
    purchaseOrderNumber:{
        type: String
    },
    purchaseOrderDate:{
        type: String
    },
    eWayBillNumber:{
        type: String
    }
});
const itemsToBeAddedSchema = new mongoose.Schema({
    barcode:{
        type: String,
        trim: true
    },
    mktBy:{
        type: String,
    },
    itemName:{
        type: String,
    },
    expDate:{
        type: String,
    },
    unitPrice: String,
    pack:{
      type: String,  
    },
    quantity:{
        billingQuantity: String,
        freeQuantity: String,
    },
    batch:{
        type: String,
    },
    hsn:{
        type: String,
    },
    purchasePrice:{
        type: String,
    },
    discount:{
        type: String,
    },
    sch:{
        type: String,
    },
    gst:{
        type: String,
    },
    mrp:{
        type: String,
    },
    value:{
        type: String,
    },
    taxableValue:{
        type: String
    },
    totalAmount:{
        type: String
    },
    rackNo: String,
});
const purchaseInvoiceSchema = new mongoose.Schema({
    purchaseBillInfo:{
        type: purchaseBillSchema,
    },
    itemsList:[itemsToBeAddedSchema],
    createdDate:String,
    totalBillAmount:String,
    createdBy:{
        type: ObjectId,
        ref : "doctors"
    },

})
const PurchaseBillCreation = mongoose.model('purchaseInformation',purchaseInvoiceSchema);


export {PurchaseBillCreation};