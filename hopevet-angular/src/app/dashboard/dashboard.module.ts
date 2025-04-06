import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardDataComponent } from './components/dashboard/dashboard-data.component';
import { PatientsComponent } from './components/patients/patients.component';
import { AddPatientComponent } from './components/add-patient/add-patient.component';
import { InvoiceCreationComponent } from './components/invoice-creation/invoice-creation.component';
import { WebcamModule } from 'ngx-webcam';
import { WebCamera1Component } from './components/web-camera1/web-camera1.component';
import { PurchaseInvoiceComponent } from './components/purchase-invoice/purchase-invoice.component';
import { SaleInvoiceComponent } from './components/sale-invoice/sale-invoice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrescriptionComponent } from './components/patients/prescription/prescription.component';
import { SearchComponent } from './components/search/search.component';
import { PopupComponent } from './components/popup/popup.component';
import { AccountManagementComponent } from './components/account-management/account-management.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeScannerComponent } from './components/barcode-scanner/barcode-scanner.component';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { ReportsComponent } from './components/reports/reports.component';
import { MasterComponent } from './components/master/master.component';
import { PdfGenerationComponent } from './components/pdf-generation/pdf-generation.component';
import { InvoiceGenerationComponent } from './components/purchase-invoice/invoice-generation/invoice-generation.component';
import { ConsultationInvoiceComponent } from './components/sale-invoice/consultation-invoice/consultation-invoice.component';
import { MedicineSaleInvoiceComponent } from './components/sale-invoice/medicine-sale-invoice/medicine-sale-invoice.component';
import { FoodSaleInvoiceComponent } from './components/sale-invoice/food-sale-invoice/food-sale-invoice.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardDataComponent,
    SidebarComponent,
    PatientsComponent,
    AddPatientComponent,
    InvoiceCreationComponent,
    WebCamera1Component,
    PurchaseInvoiceComponent,
    SaleInvoiceComponent,
    PrescriptionComponent,
    SearchComponent,
    PopupComponent,
    AccountManagementComponent,
    BarcodeScannerComponent,
    ReportsComponent,
    MasterComponent,
    PdfGenerationComponent,
    InvoiceGenerationComponent,
    ConsultationInvoiceComponent,
    MedicineSaleInvoiceComponent,
    FoodSaleInvoiceComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    WebcamModule,
    ReactiveFormsModule,
    FormsModule,
    QRCodeModule,
    ZXingScannerModule,NgxBarcode6Module,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class DashboardModule { }
