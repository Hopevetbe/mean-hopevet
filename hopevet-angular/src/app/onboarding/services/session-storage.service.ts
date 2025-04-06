import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { SessionStorage } from './utilities/SessionStorage';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService implements Storage {
  length!: number;

  private storage: Storage;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: any) {
    this.storage = new SessionStorage();

    if (isPlatformBrowser(this.platformId)) {
      this.storage = sessionStorage;
    }
  }

  getItem(key: string) {
    return this.storage.getItem(key);
  }

  setItem(key: string, value: string) {
    this.storage.setItem(key, value);
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  removeItem(key: string) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }

  [name: string]: any;
}
