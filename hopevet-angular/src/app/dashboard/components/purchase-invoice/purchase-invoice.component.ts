import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemsToBeAddedModel } from '../../models/purchase.model';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas';
// import * as html2pdf from 'html2pdf.js';
declare module 'html2pdf.js';
import * as html2pdf from 'html2pdf.js';
import jspdf from 'jspdf';
import { SafeValue } from '@angular/platform-browser';
import { PurchaseBillService } from '../../services/purchase.service';
import * as bwipjs from 'bwip-js';
import { MasterService } from '../../services/master.service';
import { ProductBrand, SupplierModel } from '../../models/product-brand.model';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.scss']
})
export class PurchaseInvoiceComponent implements OnInit {
  purchaseInvoiceForm!: FormGroup;
  itemsAddedList: any[] = [];
  medicinePurchaseList: any[] = [];
  petStorePurchaseList: any[] = [];
  yourDropdownOptions = ['APPLE', 'MANGO', 'TEXT'];
  showButton = true;
  dataToString = 'testing qr code';
  qrDownloadLink: SafeValue = '';
  purchaseBillName = '';
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  @ViewChild('barcode') barcode!: any;
  showBarcode = false;
  barcodeData: string = '123456789';
  showDialog!: boolean;
  showBorderRadius!: boolean;
  showCloseIcon!: boolean;
  popupSize!: string;
  grayBgEnabled!: boolean;
  productFormGroup!: FormGroup;
  supplierFormGroup!: FormGroup;
  productPopup!: boolean;
  productList!: ProductBrand[];
  supplierList!: SupplierModel[];
  filteredProductOption!: { id: string, name: string }[];
  filteredSupplierOption!: { id: string, name: string }[];
  newProduct!: boolean;
  searchOwnerTerm: string = '';
  showQRCode = false;
  selectedProduct!: any;
  itemAddedForm!: FormGroup;
  EditableMedicine: boolean[] = [];
  EditableFood:boolean[]=[];
  @ViewChild('content') content!: ElementRef;
  medicinePurchaseResponse!: any;
  foodPurchaseResponse!: any;
  showResponse: boolean=false;
  success: boolean=false;
  errorAlert:boolean = false;
  showPurchaseBill: boolean=false;
  purchaseBillResponse!: any;
  clinic!:any;
  supplier!:any;
  isFromPrint = false;
  qrcontainer:any[]=[];
  brands!:any[];
  groups!:any[];
  packs!:any[];
  searchGroupTerm='';
  searchBrandTerm='';
  searchPackTerm='';
  @ViewChild('downloadableContent', { static: false }) downloadableContent!: ElementRef;
  constructor(private fb: FormBuilder, private purchasebillService: PurchaseBillService, private masterService: MasterService) { }
  ngOnInit(): void {
    this.onincomponent();
    
  }
  onincomponent(){
    this.intializeFirst();
    this.fetchProducts();
    this.fetchSupplier();
    this.searchOwnerTerm = '';
  }
  fetchProducts() {
    this.masterService.getAllProductBrand().subscribe((response: any) => {
      this.productList = response.brandList;
      this.filteredProductOption = this.mapFilteredProductOption(this.productList);
    })
  }
  fetchSupplier() {
    this.masterService.getAllSuppliers().subscribe((response: any) => {
      this.supplierList = response.suppliers;
      this.filteredSupplierOption = this.mapfilteredSupplierOption(this.supplierList);
    })
  }
  downloadBarcode() {
    // Create a canvas element
    const canvas: HTMLCanvasElement = document.createElement('canvas');

    // Generate barcode on the canvas using bwip-js
    bwipjs.bc412({
      bcid: 'code128',    // Barcode type (Code 128 in this example)
      text: this.barcodeData,
      scale: 3,            // Scaling factor
      height: 10           // Barcode height in mm
    });

    // Create a download link
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'barcode.png';

    // Trigger a click on the link to start the download
    link.click();
  }

