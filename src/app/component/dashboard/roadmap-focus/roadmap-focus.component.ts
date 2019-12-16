import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import TaskUtils from 'src/app/service/task/task-utils';
import { Task } from 'src/app/domain/asana/task';
import { Project } from 'src/app/domain/project';

@Component({
  selector: 'app-roadmap-focus',
  templateUrl: './roadmap-focus.component.html',
  styleUrls: ['./roadmap-focus.component.scss']
})
export class RoadmapFocusComponent implements OnChanges {
  
  private project: Project = environment.projects.kanban;
  private weeks: number = 4;

  @Input()
  data: Task[] = [];

  @Input()
  velocity: number;

  @Input()
  maxVelocity: number;

  value: number = 0;
  unit: string = '%';
  
  ngOnChanges(changes: SimpleChanges): void {
    this.value = this.calculateRoadmapFocus();
  }

  private calculateRoadmapFocus() {
    let dateFinish = moment().subtract(this.weeks, 'weeks');
    let weekTasks = this.data.filter(t =>
      TaskUtils.getStartedDate(t, this.project, this.project.sections) != null &&
      (TaskUtils.getFinishedDate(t, this.project, this.project.sections) == null ||
        dateFinish.isBefore(moment(moment(TaskUtils.getFinishedDate(t, this.project, this.project.sections)))))
    );
    let roadmapEstimated = 0;
    let totalEstimated = 0;
    weekTasks.forEach(t => {
      let taskEstimated = TaskUtils.getTaskEstimated(t, this.data, this.project);
      if (t.memberships.filter(m => m.project.name == environment.projects.roadmap.name).length > 0) {
        roadmapEstimated += taskEstimated;
      } 
      totalEstimated += taskEstimated;
    });

    if (this.velocity && this.maxVelocity > 0) {
      return (this.velocity/this.maxVelocity) * (totalEstimated == 0 ? 0 : roadmapEstimated / totalEstimated * 100);
    } else {
      return 0;
    }

  }

}
