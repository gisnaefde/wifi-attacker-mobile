import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WebSocketPageRoutingModule } from './web-socket-routing.module';

import { WebSocketPage } from './web-socket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebSocketPageRoutingModule
  ],
  declarations: [WebSocketPage]
})
export class WebSocketPageModule {}
