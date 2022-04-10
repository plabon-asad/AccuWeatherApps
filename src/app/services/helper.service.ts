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
}
