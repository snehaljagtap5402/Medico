import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormatPipe'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: unknown, currencyCode: unknown): string {
    const numericValue = value as number;
    const currency = currencyCode as string; // Type assertion

    if (!isNaN(numericValue) && typeof currency === 'string') {
      return numericValue.toLocaleString('en-US', {
        style: 'currency',
        currency: currency,
      });
    } else {
      // Handle cases where value is not a valid number or currencyCode is not a string
      return 'N/A';
    }
  }
}
