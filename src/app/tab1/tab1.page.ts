import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonButton, IonText, IonSpinner, IonCardHeader, IonCard, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonSearchbar } from '@ionic/angular/standalone';
import { WeatherService } from '../services/weather.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from '../services/storage.service';
import { CitySelectionService } from '../services/city-selection.service';
import { star, starOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonIcon, IonSpinner, IonText, IonButton, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, CommonModule, IonCardContent, IonCardSubtitle, IonCard, IonCardHeader, IonCardTitle],
})
export class Tab1Page {

  // aktualne zadane nebo vybrane mesto v inputu
  city: string = '';

  // nahravani dat z API
  loading = false;

  // text chyby pro zobrazeni uzivateli
  error: string | null = null;

  // objekt s daty aktualniho pocasi (odpoved z API)
  currentWeather: any = null;

  // ikonky pro tlacitko oblibene (ionicons)
  public star = star;
  public starOutline = starOutline;

  // jestli je aktualni mesto v oblibenych
  isFavorite = false;

  constructor(
    private weatherService: WeatherService,           // sluzba pro volani OpenWeather API
    private storageService: StorageService,           // sluzba pro ukladani do lokalniho storage
    private citySelectionService: CitySelectionService // sluzba pro sdileni vybraneho mesta mezi taby
  ) {
    // Pri prijmu vybraneho mesta z jineho tabu automaticky nastavime hodnotu v inputu a spustime vyhledavani
    this.citySelectionService.selectedCity$.subscribe((city) => {
      console.log('Tab1: selected city from history =', city);
      this.city = city;
      this.searchCity();
    });
  }

  // aktualizuje lokalni promennou city pri psani inputu
  onCityInput(event: any) {
    const value = event.detail?.value ?? '';
    this.city = value;
  }

  // vyhleda aktualni pocasi pro zadane mesto
  async searchCity() {
    this.error = null;

    // kontrola prazdneho vstupu
    if (!this.city || this.city.trim().length === 0) {
      this.error = 'Zadej nazev mesta.';
      return;
    }

    this.loading = true;
    this.currentWeather = null;

    // zavolame sluzbu WeatherService, ktera vraci odpoved API
    this.weatherService.getCurrentWeather(this.city.trim())
      .subscribe({
        next: async (data) => {
          // pokud prisla odpoved, ulozime ji do promenne a zastavime spinner
          this.currentWeather = data;
          this.loading = false;

          // ulozime hledane mesto do historie
          try {
            await this.storageService.addToHistory(this.city.trim());
          } catch (e) {
            console.error('Chyba pri ukladani do historie:', e);
          }

          // po nacteni dat zjistime, jestli je mesto v oblibenych
          await this.updateFavoriteState();
        },
        error: (err) => {
          // pri chybe z API zobrazime uzivateli zpravu a zastavime spinner
          this.error = 'Nepodarilo se nacist pocasi. Zkontroluj nazev mesta nebo pripojeni.';
          this.loading = false;
        }
      });
  }

  // Zkontroluje ve storage, jestli je aktualni mesto v seznamu oblibenych
  async updateFavoriteState() {
    try {
      const name = (this.currentWeather?.name || this.city || '').trim();
      if (!name) {
        this.isFavorite = false;
        return;
      }
      this.isFavorite = await this.storageService.isFavorite(name);
    } catch (e) {
      console.error('Chyba pri kontrole oblibeneho stavu:', e);
      this.isFavorite = false;
    }
  }

  // Prepnuti stavu oblibeneho mesta - pokud existuje, odebere ho z oblibenych ; jinak prida
  async toggleFavorite() {
    const name = (this.currentWeather?.name || this.city || '').trim();
    if (!name) return;

    try {
      if (this.isFavorite) {
        await this.storageService.removeFavorite(name);
        this.isFavorite = false;
      } else {
        await this.storageService.addFavorite(name);
        this.isFavorite = true;
      }
    } catch (e) {
      console.error('Chyba pri prepinani oblibeneho:', e);
    }
  }
}
