import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { AuthProvider } from '../../providers/auth/auth';
import { Subscription } from 'rxjs/Subscription';
import { ESTADOS_RETIRO } from '../../config/EstadosRetiro';
import { LoadingProvider } from '../../providers/loading/loading';

/**
 * Generated class for the RetirarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-retirar',
  templateUrl: 'retirar.html',
})
export class RetirarPage implements OnInit {
  
  public amountToRetiro: number = 0;
  
  public sub: Subscription;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public dbProvider: DbProvider,
    private authProvider: AuthProvider,
    private loadingProvder: LoadingProvider
  ) {
  }

  ngOnInit() {
    console.log("ngOnInit RetirarPage")
    this.loadGananciasMensajero();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RetirarPage');
  }

  ionViewWillUnload(){
    
    console.log('RetirarPage ionViewWillUnload')
    
  }
  ionViewDidLeave(){
    console.log('RetirarPage ionViewDidLeave')
  }
  ionViewWillLeave(){
    console.log('RetirarPage ionViewWillLeave')
  }


  loadGananciasMensajero() {
    this.amountToRetiro=this.dbProvider.gananciasMensajero.CreditosNoRetiro + this.dbProvider.gananciasMensajero.CreditosRetiro;
  }

  onSubmit() {
    const uid = this.authProvider.currentUserUid;
    const date = new Date().getTime();
    const amount = this.amountToRetiro;
    const data = {
      MontoARetirar: amount,
      Estado: ESTADOS_RETIRO.Pendiente
    };
    const loading = this.loadingProvder.createLoading();
    loading.present();
    const update = this.dbProvider.objectLogRetiros(uid, date).update(data);
    update.then(() => {
      loading.dismiss();
    })
    .catch(err=> {
      loading.dismiss();
      console.log(`Algo salio haciendo log de retiro ${err.message}`)
    })
  }


}
