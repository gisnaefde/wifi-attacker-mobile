import { Component, OnInit } from '@angular/core';
import {Echo} from 'laravel-echo-ionic';
import { SocketService } from 'src/app/shared/api/socket.service';

@Component({
  selector: 'app-web-socket',
  templateUrl: './web-socket.page.html',
  styleUrls: ['./web-socket.page.scss'],
})
export class WebSocketPage implements OnInit {

  // echo: any = null;

    constructor(private socketService: SocketService) {
        // this.echo = new Echo({
        //     broadcaster: 'socket.io',
        //     host: 'http://172.15.2.212:6001',
        // });

        // this.echo.connector.socket.on('connect', function () {
        //     console.log('CONNECTED');
        // });

        // this.echo.connector.socket.on('reconnecting', function () {
        //     console.log('CONNECTING');
        // });

        // this.echo.connector.socket.on('disconnect', function () {
        //     console.log('DISCONNECTED');
        // });

        // this.echo.channel('DeviceChannel')
        //     .listen('.DeviceMessage', (data:any) => {
        //         console.log(data);
        //     });

    }

  ngOnInit() {
    this.socketService.campaignData().subscribe(
      (data: any) => {
        console.log(data.data.campaign )
      },
      (error:any)=>{
        console.log(error)
      }
    );
  }

}
