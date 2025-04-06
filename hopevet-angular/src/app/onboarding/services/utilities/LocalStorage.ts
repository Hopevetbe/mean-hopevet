export class LocalStorage implements Storage {
    public readonly length!: number;
  
    public clear(): void {
      // left intentionally
    }
  
    public getItem(ignoreKey: string): string | null {
      return '';
    }
  
    public key(ignoreIndex: number): string | null {
      return '';
    }
  
    public removeItem(ignoreKey: string): void {
      // left intentionally
    }
  
    public setItem(ignoreKey: string, ignoreValue: string): void {
      // left intentionally
    }
  
    [name: string]: any;
  }
  