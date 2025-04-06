import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountManagementService } from '../../services/account-management.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit{
  reportGroup!: FormGroup;
  reportType ='';
  reportData!:any;
  fileName= 'ExcelSheet.xlsx';
  showTable= false;
  gst:any[]=[];
  gstSale:any[]=[];
  constructor(private router:Router,private accountManagementService:AccountManagementService,private fb: FormBuilder){}
  ngOnInit(): void {
    this.reportGroup = this.fb.group({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      reportType: new FormControl(''),
    })
  }
  getReport(){
    // const data = {
    //   startDate
    // }
    // const startDate = '2024-03-01'; // Assuming 'YYYY-MM-DD' format
    //     const endDate = '2024-03-31';
        const counters ={
            startDate:this.reportGroup.get('startDate')?.value,
            endDate:this.reportGroup.get('endDate')?.value,
            reportType:this.reportGroup.get('reportType')?.value,
        }
    this.accountManagementService.getAllReports(counters).subscribe((response:any)=>{
      this.showTable = true;
      this.reportType = response.reportType;
      this.reportData = response.counting;
      if (this.reportType === 'Medicine_Purchase_Report' || this.reportType === 'Petstore_Purchase_Report'){
        this.refinePurchaseReportData();
      }
      else if (this.reportType === 'Medicine_Sales_Report'){
        this.refineMedicineSalesReportData();
      }
      else if (this.reportType === 'Petstore_Sales_Report'){
        this.refineFoodSaleReportData();
      }
      else{
        this.reportData = this.reportData;
      }

    })
  }
  getInventoryReport() {
    const counters = {

      reportType: 'Stock_Report',
    }
    this.accountManagementService.getStockReports(counters).subscribe((response: any) => {
      this.showTable = true;
      this.reportType = response.reportType;
      this.reportData = response.counting;
    })
  }
  exportexcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
 
  }
  refinePurchaseReportData(){
    this.reportData.forEach((item:any,i:number)=>{
      let zeroGst = 0;
      let fiveGst = 0;
      let tweleGst = 0;
      let eighteenGst = 0;
      let twentyEightGst = 0;
      const filterFive = item.itemsList.filter((product:any)=>product.gst === '5');
      const filterTwele = item.itemsList.filter((product:any)=>product.gst === '12');
      const filterEighteen = item.itemsList.filter((product:any)=>product.gst === '18');
      const filterTwentyEight = item.itemsList.filter((product:any)=>product.gst === '28');
      filterFive.forEach((singleProduct:any)=>{
        fiveGst += singleProduct.totalAmount * 0.05;
       });
       filterTwele.forEach((singleProduct:any)=>{
        tweleGst += singleProduct.totalAmount * 0.12;
       });
       filterEighteen.forEach((singleProduct:any)=>{
        eighteenGst += singleProduct.totalAmount * 0.18;
       });
       filterTwentyEight.forEach((singleProduct:any)=>{
        twentyEightGst += singleProduct.totalAmount * 0.28;
       });

       this.gst[i]={fiveGst,tweleGst,eighteenGst,twentyEightGst};
    })
  }
  refineMedicineSalesReportData(){
    this.reportData.forEach((item:any,i:number)=>{
      let zeroGst = 0;
      let fiveGst = 0;
      let tweleGst = 0;
      let eighteenGst = 0;
      let twentyEightGst = 0;
      const filterFive = item.medicinesInfo.filter((product:any)=>product.productInfo.gst === '5');
      const filterTwele = item.medicinesInfo.filter((product:any)=>product.productInfo.gst === '12');
      const filterEighteen = item.medicinesInfo.filter((product:any)=>product.productInfo.gst === '18');
      const filterTwentyEight = item.medicinesInfo.filter((product:any)=>product.productInfo.gst === '28');
      filterFive?.forEach((singleProduct:any)=>{
        fiveGst += singleProduct.totalAmount *0.05 *0.5;
       });
       filterTwele?.forEach((singleProduct:any)=>{
        tweleGst += singleProduct.totalAmount *0.12 *0.5;
       });
       filterEighteen?.forEach((singleProduct:any)=>{
        eighteenGst += singleProduct.totalAmount *0.18 *0.5;
       });
       filterTwentyEight?.forEach((singleProduct:any)=>{
        twentyEightGst += singleProduct.totalAmount *0.28 *0.5;
       });

       this.gstSale[i]={fiveGst,tweleGst,eighteenGst,twentyEightGst};
    })
  }
  refineFoodSaleReportData(){
    this.reportData.forEach((item:any,i:number)=>{
      let zeroGst = 0;
      let fiveGst = 0;
      let tweleGst = 0;
      let eighteenGst = 0;
      let twentyEightGst = 0;
      const filterFive = item.petStoreItems.filter((product:any)=>product.productInfo.gst === '5');
      const filterTwele = item.petStoreItems.filter((product:any)=>product.productInfo.gst === '12');
      const filterEighteen = item.petStoreItems.filter((product:any)=>product.productInfo.gst === '18');
      const filterTwentyEight = item.petStoreItems.filter((product:any)=>product.productInfo.gst === '28');
      filterFive.forEach((singleProduct:any)=>{
        fiveGst += singleProduct.totalAmount * 0.05 *0.5;
       });
       filterTwele.forEach((singleProduct:any)=>{
        tweleGst += singleProduct.totalAmount * 0.12 *0.5;
       });
       filterEighteen.forEach((singleProduct:any)=>{
        eighteenGst += singleProduct.totalAmount * 0.18 *0.5;
       });
       filterTwentyEight.forEach((singleProduct:any)=>{
        twentyEightGst += singleProduct.totalAmount * 0.28 *0.5;
       });

       this.gstSale[i]={fiveGst,tweleGst,eighteenGst,twentyEightGst};
    })
    
  }
}
