import { Component, EventEmitter, OnInit, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { SafeItem } from 'src/app/core';

@Component({
  selector: 'cool-safe-item-form',
  templateUrl: './safe-item-form.component.html',
  styleUrls: ['./safe-item-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafeItemFormComponent implements OnInit {

  @Output() result: EventEmitter<SafeItem> = new EventEmitter();
  model = <SafeItem>{};

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    this.result.emit(this.model);
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

}
