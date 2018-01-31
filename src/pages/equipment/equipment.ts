import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { PrincipalPage } from '../principal/principal';
import { Subscription } from 'rxjs/Subscription';


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
    private authProvider: AuthProvider
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

  onSubmit(){
    let data = this.form.value;
    data.Fecha = new Date().getTime();
    const uid = this.authProvider.currentUserUid;
    this.dbProvider.listLogUsuarioEquipamiento(uid)
    .push(data)
    .then(()=>{
      return this.navCtrl.setRoot(PrincipalPage);
    }).then(()=>{
      return this.navCtrl.popToRoot();
    })
    
    
  }
  get EquipoMoto() { return this.form.get('EquipoMoto') }
  get EquipoMensajero() { return this.form.get('EquipoMensajero') }
  get ChaquetaMensajero() { return this.form.get('ChaquetaMensajero') }
  get MontoParaTrabajarHoy() { return this.form.get('MontoParaTrabajarHoy') }

}
