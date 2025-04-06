export class AccountManagementModel{
    _id!:string;
    legalName!: string;
    tradeName!:string;
    panNo!:string;
    gstn!:string;
    email!: string;
    address!: string;
    mobileNumber!: string;
    createdBy!: string;
    createdDate!:string;
    clinicType!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}