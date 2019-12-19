import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Task } from 'src/app/domain/asana/task';
import { ChartData } from 'src/app/domain/chart-data';
import business from 'moment-business';
import * as moment from 'moment';
import TaskUtils from 'src/app/service/task/task-utils';
import { environment } from 'src/environments/environment';
import { Project } from 'src/app/domain/project';

@Component({
  selector: 'app-lead-time',
  templateUrl: './lead-time.component.html',
  styleUrls: ['./lead-time.component.scss']
})
export class LeadTimeComponent implements OnChanges {
  
  private project: Project = environment.projects.backlog;

  @Input()
  data: Task[];

  avg: number;
  unit: string = 'd';
  chartData: ChartData;
 
  ngOnChanges(changes: SimpleChanges): void {
    this.chartData = this.getDevelopmentDivisionChartData();
  }

  private getDevelopmentDivisionChartData(): ChartData {
    let chartData: ChartData = {
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            stacked: true,
            ticks: {
                stepSize: 0.5
            }
          }],
          yAxes: [{
            stacked: true
          }]
        }
      },
      labels: ['Average'],
      type: 'horizontalBar',
      legend: true,
      data: this.getDevelopmentDivisionData()
    };

    return chartData;
  }

  private getDevelopmentDivisionData(): { data: number[]; label: string; }[] {
    let dateFinishAfter = moment().subtract(3, 'months');
    let lastCompletedTasks: Task[] = this.data.filter( t => dateFinishAfter.isBefore(TaskUtils.getDateOnSection(t, this.project, this.project.leadtime.launch, false)));

    let totalTasks: number = 0;
    let totalTimeTodo: number = 0
    let totalTimeDoing: number = 0
    let totalTimeReview: number = 0
    let totalTimeDone: number = 0

    lastCompletedTasks.forEach( t => {
      let startedDateTodo = TaskUtils.getDateOnSection(t, this.project, this.project.leadtime.todo, true);
      let startedDateDoing = TaskUtils.getDateOnSection(t, this.project, this.project.leadtime.doing, true);
      let startedDateReview = TaskUtils.getDateOnSection(t, this.project, this.project.leadtime.review, true);
      let startedDateDone = TaskUtils.getDateOnSection(t, this.project, this.project.leadtime.done, true);
      let startedDateLaunch = TaskUtils.getDateOnSection(t, this.project, this.project.leadtime.launch, true);

      let timeOnTodo: number = startedDateTodo ? business.weekDays(moment(startedDateTodo), moment(startedDateDoing)) : 0;
      let timeOnDoing: number = startedDateDoing ? business.weekDays(moment(startedDateDoing), moment(startedDateReview || startedDateDone || startedDateLaunch)) : 0;
      if (timeOnDoing > 0) {
        let timeOnReview: number = startedDateReview ? business.weekDays(moment(startedDateReview), moment(startedDateDone || startedDateLaunch)) : 0;
        let timeOnDone: number = startedDateDone ? business.weekDays(moment(startedDateDone), moment(startedDateLaunch)) : 0;

        totalTimeTodo += timeOnTodo;
        totalTimeDoing += timeOnDoing;
        totalTimeReview += timeOnReview;
        totalTimeDone += timeOnDone;

        totalTasks++;
      }
    });

    if (totalTasks > 0) {
      //FIXME: retirar proxima linha daqui
      this.avg = (totalTimeTodo+totalTimeDoing+totalTimeReview+totalTimeDone)/totalTasks;

      return [
        { data: [totalTimeTodo/totalTasks], label: 'Todo' },
        { data: [totalTimeDoing/totalTasks], label: 'Doing' },
        { data: [totalTimeReview/totalTasks], label: 'Review' },
        { data: [totalTimeDone/totalTasks], label: 'Done' },
      ];
    } else {
      //FIXME: retirar proxima linha daqui
      this.avg = 0

      return [
        { data: [0], label: 'Todo' },
        { data: [0], label: 'Doing' },
        { data: [0], label: 'Review' },
        { data: [0], label: 'Done' },
      ];
    }
  }

}
