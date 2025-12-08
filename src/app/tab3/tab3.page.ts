import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonSpinner, IonList, IonListHeader, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { StorageService } from '../services/storage.service';
import { CommonModule } from '@angular/common';
import { CitySelectionService } from '../services/city-selection.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  standalone: true,
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonButton, IonLabel, IonItem, IonListHeader, IonList, IonSpinner, IonText, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule],
})
export class Tab3Page implements OnInit {

  history: string[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private storageService: StorageService,
    private citySelectionService: CitySelectionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadHistory();
  }

  ionViewWillEnter() {
    this.loadHistory();
  }

  async loadHistory() {
    this.error = null;
    this.loading = true;

    try {
      this.history = await this.storageService.getHistory();
    } catch (e) {
      console.error('Chyba při načítání historie:', e);
      this.error = 'Nepodařilo se načíst historii.';
    } finally {
      this.loading = false;
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

  selectFromHistory(city: string) {
    this.citySelectionService.selectCity(city);
    this.router.navigate(['tabs/tab1'])
  }
  
}
