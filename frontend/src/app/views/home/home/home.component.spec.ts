import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'app/shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let overlayContainerElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule, NoopAnimationsModule, TranslateModule.forRoot()],
      declarations: [HomeComponent],
      providers: [
        {
          provide: OverlayContainer,
          useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
