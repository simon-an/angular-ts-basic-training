import { Injectable } from '@angular/core';
import { SafeService } from './safe.service';
import { Safe, SafeItem } from '../model';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BadServiceService {
  private safe: SafeItem[] = [];
  sub: Subscription;

  constructor(private backend: SafeService) {}

  getItems(id) {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = this.backend.getItems(id).subscribe((safe: SafeItem[]) => {
      if (safe) {
        console.log(`Fetched ${safe.length} items.`);
        // this.safe.push(...safe); // fill cache
        this.safe = [...safe];
      }
    });
    return this.safe;
  }

  getSafe() {}

  getSafes() {}

  addItem(item) {
    this.backend.addItem(item);
    this.safe.push(item); // fill cache
  }
}
