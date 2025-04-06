import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthServiceService } from "src/app/onboarding/services/auth-service.service";
import { environment } from "src/environment/environment";
import { MedicalRecordModel, PatientModel } from "../models/patient.model";
import { ProductBrand, SupplierModel } from "../models/product-brand.model";

@Injectable({ providedIn: 'root'})
export class MasterService{
    constructor(private readonly httpClient:HttpClient, private readonly authService:AuthServiceService){}
    baseUrl: string = environment.apiBaseUrl;
    // CRUD PRODUCT BRANDS
    saveProductBrandUrl: string = this.baseUrl + '/product-brands/createBrandProduct';
    updateProductBrandUrl: string = this.baseUrl + '/product-brands/updatedProductBrand/';
    deleteProductBrandUrl: string = this.baseUrl + '/product-brands/deleteProductBrand/';
    getAllProductBrandUrl: string = this.baseUrl + '/product-brands/getAllBrandProducts';
    getAllMastersUrl: string = this.baseUrl + '/product-brands/getAllMasters';
    saveProductBrand(product:ProductBrand) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        // pet saving 
        return this.httpClient.post(this.saveProductBrandUrl, {product}, { headers: reqHeader });
    }

    updateProductBrand(product:ProductBrand) {

        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.put(this.updateProductBrandUrl +product._id,{product}, { headers: reqHeader });
    }

    deleteProductBrand(MedicalRecordId:number) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.delete(this.deleteProductBrandUrl + MedicalRecordId, { headers: reqHeader });
    }

    getAllProductBrand() {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.get(this.getAllProductBrandUrl, { headers: reqHeader });
    }
    getAllMasters() {
      var bearerToken = sessionStorage.getItem('token')??'';
      let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
      return this.httpClient.get(this.getAllMastersUrl, { headers: reqHeader });
  }
    // CRUD SUPPLIER 
    saveSupplierUrl: string = this.baseUrl + '/supplier/createSupplier';
    updateSupplierUrl: string = this.baseUrl + '/supplier/updatedSupplier/';
    deleteSupplierUrl: string = this.baseUrl + '/supplier/deleteSupplier/';
    getAllSupplierUrl: string = this.baseUrl + '/supplier/getAllSuppliers';
    saveSupplier(supplier:SupplierModel) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        // pet saving 
        return this.httpClient.post(this.saveSupplierUrl, {supplier}, { headers: reqHeader });
    }

    updateSupplier(supplier:SupplierModel) {

        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.put(this.updateSupplierUrl +supplier._id,{supplier}, { headers: reqHeader });
    }

    deleteSupplier(supplier:number) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.delete(this.deleteSupplierUrl + supplier, { headers: reqHeader });
    }

    getAllSuppliers() {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.get(this.getAllSupplierUrl, { headers: reqHeader });
    }
    // Function to get the current financial year
  getCurrentFinancialYear(): string {
    const today = new Date();
    const currentYear = today.getFullYear();
    const nextYear = today.getMonth() < 3 ? currentYear : currentYear + 1;
    const updateCurrentYear = currentYear.toString().substring(2);
    const updateNextYear = nextYear.toString().substring(2);
    return `${updateCurrentYear}${updateNextYear}`;
  }

  // Function to generate document number
  generateDocumentNumber(previousDocumentNumber: string): string {
    const currentFinancialYear = this.getCurrentFinancialYear();
    // Check if the previous document number is from the current financial year
    if (previousDocumentNumber.startsWith(currentFinancialYear)) {
      const lastNumber = parseInt(previousDocumentNumber.slice(-3));
      const nextNumber = lastNumber + 1;
      return currentFinancialYear + this.padNumber(nextNumber, 3);
    } else {
      // If the previous document number is from a different financial year, start from 001
      return currentFinancialYear + '001';
    }
  }

  // Function to pad number with leading zeros
  padNumber(num: number, size: number): string {
    let numStr = num.toString();
    while (numStr.length < size) {
      numStr = '0' + numStr;
    }
    return numStr;
  }
    
}