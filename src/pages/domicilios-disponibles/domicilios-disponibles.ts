import { Component } from '@angular/core';
import { DbProvider } from '../../providers/db/db';
import { Subscription } from 'rxjs/Subscription';
import { AuthProvider } from '../../providers/auth/auth';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { SolicitudInProcessDetailsPage } from '../solicitud-in-process-details/solicitud-in-process-details';
import { ESTADOS_USUARIO } from '../../config/EstadosUsuario';
import { DomiciliosProvider } from '../../providers/domicilios/domicilios';

/**
 * Generated class for the DomiciliosDisponiblesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-domicilios-disponibles',
  templateUrl: 'domicilios-disponibles.html',
})
export class DomiciliosDisponiblesPage {

  
  public isActive = this.authProvider.userState === ESTADOS_USUARIO.Activo;
  public currentTime: number;
  constructor(
    private dbProvider: DbProvider,
    private authProvider: AuthProvider,
    private navCtrl: NavController,
    public domiciliosProvider: DomiciliosProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DomiciliosDisponiblesPage');
    this.clockInterval();

  }

  clockInterval(){
    setInterval(()=> {
      this.currentTime = new Date().getTime();
    }, 1000)
  }

  

  public relaunch(service){
    const serviceKey = service.key;
    const GananciaMensajero = service.payload.val().GananciaMensajero;
    let bonoRelanzamiento = 0;
    if (service.payload.val().BonoRelanzamiento){ 
      bonoRelanzamiento += service.payload.val().BonoRelanzamiento;
    }
    return this.dbProvider.relaunchSolicitud(serviceKey, GananciaMensajero, bonoRelanzamiento)
  }

  openScheduleDetails(key){
    this.navCtrl.push(SolicitudInProcessDetailsPage, { key: key })
  }

  ionViewWillUnload(){
    console.log("unsuscribiendo solicitudes En Proceso")
    /* this.domiciliosProvider.subInProcces.unsubscribe(); */
    console.log('DomiciliosDisponiblesPage ionViewWillUnload')
    
  }
  ionViewDidLeave(){
    console.log('DomiciliosDisponiblesPage ionViewDidLeave')
  }
  ionViewWillLeave(){
    console.log('DomiciliosDisponiblesPage ionViewWillLeave')
  }

}
