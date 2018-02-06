import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { Subscription } from 'rxjs/Subscription';


/**
 * Generated class for the HistoryDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-history-detail',
  templateUrl: 'history-detail.html',
})
export class HistoryDetailPage {
  public solicitud;
  public logs;
  public sub: Subscription;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dbProvider: DbProvider
  ) {
  }
  ionViewWillUnload(){
    console.log('HistoryDetailPage ionViewWillUnload')
    this.sub.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryDetailPage');
    this.solicitud = this.navParams.get('solicitud')
    console.log(this.solicitud.payload.val())
    this.loadSolicitudLog();
  }

  loadSolicitudLog(){
    
    const uid = this.solicitud.key;
    this.sub = this.dbProvider.objectLogsSolicitud(uid)
      .snapshotChanges().subscribe(response => {
        const val = response.payload.val();
        const valToArray = Object.keys(val).map(key => {
          return {
            date: key,
            value: val[key],
          }
        })
        const userId = this.solicitud.payload.val().Motorratoner_id;
        const logsByUser = valToArray.filter( log => {
          if (log.value.Motorratoner_id == userId ){
            return log;
          }
        })
        console.log(valToArray)
        this.logs = logsByUser;
    })
  }

}
