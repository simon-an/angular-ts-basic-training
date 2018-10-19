import { Component, OnInit, ChangeDetectionStrategy, SkipSelf } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, subscribeOn } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Safe, SafeService, SafeItem } from 'src/app/core';
import { AddSafeItemDialogComponent } from 'src/app/shared/container/add-safe-item-dialog/add-safe-item-dialog.component';
import { MatDialog } from '@angular/material';
import { BadServiceService } from 'src/app/core/services/bad-service.service';

@Component({
  selector: 'cool-safe',
  templateUrl: './safe.component.html',
  styleUrls: ['./safe.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SafeComponent implements OnInit {
  safe$: Observable<Safe>;
  items: SafeItem[];

  constructor(
    private badService: BadServiceService,
    private activatedRoute: ActivatedRoute,
    @SkipSelf() private service: SafeService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.safe$ = this.activatedRoute.paramMap.pipe(switchMap((params: ParamMap) => this.service.getSafe(params.get('id'))));
    this.safe$.subscribe((safe: Safe) => (this.items = this.badService.getItems(safe.id)));
  }

  onAddSafeItem(event) {
    const dialogRef = this.dialog.open(AddSafeItemDialogComponent, {
      height: '400px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.service.addItem(result);
      }
    });
  }
}
