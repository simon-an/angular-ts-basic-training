import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SafeItem } from 'src/app/core';

@Component({
  selector: 'cool-add-safe-item-dialog',
  templateUrl: './add-safe-item-dialog.component.html',
  styleUrls: ['./add-safe-item-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddSafeItemDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddSafeItemDialogComponent>) { }

  ngOnInit() {

  }

  closeDialog(safeItem: SafeItem) {
    this.dialogRef.close(safeItem);
  }
}
