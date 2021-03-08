import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../communication.service';
import { MapService } from '../map.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  truckNumberArray: string[] = [];
  idleTruck: number = 0;
  errorTruck: number = 0;
  runningTruck: number = 0;
  stoppedTruck: number = 0;
  myForm: FormGroup;
  formSubscripition: Subscription;
  responseSubscription: Subscription;

  constructor(private mapservice: MapService, private cumService: CommunicationService) { }

  ngOnInit(): void {
    // Initializing form
    this.myForm = new FormGroup({
      selectFormControl: new FormControl(null, Validators.required)
    })

    // Taking and maupulating response
    this.responseSubscription = this.mapservice.responseArray.subscribe((data: any) => {
      for (let { truckNumber, truckRunningState, ignitionOn, updateTime } of data) {
        this.truckNumberArray.push(truckNumber);
        truckRunningState ? this.runningTruck++ : this.stoppedTruck++;
        if (ignitionOn && !truckRunningState) this.idleTruck++;
        if (new Date(updateTime).getHours() < 10) this.errorTruck++;
      }
    });

    //Pasing selector value to truck list
    this.formSubscripition = this.myForm.get('selectFormControl').valueChanges.subscribe((val) => {
      this.cumService.passingSelectorValueArray.next(val)
    })

  }

  onTTButtonClick(e: Event) {
    e.preventDefault();
    this.cumService.passingNumberTolist.next(10);
  }

  onRTButtonClick(e: Event) {
    e.preventDefault();
    this.cumService.passingNumberTolist.next(1);
  }

  onSTButtonClick(e: Event) {
    e.preventDefault();
    this.cumService.passingNumberTolist.next(0);
  }

  onITButtonClick(e: Event) {
    e.preventDefault();
    this.cumService.passingNumberTolist.next(3);

  }

  onETButtonClick(e: Event) {
    e.preventDefault();
    this.cumService.passingNumberTolist.next(2);
  }

  ngOnDestroy() {
    this.formSubscripition.unsubscribe();
    this.responseSubscription.unsubscribe();
  }


}// End of class
