import { OnInit, Output } from '@angular/core';
import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CommunicationService } from './communication.service';
import { MapService } from './map.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  noError: boolean = true;
  isLoading: boolean = false;
  errorSubscription: Subscription;
  loadingSubscription: Subscription;



  constructor(private mapservice: MapService, private cumService: CommunicationService) { }

  ngOnInit() {
    this.errorSubscription = this.mapservice.errorResponse.subscribe(() => {
      this.noError = false;
    });
    this.loadingSubscription = this.cumService.loadingSpinnerSubject.subscribe(val => {
      this.isLoading = val;
    });

  }



  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
  }


}
