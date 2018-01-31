import { Component } from '@angular/core';
import { DbProvider } from '../../providers/db/db';
import { Subscription } from 'rxjs/Subscription';
import { AuthProvider } from '../../providers/auth/auth';
import { ESTADOS_ERVICIO } from '../../config/EstadosServicio';
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
  private audio = new Audio();
  private lengthSolicitudes: number = -1;
  constructor(
    private dbProvider: DbProvider,
    private authProvider: AuthProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DomiciliosActivosPage');
    this.loadPendingSolicitud();

    
    this.audio.src = 'assets/audio/notifynew.mp3';
    
  }

  private loadPendingSolicitud(){
    this.sub = this.dbProvider.listPendingSolicitud().snapshotChanges()
      .subscribe(res=> {
        console.log(res)
        this.notifyNewSolicitud(res.length)
        this.pendingSolicitud = res.sort(( (a,b) =>{
          return Number(b.key) - Number(a.key)
        }))

        

      },err=>{
        console.log(err)
      })
  }

  private notifyNewSolicitud(newLength){
    let _newLength = newLength;
    if (this.lengthSolicitudes == -1) {
      this.lengthSolicitudes= _newLength;
      console.log("Es la primera carga")
      return
    }

    if (this.lengthSolicitudes >= _newLength) {
      console.log(`el tamaño no es mayor ${this.lengthSolicitudes} < ${_newLength}`)
      this.lengthSolicitudes= _newLength;
      return
    }
    console.log("El tamaño es mayor")
    this.lengthSolicitudes= _newLength;
    this.audio.src = 'assets/audio/notifynew.mp3';
    this.audio.load();
    this.audio.play();

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
      Estado: ESTADOS_ERVICIO.EnProceso,
      Motorratoner_id: _uid,
      EnProceso: true
    })
    .then(res=>{
      return this.dbProvider.listLogSolicitud(key).push({
        Estado: ESTADOS_ERVICIO.EnProceso,
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
