import { Component, EventEmitter, OnInit, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { SafeItem } from '~core/model';
import { FileService } from '~core/services';
import { switchMap, filter } from 'rxjs/operators';
import { from, Observable, AsyncSubject } from 'rxjs';

@Component({
  selector: 'cool-safe-item-form',
  templateUrl: './safe-item-form.component.html',
  styleUrls: ['./safe-item-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
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
  invoiceImage$: AsyncSubject<string> = new AsyncSubject();

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
        const id$ = this.fileService.uploadFile(this.state.file);
        id$.subscribe(id => (this.model.invoiceId = id));
        id$.pipe(switchMap(id => from(this.fileService.get(id)))).subscribe(this.invoiceImage$);
        // console.log(id);
      };
    }
  }
}
