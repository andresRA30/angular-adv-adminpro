import { Component, Input, OnInit, Output } from '@angular/core';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit {

  @Input() title: string = "";

  @Input() labels: string[] = ['label1', 'label2', 'label3'];

  @Input() data = ['30', '90', '20'];


  @Input() color = [{ backgroundColor: ['#9E120E', '#FF5800', '#FFB414'] }];




  ngOnInit(): void {
    console.log(this.color);
  }
}
