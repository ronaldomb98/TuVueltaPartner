import { Component } from '@angular/core';
import { FormGroup} from "@angular/forms";
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';


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
