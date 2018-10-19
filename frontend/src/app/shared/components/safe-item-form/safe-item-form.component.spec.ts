import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeItemFormComponent } from './safe-item-form.component';

describe('SafeItemFormComponent', () => {
  let component: SafeItemFormComponent;
  let fixture: ComponentFixture<SafeItemFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeItemFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
