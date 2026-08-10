import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatterPipe } from './currency-formatter.pipe';
import { FilterPipe } from './filter.pipe';



@NgModule({
  declarations: [CurrencyFormatterPipe, FilterPipe],
  imports: [
    CommonModule
  ],
  exports: [
    CurrencyFormatterPipe, FilterPipe
  ]
})
export class SharedPipeModule { }
