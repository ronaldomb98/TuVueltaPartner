import { Injectable } from '@angular/core';
import {LoadingController} from "ionic-angular";
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

/*
  Generated class for the LoadingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadingProvider {

  constructor(
    public loadingController: LoadingController,
    public toastCtrl: ToastController
  ) {
    console.log('Hello LoadingProvider Provider');
  }

  createLoading(){
    return this.loadingController.create({content:'Cargando...', spinner: 'dots'})
  }

  createUpdatedToast(time=3000, message='Se ha Actualizado la información'){
    return this.toastCtrl.create({
      message: message,
      duration: time,
      position: 'middle'
    });
  }

}
