import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import { ResetPasswordPage } from '../reset-password/reset-password';
import { SignupPage } from '../signup/signup';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public hasAccount: boolean = false;
  form: FormGroup;
  errorMessage: string;
  public canSeePass: boolean = false;
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
    this.buildFormLogin();
  }

  buildFormLogin(): void{
    this.form = this.formBuilder.group({
      email: this.formBuilder.control(null,[
        Validators.required, Validators.email
      ]),
      password1: this.formBuilder.control(null,[Validators.required]),

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
  touchPassword(){
    
  }

  goToSignup() {
    this.navCtrl.pop().then(()=> {
      this.navCtrl.push(SignupPage);
    });
  }

  goToHome(){
    this.navCtrl.pop();
  }
  get email() { return this.form.get('email') }
  get password1(){ return this.form.get('password1') }




}
