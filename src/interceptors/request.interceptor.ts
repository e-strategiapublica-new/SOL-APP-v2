import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler, HttpInterceptor, HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthService } from "../services/auth.service";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly ngxSpinnerService: NgxSpinnerService,
    private readonly router: Router
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((resp) => {
        if (request.url.includes(environment.api.path) || request.url.includes(environment.api.server)) {
          if (resp instanceof HttpResponse) {
            return resp.clone({
              body: resp.body.data ? resp.body.data : (resp.body ?? null),
            });
          }
        }
        return resp;
      }),
      catchError((err: HttpErrorResponse) => {
        if (request.url.includes(environment.api.path)) {
          if (err.status === 401) {
            // const user = this.authService.getAuthenticatedUser();
            // if (!!user) {
            //   if (!!!user.refreshToken) {
            //     this.authService.removeAuthenticatedUser();
            //     this.router.navigate(['/']);
            //     this.ngxSpinnerService.hide();
            //     throw err;
            //   }
            //   const refreshToken = this.authService.getRefreshTokenFromJWT();
            //   if (Boolean(user.keepConnected) && refreshToken.exp > new Date().getTime() / 1_000) {
            //     return of({ code: 0, msg: 'Token Refreshed!' }).pipe(mergeMap(() => {
            //       return this.authService.refreshToken();
            //     })).pipe(mergeMap(data => {
            //       this.authService.setAuthenticatedUser(data);
            //       this.authService.setKeepConnected(true);
            //       return next.handle(this.refreshRequestHeader(request)).pipe(
            //         map((resp) => {
            //           if (request.url.includes(environment.api.path)) {
            //             if (resp instanceof HttpResponse) {
            //               return resp.clone({
            //                 body: resp.body.data ? resp.body.data : null,
            //               });
            //             }
            //           }
            //           return resp;
            //         })
            //       );
            //     }));
            //   }
            // }
            this.authService.removeAuthenticatedUser();
            this.router.navigate(['/']);
            this.ngxSpinnerService.hide();
            throw err;
          }
        }
        this.ngxSpinnerService.hide();
        throw err;
      })
    );
  }

  // private refreshRequestHeader(request: HttpRequest<any>) {
  //   const authHeader = this.authService.getAuthenticatedUser();
  //   if (authHeader) {
  //     return request.clone({
  //       setHeaders: {
  //         "Authorization": `Bearer ${authHeader?.token}`
  //       }
  //     });
  //   }
  //   return request;
  // }
}
