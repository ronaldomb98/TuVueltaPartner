import { Component } from '@angular/core';
import {AuthProvider} from "../../providers/auth/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { ResetPasswordPage } from '../reset-password/reset-password';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';

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

  ngOnInit(): void {
  
  }


  public login() {
    this.navCtrl.push(LoginPage)
  }



  public signup() {
    this.navCtrl.push(SignupPage)
  }

}
