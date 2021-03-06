import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/Operators';
import { MapService } from '../map.service';

interface listResponse {
  truckNumbe: String,
  lastWayPoint: {
    speed: number
  },
  lastRunningState: {
    stopStartTime: number,
    truckRunningState: number
  }
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  subjects: string[] = ['English', 'Hindi', 'Math', 'Sanskrit', 'Science', 'Social Study', 'Urdu'];
  filteredSubjects: Observable<string[]>;
  subscription: Subscription;

  allTrucksDetails = [];
  myControl = new FormControl();

  constructor(private mapservice: MapService) { }

  ngOnInit(): void {
    // Method used to auto-filter trucks
    this.filteredSubjects = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value))
      );
    this.subscription = this.mapservice.responseArray.subscribe((data: any) => {
      // Checking for stopped or running status
      for (let { truckNumber, lastWaypoint: { speed }, lastRunningState: { stopStartTime, truckRunningState } } of data) {
        let delay: string;
        if (new Date().getDay() - new Date(stopStartTime).getDay()) {
          delay = `${new Date().getDay() - new Date(stopStartTime).getDay()} day`;
        } else if (new Date().getHours() - new Date(stopStartTime).getHours()) {
          delay = `${new Date().getHours() - new Date(stopStartTime).getHours()} hr`;
        }
        else {
          delay = `${new Date().getMinutes() - new Date(stopStartTime).getMinutes()} min`;
        }
        this.allTrucksDetails.push({ truckNumber: truckNumber, speed: speed, stopStartTime: delay, truckRunningState: truckRunningState });
      }
    });

  }// end of init

  // Filtering list data based on user input
  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.subjects.filter(option => option.toLowerCase().includes(filterValue));
  }



  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

