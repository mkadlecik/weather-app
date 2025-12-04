import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private baseUrl = environment.openWeatherBaseUrl;
  private apiKey = environment.openWeatherApiKey;

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<any> {
    const params = new HttpParams()
      .set('q', city)
      .set('appid', this.apiKey)
      .set('units', 'metric')
      .set('lang', 'cz');

    return this.http.get(`${this.baseUrl}/weather`, { params });
  }

  getForecast(city: string): Observable<any> {
    const params = new HttpParams()
      .set('q', city)
      .set('appid', this.apiKey)
      .set('units', 'metric')
      .set('lang', 'cz');

    return this.http.get(`${this.baseUrl}/forecast`, { params });
  }
}
