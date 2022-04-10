import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from '@ionic-native/native-geocoder/ngx';
import {ApiDataService} from "../services/api-data.service";
import {HelperService} from "../services/helper.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
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
  weatherIcon: string;
  address: string;
  public countryKey: string;
  currentData: any;
  cities: [];

  constructor(
    private http: HttpClient, private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder, private apiSrvc: ApiDataService,
    private helperSrvc: HelperService
  ) {
  }

  ngOnInit() {
    // this.getCurrentCoordinates();
  }

  getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      console.log('Latitude: ', this.latitude);
      console.log('Longitude: ', this.longitude);

      // this.getCountryKey(this.latitude, this.longitude);
      this.loadCountryKey(this.latitude, this.longitude);
    }).catch((error) => {
      console.log('Error getting location: ', error);
    });
  }

  loadCountryKey(lat, long) {
    this.apiSrvc.getKey(lat, long).subscribe(
      resp => {
        console.log('Full Object: ', resp);
        if (resp) {
          this.countryKey = resp.Key;
          this.address = resp.LocalizedName;
          console.log('Location Name: ', this.address);
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
      resp => {
        console.log('Current Data Response: ', resp);
        console.log('Current Data: ', resp[0]);

        this.currentData = resp[0];
        // this.weatherIcon = '15';
        this.weatherIcon = this.currentData.WeatherIcon;
        console.log('WeatherIcon Number: ', this.weatherIcon);
        console.log('WeatherText: ', this.currentData.WeatherText);
      },
      err => {
        console.log('Current Data Error: ', err);
      }
    );
  }

  clearSearch(event) {
    console.log('Clear Search: ', event);
    this.getCurrentCoordinates();
  }

  doSearch(event) {
    console.log('Search Data: ', event.detail.value);
    let cityName = event.detail.value;


    if (cityName) {
      this.apiSrvc.search(cityName).subscribe(
        resp => {
          console.log('Search Data: ', resp);
          let latData: any;
          let longData: any; //GeoPosition: {Latitude: 23.71, Longitude: 90.407
          if (resp) {
            latData = resp[0].GeoPosition.Latitude;
            longData = resp[0].GeoPosition.Longitude;

            this.loadCountryKey(latData, longData);
            console.log('Search Lat, Long Data: ', latData + ', ' + longData);
          }
        },
        err => {
          console.log('Error City Search: ');
        }
      );
    }
  }


}
