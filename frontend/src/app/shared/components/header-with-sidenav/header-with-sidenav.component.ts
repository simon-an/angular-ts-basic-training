import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cool-header-with-sidenav',
  templateUrl: './header-with-sidenav.component.html',
  styleUrls: ['./header-with-sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderWithSidenavComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {}
}
