import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeListComponent } from './safe-list.component';

describe('SafeListComponent', () => {
  let component: SafeListComponent;
  let fixture: ComponentFixture<SafeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SafeListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
