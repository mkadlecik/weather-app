import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonSpinner, IonList,IonListHeader,IonItem,IonLabel, IonButton, IonIcon} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { CitySelectionService } from '../services/city-selection.service';
import { trash, star } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonListHeader, IonList, IonSpinner, IonText, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, CommonModule
  ],
})
export class Tab3Page {

  history: string[] = [];
  favorites: string[] = [];

  loading = false;
  error: string | null = null;

  public trash = trash;
  public star = star;

  constructor(
    private storageService: StorageService,
    private citySelectionService: CitySelectionService,
    private router: Router
  ) {}

  // zavolá se při vstupu na stránku
  ionViewWillEnter() {
    this.loadAll();
  }

  private async loadAll() {
    this.error = null;
    this.loading = true;
    try {
      await this.loadFavorites();
      await this.loadHistory();
    } catch (e) {
      console.error('Chyba při načítání dat na Tab3:', e);
      this.error = 'Nepodařilo se načíst data.';
    } finally {
      this.loading = false;
    }
  }

  async loadHistory() {
    try {
      this.history = await this.storageService.getHistory();
      console.log('Tab3: history =', this.history);
    } catch (e) {
      console.error('Chyba při načítání historie:', e);
      this.history = [];
    }
  }

  async loadFavorites() {
    try {
      this.favorites = await this.storageService.getFavorites();
      console.log('Tab3: favorites =', this.favorites);
    } catch (e) {
      console.error('Chyba při načítání oblíbených:', e);
      this.favorites = [];
    }
  }

  selectFromFavorites(city: string) {
    this.citySelectionService.selectCity(city);

    this.router.navigate(['/tabs/tab1']).catch(err => {
      console.error('Navigate to Tab1 failed, trying /tab1', err);
      this.router.navigate(['/tab1']).catch(e2 => console.error('Navigate /tab1 also failed', e2));
    });
  }

  async removeFavorite(city: string) {
    try {
      await this.storageService.removeFavorite(city);
      this.favorites = this.favorites.filter(c => c.toLowerCase() !== city.toLowerCase());
    } catch (e) {
      console.error('Chyba při odebírání oblíbeného:', e);
    }
  }

  async clearHistory() {
    this.error = null;
    this.loading = true;
    try {
      await this.storageService.clearHistory();
      this.history = [];
    } catch (e) {
      console.error('Chyba při mazání historie:', e);
      this.error = 'Nepodařilo se smazat historii.';
    } finally {
      this.loading = false;
    }
  }

}
