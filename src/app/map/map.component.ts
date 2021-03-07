import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../map.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  arr = [];
  private map;
  constructor(private mapservice: MapService) { }

  ngOnInit(): void {


  }// End of init

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([30, 75], 7);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    tiles.addTo(this.map);

    L.marker([31.221287, 75.6353452262]).addTo(this.map);

  }




}
