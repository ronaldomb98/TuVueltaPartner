import { Component, OnInit } from '@angular/core';
import { DbProvider } from '../../providers/db/db';
import { Subscription } from 'rxjs/Subscription';
import { AuthProvider } from '../../providers/auth/auth';
import { ESTADOS_ERVICIO } from '../../config/EstadosServicio';
import { ESTADOS_USUARIO } from '../../config/EstadosUsuario';
import { AlertController, AlertOptions, AlertButton, Alert } from 'ionic-angular';

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
  public confirmCompra: Alert;
  public isActive = this.authProvider.userState == ESTADOS_USUARIO.Activo;
  constructor(
    private dbProvider: DbProvider,
    private authProvider: AuthProvider,
    private alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DomiciliosActivosPage');
    
    if (this.isActive){
      this.loadPendingSolicitud();    
      this.audio.src = 'assets/audio/notifynew.mp3';
    }else {
      this.sub = new Subscription();
    } 
  }

  loadConfirm(service){
    const cancelButton: AlertButton = {
      text: 'Cancelar',
      role: 'cancel'
    }
    const confirmButton: AlertButton = {
      text: 'Comprar',
      handler: () => {
        this.changeState(service)
      }
    }
    let options: AlertOptions = {
      title: 'Confirmar Compra',
      message: '¿Desea confirmar la compra de esta solicitud?',
      buttons: [cancelButton, confirmButton]
    }
    this.confirmCompra = this.alertCtrl.create(options);
    this.confirmCompra.present();
  }



  private loadPendingSolicitud(){
    this.sub = this.dbProvider.listPendingSolicitud().snapshotChanges()
      .subscribe(res=> {
        this.notifyNewSolicitud(res.length)
        this.pendingSolicitud = res.sort(( (a,b) =>{
          return Number(b.key) - Number(a.key)
        }))

        

      },err=>{
        console.log(err)
      })
  }

  private presentConfirm() {

  }

  private notifyNewSolicitud(newLength){
    let _newLength = newLength;
    if (this.lengthSolicitudes == -1) {
      this.lengthSolicitudes= _newLength;
      return
    }

    if (this.lengthSolicitudes >= _newLength) {
      this.lengthSolicitudes= _newLength;
      return
    }
    this.lengthSolicitudes= _newLength;
    this.audio.src = 'assets/audio/notifynew.mp3';
    this.audio.load();
    this.audio.play();

  }

  ionViewWillUnload(){
    this.sub.unsubscribe();
    console.log("unsuscribiendo solicitudes pendientes")
    console.log('DomiciliosActivosPage ionViewWillUnload')
    
  }
  ionViewDidLeave(){
    console.log('DomiciliosActivosPage ionViewDidLeave')
  }
  ionViewWillLeave(){
    console.log('DomiciliosActivosPage ionViewWillLeave')
  }

  changeState(service){
    let GananciaMensajero = service.payload.val().GananciaMensajero
    let _key = service.key;
    let _uid = this.authProvider.currentUserUid;
    let date = new Date().getTime()
    let bonoRelanzamiento = service.payload.val().BonoRelanzamiento;
    if (bonoRelanzamiento){
      GananciaMensajero+= bonoRelanzamiento
    }
    
    this.dbProvider.objectSolicitud(_key)
    .update({
      Estado: ESTADOS_ERVICIO.EnProceso,
      Motorratoner_id: _uid,
      EnProceso: true,
      fechaCompra: date
    })
    .then(res=>{
      return this.dbProvider.objectLogSolicitud(_key, date).update({
        Estado: ESTADOS_ERVICIO.EnProceso,
        Motorratoner_id: _uid
      })
    }).then(res => {
      return this.dbProvider.objectLogCreditoRetiro(_uid, date).update({
        servicio_id: _key,
        GananciaMensajero: GananciaMensajero
      })
    }).catch(err => {
      console.log(err);
    })
  }

}
