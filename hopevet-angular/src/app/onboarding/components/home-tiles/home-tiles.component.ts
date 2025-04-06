import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'lodash';
import { ClinicService } from '../../services/clinic.service';
import { ClinicViewModel } from '../../view-models/user.viewmodel';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-home-tiles',
  templateUrl: './home-tiles.component.html',
  styleUrls: ['./home-tiles.component.scss']
})
export class HomeTilesComponent {
  clinicList!: ClinicViewModel[]; // TODO need to change according to model
  //clinicList!:any;
  constructor(private router:Router,
    private authService:AuthServiceService,
    @Inject(DOCUMENT) public document: Document,
    private readonly clinicService:ClinicService){}
  ngOnInit(){
    const body = first(this.document.getElementsByTagName('body'));
    body?.classList.add('onboard-bg-layer');
    this.getAllClinics();
  }
  ngOnDestroy(): void {
    const body = first(this.document.getElementsByTagName('body'));
    body?.classList.remove('onboard-bg-layer');
  }
  getAllClinics(){
    this.clinicService.getAllClinic().subscribe((response:any)=>{
      this.clinicList = response.DoctorList;
    },(err)=>{console.log(err)});
  }
  navigateToDashboard(){
    this.router.navigate(['/dashboard/dashboard']);
  }
  navigateToRegister(){
    this.router.navigate(['/sign-up']);
  }
  logout(){
    this.authService.removeAccessToken();
    this.authService.removeUserData();
    this.router.navigate(["/login"]);
  }
}
