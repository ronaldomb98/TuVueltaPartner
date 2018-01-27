import { Component } from '@angular/core';
import { DbProvider } from '../../providers/db/db';
import { Subscription } from 'rxjs/Subscription';
import { AuthProvider } from '../../providers/auth/auth';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { SolicitudInProcessDetailsPage } from '../solicitud-in-process-details/solicitud-in-process-details';

/**
 * Generated class for the DomiciliosDisponiblesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-domicilios-disponibles',
  templateUrl: 'domicilios-disponibles.html',
})
export class DomiciliosDisponiblesPage {

  public inProccessSolicitud;
  private sub: Subscription;
  constructor(
    private dbProvider: DbProvider,
    private authProvider: AuthProvider,
    private navCtrl: NavController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DomiciliosActivosPage');
    this.loadPendingSolicitud();
  }

  private loadPendingSolicitud(){
    this.sub = this.dbProvider.listInProccessSolicitud().snapshotChanges()
      .subscribe(res=> {
        this.inProccessSolicitud = this.filterSolicitudByUserid(res.reverse());
        console.clear();
        this.inProccessSolicitud.forEach(element => {
          console.log(element.payload.val())
        });
      },err=>{
        console.log(err)
      })
  }

  private filterSolicitudByUserid(listSolicitud){
    let uid = this.authProvider.currentUserUid;
    return listSolicitud.filter(solicitud => {
      if (solicitud.payload.val().Motorratoner_id == uid){
        return solicitud
      }
    })
  }

  openScheduleDetails(key){
    this.navCtrl.push(SolicitudInProcessDetailsPage, { key: key })
  }

  ionViewWillUnload(){
    this.sub.unsubscribe();
    console.log('DomiciliosActivosPage ionViewWillUnload')
    
  }
  ionViewDidLeave(){
    console.log('DomiciliosActivosPage ionViewDidLeave')
  }
  ionViewWillLeave(){
    console.log('DomiciliosActivosPage ionViewWillLeave')
  }

}
