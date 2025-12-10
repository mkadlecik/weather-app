import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText, IonSpinner, IonList, IonSearchbar, IonThumbnail } from '@ionic/angular/standalone';
import { CommonModule, DatePipe} from '@angular/common';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonSearchbar, IonList, IonSpinner, IonText, IonButton, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, IonThumbnail]
})
export class Tab2Page {
  city: string = '';
  loading = false;
  error: string | null = null;
  forecastList: any[] = [];

  groupedForecast: { date: string, items: any[] }[] = [];

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
    this.groupedForecast = [];

    this.weatherService.getForecast(this.city.trim())
      .subscribe({
        next: (data) => {
          console.log('Forecast data:', data);
          // OpenWeather vrací pole v data.list
          this.forecastList = data.list || [];
          this.groupForecastByDay();
          this.loading = false;
        },
        error: (err) => {
          console.error('Chyba forecast API:', err);
          this.error = 'Nepodařilo se načíst předpověď. Zkontroluj název města nebo připojení.';
          this.loading = false;
        }
      });
    }
      private groupForecastByDay() {
        const map = new Map<string, any[]>();
    
        for (const item of this.forecastList) {
          // OpenWeather poskytuje dt_txt jako "YYYY-MM-DD HH:mm:ss"
          const dtTxt: string = item.dt_txt ?? '';
          const day = dtTxt.split(' ')[0]; // "YYYY-MM-DD"
          if (!map.has(day)) map.set(day, []);
          map.get(day)!.push(item);
        }
    
        // transform to array and sort by date ascending
        this.groupedForecast = Array.from(map.entries())
          .map(([date, items]) => ({ date, items }))
          .sort((a, b) => a.date.localeCompare(b.date));
      }
    
}
