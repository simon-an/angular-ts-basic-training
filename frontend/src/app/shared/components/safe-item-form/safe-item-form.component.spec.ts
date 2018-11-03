import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeItemFormComponent } from './safe-item-form.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { FileSizePipe } from 'app/shared/directives';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SafeItemFormComponent', () => {
  let component: SafeItemFormComponent;
  let fixture: ComponentFixture<SafeItemFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule, FormsModule, MatInputModule, HttpClientTestingModule, NoopAnimationsModule],
      declarations: [SafeItemFormComponent, FileSizePipe],
      providers: []
    }).compileComponents();
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
