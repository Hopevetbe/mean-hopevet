import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthServiceService } from "src/app/onboarding/services/auth-service.service";
import { environment } from "src/environment/environment";
import { MedicalRecordModel } from "../models/patient.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root'})
export class PurchaseBillService{
    constructor(private readonly httpClient:HttpClient, private readonly authService:AuthServiceService){}
    baseUrl: string = environment.apiBaseUrl;

    savePurchaseBillUrl: string = this.baseUrl + '/purchase-invoice/addPurchaseBill';
    // updateMedicalRecordUrl: string = this.baseUrl + '/account-management/updatedClinic/';
    // deleteMedicalRecordUrl: string = this.baseUrl + '/account-management/deleteClinic/';
    getAllPurchaseBillUrl: string = this.baseUrl + '/purchase-invoice/getAllPurchase';
    getPurchaseBillByIdUrl: string = this.baseUrl+ '/patients/getMedicalRecordsByPetId';
    getAllProductsUrl : string = this.baseUrl+ '/purchase-invoice/getAllProducts';
    apiUrl: string = this.baseUrl+'/pdf/generate-pdf';
    printPrescriptionUrl: string = this.baseUrl+ '/pdf/generate-purchase-bill';
    testUrl: string = this.baseUrl+ '/pdf/test-pdf';
    savePurchaseBill(purchaseInfo:any,list:any[]) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.post(this.savePurchaseBillUrl, this.mapPurchaseBill(purchaseInfo,list), { headers: reqHeader });
    }
    test(purchaseInfo:any) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.post(this.testUrl, purchaseInfo, { headers: reqHeader,responseType: 'blob' });
    }
    printPurchaseBill(MedicalRecordDetail:any){
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.post(this.printPrescriptionUrl,MedicalRecordDetail, { headers: reqHeader,responseType: 'blob' });
    }

    getAllPurchaseBill() {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.get(this.getAllPurchaseBillUrl, { headers: reqHeader });
    }
    getAllProducts() {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.get(this.getAllProductsUrl, { headers: reqHeader });
    }
    getPurchaseBillById(purchaseId: string) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        const body ={id:purchaseId};
        return this.httpClient.post(this.getPurchaseBillByIdUrl,body, { headers: reqHeader });
    }
    generatePdf(htmlData: string) {
        var bearerToken = sessionStorage.getItem('token')??'';
        let reqHeader = new HttpHeaders({ 'x-auth-token': bearerToken });
        return this.httpClient.post(this.apiUrl, { htmlData }, {  headers: reqHeader,responseType: 'blob' });
      }
    mapPurchaseBill(purchaseInfo:any,list:any[]){
       const mappingData = {purchaseBillInfo: {
            purchaseType: purchaseInfo.purchaseType,
            billDate: purchaseInfo.purchaseBillInformation.billdate,
            supplier: purchaseInfo.purchaseBillInformation.supplier,
            paymentTerms: purchaseInfo.purchaseBillInformation.paymentTerms,
            dueDate: purchaseInfo.purchaseBillInformation.dueDate,
            placeOfSupply: purchaseInfo.purchaseBillInformation.placeOfSupply,
            purchaseOrderNumber: purchaseInfo.purchaseBillInformation.purchaseOrderNumber,
            purchaseOrderDate:purchaseInfo.purchaseBillInformation.purchaseOrderDate,
            eWayBillNumber: purchaseInfo.purchaseBillInformation.eWayBillNumber,
        },
        itemsList: this.mapItemList(list),            
        totalBillAmount: purchaseInfo.totalPrice,
    };
        return mappingData;
    }
    mapItemList(items:any[]){
        let mappedItemData: any[]=[];
        items.forEach((item)=>{
            if(item.itemNumber){
            const mappingItemData = {
                barcode: item.barcode,
                mktBy: item.mktBy,
                itemName: item.itemNumber,
                expDate: item.expDate,
                pack: item.pack,
                quantity: {
                    billingQuantity: item.billedQuantity,
                    freeQuantity: item.freeQuantity
                },
                batch: item.batch,
                hsn: item.hsn,
                purchasePrice: item.purchasePrice,
                discount: item.discount,
                sch: item.sch,
                gst: item.gst,
                mrp: item.mrp,
                value: this.getValue(item),
                taxableValue:this.getTaxableValue(item),
                totalAmount: this.getTaxableValue(item),
                itemType:item.itemType
            }
            mappedItemData.push(mappingItemData)
        }
        })
        return mappedItemData;
    }
    getValue(product:any){
        let value = 0;
        const purchasePrice = parseFloat(product.purchasePrice);
        const discount = product.discount ? parseFloat(product.discount) : 0;
        const sch = product.sch ? parseFloat(product.sch) : 0;
        const gst = product.gst ? parseFloat(product.gst): 0;
        value=purchasePrice-(purchasePrice*(discount+sch)/100);
        value = value + (purchasePrice*gst/100);
        return value;
      }
      getTaxableValue(product:any){
        let taxableValue = 0;
        taxableValue = product.billedQuantity * this.getValue(product);
        return taxableValue;
      }
      
}