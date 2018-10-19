import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSafeItemDialogComponent } from './add-safe-item-dialog.component';

describe('AddSafeItemDialogComponent', () => {
  let component: AddSafeItemDialogComponent;
  let fixture: ComponentFixture<AddSafeItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSafeItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSafeItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
