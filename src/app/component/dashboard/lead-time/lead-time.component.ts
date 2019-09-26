import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Task } from 'src/app/domain/task';

@Component({
  selector: 'app-lead-time',
  templateUrl: './lead-time.component.html',
  styleUrls: ['./lead-time.component.scss']
})
export class LeadTimeComponent implements OnChanges {
  
  @Input()
  data: Task[];
  
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    throw new Error("Method not implemented.");
  }
}
