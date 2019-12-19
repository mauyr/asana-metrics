import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import TaskUtils from 'src/app/service/task/task-utils';
import { Task } from 'src/app/domain/asana/task';
import { Sections } from 'src/app/domain/section';

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
    let doing = [].concat(environment.projects.backlog.sections.todo, environment.projects.backlog.sections.priorized)
    let sections: Sections = { todo: [], doing: doing, done: environment.projects.backlog.sections.done };

    return this.getWeekBacklogEstimated(week, sections);
  }

  private getWeekBacklogEstimated(weekSubtract: number, sections: Sections): number {
    let dateFinish = moment().subtract(weekSubtract, 'weeks');
    let weekTasks = this.data.filter(t =>
      TaskUtils.getStartedDate(t, environment.projects.backlog, sections) &&
      dateFinish.isAfter(moment(moment(TaskUtils.getStartedDate(t, environment.projects.backlog, sections)))) &&
      (!TaskUtils.getFinishedDate(t, environment.projects.backlog, sections) ||
        dateFinish.isBefore(moment(moment(TaskUtils.getFinishedDate(t, environment.projects.backlog, sections)))))
    );
    let estimatedBacklog = 0;
    weekTasks.forEach(t => estimatedBacklog += TaskUtils.getTaskEstimated(t, this.data, environment.projects.backlog));
    return estimatedBacklog;
  }

}
