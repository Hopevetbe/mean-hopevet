import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthServiceService } from "./auth-service.service";
import { Router } from "@angular/router";
import { EMPTY, Observable } from "rxjs";
import { SessionStorageService } from "./session-storage.service";

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(
    private readonly userService: AuthServiceService,
    private readonly router: Router,    
    private readonly sessionStorageService: SessionStorageService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      const authToken = this.getAuthorizationToken();

      // if (!authToken) {
      //   this.router.navigateByUrl('/login');
      //   return EMPTY;
      // }

      const authReq = req.clone({
        // headers: req.headers.set('x-auth-token', String(authToken)),
        setHeaders: { authorization: String(authToken)  }
      });
      

      return next.handle(authReq);
    }
  

  getAuthorizationToken(): string {
    return this.sessionStorageService.getItem('_token') || '';
  }
}