import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Category } from 'src/app/modules/product/models/category';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiURL: string;

  constructor(private http: HttpClient) {
    this.apiURL = environment.apiUrl;
   }

   // Fetch categories from the API
  getCategories(): Observable<Category[]> {
    const categoriesUrl = `${this.apiURL}api/categories`;
    return this.http.get<Category[]>(categoriesUrl);
  }

  // Fetch categories from the API
  getCategory(): Observable<Category[]> {
    const categoriesUrl = `${this.apiURL}api/ProductGroup/GetCategories`;
    return this.http.get<Category[]>(categoriesUrl)
    .pipe(
      map((data: any) => {
        return data['mainCategories'] as Category[];
      }))
  }


  
}

