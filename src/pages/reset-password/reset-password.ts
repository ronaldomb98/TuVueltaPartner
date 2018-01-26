import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AuthProvider } from '../../providers/auth/auth';
import { LoadingProvider } from '../../providers/loading/loading';

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage implements OnInit{

  form: FormGroup;
  submitMessage: string;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder,
    private authProvider: AuthProvider,
    private loadingProvider: LoadingProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

  ngOnInit(){
    this.buildForm()
  }

  buildForm(){
    this.form = this.formBuilder.group({
      email: this.formBuilder.control(null, [Validators.required, Validators.email])
    })

    let email = this.navParams.get('email')
    if (email) {
      this.email.setValue(email);
    }
  }

  onSubmit(){
    const email = this.email.value
    let loading = this.loadingProvider.createLoading();
    loading.present()
    this.authProvider.resetPassword(email)
    .then(()=>{
      this.submitMessage = 'Revisa tu correo para restablecer contraseña';
      loading.dismiss();
    }).catch((err)=>{
      this.submitMessage = 'Hubo un error';
      loading.dismiss();
    })
  }

  get email() { return this.form.get('email') }

}
