import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { has } from 'lodash';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { environment } from 'src/environment/environment';
import { SessionStorageService } from './session-storage.service';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root'})
export class AuthServiceService {
  public userInfo = new BehaviorSubject<any>({ isLoggedIn: !!this.localStorageService.getItem('_token') });
  apiUrl = 'https://jsonplaceholder.typicode.com';
  constructor(
    private readonly http: HttpClient,
    private readonly sessionStorageService: SessionStorageService,
    private readonly localStorageService: LocalStorageService,
    private router:Router) { }
  
  public signIn(data:any) {
    const url = `${environment.apiBaseUrl}/on-boarding/doctorLogin`;
    return this.http.post(url,data);
  }
  public getUserProfile(token: any): void {
    if (!has(token, 'token')) return;
    this.userInfo.next({ isLoggedIn: true });
    this.sessionStorageService.setItem('_token', token.token);
    this.sessionStorageService.removeItem('_guestToken');
    this.localStorageService.removeItem('_guest_user_attempts');
    this.localStorageService.removeItem('_user');

    this.navigateToDashboard();
    this.getUser(token.accessToken).subscribe();
  }
  navigateToDashboard(){
    this.router.navigate(['/dashboard/dashboard']);
  }
  navigateToHomeTile(){
    this.router.navigate(['/home']);
  }
  public getUser(token?: string): Observable<any> {
    const url = `${environment.apiBaseUrl}/user/me`;

    let headers = {};

    if (token) {
      headers = new HttpHeaders({
        Authorization: token,
      });
    }

    return this.http.get(url, token ? { ...headers } : {}).pipe(
      tap((user: any) => {
        this.userInfo.next({
          ...user,
          isLoggedIn: true,
        });
      }),
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          this.flushUserData();
          this.navigateToSignIn();
        }

        throw err;
      }),
    );
  }
  public flushUserData(): void {
    this.userInfo.next({ isLoggedIn: false });

    this.localStorageService.removeItem('_guest_user_attempts');
    this.sessionStorageService.removeItem('_guestToken');
    this.localStorageService.removeItem('_user');
    this.localStorageService.removeItem('_token');
    this.localStorageService.removeItem('_resumeForm');
    this.sessionStorageService.removeItem('show_feedback_modal');
  }
  navigateToSignIn(){
    this.router.navigate(['/login']);
  }
  // set and access token and user data
  // setAccessToken(token:string){
  //   localStorage.setItem('bearerToken', token);
  // }
  // getAccessToken(){
  //   localStorage.getItem('bearerToken');
  // }
  setUserData(user:any){
    sessionStorage.setItem('user', user);
  }
  getUserData(): string | null{
   return sessionStorage.getItem('user');
  }
  removeUserData(): void{
    this.sessionStorageService.removeItem('user');
  }
  // Save token to sessionStorage
  setAccessToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  // Get token from sessionStorage
  getAccessToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // Remove token from sessionStorage
  removeAccessToken(): void {
    sessionStorage.removeItem('token');
  }
  isLoggedIn() {
    var bearerToken = sessionStorage.getItem('token');
    return ((bearerToken && bearerToken != '') ? true : false);
}

}
