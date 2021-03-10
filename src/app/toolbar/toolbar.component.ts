import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import { CommunicationService } from '../communication.service';
import { MapService } from '../map.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  truckNumberArray: string[] = [];
  subs = new SubSink();
  //Storing truck number for every trucks
  idleTruck: number = 0;
  errorTruck: number = 0;
  runningTruck: number = 0;
  stoppedTruck: number = 0;
  runningTruckSaved: number;
  stoppedTruckSaved: number;
  errorTruckSaved: number;
  idleTruckSaved: number;
  truckLengthSaved: number;

  myForm: FormGroup;
  selectorValue: any[] = [];

  constructor(private mapservice: MapService, private cumService: CommunicationService) { }

  ngOnInit(): void {
    // Initializing form for selector
    this.myForm = new FormGroup({
      selectFormControl: new FormControl(null)
    })

    // Taking and maupulating response
    this.subs.sink = this.mapservice.responseArray.subscribe(
      {
        next: (data: any) => {
          for (let { truckNumber, truckRunningState, truckErrorStatus, truckIdleStatus } of data) {
            this.truckNumberArray.push(truckNumber);
            this.selectorValue.push({ truckNumber, truckRunningState, truckErrorStatus, truckIdleStatus });
            truckRunningState ? this.runningTruck++ : this.stoppedTruck++;
            if (truckIdleStatus) this.idleTruck++;
            if (truckErrorStatus) this.errorTruck++;
          }
          //Saving truck status
          this.runningTruckSaved = this.runningTruck;
          this.stoppedTruckSaved = this.stoppedTruck;
          this.errorTruckSaved = this.errorTruck;
          this.idleTruckSaved = this.idleTruck;
          this.truckLengthSaved = this.truckNumberArray.length;
        }
      });

    //Pasing selector value to truck list
    this.subs.sink = this.myForm.get('selectFormControl').valueChanges
      .subscribe((val) => {
        this.cumService.passingSelectorValueArray.next(val);

        this.truckLengthSaved = 0;
        this.runningTruck = 0;
        this.stoppedTruck = 0;
        this.idleTruck = 0;
        this.errorTruck = 0;


        for (let { truckNumber, truckRunningState, truckErrorStatus, truckIdleStatus } of this.selectorValue) {
          if (val.includes(truckNumber)) {

            truckRunningState ? this.runningTruck++ : this.stoppedTruck++;
            if (truckIdleStatus) this.idleTruck++;
            if (truckErrorStatus) this.errorTruck++;
            this.truckLengthSaved++;
          }
        }// End of for loop
        if (val.length === 0) {
          this.runningTruck = this.runningTruckSaved;
          this.stoppedTruck = this.stoppedTruckSaved;
          this.errorTruck = this.errorTruckSaved;
          this.idleTruck = this.idleTruckSaved;
          this.truckLengthSaved = this.truckNumberArray.length;
        }

      });//End of selector subscribe.

  }
  // function to responde on total trucks button click
  onTTButtonClick(e: Event) {
    e.preventDefault();
    this.cumService.passingNumberTolist.next(10);
  }
  // function to responde on running trucks button click
  onRTButtonClick(e: Event) {
    e.preventDefault();
    this.cumService.passingNumberTolist.next(1);
  }
  // function to responde on stopped trucks button click
  onSTButtonClick(e: Event) {
    e.preventDefault();
    this.cumService.passingNumberTolist.next(0);
  }
  // function to responde on idle trucks button click
  onITButtonClick(e: Event) {
    e.preventDefault();
    this.cumService.passingNumberTolist.next(3);
  }
  // function to responde on error trucks button click
  onETButtonClick(e: Event) {
    e.preventDefault();
    this.cumService.passingNumberTolist.next(2);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.subs.unsubscribe();
  }


}// End of class
