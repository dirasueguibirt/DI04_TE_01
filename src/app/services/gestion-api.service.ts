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

  apiKey: string = environment.apiKey;
  apiUrl: string = environment.apiUrl;

  // Mantener el mismo tipo de datos: objeto individual o undefined
  private datosSubject = new BehaviorSubject<{ categoria: string; totalResults: number } | undefined>(undefined);
  public datos$ = this.datosSubject.asObservable();

  constructor(private http: HttpClient) { }

  public cargarCategoria(categoria: string) {
    this.http.get<RespuestaNoticias>(`${this.apiUrl}top-headlines?country=us&category=${categoria}&apiKey=${this.apiKey}`)
      .pipe(
        map(data => {
          if (data && data.totalResults !== undefined) {
            return { categoria: categoria, totalResults: data.totalResults };
          } else {
            throw new Error(`totalResults indefinido para ${categoria}`);
          }
        }),
        catchError(err => {
          console.error(err);
          return of(undefined); // emitimos undefined si hay error
        })
      )
      .subscribe(resultado => {
        if (resultado) {
          this.datosSubject.next(resultado); // emitimos **cada categoría individualmente**
        }
      });
  }

  public fetchAllCategories() {
    const categorias = [
      'business',
      'entertainment',
      'general',
      'health',
      'science',
      'sports',
      'technology'
    ];

    // Emitir cada categoría de forma individual
    categorias.forEach(cat => this.cargarCategoria(cat));
  }
}
