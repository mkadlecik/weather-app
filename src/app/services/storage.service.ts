import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const HISTORY_KEY = 'search_history';
const FAVORITES_KEY = 'favorite_cities';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storageReady = false; // indikator jestli je storage pripravena

  constructor(private storage: Storage) {
    this.init(); // inicializace storage po vytvoreni sluzby
  }

  private async init() {
    await this.storage.create();  // vytvoreni instance storage
    this._storageReady = true;    // oznaceni storage jako pripravene
  }

  private async ensureReady() {
    // zajistuje, ze storage je inicializovana drive nez se pouzije
    if (!this._storageReady) {
      await this.init();
    }
  }

  // funkce pro vraceni historie, vraci bud pole historicky hledanych mest, nebo prazdne pole
  async getHistory(): Promise<string[]> {
    await this.ensureReady();   // kontrola, jestli je storage inicializovana
    const history = await this.storage.get(HISTORY_KEY);  // nacteni historie
    return history || [];       // vraceni historie nebo prazdneho pole
  }

  // funkce pro pridani vyhledaneho mesta do historie
  async addToHistory(city: string): Promise<void> {
    const trimmed = city.trim();    // odstraneni mezer
    if (!trimmed) {
      return;     // ukonceni, kdyz je vstup prazdny
    }

    const history = await this.getHistory(); // nacteni ulozene historie

    // odstraneni duplicit podle nazvu mesta
    const filtered = history.filter(c => c.toLowerCase() !== trimmed.toLowerCase());

    // pridani noveho zaznamu na zacatek
    filtered.unshift(trimmed);

    // omezeni velikosti historie na poslednich 10 zaznamu
    const limited = filtered.slice(0, 10);

    await this.storage.set(HISTORY_KEY, limited); // ulozeni zpet do storage
  }

  // funkce pro smazani historie
  async clearHistory(): Promise<void> {
    await this.ensureReady();                // kontrola inicializace
    await this.storage.remove(HISTORY_KEY);  // odstraneni cele historie
  }

  // funkce, ktera vraci oblibena mesta
  async getFavorites(): Promise<string[]> {
    await this.ensureReady();                       // kontrola inicializace
    const favorites = await this.storage.get(FAVORITES_KEY); // nacteni oblibenych mest
    return favorites || [];                         // vraceni pole oblibenych mest nebo prazdneho pole
  }

  // funkce pro pridani mesta do oblibenych
  async addFavorite(city: string): Promise<void> {
    const trimmed = city.trim();     // odstraneni mezer
    if (!trimmed) {
      return;                        // ukonceni pri prazdnem vstupu
    }

    const favorites = await this.getFavorites();    // nacteni oblibenych mest

    // kontrola jestli mesto uz existuje
    const exists = favorites.some(c => c.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      return;       // pokud existuje, tak nic nemenit
    }

    favorites.unshift(trimmed);                     // pridani mesta na zacatek
    await this.storage.set(FAVORITES_KEY, favorites); // ulozeni noveho seznamu
  }

  // funkce pro odebrani mesta z oblibenych
  async removeFavorite(city: string): Promise<void> {
    const trimmed = city.trim();                    // odstraneni mezer
    const favorites = await this.getFavorites();    // nacteni oblibenych mest

    // odfiltrovani mesta, ktere chceme odstranit
    const filtered = favorites.filter(c => c.toLowerCase() !== trimmed.toLowerCase());

    await this.storage.set(FAVORITES_KEY, filtered); // ulozeni upraveneho seznamu
  }

  // funkce, ktera vraci, jestli je mesto oblibene
  async isFavorite(city: string): Promise<boolean> {
    const trimmed = city.trim();                    // odstraneni mezer
    if (!trimmed) return false;                     // nic neni oblibene kdyz je nazev prazdny

    const favorites = await this.getFavorites();    // nacteni oblibenych mest

    // kontrola jestli misto existuje v seznamu oblibenych
    return favorites.some(c => c.toLowerCase() === trimmed.toLowerCase());
  }
}
