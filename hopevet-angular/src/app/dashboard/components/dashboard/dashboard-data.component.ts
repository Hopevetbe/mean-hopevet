import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountManagementService } from '../../services/account-management.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dashboard-data',
  templateUrl: './dashboard-data.component.html',
  styleUrls: ['./dashboard-data.component.scss']
})
export class DashboardDataComponent {
todayDate = new Date();
data: any;
showText = false;
counters!:any;
fileName= 'stocks.xlsx';

    options: any;
    data1: any;

    options1: any;
    constructor(private router:Router,private accountManagementService:AccountManagementService){}

    ngOnInit() {
        // const documentStyle = getComputedStyle(document.documentElement);
        // const textColor = documentStyle.getPropertyValue('--text-color');
        // const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        // const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        
        // this.data = {
        //     labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL','AUG','SEP','OCT','NOV','DEC'],
        //     datasets: [
        //         {
        //             label: 'SALE',
        //             backgroundColor: documentStyle.getPropertyValue('--blue-500'),
        //             borderColor: documentStyle.getPropertyValue('--blue-500'),
        //             data: [65, 59, 80, 81, 56, 55, 40, 50, 70, 90, 80, 100]
        //         },
        //         {
        //             label: 'PURCHASE',
        //             backgroundColor: documentStyle.getPropertyValue('--pink-500'),
        //             borderColor: documentStyle.getPropertyValue('--pink-500'),
        //             data: [28, 48, 40, 19, 86, 27, 90,48, 40, 19, 86, 27]
        //         }
        //     ]
        // };

        // this.options = {
        //     maintainAspectRatio: false,
        //     aspectRatio: 0.8,
        //     plugins: {
        //         legend: {
        //             labels: {
        //                 color: textColor
        //             }
        //         }
        //     },
        //     scales: {
        //         x: {
        //             ticks: {
        //                 color: textColorSecondary,
        //                 font: {
        //                     weight: 500
        //                 }
        //             },
        //             grid: {
        //                 color: surfaceBorder,
        //                 drawBorder: false
        //             }
        //         },
        //         y: {
        //             ticks: {
        //                 color: textColorSecondary
        //             },
        //             grid: {
        //                 color: surfaceBorder,
        //                 drawBorder: false
        //             }
        //         }

        //     }
        // };

        // const documentStyle1 = getComputedStyle(document.documentElement);
        // const textColor1 = documentStyle.getPropertyValue('--text-color1');

        // this.data1 = {
        //     labels: ['A', 'B', 'C'],
        //     datasets: [
        //         {
        //             data: [300, 50, 100],
        //             backgroundColor: [documentStyle1.getPropertyValue('--blue-500'), documentStyle1.getPropertyValue('--yellow-500'), documentStyle1.getPropertyValue('--green-500')],
        //             hoverBackgroundColor: [documentStyle1.getPropertyValue('--blue-400'), documentStyle1.getPropertyValue('--yellow-400'), documentStyle1.getPropertyValue('--green-400')]
        //         }
        //     ]
        // };


        // this.options1 = {
        //     cutout: '60%',
        //     plugins: {
        //         legend: {
        //             labels: {
        //                 color: textColor1
        //             }
        //         }
        //     }
        // };
        this.fetchAccountDetails();
    }
    fetchAccountDetails(){
        this.accountManagementService.getAccountManagementById().subscribe((response:any)=>{
            if(response.clinicList){
                if(response.clinicList.length === 0){
                    this.showText=true;
                }else{
                    if(response.clinicList[0].gstn === '' || response.clinicList[1].panNo === ''){
                        this.showText = true;
                        this.navigateToAccountManagement();
                    }else{
                        this.showText = false;
                    }
                    
                }
            }
        });
        this.accountManagementService.getAllCounters().subscribe((response:any)=>{
            this.counters = response.counting;
        },(err)=>{
            console.log(err);
        })
    }
    navigateToAccountManagement(){
        this.router.navigate(['dashboard','account-management']);
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

    }

