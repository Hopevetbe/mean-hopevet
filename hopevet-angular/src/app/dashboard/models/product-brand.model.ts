export class ProductBrand{
    _id!:string;
    group!:string;
    brand!:string;
    barcode!: string;
    itemNumber!: String;
    mrp!: String;
    purchasePrice!: String;
    pack!: String;
    clinicType!: String;     
    createdDate!:string;
    rackNo!:string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
export class SupplierModel{
    _id!:string;
    companyName!: string;
      address!: string;
      city!: string;
      state!: string;
      country!: string;
      pincode!: string;
      email!: string;
      mobileNumber!: string;
      gstin!:string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}