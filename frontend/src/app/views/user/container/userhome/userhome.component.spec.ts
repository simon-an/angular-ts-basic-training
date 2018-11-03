import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHomeComponent } from './userhome.component';
import { ItemListComponent } from '~shared/components';
import { SharedModule } from 'app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('UserhomeComponent', () => {
  let component: UserHomeComponent;
  let fixture: ComponentFixture<UserHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [UserHomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
