import { OnInit, Output } from '@angular/core';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MapService } from './map.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  noError: boolean = true;
  constructor(private mapservice: MapService) { }

  ngOnInit() {
    this.mapservice.errorResponse.subscribe(() => {
      this.noError = false;
    });
  }




}
