import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable, TimeoutError } from 'rxjs';
import * as AuthN from 'keratin-authn';
import { jwt_claims } from './user.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {
    private hasSession: Promise<boolean>;
    
    get session(): Promise<boolean> {
        return this.hasSession;
    }

    constructor(private router: Router) {
        if (environment.disableAuth) {
            this.activate();
        } else {
            this.hasSession = AuthN.restoreSession()
                .then(() => {
                    // below should throw if the token is invalid
                    jwt_claims(AuthN.session());
                    return true;
                })
                .catch(() => false);
        }
    }

    activate() {
        this.hasSession = Promise.resolve(true);
    }

    async logout() {
        await AuthN.logout();
        this.hasSession = Promise.resolve(false);
        this.router.navigate(['/login']);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.hasSession;
    }
}
