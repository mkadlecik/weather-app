import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab3Page implements OnInit {

  history: string[] = [];
  loading = false;
  error: string | null = null;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
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
}
