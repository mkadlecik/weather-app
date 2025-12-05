import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonText, IonSpinner, IonCardHeader, IonCard, IonCardTitle, IonCardSubtitle, IonCardContent, IonInput } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { WeatherService } from '../services/weather.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonInput, IonSpinner, IonText, IonButton, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, CommonModule, IonCardContent, IonCardSubtitle, IonCard, IonCardHeader, IonCardTitle],
})
export class Tab1Page {

  city: string = '';
  loading = false;
  error: string | null = null;
  currentWeather: any = null;

  constructor(private weatherService: WeatherService) {}

  onCityInput(event: any) {
    const value = event.detail?.value ?? '';
    this.city = value;
    console.log('onCityInput, city =', this.city);
  }

  searchCity() {
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
        next: (data) => {
          console.log('API odpověď:', data);
          this.currentWeather = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Chyba API:', err);
          this.error = 'Nepodařilo se načíst počasí. Zkontroluj název města nebo připojení.';
          this.loading = false;
        }
      });
  }
}
