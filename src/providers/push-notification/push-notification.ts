import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';
import { Platform } from 'ionic-angular/platform/platform';

/*
  Generated class for the PushNotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PushNotificationProvider {

  constructor(
    private oneSignal: OneSignal,
    private platform: Platform
  ) {
    
  }

  init_notifications(){

    if(this.platform.is('cordova')){
      this.oneSignal.startInit('c65f216a-e1bc-4db8-a58d-d15bc07ca5a2', '565294870666');

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
      console.log("Notificacion recibida")
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
        console.log("Notificacion abierta")
      });

      this.oneSignal.endInit();
    }else{
      console.log("No estamos en la plataforma")
    }
    
  }

}
