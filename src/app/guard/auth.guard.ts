import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private readonly router: Router,
        private toastrService: ToastrService
    ) { }

    async canActivate() {
        const user = this.authService.getAuthenticatedUser();

        if(!user){
            this.router.navigate(['/']);
            this.toastrService.warning('Sua autenticação expirou. Por favor, faça login novamente!', '', { progressBar: true });
            return false;
        }

        if (!!user) {
            try {
                if (!this.authService.isJwtValid()) {
                    this.router.navigate(['/']);
                    this.toastrService.warning('Sua autenticação expirou. Por favor, faça login novamente!', '', { progressBar: true });
                    return false;
                }
                return true;
            } catch (err) {
                return false;
            }
        }
        return false;
    }
}
