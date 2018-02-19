import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { Subscription } from 'rxjs/Subscription';
import { AuthProvider } from '../../providers/auth/auth';
import { ESTADOS_ERVICIO } from '../../config/EstadosServicio';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { LoadingProvider } from '../../providers/loading/loading';
import { GeolocationOptions, Geolocation, Geoposition } from '@ionic-native/geolocation';
import { DistancematrixProvider } from '../../providers/distancematrix/distancematrix';
import { HttpClient } from '@angular/common/http';
import { DomiciliosProvider } from '../../providers/domicilios/domicilios';
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
    private loadingProvider: LoadingProvider,
    private platform: Platform,
    private geolocation: Geolocation,
    private distanceMatrixProvider: DistancematrixProvider,
    private http: HttpClient,
    public domiciliosProvider: DomiciliosProvider
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

  calcDistanceFromPoints(){
    let options: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 300000000
    };

    this.platform.ready().then(()=>{
      return this.geolocation.getCurrentPosition(options)
    }).then((_geolocation: Geoposition) => {
      const origin = _geolocation.coords.latitude + ',' + _geolocation.coords.longitude;
      alert(origin)
      const puntoInicio = this.solicitudDetails.payload.val().puntoInicialCoors;
      const puntoFinal = this.solicitudDetails.payload.val().puntoFinalCoors;
      const destinations = `${puntoInicio}|${puntoFinal}`
      alert(JSON.stringify(this.solicitudDetails))
      alert(destinations)
      return this.distanceMatrixProvider.getDistance(origin, destinations).toPromise()
    }).then((res: any) => {
      const elements = res.rows[0].elements
      this.solicitudDetails['DistanceFromPuntoInicio'] = elements[0].distance.value;
      this.solicitudDetails['DistanceFromPuntoFinal'] = elements[1].distance.value;
      return this.http.patch(`https://tuvueltap.firebaseio.com/distancematrix.json`,res).toPromise();
    }).then(res=>{
      alert(res)
    }).catch(err => {
      alert(err)
    })
  }

  loadSolicitudData(){
    
    this.sub = this.getSolicitudObject().snapshotChanges().subscribe(res=> {
      console.log(res.payload.val());
      this.solicitudDetails = res;
      this.calcDistanceFromPoints();
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
