import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Safe } from '~core/model';

@Component({
  selector: 'cool-safe-list',
  templateUrl: './safe-list.component.html',
  styleUrls: ['./safe-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafeListComponent implements OnInit {
  @Input()
  safes: Safe[];

  constructor() {}

  ngOnInit() {}
}
