import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RespuestaNoticias } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GestionApiService {

  private apiData = new BehaviorSubject<{ categoria: string; totalResults: number }[]>([]);
  apiData$ = this.apiData.asObservable();

  private datos: { categoria: string; totalResults: number }[] = [];

  private categorias = ['business','entertainment','general','technology','health','science','sports'];

  constructor(private http: HttpClient) { }

  fetchAllCategories() {
    this.datos = []; // reset

    this.categorias.forEach(cat => {
      this.http.get<RespuestaNoticias>(`${environment.apiUrl}/top-headlines`, {
        params: { country: 'us', category: cat, apiKey: environment.apiKey }
      }).subscribe({
        next: (res) => {
          this.datos.push({ categoria: cat, totalResults: res.totalResults || 0 });
          this.apiData.next([...this.datos]);
        },
        error: () => {
          this.datos.push({ categoria: cat, totalResults: 0 });
          this.apiData.next([...this.datos]);
        }
      });
    });
  }
}
