import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import TaskUtils from 'src/app/service/task/task-utils';
import { Task } from 'src/app/domain/task';

@Component({
  selector: 'app-priorized-estimate',
  templateUrl: './priorized-estimate.component.html',
  styleUrls: ['./priorized-estimate.component.scss']
})
export class PriorizedEstimateComponent implements OnInit, OnChanges {
  
  @Input()
  data: Task[] = [];

  @Input()
  velocity: number;

  value: number = 0;
  unit: string = "d";
  
  ngOnInit() {
  }
  
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (this.velocity && this.velocity > 0) {
      this.value = this.calculatePriorizedBacklogEstimate(0) / this.velocity;
    } else {
      this.value = 0;
    }
  }

  private calculatePriorizedBacklogEstimate(week: number): number {
    //Sections backlog and kanban mix
    let backlogStart = environment.sections.backlog.priorized;
    environment.sections.backlog.actualWeek.forEach(s => backlogStart.push(s));
    let sections = { todo: [], doing: backlogStart, done: environment.sections.kanban.done };

    return this.getWeekBacklogEstimated(week, sections);
  }

  private getWeekBacklogEstimated(weekSubtract: number, sections: { todo: any[], doing: any[], done: any[] }): number {
    let dateFinish = moment().subtract(weekSubtract, 'weeks');
    let weekTasks = this.data.filter(t =>
      TaskUtils.getStartedDate(t, environment.projects.backlog, sections) &&
      dateFinish.isAfter(moment(moment(TaskUtils.getStartedDate(t, environment.projects.backlog, sections)))) &&
      (!TaskUtils.getFinishedDate(t, environment.projects.kanban, sections) ||
        dateFinish.isBefore(moment(moment(TaskUtils.getFinishedDate(t, environment.projects.kanban, sections)))))
    );
    let estimatedBacklog = 0;
    weekTasks.forEach(t => estimatedBacklog += TaskUtils.getFixedTaskEstimated(t));
    return estimatedBacklog;
  }

}
