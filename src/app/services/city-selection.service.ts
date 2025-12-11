import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitySelectionService {

  // Subject slouzi k posilani vybraneho mesta ostatnim komponentam
  private selectedCitySubject = new Subject<string>();

  selectedCity$ = this.selectedCitySubject.asObservable();

  // Funkce pro vyber mesta
  // Prijme text, oreze mezery, zkontroluje prazdny retezec
  // Pokud je validni, odesle ho do Subjectu
  selectCity(city: string) {
    const trimmed = city.trim();
    if (!trimmed) {
      return; // nic se neposila, pokud je vstup prazdny
    }
    this.selectedCitySubject.next(trimmed); // odeslani vybraneho mesta
  }
}

