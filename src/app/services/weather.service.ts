import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  // zakladni URL pro API OpenWeather
  private baseUrl = environment.openWeatherBaseUrl;

  // API klic pro volani OpenWeather
  private apiKey = environment.openWeatherApiKey;

  constructor(private http: HttpClient) {}

  // funkce pro ziskani aktualniho pocasi pro dane mesto
  getCurrentWeather(city: string): Observable<any> {

    // parametry dotazu pro API
    const params = new HttpParams()
      .set('q', city)          // mesto
      .set('appid', this.apiKey) // API klic
      .set('units', 'metric')    // metricke jednotky
      .set('lang', 'cz');        // cesky jazyk

    // GET request na endpoint weather - aktualni pocasi
    return this.http.get(`${this.baseUrl}/weather`, { params });
  }

  // funkce pro ziskani predpovedi pocasi na nekolik dni
  getForecast(city: string): Observable<any> {

    // parametry dotazu pro API
    const params = new HttpParams()
      .set('q', city)          // mesto
      .set('appid', this.apiKey) // API klic
      .set('units', 'metric')    // metricke jednotky
      .set('lang', 'cz');        // cesky jazyk

    // GET request na endpoint forecast - predpoved pocasi
    return this.http.get(`${this.baseUrl}/forecast`, { params });
  }
}
