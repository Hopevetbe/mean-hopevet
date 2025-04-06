import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-invoice-generation',
  templateUrl: './invoice-generation.component.html',
  styleUrls: ['./invoice-generation.component.scss']
})
export class InvoiceGenerationComponent {
  @Input()responseData!:any;
  @Input()clinic!:any;
  @Input()supplier!:any;
}
