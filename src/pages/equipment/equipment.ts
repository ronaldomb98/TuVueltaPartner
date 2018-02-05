import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { PrincipalPage } from '../principal/principal';
import { Subscription } from 'rxjs/Subscription';
import { Geolocation, GeolocationOptions, PositionError} from '@ionic-native/geolocation'

/**
 * Generated class for the EquipmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-equipment',
  templateUrl: 'equipment.html',
})
export class EquipmentPage {
  public equipment;
  public form: FormGroup;
  public sub: Subscription;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dbProvider: DbProvider,
    private formBuilder: FormBuilder,
    private authProvider: AuthProvider,
    private geolocation: Geolocation,
    private platform: Platform
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipmentPage');
    this.loadObjectEquipamiento();
    this.buildForm();
  }

  ionViewWillUnload(){
    console.log('Equipament ionViewWillUnload')
    this.sub.unsubscribe();
  }
  ionViewDidLeave(){
    console.log('Equipament ionViewDidLeave')
  }
  ionViewWillLeave(){
    console.log('Equipament ionViewWillLeave')
  }

  buildForm(){
    this.form = this.formBuilder.group({
      EquipoMoto: this.formBuilder.control(null, Validators.required),
      EquipoMensajero: this.formBuilder.control(null, Validators.required),
      ChaquetaMensajero: this.formBuilder.control(null, Validators.required),
      MontoParaTrabajarHoy: this.formBuilder.control(null, Validators.required)
    })
  }

  loadObjectEquipamiento(){
    this.sub = this.dbProvider.objectEquipamiento().snapshotChanges().subscribe(res=>{
      console.log(res.payload.val())
      this.equipment = res.payload.val()
    })
  }

  _onSubmit(){
    let data = this.form.value;
    const date = new Date().getTime();
    const uid = this.authProvider.currentUserUid;
    this.dbProvider.objectLogUsuarioEquipamiento(uid, date)
    .update(data)
    .then(()=>{
      return this.navCtrl.setRoot(PrincipalPage);
    }).then(()=>{
      return this.navCtrl.popToRoot();
    })
    
    
  }
  onSubmit() {
    let options: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 30000
    };
    this.platform.ready().then(()=>{
      return this.geolocation.getCurrentPosition(options)
    })
    .then(response => {
      let data = this.form.value;
      data.LatLng = response.coords.latitude+','+response.coords.longitude;
      const date = new Date().getTime();
      
      const uid = this.authProvider.currentUserUid;
      return this.dbProvider.objectLogUsuarioEquipamiento(uid, date)
        .update(data)
    })
    .then(()=> {
      return this.navCtrl.setRoot(PrincipalPage);
    })
    .then(()=>{
      return this.navCtrl.popToRoot();
    })
    .catch((err: PositionError) => {
      console.log("Error obteniendo location")
      
    })
    
    
  }
  get EquipoMoto() { return this.form.get('EquipoMoto') }
  get EquipoMensajero() { return this.form.get('EquipoMensajero') }
  get ChaquetaMensajero() { return this.form.get('ChaquetaMensajero') }
  get MontoParaTrabajarHoy() { return this.form.get('MontoParaTrabajarHoy') }

}
