import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Safe, SafeService, SafeItem } from 'src/app/core';

@Component({
  selector: 'cool-safe',
  templateUrl: './safe.component.html',
  styleUrls: ['./safe.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafeComponent implements OnInit {

  safe$: Observable<Safe>;
  items$: Observable<SafeItem[]>;

  constructor(private activatedRoute: ActivatedRoute, private service: SafeService) { }

  ngOnInit() {
    this.safe$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.service.getSafe(params.get('id')))
    );
    this.items$ = this.safe$.pipe(
      switchMap((safe: Safe) =>
        this.service.getItems(safe.id))
    );
  }

}
