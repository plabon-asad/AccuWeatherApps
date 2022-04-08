import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(private http: HttpClient) {
    console.log('constructor');
  }
  ngOnInit() {
    console.log('ngOnInit');
  }

  loadCities(city: string) {
    this.http.get( `${environment.api.url}?apikey=${environment.api.key}&q=${city}` );


  }

}
