import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatDialogModule,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSelectModule
} from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { inject, async, fakeAsync, flushMicrotasks, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { NgModule, Component, Directive, ViewChild, ViewContainerRef, Injector, Inject } from '@angular/core';
import { LoginDialogComponent } from './login-dialog.component';
import { of } from 'rxjs';

describe('LoginDialog', () => {
  let dialog: MatDialog;
  let overlayContainerElement: HTMLElement;
  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DialogTestModule],
      declarations: [],
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

    dialog = TestBed.get(MatDialog);
  }));

  beforeEach(inject([MatDialog], (d: MatDialog) => {
    dialog = d;
  }));

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);

    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  });

  it('should create', () => {
    const dialogRef = dialog.open(LoginDialogComponent, {
      viewContainerRef: testViewContainerRef,
      data: { role: of('user') }
    });

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('Please Loging as');
    expect(dialogRef.componentInstance).toEqual(jasmine.any(LoginDialogComponent));
    expect(dialogRef.componentInstance.dialogRef).toBe(dialogRef);
  });
});

@Component({
  selector: 'cool-dir-with-view-container',
  template: ``
})
// tslint:disable-next-line:component-class-suffix
class DirectiveWithViewContainer {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'cool-arbitrary-component',
  template: `<cool-dir-with-view-container></cool-dir-with-view-container>`
})
// tslint:disable-next-line:component-class-suffix
class ComponentWithChildViewContainer {
  @ViewChild(DirectiveWithViewContainer)
  childWithViewContainer: DirectiveWithViewContainer;

  get childViewContainer() {
    return this.childWithViewContainer.viewContainerRef;
  }
}

const TEST_DIRECTIVES = [LoginDialogComponent, ComponentWithChildViewContainer, DirectiveWithViewContainer];

@NgModule({
  imports: [
    TranslateModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    HttpClientTestingModule,
    MatDialogModule,
    NoopAnimationsModule
  ],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [LoginDialogComponent, ComponentWithChildViewContainer]
})
class DialogTestModule {}
