import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonText, IonSpinner, IonList, IonSearchbar, IonThumbnail } from '@ionic/angular/standalone';
import { CommonModule} from '@angular/common';
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

  // struktura pro seskupeny forecast podle dni
  groupedForecast: { date: string, items: any[] }[] = [];

  constructor(private weatherService: WeatherService) {}

  // aktualizuje lokalni promennou city pri psani inputu
  onCityInput(event: any) {
    const value = event.detail?.value ?? '';
    this.city = value;
  }

  // Nacte predpoved pocasi pro zadane mesto
  loadForecast() {
    this.error = null;

    if (!this.city || this.city.trim().length === 0) {
      this.error = 'Zadej nazev mesta.';
      return;
    }

    this.loading = true;
    this.forecastList = [];
    this.groupedForecast = [];

    this.weatherService.getForecast(this.city.trim()) // nacteni predpovedi z API
      .subscribe({
        next: (data) => {
          this.forecastList = data.list || [];
          this.groupForecastByDay(); // seskupeni dat podle dne
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Nepodarilo se nacist predpoved. Zkontroluj nazev mesta nebo pripojeni.';
          this.loading = false;
        }
      });
    }

  // Seskupeni forecastList podle dnu
  private groupForecastByDay() {
    const map = new Map<string, any[]>();

    for (const item of this.forecastList) {
      const dtTxt: string = item.dt_txt ?? '';
      const day = dtTxt.split(' ')[0]; // "YYYY-MM-DD"
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(item);
    }

    this.groupedForecast = Array.from(map.entries())
      .map(([date, items]) => ({ date, items }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

}
