import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { Subscription } from 'rxjs/Subscription';
import { AuthProvider } from '../../providers/auth/auth';
import { HistoryDetailPage } from '../history-detail/history-detail';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  public solicitudes;
  public all;
  private sub: Subscription;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dbProvider: DbProvider,
    private authProvider: AuthProvider,
    private alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
    this.loadSolicitud();
  }

  ionViewWillUnload() {
    console.log("Saliendo de HistoryPage")
    this.sub.unsubscribe();
  }

  loadSolicitud() {
    const uid = this.authProvider.currentUserUid;
    this.sub = this.dbProvider.listSolicitud(uid).snapshotChanges().subscribe(res => {
      const solicitudes = [];
      this.all = res

      this.orderByYearAndMonths();
    })
  }

  orderByYearAndMonths(){
    let availableYears = []
    let availableMonths = []
    this.all.forEach(_solicitud => {
      const date = new Date(Number(_solicitud.key))
      const month = date.getMonth();
      const year = date.getFullYear().toString();

      if (availableYears.indexOf(year) === -1) {
        availableYears.push(year);
      }
      if (availableMonths.indexOf(month) === -1) {
        availableMonths.push(month);
      }
    });

    // Filter by year
    const filteredByYear = [];
    let centinelYear = 0;
    availableYears.forEach(year => {
      const filterByYear = this.all.filter(_solicitud => {
        const date = new Date(Number(_solicitud.key))
        const _year = date.getFullYear().toString();
        if (_year === year) {
          return _solicitud;
        }
      });
      filteredByYear[centinelYear] = { year: year, months: [] }
      let centinelMonth = 0;
      availableMonths.forEach(month => {
        const filterByMonth = filterByYear.filter(_solicitud => {
          const date = new Date(Number(_solicitud.key))
          const _month = date.getMonth();
          if (_month === month) {
            return _solicitud;
          }
        })

        filteredByYear[centinelYear].months[centinelMonth] = { month: this.getMonthName(month), solicitudes: this.sortByCreationDate(filterByMonth)}
        centinelMonth++;

      })
      filteredByYear[centinelYear].months = filteredByYear[centinelYear].months.reverse()
      
      centinelYear++;
    })
    
    this.solicitudes = filteredByYear;
  }

  showSolicitud(solicitud) {
    this.navCtrl.push(HistoryDetailPage, { solicitud: solicitud })
  }

  createAlertFilter(){
    this.solicitudes = null;
    let alert = this.alertCtrl.create();
    alert.setTitle('Which planets have you visited?');

    alert.addInput({
      type: 'date',
      label: 'Seleccione la fecha',
    });

    alert.addButton({
      text: 'Cancelar',
      handler: data => {
        this.orderByYearAndMonths();
      }
    });
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Date Time data:', data);
        const arrayDate = data[0].split("-");
        
        
      }
    });
    alert.present();
  }

  sortByCreationDate(list: Array<any>){
    return list.sort((a,b)=>{
      console.log(a)
      return b.key - a.key
    })
  }

  getMonthName(month): string {
    switch (month) {
      case 0:
        return "Enero"

      case 1:
        return "Febrero"

      case 2:
        return "Marzo"

      case 3:
        return "Abril"

      case 4:
        return "Mayo"

      case 5:
        return "Junio"

      case 6:
        return "Julio"

      case 7:
        return "Agosto"

      case 8:
        return "Septiembre"

      case 9:
        return "Octubre"

      case 10:
        return "Noviembre"

      case 11:
        return "Diciembre"

      default:
        return "Mes No Definido"

    }
  }

}
