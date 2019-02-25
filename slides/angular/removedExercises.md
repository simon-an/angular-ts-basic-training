## Additional Exercise 10.5

### Create a custom pipe which transform the file upload size to KB or MB

- the custom pipe should be used like this:

```angular
{{ 12490 | fileSize }}
{{ 12490 | fileSize:'MB' }}
{{ 12490 | fileSize:'KB' }}
```

```bash
ng g pipe safe/directives/fileSize --export --lintFix

ng g service core/services/file
```

<details><summary>core/services/file.service.ts</summary>

```typescript
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class FileService {
  file = null;

  constructor() {}

  uploadFile(file: string | ArrayBuffer): string {
    this.file = file;
    return "c1b16842-826a-40b0-a2d9-dc9359fb9582";
  }
}
```

</details>
<details><summary>safe-item-form.component.ts</summary>

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
import { FileService } from "src/app/core/services/file.service";

@Component({
  selector: "cool-safe-item-form",
  templateUrl: "./safe-item-form.component.html",
  styleUrls: ["./safe-item-form.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafeItemFormComponent implements OnInit {
  constructor(private fileService: FileService) {}

  // TODO: Remove this when we're done
  get diagnostic() {
    return JSON.stringify(this.model);
  }

  @Output()
  result: EventEmitter<SafeItem> = new EventEmitter();
  model = <SafeItem>{};

  state = {
    file: null,
    fileSize: 0,
    uploading: false,
    invoice: null
  };

  ngOnInit() {}

  onSubmit() {
    this.result.emit(this.model);
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.state.file = event.target.files[0];
      this.state.fileSize = this.state.file.size;
      // console.log(this.state.file);
      reader.readAsDataURL(this.state.file);
      reader.onload = () => {
        // console.log(reader.result);
        const id = this.fileService.uploadFile(reader.result);
        this.model.invoiceId = id;
        // console.log(id);
      };
    }
  }
}
```

</details>
<details><summary>safe-item-form.component.html</summary>

```html
    <input autocomplete="off" #price="ngModel" required aria-required="true" (ngModel)="state.invoice" type="file"
      name="invoice" class="form-control" id="invoice" (change)="onFileChange($event)"> {{ state.fileSize |
    fileSize}}
    <button [disabled]="!safeitemForm.form.valid" mat-raised-button color="primary" type="submit">Submit</button>
```

</details>

### Adjust the file size pipe

### Add a button to the item-list.component which will be used to show the invoice

<details><summary>solution</summary>

file-size.pipe.ts

```typescript
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "fileSize"
})
export class FileSizePipe implements PipeTransform {
  transform(value: number, args?: any): any {
    console.log("filesize", value, args);
    if (args) {
      switch (args) {
        case "KB": {
          return value / 1024;
        }
        case "MB": {
          return value / (1024 * 1024);
        }
      }
    } else {
      let currentValue = value;
      let counter = 0;
      while (currentValue > 1024) {
        currentValue = currentValue / 1024;
        counter++;
      }
      return `${currentValue} ${getUnit(counter)}`;
    }
    return value;
  }
}

function getUnit(val) {
  switch (val) {
    case 0:
      return "B";
    case 1:
      return "KB";
    case 2:
      return "MB";
    case 3:
      return "WTF";
  }
}
```

item-list.component.html

```html
 <button *ngIf="item.invoiceId" (click)="showInvoiceEmitter.emit(item.invoiceId)" mat-button>Show Invoice</button>
```

item-list.component.ts

```typescript
@Output()
showInvoiceEmitter = new EventEmitter<string>();
```

</details>

## 11.3 auth.service login calls + token
