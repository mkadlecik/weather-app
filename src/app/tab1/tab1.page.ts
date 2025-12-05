import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab1Page {
  city: string = '';
  loading = false;
  error: string | null = null;
  currentWeather: any = null;

  constructor(private weatherService: WeatherService) {}

  searchCity() {
    this.error = null;

    if (!this.city || this.city.trim().length === 0) {
      this.error = 'Zadej název města.';
      return;
    }

    this.loading = true;
    this.currentWeather = null;

    this.weatherService.getCurrentWeather(this.city.trim())
      .subscribe({
        next: (data) => {
          this.currentWeather = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Nepodařilo se načíst počasí. Zkontroluj název města nebo připojení.';
          this.loading = false;
        }
      });
  }
}
