import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderWithSidenavComponent } from './header-with-sidenav.component';

describe('HeaderWithSidenavComponent', () => {
  let component: HeaderWithSidenavComponent;
  let fixture: ComponentFixture<HeaderWithSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderWithSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderWithSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
