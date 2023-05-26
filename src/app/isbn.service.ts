import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ISBN } from './isbn.model';

@Injectable({
  providedIn: 'root'
})

export class IsbnService {

  base_url = "https://localhost:7180/api/isbn";

  constructor(private http: HttpClient) { }
  
  validate(input: string): Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(input);

    return this.http.post<any>(this.base_url, body, { headers }).pipe(
      map(data => ({
        isformat: data.isformat,
        isvalid: data.isvalid,
        isbntype: data.type,
        isbnfinal: data.isbn
      }) as ISBN),
      catchError(error => {
        console.error(error);
        return throwError('Server Fehler');
      })
    );
    
  }
}

