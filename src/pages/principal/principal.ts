import { Component } from '@angular/core';
import { DomiciliosActivosPage } from '../domicilios-activos/domicilios-activos';
import { DomiciliosDisponiblesPage } from '../domicilios-disponibles/domicilios-disponibles';

 

@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {

   tab1: any;
   tab2: any;

  constructor() {
    this.tab1 = DomiciliosActivosPage;
    this.tab2 = DomiciliosDisponiblesPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrincipalPage');
  }

}
