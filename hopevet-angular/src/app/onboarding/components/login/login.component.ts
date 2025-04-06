import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  public isLoggingIn: boolean = false;
  public passwordType: string = 'password';
  public errorMessage: string = '';
  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.maxLength(30)]),
  });
  constructor(private authService:AuthServiceService){}
  ngOnInit(): void {
    // left intentionally
  }
  signIn(){
    this.authService.signIn(this.loginForm.value).toPromise().then((response:any) => {
      this.authService.setAccessToken(response.token);
      this.authService.setUserData(JSON.stringify(response.data));
      this.errorMessage = '';
      if(response?.data){
        if(response.data.isAdmin){
          this.authService.navigateToHomeTile();
        }else{
          this.authService.navigateToDashboard();
        }
      }else{
        this.errorMessage = 'Something went wrong';
      }
    },(err)=>{
      this.errorMessage = err.error.message ?? 'Something went wrong';
    });
  }
}
