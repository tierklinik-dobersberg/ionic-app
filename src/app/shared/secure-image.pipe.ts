
import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { map, tap, flatMap } from 'rxjs/operators';

@Pipe({
  name: 'secureImage'
})
export class SecureImagePipe implements PipeTransform {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }
  
  transform(url: string | Observable<string>): Observable<SafeUrl> {
    let source: Observable<string>;
    if (typeof url == 'object') {
        source = url;
    } else {
        console.log(url);
        source = of(url);
    }

    return source.pipe(
        flatMap(u => this.http.get(u, {responseType: 'blob'})),
        map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))),
    )
  }
}