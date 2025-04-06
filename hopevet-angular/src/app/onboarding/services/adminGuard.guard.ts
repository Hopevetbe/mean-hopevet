import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthServiceService } from "src/app/onboarding/services/auth-service.service";

@Injectable({
    providedIn: 'root'
  })
  export class AdminGuard implements CanActivate {
    constructor(private authService: AuthServiceService, private router: Router) {
    }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.authService.isLoggedIn()) {
            if(this.authService.getUserData()){
                const data =JSON.parse(this.authService.getUserData() || '');
                if(!data?.isAdmin){ this.router.navigate(["/login"]); return false; }
            }
          return true;
        }
        this.router.navigate(["/login"]);
        return false;
        
        
      }
}