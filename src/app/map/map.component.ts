import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommunicationService } from '../communication.service';
import * as L from 'leaflet';
import { take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


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

  count: number = 0;
  ngOnInit(): void {

  }// End of init

  ngAfterViewInit(): void {
    this.initMap();
    this.communicationServie.passingFilteredArrayToMap
      .subscribe(ele => {
        for (let { latitude, longitude } of ele) {
          if (this.count < 30) L.marker([latitude, longitude]).addTo(this.map);
          this.count++;
        }
      });
  }

  private initMap(): void {
    this.map = L.map('map').setView([30, 75], 7);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    tiles.addTo(this.map);


  }




}
