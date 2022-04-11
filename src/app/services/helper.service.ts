import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  refresh() {
    setTimeout( ()=> {
      location.reload();
    }, 1000);
  }

  temperatureConvert(temperature){
    const temp = (temperature - 32) * (5/9) ;
    return temp.toFixed(0);
  }
}
