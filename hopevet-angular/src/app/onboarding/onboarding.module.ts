import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './onboarding.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FormOutlineComponent } from './components/form-outline/form-outline.component';
import { PasswordStrengthComponent } from './components/password-strength/password-strength.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeTilesComponent } from './components/home-tiles/home-tiles.component';
import { AuthServiceService } from './services/auth-service.service';


@NgModule({
  declarations: [
    OnboardingComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    FormOutlineComponent,
    PasswordStrengthComponent,
    HomeTilesComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers:[]
})
export class OnboardingModule { }
