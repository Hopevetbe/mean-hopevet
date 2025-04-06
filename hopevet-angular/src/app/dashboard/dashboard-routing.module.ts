import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardDataComponent } from './components/dashboard/dashboard-data.component';
import { PatientsComponent } from './components/patients/patients.component';
import { InvoiceCreationComponent } from './components/invoice-creation/invoice-creation.component';
import { WebCamera1Component } from './components/web-camera1/web-camera1.component';
import { PurchaseInvoiceComponent } from './components/purchase-invoice/purchase-invoice.component';
import { SaleInvoiceComponent } from './components/sale-invoice/sale-invoice.component';
import { PrescriptionComponent } from './components/patients/prescription/prescription.component';
import { AccountManagementComponent } from './components/account-management/account-management.component';
import { BarcodeScannerComponent } from './components/barcode-scanner/barcode-scanner.component';
import { AuthGuard } from './services/auth.guard';
import { ReportsComponent } from './components/reports/reports.component';
import { MasterComponent } from './components/master/master.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardDataComponent,
      },
      {
        path: 'patient',
        component: PatientsComponent,
      },
      {
        path: 'prescription',
        component: PrescriptionComponent,
      },
      {
        path: 'invoice',
        component: InvoiceCreationComponent,
      },
      {
        path: 'webcam',
        component: WebCamera1Component,
      },
      {
        path: 'purchase-invoice',
        component: PurchaseInvoiceComponent,
      },
      {
        path: 'sale-invoice',
        component: SaleInvoiceComponent,
      },
      {
        path: 'account-management',
        component: AccountManagementComponent,
      },
      {
        path: 'barcode',
        component: BarcodeScannerComponent,
      },
      {
        path:'reports',
        component:ReportsComponent,
      },
      {
        path:'masters',
        component:MasterComponent,
      }
    ],
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
