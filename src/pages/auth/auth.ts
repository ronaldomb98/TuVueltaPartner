import { Component } from '@angular/core';
import {AuthProvider} from "../../providers/auth/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { ResetPasswordPage } from '../reset-password/reset-password';

/**
 * Generated class for the AuthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {
  public hasAccount: boolean = false;
  form: FormGroup;
  errorMessage: string;

  public testText: string = "item1, item2, item3, item4.";
  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private authProvider: AuthProvider
  ) {

  }

  openResetPassPage(){
    this.navCtrl.push(ResetPasswordPage, { email: this.email.value })
  }

  ngOnInit(): void {
    this.buildFormSignup();
  }

  buildFormLogin(): void{
    this.form = this.formBuilder.group({
      email: this.formBuilder.control('test2@gmail.com',[
        Validators.required, Validators.email
      ]),
      password1: this.formBuilder.control('ronaldo123123',[Validators.required]),

    })
  }

  public login() {
    this.authProvider.basicLogin(this.email.value, this.password1.value)
      .then(res=>{
        console.log(res)
      }).catch(()=>{
        this.errorMessage = 'Algo salio mal al iniciar sesión.';
      });
  }

  get email() { return this.form.get('email') }
  get password1(){ return this.form.get('password1') }

  buildFormSignup(): void{
    this.form = this.formBuilder.group({
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

  get password2(){ return this.form.get('password2') }

}
