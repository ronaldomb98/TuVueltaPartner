import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';

/**
 * Generated class for the NoAuthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-no-auth',
  templateUrl: 'no-auth.html',
})
export class NoAuthPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoAuthPage');
  }

  public goLogin():void {
    this.navCtrl.setRoot(LoginPage)
    .then(()=>{
      this.navCtrl.popToRoot()
    })
  }

  public goSignup():void {
    this.navCtrl.setRoot(SignupPage)
      .then(()=>{
        this.navCtrl.popToRoot()
      })
  }

}
