import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommunicationService } from '../communication.service';
import * as L from 'leaflet';
import { delay, map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { logging } from 'selenium-webdriver';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  arr = [];
  private map;
  @Input() receivingFilteredList: any;
  constructor(private communicationServie: CommunicationService) { }
  layerGroup: any;
  count: number = 0;
  ngOnInit(): void {

  }// End of init

  ngAfterViewInit(): void {
    this.initMap();
    this.communicationServie.passingFilteredArrayToMap
      ?.pipe(
        map(data => {
          const arr = [];
          for (let { latitude, longitude } of data) {
            arr.push([latitude, longitude]);
          }
          return arr;
        })
      ).subscribe(ele => {
        this.addingMarker(ele);
      });
  }

  private initMap(): void {
    this.map = L.map('map').setView([30, 75], 7);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    tiles.addTo(this.map);

    // Adding layer group to map
    this.layerGroup = L.layerGroup().addTo(this.map);

  }

  private addingMarker(para: any) {
    this.layerGroup.clearLayers();
    para.forEach((element: any[]) => {
      L.marker([element[0], element[1]]).addTo(this.layerGroup);
    });

  }



}