  intializeFirst() {
    this.purchasebillService.getAllPurchaseBill().subscribe((response: any) => {
      const data = response.purchaseList[response.purchaseList.length - 1]?.purchaseBillInfo?.purchaseOrderNumber ?? '0';
      this.purchaseBillName = this.generateDocumentNumber(data);
      this.initialisePurchaseForm();
      this.initialiseItemsToAdded();
    })
  }
  generateDocumentNumber(previousDocumentNumber: string): string {
    return this.masterService.generateDocumentNumber(previousDocumentNumber);
  }
  initialisePurchaseForm() {
    const currentDate = (new Date()).toISOString().substring(0, 10);
    this.purchaseInvoiceForm = this.fb.group({
      'id': [null],
      'purchaseBillInformation': this.fb.group({
        billDate: [currentDate],
        supplier: [null, Validators.required],
        paymentTerms: [null],
        dueDate: [null],
        placeOfSupply: [null],
        purchaseOrderNumber: [this.purchaseBillName],
        purchaseOrderDate: [null],
        eWayBillNumber: [null, Validators.required],
      }),
      'totalPrice': 0,
      'purchaseType': '',
    }

    );
  }
  initialiseItemsToAdded() {
    this.itemAddedForm = this.fb.group({
      barcode: [null],
      mktBy: [null, Validators.required],
      itemNumber: [null, Validators.required],
      billedQuantity: [null, Validators.required],
      freeQuantity: [null],
      purchasePrice: [null, Validators.required],
      discount: [null],
      discountedPrice: [null],
      gst: [null],
      mrp: [null, Validators.required],
      pack: [null],
      batch: [null, Validators.required],
      expDate: [null, Validators.required],
      hsn: [null, Validators.required],
      sch: [null],
      id: [null],
      itemType: [null],
      rackNo: [null],
    })

  }
  public convetToPDF() {
    this.showButton = false;
    var data = document.getElementById('pdfTable');
    html2canvas(this.pdfTable.nativeElement).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('new-file.pdf'); // Generated PDF
    });
  }
  get purchaseBillInformationGroup(): FormGroup {
    return this.purchaseInvoiceForm.get('purchaseBillInformation') as FormGroup;
  }
  stringfyQrCode(i: any): string {
    const uniqueId = `${i.itemNumber}${i.batch}`;
    return uniqueId;
  }
  stringfyQrCodeName(i: any): string {
    const uniqueId = `${i.itemNumber}`;
    return uniqueId;
  }
  addItem() {
    this.itemAddedForm.markAllAsTouched();
    if (this.itemAddedForm.invalid) return;
    this.showQRCode = false;
    if (this.itemAddedForm.valid) {
      const discountedPrice = this.getTaxableValue(this.itemAddedForm.value);
      this.itemAddedForm.patchValue({ discountedPrice: discountedPrice });
      this.itemAddedForm.patchValue({ barcode: this.stringfyQrCode(this.itemAddedForm.value) });
      const totalQuantity = parseInt(this.itemAddedForm.value.freeQuantity??'0') + parseInt(this.itemAddedForm.value.billedQuantity??'0');
      for(let i=0;i<totalQuantity;i++){
        this.qrcontainer.push(this.itemAddedForm.value);
      }
      
      this.itemAddedForm.patchValue({
        pack: this.itemAddedForm.value.pack ?? 1,
        freeQuantity: this.itemAddedForm.value.freeQuantity ?? 0,
        discount: this.itemAddedForm.value.discount ?? 0,
        sch: this.itemAddedForm.value.sch ?? 0,
        gst: this.itemAddedForm.value.gst ?? 0,
      });
      if (this.selectedProduct.clinicType === 'PET_CLINIC') {
        this.medicinePurchaseList.push(this.itemAddedForm.value);
      }
      else {
        this.petStorePurchaseList.push(this.itemAddedForm.value);
      }
      this.itemAddedForm.reset();
    }
    this.searchOwnerTerm = '';
  }
  removeItem(index: number,type:string) {
    if(type === 'medicine'){
      this.medicinePurchaseList.splice(index, 1);
    }else{
      this.petStorePurchaseList.splice(index, 1);
    }
    
  }
  getTotal() {
    let total: number = 0;
    if (!this.itemsAddedList) return total;
    this.itemsAddedList.forEach(item => {
      total = total + item.discountedPrice;
    }
    )
    return total;
  }
  getMedicineTotal() {
    let total: number = 0;
    if (!this.medicinePurchaseList) return total;
    this.medicinePurchaseList.forEach(item => {
      total = total + item.discountedPrice;
    }
    )
    return total;
  }
  getPetStoreTotal() {
    let total: number = 0;
    if (!this.petStorePurchaseList) return total;
    this.petStorePurchaseList.forEach(item => {
      total = total + item.discountedPrice;
    }
    )
    return total;
  }
  getValue(product: any) {
    let value = 0;
    const purchasePrice = parseFloat(product.purchasePrice);
    const discount = product.discount ? parseFloat(product.discount) : 0;
    const sch = product.sch ? parseFloat(product.sch) : 0;
    const gst = product.gst ? parseFloat(product.gst) : 0;
    value = purchasePrice - (purchasePrice * (discount + sch) / 100);
    value = value + (value * gst / 100);
    return value;
   
  }
  getTaxableValue(product: any) {
    let taxableValue = 0;
    taxableValue = product.billedQuantity * this.getValue(product);
    return taxableValue;
  }
  downloadQrCode() {
    // this.qrDownloadLink = url;
    this.downloadAsFile();
  }

    savePurchaseBill(){
      if(this.medicinePurchaseList.length ===0 && this.petStorePurchaseList.length===0) return;
      const total = this.getMedicineTotal() + this.getPetStoreTotal();
      this.purchaseInvoiceForm.get('totalPrice')?.setValue(total);
      this.purchaseInvoiceForm.get('purchaseType')?.setValue('BOTH');
      let totalList = [];
      totalList.push(this.medicinePurchaseList,this.petStorePurchaseList);
      this.purchasebillService.savePurchaseBill(this.purchaseInvoiceForm.value,totalList).subscribe((response:any)=>{
        this.medicinePurchaseList=[];
        this.petStorePurchaseList=[];
        this.showResponse = true;
        this.success = true;
        this.errorAlert = false;
        setTimeout(()=>{
          this.showResponse = false;
          this.success = false;
          this.errorAlert = false;
        },2000);
      },(err=>{
        this.showResponse = true;
        this.errorAlert = true;
        this.success = false;
        setTimeout(()=>{
          this.showResponse = false;
          this.errorAlert = false;
          this.success = false;
        },2000);
      }))
    }
  downloadAsFile() {
    // console.log('comes');
    // const options = {
    //   filename: 'barcode.pdf',
    //   image: { type: 'jpeg', quality: 0.98 },
    //   html2canvas: { scale: 2 },
    //   jsPDF: { 
    //     unit: 'mm', 
    //     format: 'letter', 
    //     orientation: 'landscape',
    //     compressPdf: true
    //     // Specify the width here (in pixels)
       
    //   }
    // };

    const content = this.content.nativeElement;
    // html2pdf()
    //   .from(content)
    //   .set(options)
    //   .save();

    html2canvas(content).then(canvas => {
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');

      // Create a temporary link and trigger the download
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'barcode.png';
      link.click();
    });
  }
  saveMedicinePurchaseBill() {
    if(this.medicinePurchaseList.length === 0) return;
    this.purchaseBillInformationGroup.markAllAsTouched();
    if (this.purchaseBillInformationGroup.invalid) return;
    this.purchaseInvoiceForm.get('totalPrice')?.setValue(this.getMedicineTotal());
    this.purchaseInvoiceForm.get('purchaseType')?.setValue('PET_CLINIC');
    this.purchasebillService.savePurchaseBill(this.purchaseInvoiceForm.value, this.medicinePurchaseList).subscribe((response: any) => {
      this.medicinePurchaseResponse = response.purchaseBill;
      this.medicinePurchaseList = [];
      this.purchaseBillResponse = this.mapPrintFunctionality(this.medicinePurchaseResponse, 'PET_CLINIC');
      this.clinic = response.clinic[0];
      this.supplier = response.supplier;
      this.showResponse = true;
      this.success = true;
      this.errorAlert = false;
      if(this.isFromPrint) this.printMedicinePurchaseBill();
      setTimeout(()=>{
        this.showResponse = false;
        this.success = false;
        this.errorAlert = false;
      },2000);
    },(err=>{
      this.showResponse = true;
      this.errorAlert = true;
      this.success = false;
      setTimeout(()=>{
        this.showResponse = false;
        this.errorAlert = false;
        this.success = false;
      },2000);
    }))
  }
  printMedicinePurchaseBill(){
    if (!this.medicinePurchaseResponse){
      this.saveMedicinePurchaseBill();
      this.isFromPrint = true;
    }
    else{
      this.showPurchaseBill = true;
    }
  }
  savePetStorePurchaseBill() {
    if (this.petStorePurchaseList.length === 0) return;
    this.purchaseBillInformationGroup.markAllAsTouched();
    if (this.purchaseBillInformationGroup.invalid) return;
    this.purchaseInvoiceForm.get('totalPrice')?.setValue(this.getPetStoreTotal());
    this.purchaseInvoiceForm.get('purchaseType')?.setValue('MEDI_STORE');
    this.purchasebillService.savePurchaseBill(this.purchaseInvoiceForm.value, this.petStorePurchaseList).subscribe((response: any) => {
      this.foodPurchaseResponse = response.purchaseBill;
      this.petStorePurchaseList = [];
      this.purchaseBillResponse = this.mapPrintFunctionality(this.foodPurchaseResponse, 'MEDI_STORE');
      this.clinic = response.clinic[0];
      this.supplier = response.supplier;
      this.showResponse = true;
      this.success = true;
      this.errorAlert = false;
      if(this.isFromPrint) this.printPetStorePurchaseBill();
      setTimeout(()=>{
        this.showResponse = false;
        this.success = false;
        this.errorAlert = false;
      },2000);
    },(err=>{
      this.showResponse = true;
      this.errorAlert = true;
      this.success = false;
      setTimeout(()=>{
        this.showResponse = false;
        this.errorAlert = false;
        this.success = false;
      },2000);
    }))
  }
  printPetStorePurchaseBill(){
    if(!this.foodPurchaseResponse){
      this.savePetStorePurchaseBill();
      this.isFromPrint = true;
    }else{
      this.showPurchaseBill = true;
    }
  }
  generatePdf() {
    const htmlData = `<html><body><h1>Hello, world!</h1></body></html>`;
    this.purchasebillService.generatePdf(htmlData).subscribe((pdfBlob: Blob) => {
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(pdfBlob);
      downloadLink.download = 'generated.pdf';
      downloadLink.click();
    });
  }

  generateBarcode() {
    this.showBarcode = true;
  }
  downloadPdf(): void {
    const dataToSend = `<html><body><h1>Hello, world!</h1></body></html>`; // Your data to be sent to the server
    this.purchasebillService.generatePdf(dataToSend).subscribe((pdfBlob: Blob) => {
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'generated.pdf';
      link.click();
    });
  }
  showProduct() {
    this.masterService.getAllMasters().subscribe((response: any) => {
      this.brands = this.mapBrandOption(response.allMasters.brands);
      this.groups = this.mapGroupOption(response.allMasters.groups);
      this.packs = this.mapPackOptions(response.allMasters.packs);
    });
    this.productPopup = true;
    this.initialiseProduct();
    this.showPopup();

  }
  mapBrandOption(list: any[]) {
    let mappedData: { id: string, name: string }[] = [];
    let mappingProduct;
    list.forEach((item: any) => {
      mappingProduct = {
        id: item._id,
        name: item.brandName,
      };
      mappedData.push(mappingProduct);
    })
    return mappedData;
  }
  mapGroupOption(list: any[]) {
    let mappedData: { id: string, name: string }[] = [];
    let mappingProduct;
    list.forEach((item: any) => {
      mappingProduct = {
        id: item._id,
        name: item.groupName,
      };
      mappedData.push(mappingProduct);
    })
    return mappedData;
  }
  mapPackOptions(list: any[]) {
    let mappedData: { id: string, name: string }[] = [];
    let mappingProduct;
    list.forEach((item: any) => {
      mappingProduct = {
        id: item._id,
        name: item.pack,
      };
      mappedData.push(mappingProduct);
    })
    return mappedData;
  }
  showSupplier() {
    this.productPopup = false;
    this.initialiseSupplier();
    this.showPopup();
  }
  showPopup() {
    this.showCloseIcon = true;
    this.showBorderRadius = true;
    this.popupSize = 'lg';
    this.showDialog = true;
    this.grayBgEnabled = true;
  }
  onPopupClose() {
    this.showCloseIcon = false;
    this.showBorderRadius = true;
    this.showDialog = false;
    this.grayBgEnabled = false;
  }
  initialiseProduct() {
    this.productFormGroup = this.fb.group({
      group: new FormControl(''),
      brand: new FormControl(''),
      barcode: new FormControl(''),
      itemNumber: new FormControl(''),
      pack: new FormControl(''),
      purchasePrice: new FormControl(''),
      clinicType: new FormControl(''),
      mrp: new FormControl(''),
      rackNo: new FormControl(''),
    });
  }
  saveProduct() {
    console.log(this.productFormGroup.value,'test');
    const productBrand = new ProductBrand(this.productFormGroup.value);
    this.masterService.saveProductBrand(productBrand).subscribe((response: any) => {
      this.productList = response.allBrands;
      this.filteredProductOption = this.mapFilteredProductOption(this.productList);
      this.onPopupClose();
      this.productFormGroup.reset();
      this.searchGroupTerm = '';
      this.searchBrandTerm = '';
      this.searchPackTerm = '';
    });
  }
  initialiseSupplier() {
    this.supplierFormGroup = this.fb.group({
      companyName: new FormControl('', [Validators.required]),
      address: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
      pincode: new FormControl('', [Validators.required]),
      email: new FormControl(''),
      mobileNumber: new FormControl('', [Validators.required]),
      gstin: new FormControl('', [Validators.required]),
    });
  }
  saveSupplier() {
    const supplier = new SupplierModel(this.supplierFormGroup.value);
    this.masterService.saveSupplier(supplier).subscribe((response: any) => {
      this.supplierList = response.suppliers;
      this.onPopupClose();
      this.supplierFormGroup.reset();
    });
  }
  getItemCode(): string {
    const uniqueId = `BR-${this.productFormGroup.value.itemNumber}`;
    return uniqueId;
  }
  productNameChange() {
    this.productFormGroup.controls['barcode'].setValue(this.getItemCode());
  }
  mapFilteredProductOption(list: any[]) {
    let mappedData: { id: string, name: string }[] = [];
    let mappingProduct;
    list.forEach((item: any) => {
      mappingProduct = {
        id: item._id,
        name: item.itemNumber,
      };
      mappedData.push(mappingProduct);
    })
    return mappedData;
  }
  mapfilteredSupplierOption(list: any[]) {
    let mappedData: { id: string, name: string }[] = [];
    let mappedCompanyName;
    list.forEach((item: any) => {
      mappedCompanyName = {
        id: item._id,
        name: item.companyName,
      };
      mappedData.push(mappedCompanyName);
    })
    return mappedData;
  }
  changeSelectedSupplier(item: { id: string, name: string }) {
  }
  changeSelectedProduct(item: { id: string, name: string }) {
    this.selectedProduct = this.productList.find((product: any) => product._id === item.id);
    this.itemAddedForm.patchValue({
      mktBy: this.selectedProduct?.brand,
      itemNumber: this.selectedProduct?.itemNumber,
      purchasePrice: this.selectedProduct?.purchasePrice,
      mrp: this.selectedProduct?.mrp,
      pack: this.selectedProduct?.pack,
      id: this.selectedProduct?._id,
      itemType: this.selectedProduct?.clinicType,
      rackNo: this.selectedProduct?.rackNo ?? 0,
    });
  }
  newlyAddedItemNumber(item: boolean) {
    this.newProduct = item;
    if (this.newProduct) this.itemAddedForm.reset();
  }
  changeOwnerSearch(search: string) {
    this.searchOwnerTerm = search;
  }
  changeGroupSearch(search: string) {
    this.searchGroupTerm = search;
    this.productFormGroup.patchValue({
         group: this.searchGroupTerm});
  }
  changeBrandSearch(search: string) {
    this.searchBrandTerm = search;
    this.productFormGroup.patchValue({
      brand: this.searchBrandTerm});
  }
  changePackSearch(search: string) {
    this.searchPackTerm = search;
    this.productFormGroup.patchValue({
      pack: this.searchPackTerm});
  }
  mapPrintFunctionality(purchase: any, clinicType: string) {
    let totalGst = 0;
    let grandTotal = 0;
    purchase.itemsList.forEach((item: any) => {
      totalGst += item.gst ? parseInt(item.gst) : 0;
    });
    let totalGSTAmount = parseInt(purchase.totalBillAmount) * totalGst / 100;
    grandTotal = parseInt(purchase.totalBillAmount) - totalGSTAmount;
    return {
      purchase,
      clinicType: clinicType,
      totalGSTAmount: totalGSTAmount,
      grandTotal: grandTotal,
    }
  }
  refreshComponent() {
   this.purchaseInvoiceForm.reset();
   this.medicinePurchaseList = [];
   this.petStorePurchaseList = [];
  this.itemsAddedList= [];
  this.showButton = true;
  this.purchaseBillName = '';
  this.showBarcode = false;
  
  
  this.filteredProductOption=[];
  this.filteredSupplierOption=[];
  this.newProduct=false;
  this.searchOwnerTerm = '';
  this.showQRCode = false;
  this.selectedProduct={};
  this.itemAddedForm.reset();
  this.EditableMedicine = [];
  this.EditableFood=[];
 
  this.medicinePurchaseResponse=undefined;
  this.foodPurchaseResponse=undefined;
  
  this.purchaseBillResponse=undefined;
  this.clinic=undefined;
  this.supplier=undefined;
  this.isFromPrint = false;
  this.qrcontainer=[];
  this.onincomponent();
  }
  onChange(event: Event, i: number, product: string) {
    const updatedValue = (event.target as HTMLInputElement).value;
    this.medicinePurchaseList[i][product] = updatedValue;
  }
  onChangeFood(event: Event, i: number, product: string) {
    const updatedValue = (event.target as HTMLInputElement).value;
    this.petStorePurchaseList[i][product] = updatedValue;
  }
  public downloadAsPDF() {
    
    const options = {
      filename: 'invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { 
        unit: 'mm', 
        format: 'letter', 
        orientation: 'landscape',
        compressPdf: true
        // Specify the width here (in pixels)
       
      }
    };

    const element: Element = this.downloadableContent.nativeElement;
    html2pdf()
      .from(element)
      .set(options)
      .save();
  }
  downloadPdfAutoTable(){
    const doc = new jsPDF();

    // Add heading
    doc.text('Medical Invoice', 10, 10);

    autoTable(doc, {
      head: [['Name', 'Email', 'Country','Name', 'Email', 'Country','Name', 'Email', 'Country','Name', 'Email', 'Country','Name', 'Email', 'Country','Name', 'Email', 'Country']],
      body: [
        ['David', 'david@example.com', 'Sweden','David', 'david@example.com', 'Sweden','David', 'david@example.com', 'Sweden','David', 'david@example.com', 'Sweden','David', 'david@example.com', 'Sweden','David', 'david@example.com', 'Sweden'],
        ['Castille', 'castille@example.com', 'Spain','Castille', 'castille@example.com', 'Spain','Castille', 'castille@example.com', 'Spain','Castille', 'castille@example.com', 'Spain','Castille', 'castille@example.com', 'Spain','Castille', 'castille@example.com', 'Spain'],
        // ...
      ],
    })

    doc.save('table.pdf');
  }
}
