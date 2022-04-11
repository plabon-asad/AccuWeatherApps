import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from '@ionic-native/native-geocoder/ngx';
import {ApiDataService} from '../services/api-data.service';
import {HelperService} from '../services/helper.service';

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
  forecastData: any;
  forecastTempUnit: any;
  upComing1stDayData: any;
  upComing2ndDayData: any;
  upComing3rdDayData: any;
  minTempUpcoming1stDay: any;
  maxTempUpcoming1stDay: any;
  minTempUpcoming2ndDay: any;
  maxTempUpcoming2ndDay: any;
  minTempUpcoming3rdDay: any;
  maxTempUpcoming3rdDay: any;

  constructor(
    private http: HttpClient, private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder, private apiSrvc: ApiDataService,
    private helperSrvc: HelperService
  ) {
  }

  ngOnInit() {
    this.getCurrentCoordinates();
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
          /** Get countryKey as params */
          this.loadCurrentData(this.countryKey);
          this.loadForecast(this.countryKey);
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
    const cityName = event.detail.value;


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

  loadForecast(countryKey) {
    this.apiSrvc.dayForecast(countryKey).subscribe(
      resp => {
        console.log('5day Forecast Response: ', resp);
        // this.forecastData = resp.DailyForecasts;
        // console.log('5day Forecasts: ', this.forecastData);

        this.upComing1stDayData = resp.DailyForecasts[1];
        this.upComing2ndDayData = resp.DailyForecasts[2];
        this.upComing3rdDayData = resp.DailyForecasts[3];

        // temperature data
        this.minTempUpcoming1stDay = resp.DailyForecasts[1].Temperature.Minimum.Value;
        this.minTempUpcoming2ndDay = resp.DailyForecasts[2].Temperature.Minimum.Value;
        this.minTempUpcoming3rdDay = resp.DailyForecasts[3].Temperature.Minimum.Value;
        this.maxTempUpcoming1stDay = resp.DailyForecasts[1].Temperature.Maximum.Value;
        this.maxTempUpcoming2ndDay = resp.DailyForecasts[2].Temperature.Maximum.Value;
        this.maxTempUpcoming3rdDay = resp.DailyForecasts[3].Temperature.Maximum.Value;

        this.forecastTempUnit = resp.DailyForecasts[1].Temperature.Minimum.Unit;
        console.log('Temp Unit Forecasts: ', this.forecastTempUnit);

      },
      err => {
        console.log('5day Forecast Error: ');
      }
    );
  }


}
