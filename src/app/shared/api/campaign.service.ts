import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private apiUrl = 'http://172.15.3.99/api';
  private campaignUpdates = new Subject<any>();


  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    })
  };

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get(`${this.apiUrl}/campaign-list`, this.httpOptions)
  }

  create(name: any) {
    const body = { name };
    return this.http.post(`${this.apiUrl}/campaign`, body, this.httpOptions)
  }

  toCampaign(id:any){
    const body = {id};
    return this.http.get(`${this.apiUrl}/campaign/data/${id}`, this.httpOptions)
  }

  delete(id: any) {
    const body = { id };
    return this.http.delete(`${this.apiUrl}/campaign-delete/${id}`, this.httpOptions)
  }

  inspect(id:any){
    const body= {id};
    return this.http.get(`${this.apiUrl}/wifi/inspect/${id}`,  this.httpOptions)
  }

  attack(id:any){
    const body= {id};
    return this.http.get(`${this.apiUrl}/wifi/attack/${id}`,  this.httpOptions)
  }
  stopAttack(id:any){
    const body= {id};
    return this.http.get(`${this.apiUrl}/wifi/stop/${id}`,  this.httpOptions)
  }


  //for check ststus campaign is active or inactive
  status(id:any){
    const body = {id};
    return this.http.get(`${this.apiUrl}/campaign/data/${id}`, this.httpOptions)
  }

  stop(){
    return this.http.get(`${this.apiUrl}/campaign-stop`,  this.httpOptions)
  }
}
