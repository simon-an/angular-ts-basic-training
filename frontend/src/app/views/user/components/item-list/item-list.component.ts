import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { SafeItem, Safe } from 'src/app/core';

@Component({
  selector: 'cool-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemListComponent implements OnInit {
  @Input()
  items: SafeItem[];

  constructor() {}

  ngOnInit() {}
}
