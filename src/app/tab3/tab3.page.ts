import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonSpinner, IonList, IonListHeader, IonItem, IonLabel, IonButton, IonIcon} from '@ionic/angular/standalone';
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
  imports: [
    IonButton, IonLabel, IonItem, IonListHeader, IonList, IonSpinner,
    IonText, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, CommonModule
  ],
})
export class Tab3Page {

  // pole pro ulozena mesta v historii
  history: string[] = [];

  // pole pro oblibena mesta
  favorites: string[] = [];

  loading = false;
  error: string | null = null;

  // ikony pouzivane v sablone
  public trash = trash;
  public star = star;

  constructor(
    private storageService: StorageService, 
    private citySelectionService: CitySelectionService, 
    private router: Router   // router pro navigaci na tab1
  ) {}

  // vola se automaticky pri kazdem vstupu na tuto stranku
  ionViewWillEnter() {
    this.loadAll();
  }

  // nacte soucasne historii i oblibene
  private async loadAll() {
    this.error = null;
    this.loading = true;
    try {
      await this.loadFavorites();  // nacteni oblibenych
      await this.loadHistory();    // nacteni historie hledani
    } catch (e) {
      this.error = 'Nepodarilo se nacist data.';
    } finally {
      this.loading = false;
    }
  }

  // nacte historii ze storage
  async loadHistory() {
    try {
      this.history = await this.storageService.getHistory();
    } catch (e) {
      this.history = [];
    }
  }

  // nacte oblibene ze storage
  async loadFavorites() {
    try {
      this.favorites = await this.storageService.getFavorites();
    } catch (e) {
      this.favorites = [];
    }
  }

  // po kliknuti na oblibene mesto jej posle na tab1 a prepne na tuto kartu
  selectFromFavorites(city: string) {
    this.citySelectionService.selectCity(city);

    // navigace na tab1
    this.router.navigate(['/tabs/tab1'])
  }

  // odebere mesto z oblibenych a aktualizuje seznam
  async removeFavorite(city: string) {
    try {
      await this.storageService.removeFavorite(city);
      this.favorites = this.favorites.filter(
        c => c.toLowerCase() !== city.toLowerCase()
      );
    } catch (e) {
      console.error('Chyba pri odebirani oblibeneho:', e);
    }
  }

  // smaze celou historii vyhledavani
  async clearHistory() {
    this.error = null;
    this.loading = true;
    try {
      await this.storageService.clearHistory();
      this.history = [];
    } catch (e) {
      this.error = 'Nepodarilo se smazat historii.';
    } finally {
      this.loading = false;
    }
  }

}
