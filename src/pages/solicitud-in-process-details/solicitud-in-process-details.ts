import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { Subscription } from 'rxjs/Subscription';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the SolicitudInProcessDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-solicitud-in-process-details',
  templateUrl: 'solicitud-in-process-details.html',
})
export class SolicitudInProcessDetailsPage {
  private sub: Subscription;
  public solicitudDetails;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public dbProvider: DbProvider,
    public authProvider: AuthProvider
  ) {
  }

  ionViewWillUnload(){
    this.sub.unsubscribe();
    console.log('SolicitudInProcessDetailsPage ionViewWillUnload')
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SolicitudInProcessDetailsPage');
    this.loadSolicitudData();
  }

  loadSolicitudData(){
    
    this.sub = this.getSolicitudObject().snapshotChanges().subscribe(res=> {
      console.log(res.payload.val());
      this.solicitudDetails = res;
    })
  }

  getSolicitudObject(){
    let key = this.navParams.get('key');
    return this.dbProvider.objectSolicitud(key)
  }

  changeStateToEnSitio(){
    this.updateSolicitudEstado("En Sitio")
  }

  changeStateToDespachado(){
    this.updateSolicitudEstado("Despachado")
  }

  changeStateToFinalizado(){
    this.updateSolicitudEstado("Finalizado", true)
  }
  
  changeStateToDondeElCliente(){
    this.updateSolicitudEstado("En Punto")
  }

  updateSolicitudEstado(state, isFinalizado=false){
    let key = this.navParams.get('key')
    let _uid = this.authProvider.currentUserUid;
    let date = new Date().getTime()
    this.getSolicitudObject().update({
      Estado: state,
      EnProceso: !isFinalizado
    }).then(res=>{
      return this.dbProvider.listLogSolicitud(key).push({
        Estado: state,
        Motorratoner_id: _uid,
        fecha: date
      })
    })
  }


  goBack(){
    this.navCtrl.pop();
  }

}
