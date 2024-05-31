import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowHideContentService {
  private showExportButtonSubject = new BehaviorSubject<boolean>(true);
  private showBackButtonSubject = new BehaviorSubject<boolean>(true);
  
  showExportButton$ = this.showExportButtonSubject.asObservable();
  showBackButton$ = this.showBackButtonSubject.asObservable();

  constructor() { }

  setShowExportButton(show: boolean) {
    this.showExportButtonSubject.next(show);
  }
  setShowBackButton(show: boolean) {
    this.showBackButtonSubject.next(show);
  }
}
