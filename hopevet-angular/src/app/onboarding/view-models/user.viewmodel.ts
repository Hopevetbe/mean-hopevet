export class ClinicViewModel{
    _id!:string;
    // legalName!: string;
    // tradeName!: string;
    // address!: string;
    // panNo!: string;
    // gstn!: string;
    userName!: string;
    doctorName!:string;
    email!:string;
    mobileNumber!:number;
    password!:string;
   // profileImage!: string;
    isAdmin!: boolean;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}