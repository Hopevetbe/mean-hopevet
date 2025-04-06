import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-consultation-invoice',
  templateUrl: './consultation-invoice.component.html',
  styleUrls: ['./consultation-invoice.component.scss']
})
export class ConsultationInvoiceComponent {
@Input()clinic!:any;
@Input()responseData!:any;
@Input()client!:any;
}
