import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  pdf(id:any) {
    return this.http.get(`${this.apiUrl}/export-pdf/${id}`,{ responseType: 'blob' })
  }

  xlsx(id:any) {
    return this.http.get(`${this.apiUrl}/export-xlsx/${id}`,{ responseType: 'blob' })
  }
}
