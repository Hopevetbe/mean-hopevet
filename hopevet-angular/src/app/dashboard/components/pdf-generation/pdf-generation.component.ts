import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pdf-generation',
  templateUrl: './pdf-generation.component.html',
  styleUrls: ['./pdf-generation.component.scss']
})
export class PdfGenerationComponent {
@Input() responseData!:any;
@Input()doctor!:any;
@Input()clinic!:any;
}
