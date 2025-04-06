import { Component, OnInit } from '@angular/core';
import { ClinicModel } from '../../models/user.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription, debounceTime } from 'rxjs';
import { Router } from '@angular/router';
import { ClinicService } from '../../services/clinic.service';
import { ClinicViewModel } from '../../view-models/user.viewmodel';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public passwordType: string = 'password';

  public isInputFocused = false;
  public errorMessage: string = '';
  public user!: ClinicModel;
  public logo!:string;
  imageURL!: string;

  public emailAlreadyExists: boolean = false;
  public maskValue: string = '00000-00000';
  public phoneLength: string = '11';

  public isCreatingAccount: boolean = false;
  public inputType: string='';
  public registerForm = this.formBuilder.group(
    {
      userName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z`\\s]+')]),
      doctorName: new FormControl('', [Validators.required]),      
      mobileNumber: new FormControl('', [Validators.pattern(/(0|[1-9-]\d*)?$/)]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*([^a-zA-Z\d\s])).{8,}$/),
      ]),
      // profileImage: new FormControl(''),
      isAdmin: new FormControl(false),
      id: new FormControl(''),
    },
  );
  private form$!: Subscription;
  constructor(private formBuilder:FormBuilder, private router: Router,private clinicService:ClinicService){}
  ngOnInit(): void {
    this.form$ = this.registerForm.valueChanges.pipe(debounceTime(1000)).subscribe((_) => {
      if (this.errorMessage) this.errorMessage = '';
      if (this.emailAlreadyExists) this.emailAlreadyExists = false;
    });
    this.maskCheck();
  }
  maskCheck() {
    // Mask value check
    this.inputType = this.maskValue ? 'text' : 'number';
  }
  registerUser(){
    let clinic = new ClinicViewModel(this.registerForm.value);
    this.clinicService.saveClinic(clinic).subscribe((response)=>{
      this.router.navigate(['/home']);
    },(err)=>{console.log(err)});
  }
  // imagePreview(event: any) {
  //   console.log(event.target);
  //   const file = event?.target?.files[0];
  //   this.registerForm.patchValue({
  //     profileImage: file
  //   });
  //   this.registerForm.get('logo')?.updateValueAndValidity()
  //   // File Preview
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imageURL = reader.result as string;
  //   }
  //   reader.readAsDataURL(file)
  // }
}
