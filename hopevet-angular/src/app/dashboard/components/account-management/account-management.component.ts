import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountManagementModel } from '../../models/account-management.model';
import { AccountManagementService } from '../../services/account-management.service';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit {
  medistoreDetails!:AccountManagementModel;
  petClinicStoreDetails!: AccountManagementModel;
  mediForm!:FormGroup;
  petClinicForm!: FormGroup;
  clinicList!: AccountManagementModel[];
  showResponse: boolean=false;
  success: boolean=false;
  errorAlert:boolean = false;
  constructor(private fb: FormBuilder,private accountManagement: AccountManagementService ){}
  ngOnInit(): void {
    this.accountManagement.getAccountManagementById().subscribe((response:any)=>{
      if(response.clinicList && response.clinicList.length >0 ){
        this.medistoreDetails = response.clinicList[1];
        this.petClinicStoreDetails = response.clinicList[0];
        this.initializeMediForm(this.medistoreDetails);
        this.initializePetStoreForm(this.petClinicStoreDetails);
      }else{
        this.initializeMediForm(this.medistoreDetails);
        this.initializePetStoreForm(this.petClinicStoreDetails);
      }
      
    })
    
  }
  initializeMediForm(medistore:AccountManagementModel){
    this.mediForm=this.fb.group({
      '_id': [medistore ? medistore._id : null],
      'legalName': [medistore ? medistore.legalName : null, Validators.required],
      'tradeName': [medistore ? medistore.tradeName : null, Validators.required],
      'email': [medistore ? medistore.email : null, Validators.required],
      'address': [medistore ? medistore.address : null, Validators.required],
      'mobileNumber': [medistore ? medistore.mobileNumber : null, Validators.required],
      'createdBy': [medistore ? medistore.createdBy : null],
      'createdDate': [medistore ? medistore.createdDate : null],
      'panNo': [medistore ? medistore.panNo : null,Validators.required],
      'gstn': [medistore ? medistore.gstn : null,Validators.required],
      'clinicType': ['MEDI_STORE']
    })
  }
  saveMediDetails(){
    let mediStore = new AccountManagementModel(this.mediForm.value);
    this.accountManagement.updateAccountManagement(mediStore).subscribe(()=>{
      this.showResponse = true;
      this.success = true;
      this.errorAlert = false;
      setTimeout(()=>{
        this.showResponse = false;
        this.success = false;
        this.errorAlert = false;
      },2000);
    },(err=>{
      this.showResponse = true;
      this.errorAlert = true;
      this.success = false;
      setTimeout(()=>{
        this.showResponse = false;
        this.errorAlert = false;
        this.success = false;
      },2000);
    })
    );
  }
  initializePetStoreForm(medistore:AccountManagementModel){
    this.petClinicForm=this.fb.group({
      '_id': [medistore ? medistore._id : null],
      'legalName': [medistore ? medistore.legalName : null, Validators.required],
      'tradeName': [medistore ? medistore.tradeName : null, Validators.required],
      'email': [medistore ? medistore.email : null, Validators.required],
      'address': [medistore ? medistore.address : null, Validators.required],
      'mobileNumber': [medistore ? medistore.mobileNumber : null, Validators.required],
      'createdBy': [medistore ? medistore.createdBy : null],
      'createdDate': [medistore ? medistore.createdDate : null],
      'panNo': [medistore ? medistore.panNo : null,Validators.required],
      'gstn': [medistore ? medistore.gstn : null,Validators.required],
      'clinicType': ["PET_CLINIC"]
    })
  }
  savePetDetails(){
    let petStore = new AccountManagementModel(this.petClinicForm.value);
    this.accountManagement.updateAccountManagement(petStore).subscribe(()=>{
      this.showResponse = true;
      this.success = true;
      this.errorAlert = false;
      setTimeout(()=>{
        this.showResponse = false;
        this.success = false;
        this.errorAlert = false;
      },2000);
    },(err=>{
      this.showResponse = true;
      this.errorAlert = true;
      this.success = false;
      setTimeout(()=>{
        this.showResponse = false;
        this.errorAlert = false;
        this.success = false;
      },2000);
    })

    );
  }
 
}
