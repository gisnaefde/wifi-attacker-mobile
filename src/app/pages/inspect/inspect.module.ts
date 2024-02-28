import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InspectPageRoutingModule } from './inspect-routing.module';

import { InspectPage } from './inspect.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InspectPageRoutingModule,
    SharedModule,
    FontAwesomeModule,

  ],
  declarations: [InspectPage]
})
export class InspectPageModule {}
