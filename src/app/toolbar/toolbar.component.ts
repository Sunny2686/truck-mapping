import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapService } from '../map.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  toppings = new FormControl();
  truckNumberArray: string[] = [];
  runningTruck: number = 0;
  stoppedTruck: number = 0;

  constructor(private mapservice: MapService) { }

  ngOnInit(): void {
    this.mapservice.responseArray.subscribe((data: any) => {
      console.log(data[2]);
      for (let { truckNumber, lastRunningState: { truckRunningState } } of data) {
        this.truckNumberArray.push(truckNumber);
        truckRunningState ? this.runningTruck++ : this.stoppedTruck++;
      }
      console.log(this.runningTruck, this.stoppedTruck);
    });
  }

}
