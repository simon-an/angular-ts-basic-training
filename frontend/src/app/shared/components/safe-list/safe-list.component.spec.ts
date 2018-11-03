import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeListComponent } from './safe-list.component';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('SafeListComponent', () => {
  let component: SafeListComponent;
  let fixture: ComponentFixture<SafeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, RouterTestingModule],
      declarations: [SafeListComponent],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(SafeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    component.safes = [];
  });
});
