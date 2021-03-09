import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommunicationService } from '../communication.service';
import * as L from 'leaflet';
import { map, take } from 'rxjs/operators';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  iconGreen: any;
  iconBlue: any;
  iconYellow: any;
  iconRed: any;
  private map: any;
  @Input() receivingFilteredList: any;
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
    this.communicationServie.passingFilteredArrayToMap
      ?.pipe(
        map(data => {
          const arr = [];
          for (let { latitude, longitude, truckErrorStatus, truckIdleStatus, truckRunningState } of data) {
            arr.push({ latitude: latitude, longitude: longitude, truckErrorStatus: truckErrorStatus, truckIdleStatus: truckIdleStatus, truckRunningState: truckRunningState });
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



}
