import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DomiciliosDisponiblesPage } from './domicilios-disponibles';

@NgModule({
  declarations: [
    DomiciliosDisponiblesPage,
  ],
  imports: [
    IonicPageModule.forChild(DomiciliosDisponiblesPage),
  ],
})
export class DomiciliosDisponiblesPageModule {}
