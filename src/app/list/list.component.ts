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
  subscription: Subscription;
  filteredTruck2Subscription: Subscription;
  filteredTruck1Subscription: Subscription;
  passingSelectorValueArraySubs: Subscription;
  containerBoolean: boolean = true;
  allTrucksDetails = [];
  allTrucksNumber: string[] = [];
  myControl = new FormControl();
  errorTruck: boolean = false;


  constructor(private mapservice: MapService, private cumService: CommunicationService) { }

  ngOnInit(): void {

    ////////////

    this.mapservice.responseArray.
      // Modifying  truck details to identify error truck
      pipe(
        map(data => {
          let arr = [];
          for (let ele of data) {
            let truckErrorStatus = false;
            if (new Date(ele.updateTime).getHours() < 10) {
              truckErrorStatus = true
            }
            arr.push({ ...ele, truckErrorStatus });
          }
          return arr;
        }))
      .subscribe(data => {
        for (let ele of data) {
          this.allTrucksDetails.push(ele);
        }
        console.dir(this.allTrucksDetails);

        // Auto-filter trucks based on user input
        this.filteredTruck1Subscription = this.myControl.valueChanges
          .pipe(
            tap(() => this.containerBoolean = true),
            startWith(''),
            map(value => this.filterInputValue(value))
          ).subscribe(val => {
            this.filteredTrucksList = val;
            this.cumService.passingFilteredArrayToMap.next(this.filteredTrucksList);
          });


        // Auto-filter trucks based on button click
        this.filteredTruck2Subscription = this.cumService.passingNumberTolist.
          pipe(
            tap(() => {
              this.containerBoolean = false;
            }),
            startWith(''),
            map(value => this.filterInputValue(value))
          ).subscribe(val => {
            this.filteredTrucksList = val;
            this.cumService.passingFilteredArrayToMap.next(this.filteredTrucksList);
          });

        //  Auto-filter trucks based on toolbar selector
        this.passingSelectorValueArraySubs = this.cumService.passingSelectorValueArray.
          pipe(
            tap(() => {
              this.containerBoolean = false;
            }),
            startWith(''),
            map(value => this.filterInputValue(value)))
          .subscribe(val => {
            this.filteredTrucksList = val
            this.cumService.passingFilteredArrayToMap.next(this.filteredTrucksList);
          });

      });// End of response subscribe
    ////////////////////////////////////////






  }// End of ngon init


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
          this.errorTruck = false;
          return true;
        }
        //Running trucks list
        else if (value === 1) {
          this.errorTruck = false;
          return option.truckRunningState === value;
          //Stopped truck list
        } else if (value === 0) {
          this.errorTruck = false;
          return option.truckRunningState === value;
        }
        //Idle truck list
        else if (value === 3) {
          this.errorTruck = false;
          return option.ignitionOn && !option.truckRunningState;
        }
        //Error truck list
        else if (value === 2) {
          this.errorTruck = true;
          return new Date(option.updateTime).getHours() < 10;
        }
      });
    } else {
      return this.allTrucksDetails.filter(option => {
        this.errorTruck = false;
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

}// End of class
