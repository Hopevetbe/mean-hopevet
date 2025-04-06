import { Component, ElementRef, EventEmitter, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PetDetailsService } from '../../services/petDetails.service';
import { PurchaseBillService } from '../../services/purchase.service';
import { SaleService } from '../../services/sales.service';
declare module 'html2pdf.js';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.scss']
})
export class SaleInvoiceComponent implements OnInit {
  invoiceInfoForm!: FormGroup;
  ownerList!:any;
  filteredOwnerOption!:{id:string,name:string}[];
  consultationBillNo='';
  petstoreBillNo = '';
  medicineBillNo = '';
  productList!:any;
  availableQuantity = 0;
  filteredProductOption!:{id:string,name:string}[];
  itemAddedForm!:FormGroup;

  medicineSaleArray:any[]=[];
  petStoreSaleArray:any[]=[];
  selectedProduct!:any;
  searchTerm = '';
  searchOwnerTerm = '';
  selectedOwner!: any;

  medicineSubTotal = 0;
  medicineTotalGst = 0;
  medicineGrandTotal = 0;
  petStoreSubTotal = 0;
  petStoreTotalGst = 0;
  petStoreGrandTotal = 0;
  EditableMedicine: boolean[] = [];
  EditableFood:boolean[]=[];
  showResponse: boolean=false;
  success: boolean=false;
  errorAlert:boolean = false;

  consultationResponse!:any;
  medicineResponse!:any;
  foodResponse!:any;

  isConsultationSaved = false;
  isMedicineSaved = false;
  isFoodSaved = false;

  showSaleBill = false;
  showMedicineSaleBill = false;
  showFoodSaleBill = false;
  showConsultationBill = false;
  isFromPrint = false;
  clinic!:any;
  client!:any;

