import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;
const itemsToBeAddedSchema = new mongoose.Schema({
    productInfo: {
        type:ObjectId,
        ref:"products"
    },
    purchaseQuantity:String,
    totalAmount: String,
});
const salesBillSchema = new mongoose.Schema({
    invoiceInfo:{
        invoiceNumber: String,
        invoiceDate:String,
        placeOfSupply: String,
        paymentMode:String,
    },
    clientInfo:{
        type: ObjectId,
        ref : "saleClient"
    },
    clientGSTIN: String,
    soldBy:String,
    medicinesInfo:[itemsToBeAddedSchema],
    petStoreItems:[itemsToBeAddedSchema],
    createdDate: String,
    consultationDetails:{
        quantity: Number,
        price: Number,
        totalPrice: Number
    },    
    createdBy:{
        type: ObjectId,
        ref : "doctors"
    }    
});
const consultationDetailsSchema = new mongoose.Schema({
    invoiceInfo:{
        invoiceNumber: String,
        invoiceDate:String,
        placeOfSupply: String,
        paymentMode:String,
    },
    clientInfo:{
        type: ObjectId,
        ref : "saleClient"
    },
    clientGSTIN: String,
    soldBy:String,
    consultationDetails:{
        quantity: Number,
        price: Number,
        totalPrice: Number
    },        
    createdBy:{
        type: ObjectId,
        ref : "doctors"
    },
    createdDate: String,
});
const medicineSaleSchema = new mongoose.Schema({
    invoiceInfo:{
        invoiceNumber: String,
        invoiceDate:String,
        placeOfSupply: String,
        paymentMode:String,
    },
    clientInfo:{
        type: ObjectId,
        ref : "saleClient"
    },
    clientGSTIN: String,
    soldBy:String,
    medicinesInfo:[itemsToBeAddedSchema], 
    grandTotal: String,
    subtotal: String,
    totalGst: String,       
    createdBy:{
        type: ObjectId,
        ref : "doctors"
    },
    createdDate: String,
});
const petStoreSaleSchema = new mongoose.Schema({
    invoiceInfo:{
        invoiceType: String,
        invoiceNumber: String,
        date:String,
        placeOfSupply: String,
        paymentMode:String,
    },
    clientInfo:{
        type: ObjectId,
        ref : "saleClient"
    },
    clientGSTIN: String,
    soldBy:String,
    petStoreItems:[itemsToBeAddedSchema],
    grandTotal: String,
    subtotal: String,
    totalGst: String,        
    createdBy:{
        type: ObjectId,
        ref : "doctors"
    },
    createdDate: String,
});

const SaleBillCreation = mongoose.model('salesInformation',salesBillSchema);
const ConsultationDetails = mongoose.model('consultationDetails',consultationDetailsSchema);
const MedicineSale = mongoose.model('medicineSale',medicineSaleSchema);
const PetStoreSale = mongoose.model('petStoreSale',petStoreSaleSchema);


export {SaleBillCreation,ConsultationDetails,MedicineSale,PetStoreSale};