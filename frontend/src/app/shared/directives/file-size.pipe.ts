import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
  transform(value: number, args?: any): any {
    console.log('filesize', value, args);
    if (args) {
      switch (args) {
        case 'KB': {
          return `${value / 1024} KB`;
        }
        case 'MB': {
          return `${value / (1024 * 1024)} MB`;
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
      return 'B';
    case 1:
      return 'KB';
    case 2:
      return 'MB';
    case 3:
      return 'WTF';
  }
}
