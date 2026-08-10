import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ChartData } from '../models/chart-data.model';

@Component({
  selector: 'chart-multiple-xaxis',
  template: `
    <chart type="line" [data]="data" [options]="options"></chart>
  `,
  styleUrls: ['chartjs-multiple-xaxis.component.scss']
})
export class ChartjsMultipleXaxisComponent implements OnInit, OnDestroy {
  @Input() labels: string[];
  @Input() dataset: ChartData[];
  @Input() options: any;
  themeSubscription: any;
  data: {};

  constructor(private theme: NbThemeService) {

  }

  ngOnInit(): void {
    this.data = {
      labels: this.labels,
      datasets: this.dataset,
    };
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  ngOnChanges(): void {
    console.log(this.dataset);
    this.data = {
      labels: this.labels,
      datasets: this.dataset,
    };
  }
}
