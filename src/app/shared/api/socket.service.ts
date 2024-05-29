import { Injectable } from '@angular/core';
import { Echo } from 'laravel-echo-ionic';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  echo: any = null;
  private messageSubject = new Subject<any>();

  constructor() {
    // this.campaignData();
  }

  ngOnInit() {
  }

  campaignData() {
    this.echo = new Echo({
      broadcaster: 'socket.io',
      host: 'http://172.15.2.164:6001',
    });

    this.echo.connector.socket.on('connect', function () {
      console.log('CONNECTED');
    });

    this.echo.connector.socket.on('reconnecting', function () {
      console.log('CONNECTING');
    });

    this.echo.connector.socket.on('disconnect', function () {
      console.log('DISCONNECTED');
    });

    this.echo.channel('DeviceChannel')
      .listen('.DeviceMessage', (data: any) => {
        // console.log(data);
        this.messageSubject.next(data);
      });

    return this.messageSubject.asObservable();
  }



}
