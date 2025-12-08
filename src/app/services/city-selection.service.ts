import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitySelectionService {

  private selectedCitySubject = new Subject<string>();
  selectedCity$ = this.selectedCitySubject.asObservable();

  selectCity(city: string) {
    const trimmed = city.trim();
    if (!trimmed) {
      return;
    }
    this.selectedCitySubject.next(trimmed);
  }
}
