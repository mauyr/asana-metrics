import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Task } from 'src/app/domain/asana/task';
import { ChartData } from 'src/app/domain/chart-data';
import TaskUtils from 'src/app/service/task/task-utils';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { Project } from 'src/app/domain/project';
import { Sections } from 'src/app/domain/section';

@Component({
  selector: 'app-development-division',
  templateUrl: './development-division.component.html',
  styleUrls: ['./development-division.component.scss']
})
export class DevelopmentDivisionComponent implements OnChanges {

  private project: Project = environment.projects.kanban;

  private weeks: number = 2;

  @Input()
  data: Task[];

  @Input()
  velocity: number;

  @Input()
  maxVelocity: number;

  developmentDivisionChart: ChartData;
  
  ngOnChanges(changes: SimpleChanges): void {
    this.developmentDivisionChart = this.getDevelopmentDivisionChartData();
  }

  getDevelopmentDivisionChartData(): ChartData {
    let chartData: ChartData = {
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        }
      },
      labels: ['Meta', 'Atual'],
      type: 'horizontalBar',
      legend: true,
      data: this.getDevelopmentDivisionData()
    };

    return chartData;
  }

  getDevelopmentDivisionData(): { data: number[]; label: string; }[] {
    let dateStart = moment().subtract(this.weeks, 'weeks');
    let lastTwoWeeksTasks = this.data.filter(task =>
      TaskUtils.getFinishedDate(task, this.project, this.project.sections) != null &&
      dateStart.isBefore(moment(moment(TaskUtils.getFinishedDate(task, this.project, this.project.sections))))
    );

    let tasksByType = new Map()
    let totalSpent = 0
    lastTwoWeeksTasks.forEach(task => {
      let type: string = TaskUtils.getTaskType(task);
      let typeSum: number = tasksByType.get(type);

      let taskEstimate: number = TaskUtils.getTaskEstimated(task, this.data, environment.projects.kanban);

      typeSum = (typeSum == undefined ? 0 : typeSum) + taskEstimate;
      tasksByType.set(type, typeSum);
      totalSpent += taskEstimate;
    });

    if (totalSpent == 0) {
      return [
        { data: [5, 0], label: 'Bug' },
        { data: [40, 0], label: 'Feature' },
        { data: [30, 0], label: 'Technical Debt' },
        { data: [10, 0], label: 'Proposal' },
        { data: [10, 0], label: 'Support' },
        { data: [5, 0], label: 'Others' }
      ];
    }

    //Adiciona produtividade ao total
    let lostProductivity: number = this.velocity >= this.maxVelocity ? 1 : this.velocity/this.maxVelocity;
    totalSpent = totalSpent/lostProductivity;

    let bug: number = (tasksByType.get("bug") || 0) / totalSpent;
    let feature: number = (tasksByType.get("feature") || 0) / totalSpent;
    let technicalDebt: number = (tasksByType.get("technicalDebt") || 0) / totalSpent;
    let proposal: number = (tasksByType.get("proposal") || 0) / totalSpent;
    let support: number = (tasksByType.get("support") || 0) / totalSpent;
    let others: number = 1 - bug - feature - technicalDebt - proposal - support;

    return [
      { data: [5, bug * 100], label: 'Bug' },
      { data: [40, feature * 100], label: 'Feature' },
      { data: [30, technicalDebt * 100], label: 'Technical Debt' },
      { data: [10, proposal * 100], label: 'Proposal' },
      { data: [10, support * 100], label: 'Support' },
      { data: [5,  others * 100], label: 'Others' }
    ];
  }

}
