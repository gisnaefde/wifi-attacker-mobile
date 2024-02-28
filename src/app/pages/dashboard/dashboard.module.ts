import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { SharedModule } from 'src/app/shared/shared.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { SearchPipe } from './search.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    FontAwesomeModule,
    SharedModule,
    NgxPaginationModule,
    SearchPipe,
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
