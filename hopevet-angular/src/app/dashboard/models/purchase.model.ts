export class PurchaseInvoiceModel{
    id!:string;
    purchaseBillInformation!:PurchaseBillInformationModel;
    itemsAdded!:ItemsToBeAddedModel[];
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
export interface PurchaseBillInformationModel{
    purchaseType: string,
    billDate: string,
    supplierName: string,
    paymentTerms: string,
    dueDate: string,
    placeOfSupply: string,
    purchaseBillNumber: string,
    purchaseOrderNumber: string,
    purchaseOrderDate: string,
    eWayBillNumber: string,
    id: string,
}
export interface ItemsToBeAddedModel{
    barcode:string,
    itemNumber:string,
    quantity: number,
    purchasePrice: string,
    discount: number,
    gst: number,
    mrp: string,
    unit: string,
    isClosed?: boolean,
    discountedPrice?: number,
    id: string,
}