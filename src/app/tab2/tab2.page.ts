import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule, JsonPipe } from '@angular/common';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, CommonModule]
})
export class Tab2Page {
  city: string = '';
  loading = false;
  error: string | null = null;
  forecastList: any[] = [];

  constructor(private weatherService: WeatherService) {}

  onCityInput(event: any) {
    const value = event.detail?.value ?? '';
    this.city = value;
    console.log('Tab2 onCityInput, city =', this.city);
  }

  loadForecast() {
    console.log('loadForecast() zavolána, city =', this.city);

    this.error = null;

    if (!this.city || this.city.trim().length === 0) {
      this.error = 'Zadej název města.';
      return;
    }

    this.loading = true;
    this.forecastList = [];

    this.weatherService.getForecast(this.city.trim())
      .subscribe({
        next: (data) => {
          console.log('Forecast data:', data);
          // OpenWeather vrací pole v data.list
          this.forecastList = data.list || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Chyba forecast API:', err);
          this.error = 'Nepodařilo se načíst předpověď. Zkontroluj název města nebo připojení.';
          this.loading = false;
        }
      });
  }
}
