import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthServiceService } from "src/app/onboarding/services/auth-service.service";
import { environment } from "src/environment/environment";
import { AccountManagementModel } from "../models/account-management.model";

@Injectable({ providedIn: 'root'})
export class AccountManagementService{
    constructor(private readonly httpClient:HttpClient, private readonly authService:AuthServiceService){}
    baseUrl: string = environment.apiBaseUrl;

    saveAccountManagementUrl: string = this.baseUrl + '/account-management/createMediStore';
    updateAccountManagementUrl: string = this.baseUrl + '/account-management/updatedClinic/';
    deleteAccountManagementUrl: string = this.baseUrl + '/account-management/deleteClinic/';
    getAllAccountManagementUrl: string = this.baseUrl + '/account-management/getAllClinic';
    getAccountManagementByIdUrl: string = this.baseUrl+ '/account-management/getClinicById';
    getAllCountersUrl: string = this.baseUrl+ '/counters/getTodayAndYesterdayCounts';
    getAllReportsUrl: string = this.baseUrl+'/counters/getAllReports';
    saveAccountManagement(AccountManagementDetail:AccountManagementModel) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.post(this.saveAccountManagementUrl, AccountManagementDetail, { headers: reqHeader });
    }

    updateAccountManagement(AccountManagementDetail:AccountManagementModel) {

        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.put(this.updateAccountManagementUrl + AccountManagementDetail._id,AccountManagementDetail, { headers: reqHeader });
    }

    deleteAccountManagement(AccountManagementId:number) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.delete(this.deleteAccountManagementUrl + AccountManagementId, { headers: reqHeader });
    }

    getAllAccountManagement() {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.get(this.getAllAccountManagementUrl, { headers: reqHeader });
    }
    getAccountManagementById() {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.get(this.getAccountManagementByIdUrl, { headers: reqHeader });
    }
    getAllCounters() {
        const todayDate = new Date().toISOString().split('T')[0];
        const yesterdayDate = this.getYesterday().toISOString().split('T')[0];
        const threeMonthDate  = this.getThreeMonthDate().toISOString().split('T')[0];
        const counters ={
            todayDate:todayDate,
            yesterdayDate:yesterdayDate,
            threeMonthDate:threeMonthDate,
        }
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.post(this.getAllCountersUrl,counters,{ headers: reqHeader });
    }
    getAllReports(counters:any){
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.post(this.getAllReportsUrl,counters,{ headers: reqHeader });
    }
    getStockReports(counters:any){
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.post(this.getAllReportsUrl,counters,{ headers: reqHeader });
    }
    getYesterday(){
        let d = new Date();
        d.setDate(d.getDate() - 1);
        return d;
    }
    getThreeMonthDate(){
        let date = new Date();
        date.setMonth(date.getMonth() + 6);
        return date;
    }
}