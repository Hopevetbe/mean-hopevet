import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  showDashboard = true;
  constructor(private router: Router){}
  ngOnInit(): void {
    if(this.router.url.includes('/purchase-invoice')){
      this.showDashboard = false;
    }else{
      this.showDashboard = true;
    }
  }

}
