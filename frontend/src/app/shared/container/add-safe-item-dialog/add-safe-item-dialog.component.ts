import { Component, OnInit, ChangeDetectionStrategy, Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SafeItem } from 'app/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'cool-add-safe-item-dialog',
  templateUrl: './add-safe-item-dialog.component.html',
  styleUrls: ['./add-safe-item-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddSafeItemDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddSafeItemDialogComponent>,
    private renderer: Renderer2,
    private breakpointObserver: BreakpointObserver,
    public overlayC: OverlayContainer
  ) {}

  ngOnInit() {
    const overlay = this.overlayC.getContainerElement();
    this.breakpointObserver.observe(['(min-width: 500px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.renderer.removeClass(overlay, 'mobile');
        // console.log('Viewport is 500px or over!');
      } else {
        this.renderer.addClass(overlay, 'mobile');
        // console.log('Viewport is getting smaller!');
      }
    });
  }

  closeDialog(safeItem: SafeItem) {
    this.dialogRef.close(safeItem);
  }
}
