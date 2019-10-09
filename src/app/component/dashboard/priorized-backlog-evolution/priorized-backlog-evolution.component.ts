import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ChartData } from 'src/app/domain/chart-data';
import { Task } from 'src/app/domain/asana/task';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import TaskUtils from 'src/app/service/task/task-utils';
import { Sections } from 'src/app/domain/section';

@Component({
  selector: 'app-priorized-backlog-evolution',
  templateUrl: './priorized-backlog-evolution.component.html',
  styleUrls: ['./priorized-backlog-evolution.component.scss']
})
export class PriorizedBacklogEvolutionComponent implements OnChanges {
  
  private weeks: number = 8;

  @Input()
  data: Task[];

  @Input()
  velocity: number;

  backlogEvolutionChart: ChartData;
  
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.backlogEvolutionChart = this.getBacklogEvolutionChartData();
  }

  private getBacklogEvolutionChartData(): ChartData {
    let min: number = 5 * this.velocity;
    let max: number = 10 * this.velocity;
    let chartData: ChartData = {
      options: {
        scaleShowVerticalLines: false,
        responsive: true
      },
      labels: ['W7', 'W6', 'W5', 'W4', 'W3', 'W2', 'W1', 'W0'],
      type: 'line',
      legend: true,
      data: [
        { data: this.getWeeksBacklogEvolution(), label: 'Evolução' },
        { data: [min, min, min, min, min, min, min, min], label: 'Min.' },
        { data: [max, max, max, max, max, max, max, max], label: 'Máx.' }
      ]
    };

    return chartData;
  }

  private getWeeksBacklogEvolution(): number[] {
    if (this.data) {
      let weeksEvolution: number[] = [];
      for (let i: number = 1; i <= 8; i++) {
        weeksEvolution.push(this.calculatePiorizedBacklogEstimate(8 - i));
      }
      return weeksEvolution;
    }
    return [0, 0, 0, 0, 0, 0, 0, 0];
  }

  private calculatePiorizedBacklogEstimate(week: number) {
    //Sections backlog and kanban mix
    let backlogStart = environment.projects.backlog.sections.todo;
    environment.projects.backlog.sections.doing.forEach(s => backlogStart.push(s));
    let sections = { todo: [], doing: backlogStart, done: environment.projects.kanban.sections.done };

    return this.getWeekBacklogEstimated(week, sections);
  }

  private getWeekBacklogEstimated(weekSubtract: number, sections: Sections) {
    let dateFinish = moment().subtract(weekSubtract, 'weeks');
    let weekTasks = this.data.filter(t =>
      TaskUtils.getStartedDate(t, environment.projects.backlog, sections) != null &&
      dateFinish.isAfter(moment(moment(TaskUtils.getStartedDate(t, environment.projects.backlog, sections)))) &&
      (TaskUtils.getFinishedDate(t, environment.projects.kanban, sections) == null ||
        dateFinish.isBefore(moment(moment(TaskUtils.getFinishedDate(t, environment.projects.kanban, sections)))))
    );
    let estimatedBacklog = 0;
    weekTasks.forEach(t => estimatedBacklog += TaskUtils.getTaskEstimated(t, this.data, environment.projects.kanban));
    return estimatedBacklog;
  }

}
