import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.lm';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cacheable } from 'ngx-cacheable';

@Injectable({
  providedIn: 'root'
})
export class AsanaService {

  private asanaUrl: string = environment.asanaUrl;
  private asanaKey: string = environment.asanaKey;

  protected http: HttpClient
  constructor(http: HttpClient) {
    this.http = http;
   }

  @Cacheable()
  public get(service: string, params?: HttpParams): Observable<any> {
    return this.getObservable(service, params).pipe(
      map(res => res.data)
    )
  }
  private getObservable(service: string, params?: HttpParams): Observable<any> {
    let url: string = this.asanaUrl+'/'+service;

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.asanaKey);

    let options = {
      headers: new HttpHeaders(), 
      params: new HttpParams()
    };
    options.headers = headers;
    options.params = params;

    return this.http.get(url, options);
  }

}
