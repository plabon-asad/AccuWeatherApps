import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {

  constructor(
    private http: HttpClient
  ) { }


  getKey(lat, long) {
    return this.http.get<any>( `${environment.api.baseUrl}/cities/geoposition/search?apikey=${environment.api.key}&q=${lat}, ${long}` );
  }

  getCurrentData(countryKey) {
    return this.http.get<any>( `${environment.api.currentDataUrl}/${countryKey}?apikey=${environment.api.key}&details=true` );
  }

  search(city) {
    console.log('Search city param', city);
    return this.http.get(`${environment.api.baseUrl}/cities/search?apikey=${environment.api.key}&q=${city}&details=true`);
  }
}
