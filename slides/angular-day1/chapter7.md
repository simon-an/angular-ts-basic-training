# Chapter 7

## Exercise: 7.1

Add a footer to safe component
create a add button when in the item list view.
Add button should open a new dialog.

```
ng g component shared/container/addSafeItemDialog --export --changeDetection OnPush
```

![71](screenshots/71.PNG)

<details><summary>Show Solution</summary>
<p>
safe.component.html
</p>

```html
<footer>
  <button mat-fab color="primary" (click)="onAddSafeItem($event)" >
     <mat-icon aria-label="Example icon-button with a add icon">add</mat-icon>
  </button>
</footer>
```

safe.component.css

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

# Create Form inside Dialog

## Exercise: 7.2

Add Price to SafeItem Model and item-list.component.html

<details><summary>Show Solution</summary>

```html
<ul>
  <li *ngFor="let item of items">{{item?.name}}
    <span *ngIf="item!.price">
      {{item!.price}}€
    </span>
  </li>
</ul>
```

</details>

## Exercise: 7.3 Create a template driven form inside a dialog

![73](screenshots/73.PNG)

```
ng g component shared/components/SafeItemForm --export --changeDetection OnPush
```

```typescript
export class AddSafeItemDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AddSafeItemDialogComponent>) {}

  ngOnInit() {}

  closeDialog(safeItem: SafeItem) {
    this.dialogRef.close(safeItem);
  }
}
```

## write the dialog template

add-safe-item-dialog.html

```html
<cool-safe-item-form></cool-safe-item-form>
```

## Create Form Component

safe-item-form.component.html

<details><summary>Show Solution</summary>
<p>

### Exercise 7.3.x Create Form Component

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
import { Component, EventEmitter, OnInit, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { SafeItem } from 'src/app/core';

@Component({
  selector: 'cool-safe-item-form',
  templateUrl: './safe-item-form.component.html',
  styleUrls: ['./safe-item-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

Add addItem to safe-service.ts

```typescript
  addItem(item: SafeItem): any {
    const newItems = [
      ... this.items.getValue(),
      item
    ];
    this.items.next(newItems);
  }
```

### Exercise 7.3.x Call the add Item Method from the safe.component.ts

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

### Exercise 7.3.x Bind the from result to the dialog component.

<details><summary>Show Solution</summary>
<p>

```html
<cool-safe-item-form (result)=closeDialog($event)></cool-safe-item-form>
```

</p>
</details>

## Additional Exercise: add Edit SafeItem
