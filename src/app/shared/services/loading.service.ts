import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public isLoading = new BehaviorSubject<boolean>(false);

  show() {
    this.isLoading.next(true);
  }

  hide() {
    this.isLoading.next(false);
  }

  // Add a method to hide the loader with a delay
  hideWithDelay(delay: number) {
    setTimeout(() => {
      this.isLoading.next(false);
    },);
  }
}