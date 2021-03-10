import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommunicationService } from '../communication.service';
import * as L from 'leaflet';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  subs = new SubSink();
  iconGreen: object;
  iconBlue: object;
  iconYellow: object;
  iconRed: object;
  private map: any;

  constructor(private communicationServie: CommunicationService) { }
  layerGroup: any;
  count: number = 0;
  ngOnInit(): void {

    // Creating custom marker class
    const LeafIcon = L.Icon.extend({
      options: {
        iconSize: [38, 40],
        shadowSize: [50, 64],
        iconAnchor: [25, 62],
      }
    });
    // Initializing custom marker class
    this.iconBlue = new LeafIcon({ iconUrl: '../../assets/truck-icon-blue.png' });
    this.iconRed = new LeafIcon({ iconUrl: '../../assets/truck-icon-red.png' });
    this.iconGreen = new LeafIcon({ iconUrl: '../../assets/truck-icon-green.png' });
    this.iconYellow = new LeafIcon({ iconUrl: '../../assets/truck-icon-yellow.png' });


  }// End of init

  ngAfterViewInit(): void {
    this.initMap();
    this.subs.sink = this.communicationServie.passingFilteredArrayToMap
      ?.pipe(
        map(data => {
          const arr = [];
          for (let { latitude, longitude, truckErrorStatus, truckIdleStatus, truckRunningState } of data) {
            arr.push({ latitude, longitude, truckErrorStatus, truckIdleStatus, truckRunningState });
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

  private addingMarker(para: any[]) {
    this.layerGroup.clearLayers();

    para.forEach((ele: any) => {
      if (ele.truckErrorStatus) {
        L.marker([ele.latitude, ele.longitude], { icon: this.iconRed }).addTo(this.layerGroup);
      }
      else if (ele.truckRunningState) {
        L.marker([ele.latitude, ele.longitude], { icon: this.iconGreen }).addTo(this.layerGroup);
      }
      else if (ele.truckIdleStatus) {
        L.marker([ele.latitude, ele.longitude], { icon: this.iconYellow }).addTo(this.layerGroup);
      }
      else {
        L.marker([ele.latitude, ele.longitude], { icon: this.iconBlue }).addTo(this.layerGroup);
      }
    });

  }


  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
