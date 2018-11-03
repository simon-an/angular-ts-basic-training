import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeComponent } from './safe.component';
import { ItemListComponent } from 'app/shared/components/item-list';
import { MatIconModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('SafeComponent', () => {
  let component: SafeComponent;
  let fixture: ComponentFixture<SafeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatIconModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule
      ],
      declarations: [SafeComponent, ItemListComponent]
    }).compileComponents();
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
