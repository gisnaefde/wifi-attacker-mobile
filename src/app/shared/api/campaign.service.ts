import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private apiUrl = environment.apiUrl;
  private campaignUpdates = new Subject<any>();


  // private httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer ' + localStorage.getItem('token'),
  //   })
  // };

  constructor(private http: HttpClient) { }

  // list() {
  //   return this.http.get(`${this.apiUrl}/campaign-list`, this.httpOptions)
  // }
  list() {
    return this.http.get(`${this.apiUrl}/campaign-list`)
  }

  create(name: any) {
    const body = { name };
    return this.http.post(`${this.apiUrl}/campaign`, body)
  }

  toCampaign(id:any){
    return this.http.get(`${this.apiUrl}/campaign/data/${id}`)
  }

  delete(id: any) {

    return this.http.delete(`${this.apiUrl}/campaign-delete/${id}`)
  }

  inspect(id:any){
    return this.http.get(`${this.apiUrl}/wifi/inspect/${id}`)
  }

  attack(id:any){
    return this.http.get(`${this.apiUrl}/wifi/attack/${id}`)
  }
  stopAttack(id:any){
    return this.http.get(`${this.apiUrl}/wifi/stop/${id}`)
  }

  rogueAp(){
    return this.http.get(`${this.apiUrl}/rogueap`)
  }

  setalert(id:any){
    return this.http.get(`${this.apiUrl}/set-alert/${id}`)
  }

  //for check ststus campaign is active or inactive
  status(id:any){
    const body = {id};
    return this.http.get(`${this.apiUrl}/campaign/data/${id}`)
  }

  stop(){
    return this.http.get(`${this.apiUrl}/campaign-stop`)
  }
}
