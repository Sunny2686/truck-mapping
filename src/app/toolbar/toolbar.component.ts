import { Component, OnInit, OnDestroy } from '@angular/core';
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
      for (let { truckNumber, truckRunningState, truckErrorStatus, truckIdleStatus } of data) {
        this.truckNumberArray.push(truckNumber);
        truckRunningState ? this.runningTruck++ : this.stoppedTruck++;
        if (truckIdleStatus) this.idleTruck++;
        if (truckErrorStatus) this.errorTruck++;
      }
    });

    //Pasing selector value to truck list
    this.formSubscripition = this.myForm.get('selectFormControl').valueChanges.subscribe((val) => {
      this.cumService.passingSelectorValueArray.next(val)
    })

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
    this.formSubscripition.unsubscribe();
    this.responseSubscription.unsubscribe();
  }


}// End of class
