import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map, startWith, tap } from 'rxjs/Operators';
import { MapService } from '../map.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  filteredTrucksList: any[];
  subscription: Subscription;
  filteredTruck2Subscription: Subscription;
  filteredTruck1Subscription: Subscription;
  passingSelectorValueArraySubs: Subscription;
  containerBoolean: boolean = true;
  toolbarComponent: ToolbarComponent;
  allTrucksDetails = [];
  allTrucksNumber: string[] = [];
  myControl = new FormControl();
  truckState: number = 0;
  randomNumber: number;
  constructor(private mapservice: MapService) { }

  ngOnInit(): void {

    this.randomNumber = Math.floor((Math.random() * 15) + 5);
    // Receiving and Manupulating API data
    this.subscription = this.mapservice.responseArray.subscribe((data: any) => {
      // Checking for stopped or running status
      for (let { truckNumber, lastWaypoint: { speed, ignitionOn, updateTime, lat, lng }, lastRunningState: { stopStartTime, truckRunningState } } of data) {

        this.allTrucksNumber.push(truckNumber);
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
        this.allTrucksDetails.push(obj);
      }

      //  Auto-filter trucks based on toolbar selector
      this.passingSelectorValueArraySubs = this.mapservice.passingSelectorValueArray.
        pipe(
          tap((val) => {
            if (val.length === 0) {
              this.containerBoolean = true;
            } else {
              this.containerBoolean = false;
            }
          }),
          startWith(''),
          map(value => this.filterInputValue(value)))
        .subscribe(val => {
          this.filteredTrucksList = val
          this.mapservice.passingFilteredArrayToMap.next(this.filteredTrucksList);

        });

      // Auto-filter trucks based on user input
      this.filteredTruck1Subscription = this.myControl.valueChanges
        .pipe(
          tap(() => this.containerBoolean = true),
          startWith(''),
          map(value => this.filterInputValue(value))
        ).subscribe(val => {
          this.filteredTrucksList = val;
          this.mapservice.passingFilteredArrayToMap.next(this.filteredTrucksList);
        });

      // Auto-filter trucks based on button click
      this.filteredTruck2Subscription = this.mapservice.passingNumberTolist.
        pipe(
          tap((val) => {
            this.containerBoolean = false;
          }),
          startWith(''),
          map(value => this.filterInputValue(value))
        ).subscribe(val => {
          this.filteredTrucksList = val;
          this.mapservice.passingFilteredArrayToMap.next(this.filteredTrucksList);
        });
    });

  }// end of init

  // Filtering truck list data based on user input
  private filterInputValue(value: any): string[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.allTrucksDetails.filter(option => {
        return option.truckNumber.toLowerCase().replace(' ', '').includes(filterValue)
      });
    } else if (typeof value === 'number') {
      return this.allTrucksDetails.filter(option => {

        //Total truck list
        if (value === 10) {
          return true;
        }
        //Running trucks list
        else if (value === 1) {
          return option.truckRunningState === value;
          //Stopped truck list
        } else if (value === 0) {
          return option.truckRunningState === value;
        }
        //Idle truck list
        else if (value === 3) {
          return option.ignitionOn && !option.truckRunningState;
        }
        //Error truck list
        else if (value === 2) {
          return new Date(option.updateTime).getHours() < 10;
        }
      });
    } else {
      return this.allTrucksDetails.filter(option => {
        return value.includes(option.truckNumber);
      })
    }
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.filteredTruck1Subscription.unsubscribe();
    this.filteredTruck2Subscription.unsubscribe();
    this.passingSelectorValueArraySubs.unsubscribe();
  }

}

