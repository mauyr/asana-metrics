import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Task } from 'src/app/domain/task';
import TaskUtils from 'src/app/service/task/task-utils';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Velocity } from 'src/app/domain/velocity';

@Component({
  selector: 'app-velocity',
  templateUrl: './velocity.component.html',
  styleUrls: ['./velocity.component.scss']
})
export class VelocityComponent implements OnChanges, OnInit {
  
  @Input()
  data: Task[] = [];

  @Output() 
  messageEvent = new EventEmitter<Velocity>();

  velocity: Velocity = {
    velocity: 0,
    maxVelocity: 0
  };

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.velocity.maxVelocity = params.teamSize || environment.maxVelocity;
    });
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.velocity.velocity = this.calculateVelocity();
    this.messageEvent.emit(this.velocity)
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
