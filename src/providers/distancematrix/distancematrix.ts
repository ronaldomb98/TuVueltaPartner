import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/*
  Generated class for the DistancematrixProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DistancematrixProvider {

  private API_KEY: string = 'AIzaSyDjPraTx4A9TO4UMKgE24rAu2YANT4WjsM';
  private base: string = 'https://maps.googleapis.com/maps/api/distancematrix/json';
  constructor(public http: HttpClient) {
    console.log('Hello DistancematrixProvider Provider');
  }

  getDistance(destinations: string){
    let url = this.base;
    url+='?key='+this.API_KEY;
    url+='&origins='+'4.404787,-75.148138';
    url+='&destinations='+destinations;
    return this.http.get(url)
  }

}
