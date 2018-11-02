import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Safe, SafeService } from '~core/*';
import { Observable } from 'rxjs';

@Component({
  selector: 'cool-safe-list',
  templateUrl: './safe-list.component.html',
  styleUrls: ['./safe-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafeListComponent implements OnInit {
  safes$: Observable<Safe[]>;

  constructor(private service: SafeService) {}

  ngOnInit() {
    this.safes$ = this.service.getSafes();
  }
}
