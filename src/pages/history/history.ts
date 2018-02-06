import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { Subscription } from 'rxjs/Subscription';
import { AuthProvider } from '../../providers/auth/auth';
import { HistoryDetailPage } from '../history-detail/history-detail';

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  public solicitudes;
  private sub: Subscription;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dbProvider: DbProvider,
    private authProvider: AuthProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
    this.loadSolicitud();
  }

  ionViewWillUnload(){
    console.log("Saliendo de HistoryPage")
    this.sub.unsubscribe();
  }

  loadSolicitud(){
    const uid = this.authProvider.currentUserUid;
    this.sub = this.dbProvider.listSolicitud(uid).snapshotChanges().subscribe(res => {
      const solicitudes = [];
      const _solicitudes = res.sort( (a,b) =>{
        return Number(b.key) - Number(a.key)
      });

      _solicitudes.forEach(_solicitud => {
        const date = new Date(Number(_solicitud.key))  
        const month = date.getMonth();
        if (!solicitudes[month]){
          solicitudes[month] = {month: this.getMonthName(month), solicitudes: [_solicitud]}
        }else {
          solicitudes[month].solicitudes.push( _solicitud)
        }
      });

      this.solicitudes = solicitudes.reverse();
      console.log(this.solicitudes)
    })
  }

  showSolicitud(solicitud){
    this.navCtrl.push(HistoryDetailPage, { solicitud: solicitud})
  }

  getMonthName(month): string{
    switch (month) {
      case 0:
        return "Enero"
        
      case 1:
        return "Febrero"
        
      case 2:
        return "Marzo"
        
      case 3:
        return "Abril"
        
      case 4:
        return "Mayo"
        
      case 5:
        return "Junio"
        
      case 6:
        return "Julio"
        
      case 7:
        return "Agosto"
        
      case 8:
        return "Septiembre"
        
      case 9:
        return "Octubre"
        
      case 10:
        return "Noviembre"
        
      case 11:
        return "Diciembre"
        
      default:
        return "Mes No Definido"
        
    }
  }

}
