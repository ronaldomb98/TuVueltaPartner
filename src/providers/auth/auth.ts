import {Injectable, ViewChild} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import {MenuController, Nav} from "ionic-angular";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  @ViewChild(Nav) nav: Nav;
  public isLoggedIn: boolean = false;
  public isUpdatingUserInfo: boolean = false;
  public currentUserUid: string = '';
  public userState: string = '';
  constructor(
    private angularFireAuth: AngularFireAuth,
    public menuController: MenuController
  ) {
  // this.checkLog()
  }

  public basicLogin(email: string, password: string){
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
  }

  public basicSignup(email: string, password: string){
    return this.angularFireAuth.auth.
    createUserWithEmailAndPassword(email, password)
    .then(()=>{
      this.sendEmailVerification();
    })
  }

  public signOut() {
    return this.angularFireAuth.auth.signOut()
  }

  public sendEmailVerification(){
    return this.angularFireAuth.auth.currentUser.sendEmailVerification()
  }

  public resetPassword(email){
    return this.angularFireAuth.auth.sendPasswordResetEmail(email)
  }

}
