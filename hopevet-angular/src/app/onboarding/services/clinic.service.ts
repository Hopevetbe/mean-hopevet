import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment/environment";
import { AuthServiceService } from "./auth-service.service";
import { ClinicModel } from "../models/user.model";
import { ClinicViewModel } from "../view-models/user.viewmodel";

@Injectable({ providedIn: 'root'})
export class ClinicService{
    constructor(private readonly httpClient:HttpClient, private readonly authService:AuthServiceService){}
    baseUrl: string = environment.apiBaseUrl;

    saveClinicUrl: string = this.baseUrl + '/on-boarding/createDoctor';
    updateClinicUrl: string = this.baseUrl + '/on-boarding/updatedDoctor/';
    deleteClinicUrl: string = this.baseUrl + '/on-boarding/deleteDoctor/';
    getAllClinicUrl: string = this.baseUrl + '/on-boarding/getAllDoctor';
    saveClinic(clinicDetail:ClinicViewModel) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.post(this.saveClinicUrl, clinicDetail, { headers: reqHeader });
    }

    updateClinic(clinicDetail:ClinicViewModel) {

        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.put(this.updateClinicUrl+clinicDetail._id, { headers: reqHeader });
    }

    deleteClinic(clinicId:number) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.delete(this.deleteClinicUrl + clinicId, { headers: reqHeader });
    }

    getAllClinic() {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.get(this.getAllClinicUrl, { headers: reqHeader });
    }
}