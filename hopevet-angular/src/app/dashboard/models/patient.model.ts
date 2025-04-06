export class PatientModel{
    _id!:string;
    ownerName!: string;
    email!: string;
    address!: string;
    phoneNumber!: string;
    createdBy!: string;
    createdDate!:string;
    updatedBy!: string;
    lastupdatedDate!: string;    
    petDetails!: [PetDetails];
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
export interface PetDetails{
    category: string,
    petName: string,
    petWeight: string,
    petAge: string,
    petAgeDetails: string,
    petImage: string,
    id: string,
    isOpen?: boolean,
}
export class VaccinationModel{
    vaccinatedDate!: string;
    nextVaccination!: string;
    vaccinated!: boolean;
    
}
export class CasePrescriptionModel{
    remarks!: string;
    medicines!: [MedicineModel];
}
export class MedicineModel{
    medicine!: string;
    dosage!: string;
    duration!: Duration;
    isShow?:boolean;
}
export class MedicalRecordModel{
    prescriptionNumber!: string;
    petOwnerDetails!: string;
    selectedPet!: PetDetails;
    vaccinationDetails!: VaccinationModel;
    medicalRecords!: CasePrescriptionModel;
}
export class Duration{
    
        morning!:string;
        afternoon!:string;
        evening!: string;
        night!: string;
    
}