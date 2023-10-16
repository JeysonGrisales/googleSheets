import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  
  constructor(private http: HttpClient) { }

  public get(url:string){
    return this.http.get(url)
  }

  post(url: string, data: any): Observable<any> {
    return this.http.post(url, data);
  }

  public put(url: string, data: any): Observable<any> {
    return this.http.put(url, data);
  }

  public delete(url: string): Observable<any> {
    return this.http.delete(url);
  }
  
}
