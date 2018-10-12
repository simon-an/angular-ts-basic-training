import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeComponent } from './safe.component';

describe('SafeComponent', () => {
  let component: SafeComponent;
  let fixture: ComponentFixture<SafeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
