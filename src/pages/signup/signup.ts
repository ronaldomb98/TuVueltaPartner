import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ResetPasswordPage } from '../reset-password/reset-password';
import { DbProvider } from '../../providers/db/db';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  public hasAccount: boolean = false;
  public paramsRegistro;
  form: FormGroup;
  errorMessage: string;

  public testText: string = "item1, item2, item3, item4.";
  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private authProvider: AuthProvider,
    private dbProvider: DbProvider
  ) {

  }

  openResetPassPage(){
    this.navCtrl.push(ResetPasswordPage, { email: this.email.value })
  }

  ngOnInit(): void {
    this.buildForm();
    this.loadParamsRegistro();
  }
  

  buildForm(): void{
    this.form = this.formBuilder.group({
      Nombres: this.formBuilder.control(null, [Validators.required]),
      Apellidos: this.formBuilder.control(null, [Validators.required]),
      Celular: this.formBuilder.control(null, [Validators.required]),
      Telefono: this.formBuilder.control(null, [Validators.required]),
      Cedula: this.formBuilder.control(null, [Validators.required]),
      Direccion: this.formBuilder.control(null, [Validators.required]),
      Ciudad: this.formBuilder.control(null, [Validators.required]),
      TieneCelAndroidYDatos: this.formBuilder.control(null, [Validators.required]),
      TieneEPS: this.formBuilder.control(null, [Validators.required]),
      TipoVehiculo: this.formBuilder.control(null, [Validators.required]),
      PlacaVehiculo: this.formBuilder.control(null, [Validators.required]),
      TiempoDispParaHacerServicio: this.formBuilder.control(null, [Validators.required]),
      ComoNosConocio: this.formBuilder.control(null, [Validators.required]),
      email: this.formBuilder.control(null,[
        Validators.required,
        Validators.email
      ]),
      password1: this.formBuilder.control(null,[
        Validators.required,
        Validators.minLength(6)
      ]),
      password2: this.formBuilder.control(null,Validators.required)
    })
  }

  public signup() {
    this.authProvider.basicSignup(this.email.value, this.password1.value)
      .then(res=>{
        console.log(res)
      }).catch(()=>{
        this.errorMessage = 'Algo salio mal al registrar.';
      });
  }

  private loadParamsRegistro():void {
    this.dbProvider.getParamsRegistro()
      .snapshotChanges()
      .subscribe(action => {
        this.paramsRegistro = action.payload.val()
      })
  } 

  get password2(){ return this.form.get('password2') }
  get email() { return this.form.get('email') }
  get password1(){ return this.form.get('password1') }
  get Nombres() { return this.form.get('Nombres')}
  get Apellidos() { return this.form.get('Apellidos')}
  get Celular() { return this.form.get('Celular')}
  get Telefono() { return this.form.get('Telefono')}
  get Cedula() { return this.form.get('Cedula')}
  get Direccion() { return this.form.get('Direccion')}
  get Ciudad() { return this.form.get('Ciudad')}
  get TieneCelAndroidYDatos() { return this.form.get('TieneCelAndroidYDatos')}
  get TieneEPS() { return this.form.get('TieneEPS')}
  get TipoVehiculo() { return this.form.get('TipoVehiculo')}
  get PlacaVehiculo() { return this.form.get('PlacaVehiculo')}
  get TiempoDispParaHacerServicio() { return this.form.get('TiempoDispParaHacerServicio')}
  get ComoNosConocio() { return this.form.get('ComoNosConocio')}
}
