import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const HISTORY_KEY = 'search_history';
const FAVORITES_KEY = 'favorite_cities';

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


async getFavorites(): Promise<string[]> {
  await this.ensureReady();
  const favorites = await this.storage.get(FAVORITES_KEY);
  return favorites || [];
}

async addFavorite(city: string): Promise<void> {
  const trimmed = city.trim();
  if (!trimmed) {
    return;
  }

  const favorites = await this.getFavorites();

  // pokud už tam je, nic neměň
  const exists = favorites.some(c => c.toLowerCase() === trimmed.toLowerCase());
  if (exists) {
    return;
  }

  favorites.unshift(trimmed);
  await this.storage.set(FAVORITES_KEY, favorites);
}

async removeFavorite(city: string): Promise<void> {
  const trimmed = city.trim();
  const favorites = await this.getFavorites();
  const filtered = favorites.filter(c => c.toLowerCase() !== trimmed.toLowerCase());
  await this.storage.set(FAVORITES_KEY, filtered);
}

async isFavorite(city: string): Promise<boolean> {
  const trimmed = city.trim();
  if (!trimmed) return false;

  const favorites = await this.getFavorites();
  return favorites.some(c => c.toLowerCase() === trimmed.toLowerCase());
}
}
