import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map, startWith, tap } from 'rxjs/Operators';
import { CommunicationService } from '../communication.service';
import { MapService } from '../map.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  filteredTrucksList: any[];
  filteredTrucksnewList: any[];
  responseSubscription: Subscription;
  filteredTruck2Subscription: Subscription;
  filteredTruck1Subscription: Subscription;
  passingSelectorValueArraySubs: Subscription;
  allTrucksDetails = [];
  allTrucksNumber: string[] = [];
  myControl = new FormControl();
  errorTruck: boolean = false;


  constructor(private mapservice: MapService, private cumService: CommunicationService) { }

  ngOnInit(): void {

    this.responseSubscription = this.mapservice.responseArray
      .subscribe(data => {
        this.allTrucksDetails = data;
      });// End of response subscribe


    // Auto-filter trucks based on user input
    this.filteredTruck1Subscription = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterInputValue(value))
      ).subscribe(val => {
        console.log(this.filteredTrucksList);
        this.filteredTrucksList = val;
        this.cumService.passingFilteredArrayToMap.next(this.filteredTrucksList);
      });


    // Auto-filter trucks based on button click
    this.filteredTruck2Subscription = this.cumService.passingNumberTolist.
      pipe(
        startWith(''),
        map(value => this.filterInputValue(value))
      ).subscribe(val => {
        this.filteredTrucksList = val;
        this.cumService.passingFilteredArrayToMap.next(this.filteredTrucksList);
      });

    //  Auto-filter trucks based on header toolbar selector
    this.passingSelectorValueArraySubs = this.cumService.passingSelectorValueArray.
      pipe(
        startWith(''),
        map(value => this.filterInputValue(value)))
      .subscribe(val => {
        this.filteredTrucksList = val
        if (val.length === 0) {
          this.filteredTrucksList = this.allTrucksDetails;
        }
        this.cumService.passingFilteredArrayToMap.next(this.filteredTrucksList);
      });


  }// End of ng on init


  // Function to filter truck list data
  private filterInputValue(value: any): string[] {

    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.allTrucksDetails.filter(option => {
        return option.truckNumber.toLowerCase().replace(' ', '').includes(filterValue)
      });
    } else if (typeof value === 'number') {
      return this.allTrucksDetails.filter(option => {

        //Total truck list (assigned value = 10)
        if (value === 10) {
          this.errorTruck = false;
          return true;
        }
        //Running trucks list (assigned value = 1)
        else if (value === 1) {
          this.errorTruck = false;
          return option.truckRunningState === value;
          //Stopped truck list(assigned value = 0)
        } else if (value === 0) {
          this.errorTruck = false;
          return option.truckRunningState === value;
        }
        //Idle truck list(assigned value = 3)
        else if (value === 3) {
          this.errorTruck = false;
          return option.ignitionOn && !option.truckRunningState;
        }
        //Error truck list (assigned value = 2)
        else if (value === 2) {
          this.errorTruck = true;
          return new Date(option.updateTime).getHours() < 4;
        }
      });
    } else {
      //Filtering for selector truck list
      return this.allTrucksDetails.filter(option => {
        this.errorTruck = false;
        return value.includes(option.truckNumber);
      })
    }
  }


  ngOnDestroy() {
    this.responseSubscription.unsubscribe();
    this.filteredTruck1Subscription.unsubscribe();
    this.filteredTruck2Subscription.unsubscribe();
    this.passingSelectorValueArraySubs.unsubscribe();
  }

}// End of class
