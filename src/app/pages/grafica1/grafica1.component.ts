import { Component } from '@angular/core';
import { MultiDataSet, Label, Color } from 'ng2-charts';
@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {
  public labels1: string[] = ['Download Sale', 'In-Store Sales', 'Mail-Order Sales'];
  public data1 = [
    [350, 405, 100],

  ];

  public color1 = [{ backgroundColor: ['#6857E6', '#FF5800', '#FFB414'] }];
}
