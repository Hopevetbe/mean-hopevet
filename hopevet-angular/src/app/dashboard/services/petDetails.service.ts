import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthServiceService } from "src/app/onboarding/services/auth-service.service";
import { environment } from "src/environment/environment";
import { MedicalRecordModel, PatientModel, PetDetails } from "../models/patient.model";

@Injectable({ providedIn: 'root'})
export class PetDetailsService{
    constructor(private readonly httpClient:HttpClient, private readonly authService:AuthServiceService){}
    baseUrl: string = environment.apiBaseUrl;

    //savePetDetailsUrl: string = this.baseUrl + '/patients/addPetOwner';
    savePetDetailsUrl: string = this.baseUrl + '/patients/createPrescription';
    updatePetDetailsUrl: string = this.baseUrl + '/patients/updatePrescription/';
    deletePetDetailsUrl: string = this.baseUrl + '/patients/deletePetOwner/';
    getAllPetDetailsUrl: string = this.baseUrl + '/patients/getAllPetOwners';
    getPetDetailsByOwnerIdUrl: string = this.baseUrl+ '/patients/getOwnerById';
    savePetDetails(MedicalRecordDetail:PatientModel,selectedPetIndex: number |undefined) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        // pet saving 
        const petOwner = {
            ownerDetails: {
                ownerName: MedicalRecordDetail.ownerName,
                email: MedicalRecordDetail.email,
                phoneNumber: MedicalRecordDetail.phoneNumber,
                address: MedicalRecordDetail.address,
            },
            petDetails: this.mapPetDetails(MedicalRecordDetail.petDetails),
            selectedPetIndex: selectedPetIndex,
            createMedicalRecord: false,
        }
        return this.httpClient.post(this.savePetDetailsUrl, petOwner, { headers: reqHeader });
    }
    updateSavedPetDetails(MedicalRecordDetail:PatientModel,selectedPetIndex:  number |undefined,owner:any){
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        const petOwner = {
            ownerDetails: {
                ownerName: MedicalRecordDetail.ownerName,
                email: MedicalRecordDetail.email,
                phoneNumber: MedicalRecordDetail.phoneNumber,
                address: MedicalRecordDetail.address,
            },
            petDetails: this.mapSavedPetDetails(MedicalRecordDetail.petDetails),
            selectedPetIndex: selectedPetIndex,
            createMedicalRecord: false,
            id:owner._id,
        }
        return this.httpClient.post(this.savePetDetailsUrl, petOwner, { headers: reqHeader });
    }

    updatePetDetails(MedicalRecordDetail:any,id:string) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.put(this.updatePetDetailsUrl +id,MedicalRecordDetail, { headers: reqHeader });
    }
    

    deletePetDetails(MedicalRecordId:number) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.delete(this.deletePetDetailsUrl + MedicalRecordId, { headers: reqHeader });
    }

    getAllPetDetails() {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.get(this.getAllPetDetailsUrl, { headers: reqHeader });
    }
    getPetDetailsByOwnerId(petId: string) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        const body ={id:petId};
        return this.httpClient.post(this.getPetDetailsByOwnerIdUrl,body, { headers: reqHeader });
    }
    mapPetDetails(petDetails:PetDetails[]){
        let mappedPetDetails: { petName: string; category: string; petAge: string; petWeight: string; }[]=[];
        petDetails.forEach((petDetail:PetDetails)=>{
            const mappingData = {
                petName: petDetail.petName,
                category: petDetail.category,
                petAge: petDetail.petAge,
                petAgeDetails:petDetail.petAgeDetails,
                petWeight: petDetail.petWeight
            }
            mappedPetDetails.push(mappingData);
        })
        return mappedPetDetails;
    }
    mapSavedPetDetails(petDetails:PetDetails[]){
        let mappedPetDetails: { petName: string; category: string; petAge: string;petAgeDetails:string; petWeight: string; id:string}[]=[];
        let mappingData:any;
        petDetails.forEach((petDetail:PetDetails)=>{
            if (petDetail.id){
                mappingData = {
                    petName: petDetail.petName,
                    category: petDetail.category,
                    petAge: petDetail.petAge,
                    petAgeDetails: petDetail.petAgeDetails,
                    petWeight: petDetail.petWeight,
                    id: petDetail.id,
                }
            }else{
                mappingData = {
                    petName: petDetail.petName,
                    category: petDetail.category,
                    petAge: petDetail.petAge,
                    petAgeDetails: petDetail.petAgeDetails,
                    petWeight: petDetail.petWeight,
                }
            }
            
            mappedPetDetails.push(mappingData);
        })
        return mappedPetDetails;
    }
}