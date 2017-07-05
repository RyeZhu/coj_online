import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'beautiful'
})
export class BeautifulPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    // return value.replace("\n", "<br />");
    return value;
  }

}
