import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/auth';
import { DbProvider } from '../db/db';
import { Subscription } from 'rxjs/Subscription';
import { DistancematrixProvider } from '../distancematrix/distancematrix';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { Observable } from '@firebase/util';
import { IConfigGlobal } from '../../entities/configglobal.interface';
import { ESTADOS_USUARIO } from '../../config/EstadosUsuario';
import { localStorageConstants } from '../../config/LocalstorageConstants';
import { Platform } from 'ionic-angular';

/*
  Generated class for the DomiciliosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DomiciliosProvider {


  public pendingSolicitud;
  public sub: Subscription;
  public audio = new Audio();
  public inProccessSolicitud;
  public subInProcces: Subscription;
  public subListClients: Subscription;
  public inProccessSolicitudByDistance;
  public lengthSolicitudes: number = -1;
  public Mensajeros;
  public globalConfig: IConfigGlobal;
  public intervalChangeState: any;

  constructor(
    private authProvider: AuthProvider,
    private dbProvider: DbProvider,
    private distanceMatrixProvider: DistancematrixProvider,
    private geolocation: Geolocation,
    private platform: Platform
  ) {
    console.log('Hello DomiciliosProvider Provider');
  }


  public loadPendingSolicitud() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = this.dbProvider.listPendingSolicitud().snapshotChanges()
      .subscribe(res => {
        this.notifyNewSolicitud(res.length)
        this.pendingSolicitud = res
        if (res.length > 0) {
          this.getDistance();
        }
      }, err => {
        console.log(err)
      })
  }

  public notifyNewSolicitud(newLength) {
    let _newLength = newLength;
    if (this.lengthSolicitudes == -1) {
      this.lengthSolicitudes = _newLength;
      return
    }

    if (this.lengthSolicitudes >= _newLength) {
      this.lengthSolicitudes = _newLength;
      return
    }
    this.lengthSolicitudes = _newLength;
    this.audio.src = 'assets/audio/notifynew.mp3';
    this.audio.load();
    this.audio.play();

  }

  public loadInProccesSolicitud() {
    if (this.subInProcces) {
      this.subInProcces.unsubscribe();
    }
    this.subInProcces = this.dbProvider.listInProccessSolicitud().snapshotChanges()
      .subscribe(res => {
        this.inProccessSolicitud = this.filterSolicitudByUserid(res);
        this.inProccessSolicitud = this.sortServiceByCreationDate(this.inProccessSolicitud)


      }, err => {
        console.log(err)
      })
  }

  public sortServiceByCreationDate(list) {
    return list.sort((a, b) => {
      return Number(b.key) - Number(a.key)
    })
  }

  private filterSolicitudByUserid(listSolicitud) {
    let uid = this.authProvider.currentUserUid;
    return listSolicitud.filter(solicitud => {
      if (solicitud.payload.val().Motorratoner_id == uid) {
        return solicitud
      }
    })
  }

  loadClientes() {
    this.subListClients = this.dbProvider.listClientes().snapshotChanges().subscribe(res => {

      this.Mensajeros = res.reduce((o, val) => {
        o[val.key] = val.payload.val();
        return o;
      }, {});

    })
  }

  getDistance() {
    console.log("updating distance from me services")
    let options: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 300000000
    };
    const destinations = this.pendingSolicitud
      .map(solicitud => solicitud.payload.val().puntoInicialCoors)
      .join('|')

    if (destinations.length > 0) {
      this.platform.ready().then(() => {
        return this.geolocation.getCurrentPosition(options)
      }).then(_geolocation => {
        const origin = _geolocation.coords.latitude + ',' + _geolocation.coords.longitude;
        console.log(origin)
        return this.distanceMatrixProvider.getDistance(origin, destinations).toPromise()
      }).then((dist_promise: any) => {
        const distances: any = dist_promise.rows[0].elements;
        for (let index = 0; index < this.pendingSolicitud.length; index++) {
          this.pendingSolicitud[index].distanceFromMe = distances[index].distance.value;
        }
        this.pendingSolicitud = this.sortServiceByDistance(this.pendingSolicitud);
      }).catch(err => {
        console.log(`Error en get distance: ${err.message}`)
      })
    }
  }

  public sortServiceByDistance(list) {
    return list.sort((a, b) => {
      return a.distanceFromMe - b.distanceFromMe
    })
  }

  public subReglasActivos: Subscription;
  public reglasActivos;
  public loadReglasActivos() {
    const sub = this.subReglasActivos;
    if (sub) {
      this.subReglasActivos.unsubscribe();
    }
    this.subReglasActivos = this.dbProvider.objectReglasActivos()
      .snapshotChanges()
      .subscribe(response => {
        this.reglasActivos = response.payload.val();
        console.log(this.reglasActivos)
        this.loadPendingSolicitud();
      })
  }
  

  loadGlobalConfig() {
    this.dbProvider.objectGlobalConfig().subscribe(res => {
      this.globalConfig = res;
      this.loadIntervalChangeState();
    })
  }
  
  loadIntervalChangeState(): any {
    if (this.intervalChangeState) {
      clearInterval(this.intervalChangeState);
    }

    this.intervalChangeState = setInterval(() => {
      let uid = this.authProvider.currentUserUid;

      if (uid) {
        let localItem = localStorage.getItem(localStorageConstants.lastStateChanged);
        let lastStateChanged: number = Number(localItem);
        let tiempoCambioAInactivo = this.globalConfig.TiempoCambiarAInactivo;
        let date = new Date().getTime();
        let nextTimeToChangeState = lastStateChanged + tiempoCambioAInactivo;
        if ((date > nextTimeToChangeState) || (lastStateChanged == 0)) {

          this.dbProvider.objectUserInfo(uid).update({
            Estado: ESTADOS_USUARIO.Inactivo
          }).catch(err => {
            console.log(`Error actualizando a estado inactivo`, err);

          })
        }
      }
    }, this.globalConfig.TiempoIntervaloRevisarUltimoCambioEstado)
  }
}
