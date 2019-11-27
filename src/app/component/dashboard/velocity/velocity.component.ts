import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Task } from 'src/app/domain/asana/task';
import TaskUtils from 'src/app/service/task/task-utils';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/domain/project';

@Component({
  selector: 'app-velocity',
  templateUrl: './velocity.component.html',
  styleUrls: ['./velocity.component.scss']
})
export class VelocityComponent implements OnChanges {
  
  private project: Project = environment.projects.kanban;
  private weeks: number = 4;

  @Input()
  data: Task[] = [];

  @Input()
  maxVelocity: number;

  @Output() 
  messageEvent = new EventEmitter<number>();

  velocity: number;

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.velocity = this.calculateVelocity();
    this.messageEvent.emit(this.velocity)
  }

  private calculateVelocity() {
    let dateStart = moment().subtract(this.weeks, 'weeks');
    let lastTwoWeeksTasks = this.data.filter(task =>
      TaskUtils.getFinishedDate(task, this.project, this.project.sections) != null &&
      dateStart.isBefore(moment(moment(TaskUtils.getFinishedDate(task, this.project, this.project.sections))))
    );

    let totalSpent: number = 0;
    let totalEstimated: number = 0;
    lastTwoWeeksTasks.forEach(task => {
      let spent: number = TaskUtils.getTaskEstimated(task, this.data, environment.projects.kanban);
      if (TaskUtils.getTaskType(task) != environment.taskType.other.name &&
          TaskUtils.getTaskType(task) != environment.taskType.support.name) {
        totalSpent += spent;
      }

      totalEstimated += spent;
    });

    let estimatedByMaxVelocity: number = (this.weeks * 5) * this.maxVelocity;
    if (totalEstimated > estimatedByMaxVelocity) {
      return (estimatedByMaxVelocity/totalEstimated) * (totalSpent/totalEstimated) * this.maxVelocity;
    } else {
      return (totalSpent/totalEstimated) * this.maxVelocity;
    }
  }

}
