import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const HISTORY_KEY = 'search_history';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storageReady = false;

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    await this.storage.create();
    this._storageReady = true;
  }

  private async ensureReady() {
    if (!this._storageReady) {
      await this.init();
    }
  }

  async getHistory(): Promise<string[]> {
    await this.ensureReady();
    const history = await this.storage.get(HISTORY_KEY);
    return history || [];
  }

  async addToHistory(city: string): Promise<void> {
    const trimmed = city.trim();
    if (!trimmed) {
      return;
    }

    const history = await this.getHistory();

    // odstraneni duplikatu
    const filtered = history.filter(c => c.toLowerCase() !== trimmed.toLowerCase());

    // nove mesto na zacatek
    filtered.unshift(trimmed);

    // omezeni na poslednich 10 vyhledavani
    const limited = filtered.slice(0, 10);

    await this.storage.set(HISTORY_KEY, limited);
  }

  async clearHistory(): Promise<void> {
    await this.ensureReady();
    await this.storage.remove(HISTORY_KEY);
  }
}
