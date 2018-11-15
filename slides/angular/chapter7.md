# Chapter 7

## Exercise: 7.1

### Add footer with add button to item list and dialog

Add a footer to safe component:
Create an add button when in the item list view.
Add button should open a new dialog.

Generate dialog

```bash
ng g component shared/containers/addSafeItemDialog --export --changeDetection OnPush
```

![71](screenshots/71.PNG)

<details><summary>Show Solution Main Routing</summary>
  
- item-list.component.html

```html
<cool-header-with-sidenav>
  <ng-container navlist>
    <mat-nav-list>
      <a mat-list-item routerLink="/home" routerLinkActive="active">Home</a>
      <mat-divider></mat-divider>
      <a mat-list-item routerLink="../" routerLinkActive="active">Back to Safes</a>
    </mat-nav-list>
  </ng-container>
  <!-- Content -->
  <ng-container body>
    <header>
      <h4 mat-subheader>Items</h4>
      <button mat-mini-fab color="primary" (click)="onAddSafeItem($event)">
        <mat-icon aria-label="Example icon-button with a add icon">add</mat-icon>
      </button>
    </header>
    <mat-list>
      <mat-list-item *ngFor="let item of items">{{ item?.name }}</mat-list-item>
    </mat-list>
  </ng-container>
  <!---->
</cool-header-with-sidenav>

```

item-list.component.scss

```css
header {
  display: flex;
  flex-direction: row;
  align-items: center;
}

```

```typescript
 
```
  
</details>
<details><summary>Show Solution Secondary Routing</summary>

safe.component.html

```html
<footer>
  <button mat-fab color="primary" (click)="onAddSafeItem($event)" >
     <mat-icon aria-label="Example icon-button with a add icon">add</mat-icon>
  </button>
</footer>
```

safe.component.scss

```css
:host {
  display: flex;
  flex-direction: column;
}

cool-item-list {
  flex: 1;
}
```

safe.component.ts

```typescript
  ...
  constructor(
    private activatedRoute: ActivatedRoute,
    private service: SafeService,
    private dialog: MatDialog,
  ) { }

  ...

  onAddSafeItem(event) {
    const dialogRef = this.dialog.open(AddSafeItemDialogComponent, {
      height: '400px',
      width: '600px',
    });
  }
```

</details>

## Exercise: 7.2

### Add Price to safe item

Add Price to SafeItem Model and item-list.component.html

<details><summary>Show Solution </summary>

- item-list.component.html (short)

```html
<ng-container body>
    <header>
      <h4 mat-subheader>Items</h4>
      <button mat-mini-fab color="primary" (click)="onAddSafeItem($event)">
        <mat-icon aria-label="Example icon-button with a add icon">add</mat-icon>
      </button>
    </header>
    <mat-list>
      <mat-list-item *ngFor="let item of items">
        <p matLine>{{ item?.name }}</p>
        <p matLine>{{ item?.price }}€</p>
      </mat-list-item>
    </mat-list>
  </ng-container>
```

</details>

## Exercise: 7.3

### Create a template driven form inside a dialog

![73](screenshots/73.PNG)

Add close button to dialog:
add-safe-item-dialog.component.ts TODO hier richtig?

```typescript
export class AddSafeItemDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AddSafeItemDialogComponent>) {}

  ngOnInit() {}

  closeDialog(safeItem: SafeItem) {
    this.dialogRef.close(safeItem);
  }
}
```

Create form:

```bash
ng g component shared/components/SafeItemForm --export --changeDetection OnPush
```

Add AddSafeItemDialogComponent to shared module entryComponents.

## write the dialog template

add-safe-item-dialog.component.html

```html
<cool-safe-item-form></cool-safe-item-form>
```

### Exercise 7.3.1 Create Form Component

safe-item-form.component.html

<details><summary>Show Solution</summary>
<p>

```html
<h1>Please insert name and price of the item</h1>
<form (ngSubmit)="onSubmit()" #safeitemForm="ngForm">
  <div>
    <mat-form-field>
      <input autocomplete="section-item name" #name="ngModel" matInput placeholder="name" required aria-required="true" [(ngModel)]="model.name" type="text"
        name="name" class="form-control" id="name">
      <mat-error *ngIf="(name.invalid || !name.pristine) && name.getError('required')">required</mat-error>
    </mat-form-field>
    <mat-form-field>
      <input autocomplete="section-item price" #price="ngModel" matInput required placeholder="price" pattern="[0-9]*" aria-required="true" [(ngModel)]="model.price"
        type="text" name="price" class="form-control" id="price">
      <span matPrefix>€&nbsp;</span>
      <span matSuffix>.00</span>
      <mat-error *ngIf="(price.invalid || !price.pristine) && price.getError('required')">required</mat-error>
      <mat-error *ngIf="price.invalid || !price.pristine ">{{price.getError('pattern') | json}}</mat-error>
    </mat-form-field>
    <button [disabled]="!safeitemForm.form.valid" mat-raised-button color="primary" type="submit">Submit</button>
  </div>
  {{ model | json }}
</form>
```

</p>
</details>

safe-item-form.component.ts

<details><summary>Show Solution</summary>
<p>

```typescript
import {
  Component,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output
} from "@angular/core";
import { SafeItem } from "src/app/core";

@Component({
  selector: "cool-safe-item-form",
  templateUrl: "./safe-item-form.component.html",
  styleUrls: ["./safe-item-form.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafeItemFormComponent implements OnInit {
  @Output()
  result: EventEmitter<SafeItem> = new EventEmitter();
  model = <SafeItem>{};

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    this.result.emit(this.model);
  }

  // TODO: Remove this when we're done
  get diagnostic() {
    return JSON.stringify(this.model);
  }
}
```

</p>
</details>

Add addItem to safe.service.ts

```typescript
addItem(item: SafeItem): any {
  const newItems = [
    ... this.items.getValue(),
    item
  ];
  this.items.next(newItems);
}
```

### Exercise 7.3.2 Call the add Item Method from the safe.component.ts

<details><summary>Show Solution</summary>
<p>

safe.component.ts

```typescript
onAddSafeItem(event) {
  const dialogRef = this.dialog.open(AddSafeItemDialogComponent, {
    height: '400px',
    width: '600px',
  });
  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
    if (result) {
      this.service.addItem(result);
    }
  });
}
```

</p>
</details>

### Exercise 7.3.3 Bind the form result to the dialog component.

<details><summary>Show Solution</summary>
<p>

add-safe-item-dialog.component.html

```html
<cool-safe-item-form (result)="closeDialog($event)"></cool-safe-item-form>
```

</p>
</details>

## Additional Exercise: add Edit SafeItem

- Implement an EditSafeItem Dialog.
- Pass a copy of safeitem to the dialog.
- Modify form to accept optional @Input.
