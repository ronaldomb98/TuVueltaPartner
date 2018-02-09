import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ESTADOS_ERVICIO } from '../../config/EstadosServicio';
import { AuthProvider } from '../auth/auth';
import { LoadingProvider } from '../loading/loading';
import { Subscription } from 'rxjs/Subscription';
import { Reference } from '@firebase/database-types';
import { HttpClient } from '@angular/common/http';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {
  private urlParamsSignup: string = '/Administrativo/ParamsRegistro'
  constructor(
    private db: AngularFireDatabase,
    private authProvider: AuthProvider,
    private loadingProvider: LoadingProvider,
    private http: HttpClient
  ) {
    console.log('Hello DbProvider Provider');
  }

  public getParamsRegistro() {
    return this.db.object(this.urlParamsSignup)
  }

  public objectUserInfo(uid){
    return this.db.object(`/Administrativo/Usuarios/${uid}`)
  }

  public testobjectUserInfo(uid){
    return this.http.get(`/Administrativo/Usuarios/${uid}`)
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

  public objectLogUsuarioEquipamiento(uid, date){
    return this.db.object(`/Operativo/Logs/EquipamientoMotorratoner/${uid}/${date}`)
  }

  public listLogCreditoRetiro(key) {
    return this.db.list(`/Operativo/Logs/CreditosMensajero/CreditoRetiro/${key}`)
  }

  public objectLogCreditoRetiro(userId, date) {
    return this.db.object(`/Operativo/Logs/CreditosMensajero/CreditoRetiro/${userId}/${date}`)
  }

  public objectLogRelanzamientos(userId, date) {
    return this.db.object(`/Operativo/Logs/CreditosMensajero/Relanzamientos/${userId}/${date}`)
  }

  public listLogCreditoNoRetiro(key) {
    return this.db.list(`/Operativo/Logs/CreditosMensajero/CreditoNoRetiro/${key}`)
  }

  public listLogSolicitud(key){
    return this.db.list(`/Operativo/Logs/Solicitud/${key}`)
  }

  public objectLogSolicitud(key, date){
    return this.db.object(`/Operativo/Logs/Solicitud/${key}/${date}`);
  }
  public objectLogsSolicitud(key){
    return this.db.object(`/Operativo/Logs/Solicitud/${key}`);
  }
  
  public objectLogRetiros(key, date){
    return this.db.object(`/Operativo/Logs/CreditosMensajero/Retiros/${key}/${date}`);
  }

  public objectGananciasMensajero(key) {
    return this.db.object(`/Operativo/Logs/GananciasMensjero/${key}`)
  }

  public listSolicitud(key){
    return this.db.list(`/Operativo/Solicitud`, (ref: Reference) => 
      ref.orderByChild('Motorratoner_id').equalTo(key)
    )
  }

  public relaunchSolicitud(serviceKey, GananciaMensajero, bonoRelanzamiento){
    const userId = this.authProvider.currentUserUid;
    const date = new Date().getTime();
    let _bonoRelanzamiento = 0;
    _bonoRelanzamiento += bonoRelanzamiento;
    
    const relounchLogData = {
      servicio_id: serviceKey,
      Multa: 2000,
      GananciaMensajero: GananciaMensajero + _bonoRelanzamiento
    };
    _bonoRelanzamiento+= 1500;
    const solicitudData = {
      Estado: ESTADOS_ERVICIO.Pendiente,
      EnProceso: false,
      BonoRelanzamiento: _bonoRelanzamiento
    }
    
    const loading = this.loadingProvider.createLoading()
    const infoToUpdate = loading.present().then((()=>{
      const p_relounch = this.objectLogRelanzamientos(userId, date).update(relounchLogData)
      const p_service = this.objectSolicitud(serviceKey).update(solicitudData);
      return Promise.all([p_relounch, p_service]);
    }))
    return infoToUpdate.then(()=>{
      loading.dismiss();
      return this.loadingProvider.createUpdatedToast().present();
    })
  }

  public subGanancias: Subscription;
  public gananciasMensajero;
  loadGananciasMensajero() {
    
    if (this.gananciasMensajero){
      console.log("Unsuscribiendo ganancias mensajero")
      this.subGanancias.unsubscribe();
    }
    
    const uid = this.authProvider.currentUserUid;
    const gananciasMensajero = this.objectGananciasMensajero(uid).snapshotChanges();
    this.subGanancias = gananciasMensajero.subscribe(response => {
      this.gananciasMensajero = response.payload.val();
      console.log()
      this.gananciasMensajero = {
        CreditosRetiro: 0,
        CreditosNoRetiro: 0
      }
      
      if (response.payload.val()){
        if (response.payload.val().CreditosRetiro) {
          this.gananciasMensajero.CreditosRetiro = response.payload.val().CreditosRetiro;
        }
  
        if (response.payload.val().CreditosNoRetiro) {
          this.gananciasMensajero.CreditosNoRetiro = response.payload.val().CreditosNoRetiro;
        }
      }
      

      /* this.amountToRetiro=this.gananciasMensajero.CreditosNoRetiro + this.gananciasMensajero.CreditosRetiro; */
    })
  }

  objectReglasActivos(){
    return this.db.object('/Administrativo/ReglasActivos')
  }



}
