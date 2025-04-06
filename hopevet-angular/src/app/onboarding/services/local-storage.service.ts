import { isPlatformBrowser } from "@angular/common";
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { LocalStorage } from "./utilities/LocalStorage";

@Injectable({
    providedIn: 'root',
  })
  export class LocalStorageService implements Storage {
    length!: number;
  
    private storage: Storage;
   
    constructor(@Inject(PLATFORM_ID) private readonly platformId:any) {
      this.storage = new LocalStorage();
  
      if (isPlatformBrowser(this.platformId)) {
        this.storage = localStorage;
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
  