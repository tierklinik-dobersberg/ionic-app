import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DxrService {
    private _studyCache: any | null = null;
    constructor(private http: HttpClient) { }

    loadLastStudies(offset: number = 0, limit: number = 10): Observable<any[]> {
        return this.http.get<any[]>(`${environment.dxrUrl}/list`, {params: {
            offset: offset + '',
            limit: limit + ''
        }})
    }

    loadStudy(id: string, refresh: boolean = false): Observable<any> {
        if (!refresh && !!this._studyCache && this._studyCache.studyInstanceUid === id) {
            return of(this._studyCache);
        }
        
        return this.http.get<any>(`${environment.dxrUrl}/ohif/${id}`)
            .pipe(tap(study => this._studyCache = study));
    }

    search(searchTerm: string): Observable<any[]> {
        return this.http.get<any[]>(`${environment.dxrUrl}/search`, {params: {
            q: searchTerm,
        }});
    }

    getThumbnailUrl(wadoURI: string): string {
        const scheme = environment.dxrUrl.startsWith('http://') ? 'http://' : 'https://';
        return wadoURI.replace('dicomweb://', scheme) + '&contentType=image/jpeg';
    }
}
