import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Task } from 'src/app/domain/task';
import TaskUtils from 'src/app/service/task/task-utils';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-velocity',
  templateUrl: './velocity.component.html',
  styleUrls: ['./velocity.component.scss']
})
export class VelocityComponent implements OnChanges, OnInit {
  
  @Input()
  data: Task[] = [];

  @Output() 
  messageEvent = new EventEmitter<number>();

  value: number = 0;

  maxVelocity: number = 0;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.maxVelocity = params.teamSize || environment.maxVelocity;
    });
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.value = this.calculateVelocity();
    this.messageEvent.emit(this.value)
  }

  private calculateVelocity() {
    let sections = TaskUtils.getSections(environment.projects.kanban);
    let dateStart = moment().subtract(3, 'weeks');
    let lastTwoWeeksTasks = this.data.filter(task =>
      TaskUtils.getFinishedDate(task, sections) != null &&
      dateStart.isBefore(moment(moment(TaskUtils.getFinishedDate(task, sections))))
    );

    let totalSpended: number = 0;
    lastTwoWeeksTasks.forEach(task => {
      totalSpended += TaskUtils.getFixedTaskEstimated(task);
    });

    let twoWeeksBusinessDays = 10;

    return totalSpended / twoWeeksBusinessDays;
  }

}
