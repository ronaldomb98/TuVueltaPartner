import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../auth/auth';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';

@Injectable()
export class LocatorProvider {
  private subWatch: Subscription;
  private subBackWatch: Subscription;
  constructor(
    private geolocation: Geolocation,
    private authProvider: AuthProvider,
    private af: AngularFireDatabase,
    private backgroundGeolocation: BackgroundGeolocation
  ) { }

  startWatchingLocation(): void {

    /* Background geolocation */
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 1,
      stationaryRadius: 2,
      distanceFilter: 0,
      debug: false,
      interval: 500,
      fastestInterval: 500,
      notificationTitle: 'Estado Activo',
      notificationText: 'Geolocalización activa',
      /* url: `https://us-central1-tuvueltap.cloudfunctions.net/api/localizador/posicion-actual?id=` +
        this.authProvider.currentUserUid +
        '&Nombres=' + this.authProvider.userInfo.Nombres +
        '&PlacaVehiculo=' + this.authProvider.userInfo.PlacaVehiculo +
        '&TipoVehiculo=' + this.authProvider.userInfo.TipoVehiculo, */
    };


    this.subBackWatch = this.backgroundGeolocation.configure(config)
      .subscribe((location) => {
        const userId: string = this.authProvider.currentUserUid;
        /* this.af.list(`/pruebas2`).push(location)
        this.af.list(`/pruebas3`).push(this.authProvider.userInfo) */
        if (userId)
          this.updatePosition(location.latitude, location.longitude, userId);


      }, (err) => {

        alert(JSON.stringify(err))

      });


    this.backgroundGeolocation.start();


    /* Geolocation */
    const options: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 30000
    };


    const geo: Observable<Geoposition> = this.geolocation.watchPosition(options);
    this.subWatch = geo.subscribe(res => {
      const userId: string = this.authProvider.currentUserUid;

      if (res.coords && userId) {
        this.updatePosition(res.coords.latitude, res.coords.longitude, userId);
      }
    })
  }

  updatePosition(latitude, longitude, userId) {
    const ref: AngularFireObject<any> = this.af.object(`/Operativo/SeguimientoActivo/${userId}/`);
    const body = {
      Nombre: this.authProvider.userInfo.Nombres,
      PlacaVehiculo: this.authProvider.userInfo.PlacaVehiculo,
      TipoVehiculo: this.authProvider.userInfo.TipoVehiculo,
      Latitude: latitude,
      Longitude: longitude
    }
    ref.update(body).catch(res => {
      console.log(res);
    })
  }

  stopWatchingLocation(): void {
    if (this.subWatch) this.subWatch.unsubscribe();
    if (this.subBackWatch) this.subBackWatch.unsubscribe();

    this.backgroundGeolocation.stop();
    const userId: string = this.authProvider.currentUserUid;
    const ref: AngularFireObject<any> = this.af.object(`/Operativo/SeguimientoActivo/${userId}/`);

    if (userId) {
      ref.remove();
    }

  }
}
