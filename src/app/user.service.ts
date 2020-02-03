import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as AuthN from 'keratin-authn';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface JWTClaims {
    iss: string;
    aud: string;
    sub: number;
    iat: number;
    exp: number;
}

export interface User {
    username: string;
    accountID: number;
    urn: string;
    phone: string;
    lastname: string;
    firstname: string;
    job: string;
    email: string;
    street: string;
    city: string;
    cityCode: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserService implements HttpInterceptor {
    constructor(private _http: HttpClient) {}
    
    /**
     * Loads the profile of the currently logged in user
     */
    getProfile(): Observable<User> {
        const accountID = this.getAccountID();
        return this._http.get<User>(`${environment.iamServer}/v1/users/${accountID}`)
    }

    /**
     * Updates the profile of a user
     * 
     * @param u - The user to save
     */
    saveProfile(u: User): Observable<User> {
        const accountID = this.getAccountID();
        return this._http.put<User>(`${environment.iamServer}/v1/users/${accountID}`, {
            ...u,
            username: undefined, // remove username from request
        });
    }

    /**
     * Returns the account ID of the currently logged in user
     */
    getAccountID(): number | null {
        try {
            const claims = jwt_claims(AuthN.session());
            return claims.sub;
        } catch (err) {
            console.error(`No valid user session found`, err);
            return null;
        }
    }

    /**
     * Intercepts outgoing HTTP requests and adds the JWT token
     *
     * @implements HttpInterceptor
     *
     * BUG(ppacher): currently all requests from the HttpClient are intercepted.
     * Make sure to only append the JWT token if the destination server is trusted
     * (ie. whitelist iam, authn, dxray, ... or the entire top-level domain)
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (AuthN.session() != undefined) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${AuthN.session()}`
                }
            })
        }

        return next.handle(req);
    }
}


export function jwt_claims(jwt: string): JWTClaims {
    try {
        return JSON.parse(atob(jwt.split('.')[1]));
    } catch(e) {
        throw 'Malformed JWT: invalid encoding in ' + jwt;
    }
}