import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapService implements OnInit {


  private url = "https://api.mystral.in/tt/mobile/logistics/searchTrucks?auth-company=PCH&companyId=33&deactivated=false&key=g2qb5jvucg7j8skpu5q7ria0mu&q-expand=true&q-include=lastRunningState,lastWaypoint";

  responseArray = new Subject<any[]>();
  trucksDetails: any[] = [];
  constructor(private http: HttpClient) {

    //Making an API call to serve
    this.http.get<{ responseCode: object, data: object[] }>(this.url)
      .pipe(
        take(1),
        map(response => {
          const { data } = JSON.parse(JSON.stringify(response));
          for (let { truckNumber, lastWaypoint: { speed, ignitionOn, updateTime, lat, lng }, lastRunningState: { stopStartTime, truckRunningState } } of data) {

            let delay: string;
            if (new Date().getDay() - new Date(stopStartTime).getDay()) {
              delay = `${new Date().getDay() - new Date(stopStartTime).getDay()} d`;
            } else if (new Date().getHours() - new Date(stopStartTime).getHours()) {
              delay = `${new Date().getHours() - new Date(stopStartTime).getHours()} hr`;
            }
            else {
              delay = `${new Date().getMinutes() - new Date(stopStartTime).getMinutes()} m`;
            }
            const obj = { truckNumber: truckNumber, speed: speed, ignitionOn: ignitionOn, updateTime: updateTime, stopStartTime: delay, truckRunningState: truckRunningState, latitude: lat, longitude: lng }
            this.trucksDetails.push(obj);
          }
          return this.trucksDetails;
        })
      ).subscribe({
        next: (response) => {
          this.responseArray.next(response);
        },
        error: (error) => {
          this.responseArray.next(error);
        },
      });
  }

  ngOnInit() {

  }

}
