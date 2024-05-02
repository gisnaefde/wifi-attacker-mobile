import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebSocketPage } from './web-socket.page';

const routes: Routes = [
  {
    path: '',
    component: WebSocketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebSocketPageRoutingModule {}
