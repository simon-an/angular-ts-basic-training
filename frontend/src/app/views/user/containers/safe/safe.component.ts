import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'cool-safe',
  templateUrl: './safe.component.html',
  styleUrls: ['./safe.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
