import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private apiUrl = 'http://172.15.3.99/api';
  private campaignUpdates = new Subject<any>();


  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    })
  };

  constructor(private http: HttpClient) { }

  setting() {
    return this.http.get(`${this.apiUrl}/settings`, this.httpOptions)
  }

  update(attack_automation :any, token_tele:any, id_chat_tele:any) {
    const body = { attack_automation, token_tele, id_chat_tele};
    return this.http.post(`${this.apiUrl}/update/tele`, body, this.httpOptions)
  }


}
