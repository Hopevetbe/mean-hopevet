import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/onboarding/services/auth-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(private router: Router, private authService:AuthServiceService){}
getActiveClass(url: string){
  return this.router.url.includes(url) ? 'active':'';
}
logout(){
  this.authService.removeAccessToken();
  this.authService.removeUserData();
  this.router.navigate(["/login"]);
}
}
