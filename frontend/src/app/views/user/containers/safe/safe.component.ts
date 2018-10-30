import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map, withLatestFrom, switchMapTo } from 'rxjs/operators';
import { Observable, merge, Subject } from 'rxjs';
import { Safe, SafeService, SafeItem } from 'src/app/core';
import { AddSafeItemDialogComponent } from 'src/app/shared/container/add-safe-item-dialog/add-safe-item-dialog.component';
import { MatDialog } from '@angular/material';
import { FileService } from 'src/app/core/services/file.service';

@Component({
  selector: 'cool-safe',
  templateUrl: './safe.component.html',
  styleUrls: ['./safe.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafeComponent implements OnInit {
  safe$: Observable<Safe>;
  items$: Observable<SafeItem[]>;
  trigger$: Subject<any> = new Subject<any>();

  constructor(
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    private service: SafeService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Changed in Exersice 9.4.1
    // this.safe$ = this.activatedRoute.paramMap.pipe(switchMap((params: ParamMap) => this.service.getSafe(params.get('id'))));
    this.safe$ = this.activatedRoute.data.pipe(
      map((data: { safe: Safe }) => {
        return data.safe;
      })
    );

    this.items$ = merge(this.safe$, this.trigger$).pipe(
      withLatestFrom(this.safe$),
      switchMap(([trigger, safe]: [any, Safe]) => this.service.getItems(safe.id))
    );
  }

  openInvoice(id: string) {
    this.fileService
      .get(id)
      .then(image => {
        // console.log(image);
        const newTab = window.open();
        newTab.document.body.innerHTML = '<img src="' + image + '">';
      })
      .catch(err => console.error('invoice not found:', id, err));
  }

  onAddSafeItem(event) {
    const dialogRef = this.dialog.open(AddSafeItemDialogComponent, {
      height: '400px',
      width: '600px'
    });
    dialogRef
      .afterClosed()
      .pipe(withLatestFrom(this.safe$))
      .subscribe(([result, safe]) => {
        if (!!result) {
          console.log(`Dialog result: ${result}`);
          const result$ = this.service.addItem(result, safe.id);
          result$.subscribe(this.trigger$);
        }
      });
  }
}
