import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/auth';
import { DbProvider } from '../db/db';
import { Subscription } from 'rxjs/Subscription';
import { DistancematrixProvider } from '../distancematrix/distancematrix';

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
  public inProccessSolicitudByDistance;
  public lengthSolicitudes: number = -1;
  constructor(
    private authProvider: AuthProvider,
    private dbProvider: DbProvider,
    private distanceMatrixProvider: DistancematrixProvider
  ) {
    console.log('Hello DomiciliosProvider Provider');
  }
  

  public loadPendingSolicitud(){
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = this.dbProvider.listPendingSolicitud().snapshotChanges()
      .subscribe(res=> {
        this.notifyNewSolicitud(res.length)
        this.pendingSolicitud = res
        if (res.length > 0) {
          this.getDistance();
        }
        

      },err=>{
        console.log(err)
      })
  }

  public notifyNewSolicitud(newLength){
    let _newLength = newLength;
    if (this.lengthSolicitudes == -1) {
      this.lengthSolicitudes= _newLength;
      return
    }

    if (this.lengthSolicitudes >= _newLength) {
      this.lengthSolicitudes= _newLength;
      return
    }
    this.lengthSolicitudes= _newLength;
    this.audio.src = 'assets/audio/notifynew.mp3';
    this.audio.load();
    this.audio.play();

  }

  public loadInProccesSolicitud(){
    if (this.subInProcces) {
      this.subInProcces.unsubscribe();
    }
    this.subInProcces = this.dbProvider.listInProccessSolicitud().snapshotChanges()
      .subscribe(res=> {
        this.inProccessSolicitud = this.filterSolicitudByUserid(res);
        this.inProccessSolicitud = this.sortServiceByCreationDate(this.inProccessSolicitud)
        
        
      },err=>{
        console.log(err)
      })
  }

  public sortServiceByCreationDate(list) {
    return list.sort( (a,b) =>{
      return Number(b.key) - Number(a.key)
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

  async getDistance(){
    
    const destinations = this.pendingSolicitud
      .map(solicitud => solicitud.payload.val().puntoInicialCoors)
      .join('|')
      console.log(destinations)  
    if (destinations.length > 0) {
      try {
        const dist_promise: any = await this.distanceMatrixProvider.getDistance(destinations).toPromise()
        const distances: any = dist_promise.rows[0].elements;
        for (let index = 0; index < this.pendingSolicitud.length; index++) {
          this.pendingSolicitud[index].distanceFromMe = distances[index].distance.value;
        }
        this.pendingSolicitud = this.sortServiceByDistance(this.pendingSolicitud);
        console.log(this.pendingSolicitud)
        
      }catch (err) {
        console.log(err)
      }
    }
  }

  public sortServiceByDistance(list) {
    return list.sort( (a,b) =>{
      return a.distanceFromMe - b.distanceFromMe
    })
  }

}
