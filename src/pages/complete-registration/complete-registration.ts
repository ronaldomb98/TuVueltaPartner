import { Component } from '@angular/core';
import {AuthProvider} from "../../providers/auth/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { DbProvider } from '../../providers/db/db';
import { Subscription } from 'rxjs/Subscription';
import { ROLES } from '../../config/Roles';
import { ESTADOS_USUARIO } from '../../config/EstadosUsuario';
import { LoadingProvider } from '../../providers/loading/loading';
/**
 * Generated class for the CompleteRegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-complete-registration',
  templateUrl: 'complete-registration.html',
})
export class CompleteRegistrationPage {

  public hasAccount: boolean = false;
  public paramsRegistro;
  form: FormGroup;
  errorMessage: string;
  private sub: Subscription;
  public Ciudades;

  public testText: string = "item1, item2, item3, item4.";
  constructor(
    private formBuilder: FormBuilder,
    private authProvider: AuthProvider,
    private dbProvider: DbProvider,
    private loadingProvider: LoadingProvider
  ) {

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CompleteRegistrationPage');
  }
  ngOnInit(): void {
    this.buildForm();
    this.loadParamsRegistro();

  }

  loadInfo(){

  }

  ionViewWillUnload(){
    this.sub.unsubscribe();
    console.log('DomiciliosActivosPage ionViewWillUnload')

  }


  buildForm(): void{
    this.form = this.formBuilder.group({
      Nombres:
        this.formBuilder.control(null, [Validators.required]),
      Apellidos:
        this.formBuilder.control(null, [Validators.required]),
      Celular:
        this.formBuilder.control(null, [Validators.required]),
      CelularFijo:
        this.formBuilder.control(null, [Validators.required]),
      Correo:
        this.formBuilder.control(null, [Validators.required]),
      Cedula:
        this.formBuilder.control(null, [Validators.required]),
      Direccion:
        this.formBuilder.control(null, [Validators.required]),
      FechaNacimiento:
        this.formBuilder.control(null, [Validators.required]),
      TipoCelular:
        this.formBuilder.control(null, [Validators.required]),
      Ciudad:
        this.formBuilder.control(null, [Validators.required]),
      TieneDatos:
        this.formBuilder.control(null, [Validators.required]),
      TieneEPS:
        this.formBuilder.control(null, [Validators.required]),
      TipoVehiculo:
        this.formBuilder.control(null, [Validators.required]),
      PlacaVehiculo:
        this.formBuilder.control(null, [Validators.required]),
      TiempoDispParaHacerServicio:
        this.formBuilder.control(null, [Validators.required]),
      ComoNosConocio:
        this.formBuilder.control(null, [Validators.required])
    })

    if (this.authProvider.userInfo) {
      this.form.patchValue(this.authProvider.userInfo)
    }
  }

  onSubmit():void {
    let uid = this.authProvider.currentUserUid;
    let data = this.form.value;
    let hasData: boolean = true;
    const loading = this.loadingProvider.createLoading();
    loading.present();
    if (!this.authProvider.userInfo){
      data.Rol = ROLES.Mensajero;
      data.Estado = ESTADOS_USUARIO.Bloqueado;
      hasData = false;
    }

    console.log(data)
    this.dbProvider.objectUserInfo(uid)
      .update(data)
      .then((data)=> {
        console.log(data)
        loading.dismiss();
        if (hasData){
          const toast = this.loadingProvider.createUpdatedToast();
          toast.present();
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  private loadParamsRegistro():void {
    this.sub = this.dbProvider.getParamsRegistro()
      .snapshotChanges()
      .subscribe(action => {
        this.paramsRegistro = action.payload.val()
        let _Ciudades = this.paramsRegistro.Ciudades
        console.log(this.paramsRegistro)
        this.Ciudades = Object.keys(_Ciudades).map(key => {
          let city = _Ciudades[key];
          city.key = key;
          return city
        })
        console.log(this.Ciudades)
      })
  }

  get Nombres() { return this.form.get('Nombres')}
  get Apellidos() { return this.form.get('Apellidos')}
  get Celular() { return this.form.get('Celular')}
  get CelularFijo() { return this.form.get('CelularFijo')}
  get Correo() { return this.form.get('Correo')}
  get Cedula() { return this.form.get('Cedula')}
  get Direccion() { return this.form.get('Direccion')}
  get FechaNacimiento() { return this.form.get('FechaNacimiento')}
  get TipoCelular() { return this.form.get('TipoCelular')}
  get Ciudad() { return this.form.get('Ciudad')}
  get TieneDatos() { return this.form.get('TieneDatos')}
  get TieneEPS() { return this.form.get('TieneEPS')}
  get TipoVehiculo() { return this.form.get('TipoVehiculo')}
  get PlacaVehiculo() { return this.form.get('PlacaVehiculo')}
  get TiempoDispParaHacerServicio() { return this.form.get('TiempoDispParaHacerServicio')}
  get ComoNosConocio() { return this.form.get('ComoNosConocio')}

}
