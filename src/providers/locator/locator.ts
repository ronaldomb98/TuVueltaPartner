import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../auth/auth';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';

/*
  Generated class for the LocatorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocatorProvider {
  private subWatch: Subscription;
  constructor(
    private geolocation: Geolocation,
    private authProvider: AuthProvider,
    private af: AngularFireDatabase
  ) { }

  startWatchingLocation(): void {
    const options: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 30000
    };
    const geo: Observable<Geoposition> = this.geolocation.watchPosition(options);
    this.subWatch = geo.subscribe(res => {
      const userId: string = this.authProvider.currentUserUid;
      
      if (res.coords && userId) {
        const ref: AngularFireObject<any> = this.af.object(`/Operativo/SeguimientoActivo/${userId}/`);
        const body = {
          Nombre: this.authProvider.userInfo.Nombres,
          PlacaVehiculo: this.authProvider.userInfo.PlacaVehiculo,
          TipoVehiculo: this.authProvider.userInfo.TipoVehiculo,
          Latitude: res.coords.latitude,
          Longitude: res.coords.longitude
        }
        ref.update(body).catch(res => {
          console.log(res);
        })
      }
    })
  }

  stopWatchingLocation(): void {
    if (this.subWatch) this.subWatch.unsubscribe();
    const userId: string = this.authProvider.currentUserUid;
    const ref: AngularFireObject<any> = this.af.object(`/Operativo/SeguimientoActivo/${userId}/`);

    if (userId){
      ref.remove();
    }
    
  }
}
