import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import TaskUtils from 'src/app/service/task/task-utils';
import { Task } from 'src/app/domain/task';

@Component({
  selector: 'app-roadmap-focus',
  templateUrl: './roadmap-focus.component.html',
  styleUrls: ['./roadmap-focus.component.scss']
})
export class RoadmapFocusComponent implements OnChanges {
  
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
    let sections = environment.sections.kanban;
    let dateFinish = moment().subtract(4, 'weeks');
    let weekTasks = this.data.filter(t =>
      TaskUtils.getStartedDate(t, sections) != null &&
      (TaskUtils.getFinishedDate(t, sections) == null ||
        dateFinish.isBefore(moment(moment(TaskUtils.getFinishedDate(t, sections)))))
    );
    let roadmapEstimated = 0;
    let totalEstimated = 0;
    weekTasks.forEach(t => {
      let taskEstimated = TaskUtils.getFixedTaskEstimated(t);
      if (t.memberships.filter(m => m.project.name == environment.projects.roadmap).length > 0) {
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
