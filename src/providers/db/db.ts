import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {
  private urlParamsSignup: string = '/Administrativo/ParamsRegistro'
  constructor(
    private db: AngularFireDatabase
  ) {
    console.log('Hello DbProvider Provider');
  }

  public getParamsRegistro() {
    return this.db.object(this.urlParamsSignup)
  }

  public objectUserInfo(uid){
    return this.db.object(`/Administrativo/Usuarios/${uid}`)
  }

  public objectEquipamiento(){
    return this.db.object(`/Administrativo/Equipamiento`)
  }

  public objectSolicitud(key){
    return this.db.object(`/Operativo/Solicitud/${key}`)
  }

  public listPendingSolicitud(){
    /* let today = new Date();
    let dd = today.getDate()-1;
    let mm = today.getMonth(); //January is 0!
    var yyyy = today.getFullYear();
    let _today = new Date(yyyy, mm, dd).getTime().toString()
    ref.orderByKey().startAt(_today) */
    return this.db.list(
      '/Operativo/Solicitud', 
      ref => ref.orderByChild('Estado').equalTo('Pendiente')
    )
  }
  public listInProccessSolicitud(){
    return this.db.list('/Operativo/Solicitud', ref => ref.orderByChild('EnProceso').equalTo(true))
  }
  public listLogUsuarioEquipamiento(uid){
    return this.db.list(`/Operativo/Logs/EquipamientoMotorratoner/${uid}`)
  }

  public listLogCreditoRetiro(key) {
    return this.db.list(`/Operativo/Logs/CreditosMensajero/CreditoRetiro/${key}`)
  }

  public listLogCreditoNoRetiro() {
    return this.db.list('/Operativo/Logs/CreditosMensajero/CreditoNoRetiro')
  }

  public listLogSolicitud(key){
    return this.db.list(`/Operativo/Logs/Solicitud/${key}`)
  }

}
