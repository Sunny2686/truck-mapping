import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { CommunicationService } from './communication.service';

@Injectable({
  providedIn: 'root'
})
export class MapService implements OnInit {


  private url = "https://api.mystral.in/tt/mobile/logistics/searchTrucks?auth-company=PCH&companyId=33&deactivated=false&key=g2qb5jvucg7j8skpu5q7ria0mu&q-expand=true&q-include=lastRunningState,lastWaypoint";

  responseArray = new Subject<any[]>();
  errorResponse = new Subject<any>();
  trucksDetails: any[] = [];
  constructor(private http: HttpClient, private comService: CommunicationService) {
    //Making an API call to serve
    this.getTruckAPI();

  }

  ngOnInit() { }

  getTruckAPI(): void {

    this.http.get<{ responseCode: object, data: object[] }>(this.url, {
      responseType: 'json'
    })
      .pipe(
        // Loading spinner response
        tap(() => this.comService.loadingSpinnerSubject.next(true)),
        take(1),
        // Modifying the response
        map(response => {
          const { data } = JSON.parse(JSON.stringify(response));
          for (let { truckNumber, lastWaypoint: { speed, ignitionOn, updateTime, lat, lng }, lastRunningState: { stopStartTime, truckRunningState } } of data) {
            // Adding trucks error and idle status
            let truckErrorStatus = false;
            let truckIdleStatus = false;
            if (new Date(updateTime).getHours() < 4) {
              truckErrorStatus = true
            }
            if (ignitionOn && !truckRunningState) {
              truckIdleStatus = true;
            }
            // Calculating delay in trucks response
            let delay: string;
            if (new Date().getDay() - new Date(stopStartTime).getDay()) {
              delay = `${(new Date().getDay() - new Date(stopStartTime).getDay() < 0 ? -(new Date().getDay() - new Date(stopStartTime).getDay()) : new Date().getDay() - new Date(stopStartTime).getDay())} d`;
            } else if (new Date().getHours() - new Date(stopStartTime).getHours()) {
              delay = `${new Date().getHours() - new Date(stopStartTime).getHours()} hr`;
            }
            else {
              delay = `${new Date().getMinutes() - new Date(stopStartTime).getMinutes()} m`;
            }
            // Creating and passing the object with useful data to application
            const obj = { truckNumber, speed, ignitionOn, updateTime, stopStartTime: delay, truckRunningState, latitude: lat, longitude: lng, truckErrorStatus, truckIdleStatus };
            this.trucksDetails.push(obj);
          }
          return this.trucksDetails;
        })
      ).subscribe({
        next: (response) => {
          this.responseArray.next(response);
          this.comService.loadingSpinnerSubject.next(false);
        },
        error: () => {
          this.errorResponse.next();
        }
      });


  }// end of method gettruckapi


}
