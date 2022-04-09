import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from '@ionic-native/native-geocoder/ngx';
import {ApiDataService} from "../services/api-data.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  latitude: any = 0; //latitude
  longitude: any = 0; //longitude
  options = {
    timeout: 10000,
    enableHighAccuracy: true,
    maximumAge: 3600
  };
  // geocoder options
  nativeGeocoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  address: string;
  public countryKey: string;
  currentData: any;

  constructor(
    private http: HttpClient, private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder, private apiSrvc: ApiDataService
  ) {
    console.log('constructor');
  }
  ngOnInit() {
    console.log('ngOnInit');
    this.getCurrentCoordinates();


  }



  getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      console.log('latitude: ', this.latitude);
      console.log('longitude: ', this.longitude);

      // this.getCountryKey(this.latitude, this.longitude);
      this.loadCountryKey(this.latitude, this.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  loadCountryKey(lat, long) {
    // console.log('lat, long', this.latitude + ' ,' + this.longitude);
    // console.log('parm1, parm2', lat + ' ,' + long);
    this.apiSrvc.getKey(lat, long).subscribe(
      resp => {
        console.log('Full Object: ', resp);
        if (resp) {
          this.countryKey = resp.Key;
          console.log('Country Code Key: ', this.countryKey);
          this.loadCurrentData(this.countryKey);
        }

      }, error => {
        console.log('Error Country Key: ', error);
      }
    );
  }

  loadCurrentData(countryKey) {
    this.apiSrvc.getCurrentData(countryKey).subscribe(
      resp  => {
        console.log('Current Data Response: ', resp);
        console.log('Current Data: ', resp[0]);

        this.currentData = resp[0];
        console.log('WeatherText: ', this.currentData.WeatherText);
      },
      err  => {
        console.log('Current Data Error: ', err);
      }
    );
  }


}
