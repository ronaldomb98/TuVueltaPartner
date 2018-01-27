import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {
  private urlParamsSignup: string = '/ParamsRegistro'
  constructor(
    private db: AngularFireDatabase
  ) {
    console.log('Hello DbProvider Provider');
  }

  public getParamsRegistro() {
    return this.db.object(this.urlParamsSignup)
  }

  public objectUserInfo(email){
    return this.db.object(`/Usuarios/${email}`)
  }

  public objectEquipamiento(){
    return this.db.object(`/Equipamiento`)
  }

  public objectSolicitud(key){
    return this.db.object(`/Usuarios/${key}`)
  }

  public listPendingSolicitud(){
    /* let today = new Date();
    let dd = today.getDate()-1;
    let mm = today.getMonth(); //January is 0!
    var yyyy = today.getFullYear();
    let _today = new Date(yyyy, mm, dd).getTime().toString()
    ref.orderByKey().startAt(_today) */
    return this.db.list(
      '/Solicitud', 
      ref => ref.orderByChild('Estado').equalTo('Pendiente')
    )
  }

  public listLogUsuarioEquipamiento(){
    return this.db.list('/Logs/EquipamientoMotorratoner')
  }

}
