import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthServiceService } from "src/app/onboarding/services/auth-service.service";
import { environment } from "src/environment/environment";
import { MedicalRecordModel } from "../models/patient.model";

@Injectable({ providedIn: 'root'})
export class MedicalRecordsService{
    constructor(private readonly httpClient:HttpClient, private readonly authService:AuthServiceService){}
    baseUrl: string = environment.apiBaseUrl;

    saveMedicalRecordUrl: string = this.baseUrl + '/patients/addMedicalRecord';
    // updateMedicalRecordUrl: string = this.baseUrl + '/account-management/updatedClinic/';
    // deleteMedicalRecordUrl: string = this.baseUrl + '/account-management/deleteClinic/';
    getAllMedicalRecordUrl: string = this.baseUrl + '/patients/getAllMedicalRecords';
    getMedicalRecordByIdUrl: string = this.baseUrl+ '/patients/getMedicalRecordsByPetId';
    saveMedicalRecord(MedicalRecordDetail:MedicalRecordModel,ownerId:string) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        
        return this.httpClient.post(this.saveMedicalRecordUrl, MedicalRecordDetail, { headers: reqHeader });
    }

    // updateMedicalRecord(MedicalRecordDetail:MedicalRecordModel) {

    //     var bearerToken = sessionStorage.getItem('token')??'';
    //     let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
    //     return this.httpClient.put(this.updateMedicalRecordUrl + MedicalRecordDetail._id, { headers: reqHeader });
    // }

    // deleteMedicalRecord(MedicalRecordId:number) {
    //     var bearerToken = sessionStorage.getItem('token')??'';
    //     let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
    //     return this.httpClient.delete(this.deleteMedicalRecordUrl + MedicalRecordId, { headers: reqHeader });
    // }

    getAllMedicalRecord() {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.get(this.getAllMedicalRecordUrl, { headers: reqHeader });
    }
    getMedicalRecordById(petId: string) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        const body ={id:petId};
        return this.httpClient.post(this.getMedicalRecordByIdUrl,body, { headers: reqHeader });
    }
}