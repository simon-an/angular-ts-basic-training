import { Component, EventEmitter, OnInit, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { SafeItem, FileService } from '~core/';

@Component({
  selector: 'cool-safe-item-form',
  templateUrl: './safe-item-form.component.html',
  styleUrls: ['./safe-item-form.component.css'],
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
        const id$ = this.fileService.uploadFile(this.state.file);
        id$.subscribe(id => (this.model.invoiceId = id));
        // console.log(id);
      };
    }
  }
}