  consultationForm!: FormGroup;
  @ViewChild('barcode') barcode!: ElementRef;
  @ViewChild('downloadableContent', { static: false }) downloadableContent!: ElementRef;
  constructor(private formBuilder:FormBuilder,
    private petDetailsService:PetDetailsService,
    private saleService:SaleService,
    private purchaseBillService:PurchaseBillService){}
  ngOnInit(): void {
    this.onincomponent();
  }
  onincomponent(){
    this.fetchPetOwners();
    this.fetchProducts();
    this.intializeFirst();
  }
  intializeFirst(){
    this.saleService.getInvoiceNumbers().subscribe((response:any)=>{     
      this.consultationBillNo=response.invoiceNumbers.consultationInvoiceNumber;
      this.petstoreBillNo = response.invoiceNumbers.petInvoiceNumber;
      this.medicineBillNo = response.invoiceNumbers.medicineInvoiceNumber; 
      this.initializeInvoiceForm();  
      this.intializeConsultationForm();
      this.initializeitemAddedForm();  
  });
  }
  initializeInvoiceForm(){
    const currentDate = (new Date()).toISOString().substring(0,10);
    this.invoiceInfoForm = this.formBuilder.group({
      invoiceNumber: new FormControl(''),
      invoiceDate: new FormControl(currentDate),
      placeOfSupply:new FormControl(''),
      paymentMode: new FormControl(''),
      mobileNumber: new FormControl(''),
      clientName: new FormControl(''),
      address: new FormControl(''),
      clientGSTIN: new FormControl(''),
      soldBy: new FormControl('')
    })
  }
  fetchPetOwners(){
    this.petDetailsService.getAllPetDetails().subscribe((response:any)=>{
      this.ownerList = response.petOwnerList;
      this.filteredOwnerOption = this.mapFilterOwnerOption(this.ownerList);
    });
  }
  fetchProducts(){
    this.purchaseBillService.getAllProducts().subscribe((response:any)=>{
      this.productList = response.productsList;
      this.filteredProductOption = this.mapFilterProductOption(this.productList);
    });
  }
  mapFilterOwnerOption(list:any[]){
    let mappedData:{id:string,name:string}[]=[];
    let mappingOwner;
    list.forEach((item:any)=>{
      mappingOwner={
        id:item._id,
        name:item.phoneNumber.toString(),
      };
      mappedData.push(mappingOwner);
    })
    return mappedData;
  }
  mapFilterProductOption(list:any[]){
    let mappedProductData:{id:string,name:string}[]=[];
    let mappingProduct;
    list.forEach((item:any)=>{
      if(item.itemName){
      mappingProduct={
        id:item._id,
        name:item.itemName,
      };
      mappedProductData.push(mappingProduct);
    }
    })
    return mappedProductData;
  }
  changeEvent(owner:{id:string,name:string}){
     this.selectedOwner = this.ownerList.find((item:any)=>item._id === owner.id);
    this.invoiceInfoForm.patchValue({
      clientName:this.selectedOwner.ownerName,
      address:this.selectedOwner.address,
      mobileNumber: this.selectedOwner.phoneNumber,
    });  
  }
  intializeConsultationForm(){
    this.consultationForm = this.formBuilder.group({
      quantity: new FormControl(1),
      price: new FormControl(600),
      totalPrice: new FormControl(600)
    })
  }
  updateTotalConsulatation(){
    this.consultationForm.controls['totalPrice'].setValue(this.getTotalConsultationAmount());
  }
  getTotalConsultationAmount():number{
    return (this.consultationForm?.controls['quantity'].value * this.consultationForm?.controls['price'].value)??0;
  }
  initializeitemAddedForm(){
    this.itemAddedForm=this.formBuilder.group({
      id:new FormControl(''),
      barcode: new FormControl(''),
      itemName: new FormControl(''),
      quantity: new FormControl(''),
      mrp: new FormControl(''),
      discount: new FormControl(''),
      gst: new FormControl(''),
    })
  }
  changeProductEvent(product:{id:string,name:string}){
    this.selectedProduct = this.productList.find((item:any)=>item._id === product.id);
    this.availableQuantity = this.selectedProduct.availableQuantity;
    this.itemAddedForm.patchValue({
      barcode: this.selectedProduct.barcode,
      itemName: this.selectedProduct.itemName,
      mrp: this.selectedProduct.mrp,
      id:this.selectedProduct._id,
      gst:this.selectedProduct.gst,
    });
  }
  addProductToTable(){
    if(this.selectedProduct.itemType === 'PET_CLINIC'){      
      const totalPrice =  this.selectedProduct.unitPrice * this.itemAddedForm.controls['quantity'].value;
      const discountedAmount = totalPrice * this.itemAddedForm.controls['discount'].value/100; 
      const discountedPrice = totalPrice - discountedAmount;
      const previewFields = {
        productInfo: this.selectedProduct,
        purchaseQuantity:this.itemAddedForm.controls['quantity'].value,
        discount:this.itemAddedForm.controls['discount'].value,
        gst:this.itemAddedForm.controls['gst'].value,
        discountedPrice:discountedPrice
      }
      this.medicineSaleArray.push(previewFields);
      this.itemAddedForm.reset();
      this.selectedProduct={};
      this.searchTerm='';
      this.availableQuantity=0;
    }
    else{
      const totalPrice =  this.selectedProduct.unitPrice * this.itemAddedForm.controls['quantity'].value;
      const discountedAmount = totalPrice * this.itemAddedForm.controls['discount'].value/100; 
      const discountedPrice = totalPrice - discountedAmount;
      const previewFields = {
        productInfo: this.selectedProduct,
        purchaseQuantity:this.itemAddedForm.controls['quantity'].value,
        discount:this.itemAddedForm.controls['discount'].value,
        gst:this.itemAddedForm.controls['gst'].value,
        discountedPrice:discountedPrice
      }
      this.petStoreSaleArray.push(previewFields);
      this.itemAddedForm.reset();
      this.selectedProduct={};
      this.searchTerm='';
      this.availableQuantity=0;
    }
  }
  changeSearch(searchText:string){
    this.searchTerm = searchText;
  }
  changeOwnerSearch(searchText:string){
    this.searchOwnerTerm = searchText;
  }
  saveConsultation(){
    this.invoiceInfoForm.controls['invoiceNumber']?.setValue(this.consultationBillNo);
    const consultatedDetails = this.mapConsultation();
    this.saleService.saveConsultation(consultatedDetails).subscribe((response:any)=>{
      this.consultationResponse = response.consultations;
      this.clinic = response.clinic[0];
      this.client = response.client;
      this.isConsultationSaved = true;
      this.showResponse = true;
      this.success = true;
      this.errorAlert = false;
      if (this.isFromPrint) this.printConsultation();
      setTimeout(()=>{
        this.showResponse = false;
        this.success = false;
        this.errorAlert = false;
      },2000);
    },(err=>{
      this.showResponse = true;
      this.errorAlert = true;
      this.success = false;
      this.isConsultationSaved = false;
      setTimeout(()=>{
        this.showResponse = false;
        this.errorAlert = false;
        this.success = false;
      },2000);
    }))
  }
  printConsultation(){
    console.log('comes first')
    if(!this.isConsultationSaved){
      console.log('comes if');
      this.isFromPrint = true;
      this.saveConsultation();
      
    }else{
      console.log('comes else')
      this.showSaleBill = true;
      this.showConsultationBill = true;
      this.showFoodSaleBill = false;
      this.showMedicineSaleBill = false;
    }
    
    
  }
  goBack(){
    this.showSaleBill = false;
    this.showConsultationBill = false;
    this.showFoodSaleBill = false;
    this.showMedicineSaleBill = false;
    this.isFromPrint = false;
  }
  mapConsultation(){
    const info ={invoiceInfo: this.mapInvoiceInfo(),
            clientInfo: this.mapClientInfo(),
            clientGSTIN: this.invoiceInfoForm.controls['clientGSTIN'].value,
            soldBy: this.invoiceInfoForm.controls['soldBy'].value,
            consultationDetails: this.mapConsulatationDetail(),
    }
    return info;
  }
  mapInvoiceInfo(){
    return {
      invoiceNumber: this.invoiceInfoForm.controls['invoiceNumber'].value,
        invoiceDate:this.invoiceInfoForm.controls['invoiceDate'].value,
        placeOfSupply: this.invoiceInfoForm.controls['placeOfSupply'].value,
        paymentMode:this.invoiceInfoForm.controls['paymentMode'].value,
    };
  }
  mapConsulatationDetail(){
    return {
      quantity: this.consultationForm.controls['quantity'].value,
      price: this.consultationForm.controls['price'].value,
      totalPrice: this.consultationForm.controls['totalPrice'].value
    }
  }
  saveMedicineBill(){
    this.invoiceInfoForm.controls['invoiceNumber']?.setValue(this.medicineBillNo);
    const medicineBillDetails = this.mapMedicineBillDetails();
    this.saleService.saveMedicineSale(medicineBillDetails).subscribe((response:any)=>{
      this.medicineResponse = this.mapPreviewValuesPetstore(response.medicineSale);
      this.client = response.client;
      this.clinic = response.clinic[0];
      this.isMedicineSaved = true;
      this.showResponse = true;
      this.success = true;
      this.errorAlert = false;
      if(this.isFromPrint) this.printMedicineBill();
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
  printMedicineBill(){
    if(!this.isMedicineSaved){
      this.isFromPrint = true;
      this.saveMedicineBill();
      
    }else{
      this.showSaleBill = true;
      this.showConsultationBill = false;
      this.showFoodSaleBill = false;
      this.showMedicineSaleBill = true;
    }
    
  }
  mapMedicineBillDetails(){
    this.getTotalAmount(this.medicineSaleArray);
    const totalGSTAmount = (this.medicineGrandTotal*this.medicineTotalGst/100);
    const mappInfo = {
            invoiceInfo: this.mapInvoiceInfo(),
            clientInfo: this.mapClientInfo(),
            clientGSTIN: this.invoiceInfoForm.controls['clientGSTIN'].value,
            soldBy: this.invoiceInfoForm.controls['soldBy'].value,
            medicinesInfo: this.mapItemAdded(this.medicineSaleArray),
            grandTotal: this.medicineGrandTotal,
            subtotal: this.medicineGrandTotal-totalGSTAmount,
            totalGst: totalGSTAmount 
    }
    return mappInfo;
  }
  mapItemAdded(itemArray:any[]){
    let mappedData:any[]=[];
    let mappedCompanyName;
    itemArray.forEach((item:any)=>{
      mappedCompanyName={
        productInfo: item.productInfo._id,
      purchaseQuantity:item.purchaseQuantity,
      totalAmount: item.discountedPrice,
      };
      mappedData.push(mappedCompanyName);
    })
    return mappedData;
  }
  savePetStoreDetails(){
    this.invoiceInfoForm.controls['invoiceNumber']?.setValue(this.petstoreBillNo);
    const petStoreBillDetails = this.mapPetStoreBillDetails();
    this.saleService.savePetStoreSale(petStoreBillDetails).subscribe((response:any)=>{
      this.foodResponse = this.mapPreviewValuesPetstore(response.petStoreSale);
      this.clinic = response.clinic[0];
      this.client = response.client;
      this.isFoodSaved = true;
      this.showResponse = true;
      this.success = true;
      this.errorAlert = false;
      if(this.isFromPrint) this.printPetStoreDetails();
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
  printPetStoreDetails(){
    if(!this.isFoodSaved){
      this.savePetStoreDetails();
      this.isFromPrint = true;
    }else{
      this.showSaleBill = true;
      this.showConsultationBill = false;
      this.showFoodSaleBill = true;
      this.showMedicineSaleBill = false;
    }
    
  }
  saveSalesBill(){
    this.invoiceInfoForm.controls['invoiceNumber']?.setValue(this.medicineBillNo+this.consultationBillNo+this.petstoreBillNo);
    const saleBillDetails = this.mapSaleBillDetails();
    this.saleService.saveSale(saleBillDetails).subscribe((response:any)=>{
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
  mapPetStoreBillDetails(){
    this.getPetStoreTotalAmount(this.petStoreSaleArray);
    const totalGSTAmount = (this.petStoreGrandTotal*this.petStoreTotalGst/100);
    const mappInfo = {
      invoiceInfo: this.mapInvoiceInfo(),
      clientInfo: this.mapClientInfo(),
      clientGSTIN: this.invoiceInfoForm.controls['clientGSTIN'].value,
      soldBy: this.invoiceInfoForm.controls['soldBy'].value,
      petStoreItems: this.mapItemAdded(this.petStoreSaleArray),
      grandTotal: this.petStoreGrandTotal,
      subtotal: this.petStoreGrandTotal-totalGSTAmount,
      totalGst: totalGSTAmount
}
return mappInfo;
  }
  mapSaleBillDetails(){
    this.getPetStoreTotalAmount(this.petStoreSaleArray);
    const totalGSTAmount = (this.petStoreGrandTotal*this.petStoreTotalGst/100);
    const mappInfo = {
      invoiceInfo: this.mapInvoiceInfo(),
      clientInfo: this.mapClientInfo(),
      clientGSTIN: this.invoiceInfoForm.controls['clientGSTIN'].value,
      soldBy: this.invoiceInfoForm.controls['soldBy'].value,
      petStoreItems: this.mapItemAdded(this.petStoreSaleArray),
      medicinesInfo: this.mapItemAdded(this.medicineSaleArray),
      consultationDetails: this.mapConsulatationDetail(),
}
return mappInfo;
  }
  focus(item:Event){
    item.preventDefault();
  }
  blurValue(){
    const selectedValue = this.itemAddedForm.get('barcode')?.value;    
    if(selectedValue){
    this.selectedProduct = this.productList.find((item:any)=>item.barcode === selectedValue);
    if(!this.selectedProduct || this.selectedProduct.length ==0) return;
    this.searchTerm = this.selectedProduct.itemName;
    this.itemAddedForm.patchValue({
      itemName: this.selectedProduct.itemName,
      mrp: this.selectedProduct.mrp,
      id:this.selectedProduct._id,
      gst:this.selectedProduct.gst,
    });
 }
}
changessss(event:Event){
  if((event.target as HTMLInputElement).value !== ''){
    this.barcode.nativeElement.blur();
  }
}
getTotalAmount(medicine:any[]){
 
  medicine.forEach((item)=>{
    this.medicineGrandTotal += parseInt(item.discountedPrice);
    this.medicineTotalGst += parseInt(item.gst);
  });
}
getPetStoreTotalAmount(medicine:any[]){
  medicine.forEach((item)=>{
    this.petStoreGrandTotal += parseInt(item.discountedPrice);
    this.petStoreTotalGst += parseInt(item.gst);
  });
}
mapPreviewValuesPetstore(petStoreValues:any){
  return {
    petStoreValues,
    medicineToDisplay: petStoreValues.petStoreItems ? this.getMedicineToDisplay(petStoreValues.petStoreItems): this.getMedicineToDisplay(petStoreValues.medicinesInfo), 
  }
}
getMedicineToDisplay(petDetails:any[]){
  let mappedData:any[]=[];
  petDetails.forEach((pet)=>{
    const product = this.productList.filter((item:any)=>item._id === pet.productInfo)[0];
   const data={ 
    productName:product.itemName,
    hsn:product.hsn,                 
    batch:product.batch,
    exp:product.expDate,
    quantity:pet.purchaseQuantity,
    mrp:parseInt(product.unitPrice),
    gst:product.gst,
    amount:parseInt(pet.totalAmount)
   }
   mappedData.push(data);
  });
  return mappedData;
  
}
getMedicineSubtotal(){
  let total=0;
  this.medicineSaleArray.forEach((item)=>{
    total +=item.discountedPrice
  });
  return total;
}
getPetSubtotal(){
  let total=0;
  this.petStoreSaleArray.forEach((item)=>{
    total +=item.discountedPrice
  });
  return total;
}
refreshComponent(){
  this.invoiceInfoForm.reset();
  this.ownerList=undefined;
  this.filteredOwnerOption=[];
  this.consultationBillNo='';
  this.petstoreBillNo = '';
  this.medicineBillNo = '';
  this.productList=undefined;
  this.availableQuantity = 0;
  this.filteredProductOption=[];
  this.itemAddedForm.reset();

  this.medicineSaleArray=[];
  this.petStoreSaleArray=[];
  this.selectedProduct=undefined;
  this.searchTerm = '';
  this.searchOwnerTerm = '';
  this.selectedOwner=undefined;

  this.medicineSubTotal = 0;
  this.medicineTotalGst = 0;
  this.medicineGrandTotal = 0;
  this.petStoreSubTotal = 0;
  this.petStoreTotalGst = 0;
  this.petStoreGrandTotal = 0;
  this.EditableMedicine= [];
  this.EditableFood=[];

  this.consultationResponse=undefined;
  this.medicineResponse=undefined;
  this.foodResponse=undefined;

  this.isConsultationSaved = false;
  this.isMedicineSaved = false;
  this.isFoodSaved = false;

  this.showSaleBill = false;
  this.showMedicineSaleBill = false;
  this.showFoodSaleBill = false;
  this.showConsultationBill = false;
  this.isFromPrint = false;
  this.clinic=undefined;
  this.client=undefined;
  this.consultationForm.reset();
  this.onincomponent();
  }
  onChange(event: Event, i: number, product: string) {
    const updatedValue = (event.target as HTMLInputElement).value;
    this.medicineSaleArray[i][product] = updatedValue;
  }
  onChangeFood(event: Event, i: number, product: string) {
    const updatedValue = (event.target as HTMLInputElement).value;
    this.petStoreSaleArray[i][product] = updatedValue;
  }
  removeItem(index: number,type:string) {
    if(type === 'medicine'){
      this.medicineSaleArray.splice(index, 1);
    }else{
      this.petStoreSaleArray.splice(index, 1);
    }
    
  }
  mapClientInfo(){
    const clientInfo = {
      clientName:this.invoiceInfoForm.controls['clientName'].value,
      mobileNumber:this.invoiceInfoForm.controls['mobileNumber'].value,
      address:this.invoiceInfoForm.controls['mobileNumber'].value,
      clientGstin:this.invoiceInfoForm.controls['clientGSTIN'].value,
    }
    return clientInfo;
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
}
