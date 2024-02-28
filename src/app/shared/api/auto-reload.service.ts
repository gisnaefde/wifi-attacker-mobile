import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutoReloadService {

  constructor() { }

  startReloading(): Observable<number> {
    return interval(5000); // Mengembalikan Observable yang akan mengeluarkan nilai setiap 5 detik
  }
}
