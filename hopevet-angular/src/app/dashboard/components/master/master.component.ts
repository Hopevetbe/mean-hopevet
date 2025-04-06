import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PurchaseBillService } from '../../services/purchase.service';
import { MasterService } from '../../services/master.service';
import { ProductBrand, SupplierModel } from '../../models/product-brand.model';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent {
  masterType = '';
  productPopup!:boolean;
  productFormGroup!: FormGroup;
  supplierFormGroup!: FormGroup;
  
  productList!: ProductBrand[];
  supplierList!:SupplierModel[];
  constructor(private fb: FormBuilder, private purchasebillService: PurchaseBillService,private masterService:MasterService){}
  selected(){
    if(this.masterType ==='SUPPLIER'){
      this.showSupplier();
    }else{
      this.showProduct();
    }
  }
  getItemCode():string{
    const uniqueId = `BR-${this.productFormGroup.value.itemNumber}`;
    return uniqueId;
  }
  productNameChange(){
    this.productFormGroup.controls['barcode'].setValue(this.getItemCode());
  }
  showProduct(){
    this.productPopup = true;
    this.initialiseProduct();

  }
  showSupplier(){
    this.productPopup = false;
    this.initialiseSupplier();
  }
  initialiseProduct(){
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
  saveProduct(){
    
    const productBrand = new ProductBrand(this.productFormGroup.value);
   this.masterService.saveProductBrand(productBrand).subscribe((response:any)=>{
    this.productList = response.allBrands;
    this.productFormGroup.reset();
   });
  }
  initialiseSupplier(){
    this.supplierFormGroup = this.fb.group({
      companyName: new FormControl(''),
      address: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
      pincode: new FormControl(''),
      email: new FormControl(''),
      mobileNumber: new FormControl(''),
      clinicType:new FormControl(''),
      gstin: new FormControl(''),
    });
  }
  saveSupplier(){
    const supplier = new SupplierModel(this.supplierFormGroup.value);
    this.masterService.saveSupplier(supplier).subscribe((response:any)=>{
     this.supplierList = response.suppliers;
     this.supplierFormGroup.reset();
    });
  }
}
