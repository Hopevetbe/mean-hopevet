import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthServiceService } from "src/app/onboarding/services/auth-service.service";
import { environment } from "src/environment/environment";
import { ConsulatationModel, InvoiceInformation, MedicinesInfoModel, PetStoreItemsModel } from "../models/sale.model";

@Injectable({ providedIn: 'root'})
export class SaleService{
    constructor(private readonly httpClient:HttpClient, private readonly authService:AuthServiceService){}
    baseUrl: string = environment.apiBaseUrl;
    // CRUD Consulatation BRANDS
    saveConsultationUrl: string = this.baseUrl + '/sale-invoice/addConsultation';
    saveSaleUrl: string = this.baseUrl + '/sale-invoice/addSalesBill';
    getAllConsultationUrl: string = this.baseUrl + '/sale-invoice/getAllConsultation';
    printConsultationUrl: string = this.baseUrl+ '/pdf/generate-consultation';
    printMedicineUrl: string = this.baseUrl+ '/pdf/generate-clinic-bill';
    printPetstoreUrl: string = this.baseUrl+ '/pdf/generate-pet-store-bill';
    saveConsultation(consultation:any) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });

        
        return this.httpClient.post(this.saveConsultationUrl, {consultation}, { headers: reqHeader });
    }
    saveSale(consultation:any) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });

        
        return this.httpClient.post(this.saveSaleUrl, consultation, { headers: reqHeader });
    }
    printConsultation(MedicalRecordDetail:any){
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.post(this.printConsultationUrl,MedicalRecordDetail, { headers: reqHeader,responseType: 'blob' });
    }
    printMedicineSale(MedicalRecordDetail:any){
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.post(this.printMedicineUrl,MedicalRecordDetail, { headers: reqHeader,responseType: 'blob' });
    }
    printPetStoreSale(MedicalRecordDetail:any){
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.post(this.printPetstoreUrl,MedicalRecordDetail, { headers: reqHeader,responseType: 'blob' });
    }

    getAllConsultation() {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.get(this.getAllConsultationUrl, { headers: reqHeader });
    }
    // CRUD Medicine sale
    saveMedicineUrl: string = this.baseUrl + '/sale-invoice/addMedicineSales';
    getAllMediniceUrl: string = this.baseUrl + '/sale-invoice/getAllMedicinesSale';
    saveMedicineSale(medicinesInfoModel:any) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });

        
        return this.httpClient.post(this.saveMedicineUrl, medicinesInfoModel, { headers: reqHeader });
    }

    getAllMedicineSale() {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.get(this.getAllMediniceUrl, { headers: reqHeader });
    }
    // CRUD Pet Store sale
    savePetStoreUrl: string = this.baseUrl + '/sale-invoice/addPetStoreSale';
    getAllPetStoreUrl: string = this.baseUrl + '/sale-invoice/getAllPetStoreSale';
    savePetStoreSale(petStoreItemsModel:any) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });

        
        return this.httpClient.post(this.savePetStoreUrl, petStoreItemsModel, { headers: reqHeader });
    }

    getAllPetStoreSale() {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.get(this.getAllPetStoreUrl, { headers: reqHeader });
    }
    // CRUD Sale sale
    saveInvoiceSaleUrl: string = this.baseUrl + '/sale-invoice/addSalesBill';
    getAllInvoiceUrl: string = this.baseUrl + '/sale-invoice/getAllSales';
    saveInvoiceSale(invoiceInformation:InvoiceInformation) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });

        
        return this.httpClient.post(this.saveInvoiceSaleUrl, {invoiceInformation}, { headers: reqHeader });
    }

    getAllInvoiceSale() {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.get(this.getAllInvoiceUrl, { headers: reqHeader });
    }
    getInvoiceNumbersUrl: string = this.baseUrl + '/sale-invoice/getInvoiceNumbersSale';
    getInvoiceNumbers() {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.get(this.getInvoiceNumbersUrl, { headers: reqHeader });
    }
}