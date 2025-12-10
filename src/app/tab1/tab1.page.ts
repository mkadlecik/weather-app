import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonText, IonSpinner, IonCardHeader, IonCard, IonCardTitle, IonCardSubtitle, IonCardContent, IonInput, IonIcon, IonSearchbar } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
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

  city: string = '';
  loading = false;
  error: string | null = null;
  currentWeather: any = null;
  public star = star;
  public starOutline = starOutline;

  isFavorite = false;

  constructor(
    private weatherService: WeatherService,
    private storageService: StorageService,
    private citySelectionService: CitySelectionService
  ) {
    this.citySelectionService.selectedCity$.subscribe((city) => {
      console.log('Tab1: selected city from history =', city);
      this.city = city;
      this.searchCity();
    });
  }

  onCityInput(event: any) {
    const value = event.detail?.value ?? '';
    this.city = value;
  }

  async searchCity() {
    console.log('searchCity() zavolána, city =', this.city);

    this.error = null;

    if (!this.city || this.city.trim().length === 0) {
      this.error = 'Zadej název města.';
      return;
    }

    this.loading = true;
    this.currentWeather = null;

    this.weatherService.getCurrentWeather(this.city.trim())
      .subscribe({
        next: async (data) => {
          console.log('API odpověď:', data);
          this.currentWeather = data;
          this.loading = false;

          // ulozi do historie
          try {
            await this.storageService.addToHistory(this.city.trim());
          } catch (e) {
            console.error('Chyba při ukládání do historie:', e);
          }

          await this.updateFavoriteState();
        },
        error: (err) => {
          console.error('Chyba API:', err);
          this.error = 'Nepodařilo se načíst počasí. Zkontroluj název města nebo připojení.';
          this.loading = false;
        }
      });
  }

  // zjisti, jestli je aktualni mesto v oblibenych
  async updateFavoriteState() {
    try {
      const name = (this.currentWeather?.name || this.city || '').trim();
      if (!name) {
        this.isFavorite = false;
        return;
      }
      this.isFavorite = await this.storageService.isFavorite(name);
    } catch (e) {
      console.error('Chyba při kontrole oblíbeného stavu:', e);
      this.isFavorite = false;
    }
  }

  // prida nebo odebere mesto z oblibenych
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
      console.error('Chyba při přepínání oblíbeného:', e);
    }
  }
}
