export interface InvoiceInformation{
    invoiceDate: string,
    invoiceNumber: string,
    placeOfSupply: string,
    paymentMode:string,
    clientInfo: string,
    clientGSTIN: string,
    soldBy:string,
    medicinesInfo:[ItemsToBeAddedModel],
    petStoreItems:[ItemsToBeAddedModel],
    createdDate: string,
    consultationDetails:ConsulatationDetails,
    createdBy:string
}
export interface ItemsToBeAddedModel{
    productInfo: string,
    purchaseQuantity:string,
    totalAmount: string,
}
export interface ConsulatationDetails{
    quantity: Number,
    price: Number,
    totalPrice: Number
}
export interface ConsulatationModel{
    invoiceDate: string,
    invoiceNumber: string,
    placeOfSupply: string,
    paymentMode:string,
    clientInfo: string,
    clientGSTIN: string,
    soldBy:string,
    createdDate: string,
    consultationDetails:ConsulatationDetails,
    createdBy:string
}
export interface MedicinesInfoModel{
    invoiceDate: string,
    invoiceNumber: string,
    placeOfSupply: string,
    paymentMode:string,
    clientInfo: string,
    clientGSTIN: string,
    soldBy:string,
    createdDate: string,
    medicinesInfo:[ItemsToBeAddedModel],
    createdBy:string
}
export interface PetStoreItemsModel{
    invoiceDate: string,
    invoiceNumber: string,
    placeOfSupply: string,
    paymentMode:string,
    clientInfo: string,
    clientGSTIN: string,
    soldBy:string,
    createdDate: string,
    petStoreItems:[ItemsToBeAddedModel],
    createdBy:string
}