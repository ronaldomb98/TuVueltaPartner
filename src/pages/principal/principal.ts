import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomiciliosActivosPage, DomiciliosDisponiblesPage } from '../index.paginas';
 
@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {

   tab1: any;
   tab2: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tab1 = DomiciliosActivosPage;
    this.tab2 = DomiciliosDisponiblesPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrincipalPage');
  }

}
