import { Component } from '@angular/core';
import { DbProvider } from '../../providers/db/db';
import { Subscription } from 'rxjs/Subscription';
import { AuthProvider } from '../../providers/auth/auth';


/**
 * Generated class for the DomiciliosActivosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-domicilios-activos',
  templateUrl: 'domicilios-activos.html',
})
export class DomiciliosActivosPage {

  public pendingSolicitud;
  private sub: Subscription;
  constructor(
    private dbProvider: DbProvider,
    private authProvider: AuthProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DomiciliosActivosPage');
    this.loadPendingSolicitud();
  }

  private loadPendingSolicitud(){
    this.sub = this.dbProvider.listPendingSolicitud().snapshotChanges()
      .subscribe(res=> {
        this.pendingSolicitud = res.sort(( (a,b) =>{
          return Number(b.key) - Number(a.key)
        }))
      },err=>{
        console.log(err)
      })
  }

  orderByCreationDate(){

  }

  ionViewWillUnload(){
    this.sub.unsubscribe();
    console.log('DomiciliosActivosPage ionViewWillUnload')
    
  }
  ionViewDidLeave(){
    console.log('DomiciliosActivosPage ionViewDidLeave')
  }
  ionViewWillLeave(){
    console.log('DomiciliosActivosPage ionViewWillLeave')
  }

  changeState(key, GananciaMensajero){
    let _key = key;
    let _uid = this.authProvider.currentUserUid;
    let date = new Date().getTime()
    this.dbProvider.objectSolicitud(_key)
    .update({
      Estado: "En Proceso",
      Motorratoner_id: _uid,
      EnProceso: true
    })
    .then(res=>{
      return this.dbProvider.listLogSolicitud(key).push({
        Estado: "En Proceso",
        Motorratoner_id: _uid,
        fecha: date
      })
    }).then(res => {
      return this.dbProvider.listLogCreditoRetiro(_uid).push({
        servicio_id: key,
        fecha: date,
        GananciaMensajero: GananciaMensajero
      })
    }).catch(err => {
      console.log(err);
    })
  }

}