import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormatter'
})
export class CurrencyFormatterPipe implements PipeTransform {

  transform(value: number, decimalPoint: number = 0): string {
    value = (value == null || value == undefined) ? 0 : value;
    const sansDec = value.toFixed(decimalPoint);
    const formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

}
