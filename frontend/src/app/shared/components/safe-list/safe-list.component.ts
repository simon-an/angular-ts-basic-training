import { ActivatedRoute, Data } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy, Input, ViewEncapsulation } from '@angular/core';
import { Safe } from '~core/model';

@Component({
  selector: 'cool-safe-list',
  templateUrl: './safe-list.component.html',
  styleUrls: ['./safe-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class SafeListComponent implements OnInit {
  @Input()
  safes: Safe[];

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    if (!this.safes) {
      this.activatedRoute.data.subscribe((data: Data) => {
        this.safes = data.safes;
      });
    }
  }
}
