import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class CommunicationService {

  loadingSpinnerSubject = new Subject<any>();
  passingNumberTolist = new Subject<number>();
  passingFilteredArrayToMap = new Subject<any[]>();
  passingSelectorValueArray = new BehaviorSubject<string[]>([]);

}
