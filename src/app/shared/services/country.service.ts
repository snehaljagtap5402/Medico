import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiURL: string;

  constructor(private http: HttpClient) {
    this.apiURL = environment.apiUrl;
   }


  getCountries(): Observable<GetCountriesResult[]> {
    return this.http.get<GetCountriesResult[]>(`${this.apiURL}api/Country`);
  }
}

export interface GetCountriesResult {
  id: number;
  description: string;
}