import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { Subscription } from 'rxjs/Subscription';
import { AuthProvider } from '../../providers/auth/auth';
import { ESTADOS_ERVICIO } from '../../config/EstadosServicio';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { LoadingProvider } from '../../providers/loading/loading';
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
  public currentTime:number;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public dbProvider: DbProvider,
    public authProvider: AuthProvider,
    private launchNavigator: LaunchNavigator,
    private loadingProvider: LoadingProvider
  ) {
  }

  clockInterval(){
    setInterval(()=> {
      this.currentTime = new Date().getTime();
    }, 1000)
  }

  ionViewWillUnload(){
    this.sub.unsubscribe();
    console.log('SolicitudInProcessDetailsPage ionViewWillUnload')
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SolicitudInProcessDetailsPage');
    this.loadSolicitudData();
    this.clockInterval();
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

  changeStateToEnSitio():void {
    const newEstate = ESTADOS_ERVICIO.EnSitio
    this.updateSolicitudEstado(newEstate)
  }

  changeStateToDespachado():void {
    const newEstate = ESTADOS_ERVICIO.Despachado
    this.updateSolicitudEstado(newEstate)
  }

  changeStateToDondeElCliente():void {
    const newEstate = ESTADOS_ERVICIO.EnPunto
    this.updateSolicitudEstado(newEstate)
  }

  changeStateToDevolucionDatafono():void {
    const newEstate = ESTADOS_ERVICIO.DevolucionDatafono
    this.updateSolicitudEstado(newEstate)
  }

  changeStateToFinalizado():void {
    const newEstate = ESTADOS_ERVICIO.Finalizado
    this.updateSolicitudEstado(newEstate, true)
  }

  updateSolicitudEstado(state, isFinalizado=false){
    let key = this.navParams.get('key')
    let _uid = this.authProvider.currentUserUid;
    let date = new Date().getTime()
    this.getSolicitudObject().update({
      Estado: state,
      EnProceso: !isFinalizado
    }).then(res=>{
      return this.dbProvider.objectLogSolicitud(key,date).update({
        Estado: state,
        Motorratoner_id: _uid
      })
    })
  }

  public relaunch(service){
    const serviceKey = service.key;
    const GananciaMensajero = service.payload.val().GananciaMensajero;
    let bonoRelanzamiento = 0;
    if (service.payload.val().BonoRelanzamiento){ 
      bonoRelanzamiento += service.payload.val().BonoRelanzamiento;
    }
    this.navCtrl.pop().then(()=>{
      return this.dbProvider.relaunchSolicitud(serviceKey, GananciaMensajero, bonoRelanzamiento)
    }) 
    .catch(err => {
      console.log("Algo salio mal relanzando la solicitud")
    });
  }


  goBack(){
    this.navCtrl.pop();
  }

  openNavigator(isOrigin){
    const destination= isOrigin ? this.solicitudDetails.payload.val().puntoInicialCoors : this.solicitudDetails.payload.val().puntoFinalCoors
    this.launchNavigator.navigate(destination)
      .catch(err=>{
        const loading = this.loadingProvider.createUpdatedToast(3000, "Algo salio mal abriendo el navegador");
        loading.present();
      })
  }

}
