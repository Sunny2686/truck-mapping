import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapService {


  private url = "https://api.mystral.in/tt/mobile/logistics/searchTrucks?auth-company=PCH&companyId=33&deactivated=false&key=g2qb5jvucg7j8skpu5q7ria0mu&q-expand=true&q-include=lastRunningState,lastWaypoint";

  passingNumberTolist = new Subject<number>();
  passingFilteredArrayToMap = new Subject<any[]>();
  responseArray = new Subject<any[]>();
  passingSelectorValueArray = new BehaviorSubject<string[]>([]);
  constructor(private http: HttpClient) {

    //Making an API call to serve
    this.http.get<{ responseCode: object, data: object[] }>(this.url)
      .pipe(
        take(1),
        map(res => {
          const { data } = JSON.parse(JSON.stringify(res));
          return data;
        })
      ).subscribe({
        next: (response) => {
          this.responseArray.next(response);
        },
        error: (error) => {
          this.responseArray.next(error);
        },

      })
  }

}
