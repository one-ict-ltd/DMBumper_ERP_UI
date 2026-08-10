export class ChartData {
  constructor() {
    this.label = 'label';
    this.data = [];
    this.borderColor = '';
    this.backgroundColor = '';
    this.fill = false;
    this.pointRadius = 8;
    this.pointHoverRadius = 10;
  }
  label: string;
  data: number[];
  borderColor: any;
  backgroundColor: any;
  fill: boolean;
  borderDash?: number[];
  pointRadius: number;
  pointHoverRadius: number;
}
