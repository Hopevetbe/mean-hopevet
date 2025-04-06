import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-food-sale-invoice',
  templateUrl: './food-sale-invoice.component.html',
  styleUrls: ['./food-sale-invoice.component.scss']
})
export class FoodSaleInvoiceComponent implements OnInit {
@Input()responseData!:any;
@Input()clinic!:any;
@Input()client!:any;
subTotal = 0;
totalGst = 0;
grandTotal = 0;
ngOnInit(): void {
  this.subTotal = parseInt(this.responseData.petStoreValues.subtotal);
  this.totalGst = parseInt(this.responseData.petStoreValues.totalGst);
  this.grandTotal = parseInt(this.responseData.petStoreValues.grandTotal);
}
}
