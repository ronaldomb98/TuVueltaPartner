import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DomiciliosActivosPage } from './domicilios-activos';

@NgModule({
  declarations: [
    DomiciliosActivosPage,
  ],
  imports: [
    IonicPageModule.forChild(DomiciliosActivosPage),
  ],
})
export class DomiciliosActivosPageModule {}
