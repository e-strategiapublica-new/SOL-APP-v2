import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CEP'
})
export class CEPPipe implements PipeTransform {
  
  transform(value: string, ...args: any[]): any {
    if (value.length === 8) {
      return value.replace(/(\d{5})(\d{3})/g, '\$1\-\$2');
    }
    return 'error';
  }

}
