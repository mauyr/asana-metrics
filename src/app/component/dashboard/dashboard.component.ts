import { Component, ChangeDetectorRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { TaskService } from 'src/app/service/task/task.service';
import { ProjectService } from 'src/app/service/project/project.service';
import { Project } from 'src/app/domain/project';
import { environment } from 'src/environments/environment';
import { Task } from 'src/app/domain/task';
import { TimeSpendedPipe } from 'src/app/pipe/time-spended.pipe';
import { ChartData } from 'src/app/domain/chart-data';
import * as moment from 'moment';
import { TaskDatePipe } from 'src/app/pipe/task-date.pipe';
import { TaskSectionsPipe } from 'src/app/pipe/task-sections.pipe';
import { ThemeService } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  private projects: Project[];
  private kanbanTasks: Task[] = [];
  private backlogTasks: Task[] = [];
  private proposalTasks: Task[] = [];

  private featureAvg: number = 0;
  private bugAvg: number = 0;
  private technicalDebtAvg: number = 0;
  
  private updateTimeout: any;
  
  //UI components binded variables
  cards: any[];

  taskAvg: number = 0;
  estimatedBacklog: number = 0;
  proposalAvg: number = 0;
  velocity: number = 0;

  backlogEvolutionChart: ChartData;
  developmentDivisionChart: ChartData;

  ngOnInit() {
    this.defineChartTheme();
    this.cards = this.getCardsValue();
    this.backlogEvolutionChart = this.getBacklogEvolutionChartData();
    this.developmentDivisionChart = this.getDevelopmentDivisionChartData();
    this.getTasksStatus();
  }

  clearLocal(): void {
    this.storageService.delete(environment.projects.kanban);
    this.storageService.delete(environment.projects.proposal);
    this.storageService.delete(environment.projects.backlog);
  }

  updateCards(): void {
    //save on storage
    this.storageService.save(environment.projects.kanban, this.kanbanTasks);
    this.storageService.save(environment.projects.proposal, this.proposalTasks);
    this.storageService.save(environment.projects.backlog, this.backlogTasks);

    //calculate avg's
    this.taskAvg = this.calculateKanbanAvgs();
    this.proposalAvg = this.calculateProposalAvg();
    this.velocity = this.calculateVelocity();
    this.estimatedBacklog = this.calculateBacklogEstimate();

    this.backlogEvolutionChart = this.getBacklogEvolutionChartData();

    console.log('Updating cards value');
    this.cards = this.getCardsValue();
  }
  
  getCardsValue(): any[] {
    return [
      { title: 'Avg. task', cols: 1, rows: 1, value: this.taskAvg, footer: "Last 7 days" },
      { title: 'Avg. proposal', cols: 1, rows: 1, value: this.proposalAvg, footer: "Last 7 days" },
      { title: 'Velocity', cols: 1, rows: 1, value: this.velocity, footer: "Last 7 days" },
      { title: 'Backlog Estimate', cols: 1, rows: 1, value: this.estimatedBacklog, footer: "Estimative to close all issues" }
    ];
  }

  getTasksStatus() {
    this.kanbanTasks = this.storageService.get(environment.projects.kanban);
    if (this.kanbanTasks == null) {
      this.kanbanTasks = [];
      this.getKanbanStatus();
    }
    
    this.backlogTasks = this.storageService.get(environment.projects.backlog);
    if (this.backlogTasks == null) {
      this.backlogTasks = [];
      this.getBacklogStatus();
    }

    this.proposalTasks = this.storageService.get(environment.projects.proposal);
    if (this.proposalTasks == null) {
      this.proposalTasks = [];
      this.getProposalStatus();
    }

    this.updateCards();
  }

  getKanbanStatus() {
    this.projectService.getByName(environment.projects.kanban).then(project => {
      this.projectService.getAllTasksOfProject(project.gid).then(tasks => {
        tasks.forEach(t => {
          this.taskService.getTaskWithDetails(t.gid).then(task => { 
            this.kanbanTasks.push(task)
            clearTimeout(this.updateTimeout);
            this.updateTimeout = setTimeout(() => { this.updateCards() }, 1000);
          });
          
        });
      });
    })
  }

  getBacklogStatus() {
    this.projectService.getByName(environment.projects.backlog).then(project => {
      this.projectService.getAllTasksOfProject(project.gid).then(tasks => {
        tasks.forEach(t => {
          this.taskService.getTaskWithDetails(t.gid).then(task => {
            this.backlogTasks.push(task)
            clearTimeout(this.updateTimeout);
            this.updateTimeout = setTimeout(() => { this.updateCards() }, 1000);
          });
        });
      })
    })
  }

  getProposalStatus() {
    this.projectService.getByName(environment.projects.proposal).then(project => {
      this.projectService.getAllTasksOfProject(project.gid).then(tasks => {
        tasks.forEach(t => {
          this.taskService.getTaskWithDetails(t.gid).then(task => {
            this.proposalTasks.push(task)
            clearTimeout(this.updateTimeout);
            this.updateTimeout = setTimeout(() => { this.updateCards() }, 1000);
          });
        });
      })
    })
  }

  calculateKanbanAvgs() {
    this.featureAvg = this.calculateAvgByTag(this.kanbanTasks, environment.projects.kanban, environment.labels.feature);
    this.bugAvg = this.calculateAvgByTag(this.kanbanTasks, environment.projects.kanban, environment.labels.bug);
    this.technicalDebtAvg = this.calculateAvgByTag(this.kanbanTasks, environment.projects.kanban, environment.labels.technicalDebt);

    let countAvgs: number = [this.featureAvg, this.bugAvg, this.technicalDebtAvg].filter(a => a > 0).length;
    return countAvgs > 0 ? this.featureAvg + this.bugAvg + this.technicalDebtAvg / countAvgs : 0;
  }

  calculateProposalAvg() {
    return this.calculateAvgByTag(this.proposalTasks, environment.projects.kanban, []);
  }

  calculateAvgByTag(tasks: Task[], project: string, tags: string[]) {
    let totalSpended: number = 0;
    let countSpended: number = 0;
    tasks.forEach(task => {
      if (tags.length == 0 || task.tags.filter(t => tags.filter(tag => t.name===tag).length > 0).length > 0) {
        let timeSpended: number = this.timeSpendedPipe.transform(task, project);
        if (timeSpended > 0) {
          totalSpended += timeSpended;
          countSpended++;
        }
      }
    });
    return countSpended > 0 ? totalSpended/countSpended : 0;
  }

  calculateVelocity() {
    let sections = this.sectionsPipe.transform(environment.projects.kanban);
    let dateStart = moment().subtract(2, 'weeks');
    let lastTwoWeeksTasks = this.kanbanTasks.filter(task => 
      this.datePipe.transform(task, 'finishDate', sections) != null &&
      dateStart.isBefore(moment(moment(this.datePipe.transform(task, 'finishDate', sections))))
    );

    let totalSpended: number = 0;
    lastTwoWeeksTasks.forEach(task => {
      totalSpended += this.getTaskEstimated(task);
    });

    return lastTwoWeeksTasks.length > 0 ? totalSpended / lastTwoWeeksTasks.length : 0;
  }

  calculateBacklogEstimate() {
    let estimatedBacklog: number = 0;
    let todoKanbanTasks: Task[] = this.kanbanTasks.filter(task => task.memberships.filter(m => m.section && environment.sections.kanban.todo.filter(s => s === m.section.name).length > 0).length > 0)
    todoKanbanTasks.forEach(t => estimatedBacklog += this.getTaskEstimated(t));

    let priorizedTasks: Task[] = this.backlogTasks.filter(task => task.memberships.filter(m => m.section && environment.sections.backlog.priorized.filter(s=> s === m.section.name).length > 0).length > 0);    
    priorizedTasks.forEach(t => estimatedBacklog += this.getTaskEstimated(t));

    return estimatedBacklog / this.velocity;
  }

  getTaskEstimated(task: Task) {
    if (task.tags.find(t => environment.labels.feature.filter(l => t.name === l).length > 0)) {
      return this.featureAvg;
    } else if (task.tags.find(t => environment.labels.bug.filter(l => t.name === l).length > 0)) {
      return this.bugAvg;
    } else if (task.tags.find(t => environment.labels.technicalDebt.filter(l => t.name === l).length > 0)) {
      return this.technicalDebtAvg;
    } else {
      let countAvgs: number = [this.featureAvg, this.bugAvg, this.technicalDebtAvg].filter(a => a > 0).length;
      return countAvgs > 0 ? this.featureAvg + this.bugAvg + this.technicalDebtAvg / countAvgs : 0;
    }
  }

  getBacklogEvolutionChartData(): ChartData {
    let chartData: ChartData = {
      options: {
        scaleShowVerticalLines: false, 
        responsive: true
      },    
      labels: ['W7', 'W6', 'W5', 'W4', 'W3', 'W2', 'W1', 'W0'],
      type: 'line',
      legend: true,
      data:[
        {data: [5, 5, 5, 5, 5, 5, 5, 5], label: 'Meta'},
        {data: this.getWeeksBacklogEvolution(), label: 'Evolução'}
      ]
    };

    return chartData;
  }

  getDevelopmentDivisionChartData(): ChartData {
    let chartData: ChartData = {
      options: {
        responsive: true
      },
      labels: ['Feature', 'Bug', 'Technical Debt', 'Proposal', 'Support'],
      type: 'radar',
      legend: true,
      data:[
        { data: [40, 10, 30, 10, 10], label: 'Meta' },
        { data: [5, 10, 5, 30, 50], label: 'Actual' }
      ]
    };

    return chartData;
  }

  getWeeksBacklogEvolution(): number[] {
    //Sections backlog and kanban mix
    let backlogStart = environment.sections.backlog.priorized;
    environment.sections.backlog.actualWeek.forEach(s => backlogStart.push(s));
    let sections = {todo: [], doing: backlogStart, done: environment.sections.kanban.done};

    if (this.backlogTasks) {
      let weeksEvolution: number[] = [];
      for (let i: number=0; i<8; i++) {
        let dateStart = moment().subtract(8-i, 'weeks');
        let dateFinish = moment().subtract(7-i, 'weeks');
        let weekTasks = this.backlogTasks.filter(t => 
          this.datePipe.transform(t, 'startDate', sections) != null &&
          dateFinish.isAfter(moment(moment(this.datePipe.transform(t, 'startDate', sections)))) &&
          (this.datePipe.transform(t, 'finishDate', sections) == null ||
            dateFinish.isBefore(moment(moment(this.datePipe.transform(t, 'finishDate', sections)))))
        );
        let estimatedBacklog = 0;
        weekTasks.forEach(t => estimatedBacklog += this.getTaskEstimated(t));
        weeksEvolution.push(estimatedBacklog);
      }
      return weeksEvolution;
    }
    return [0,0,0,0,0,0,0,0];
  }

  public defineChartTheme() {
    let overrides: ChartOptions;
    overrides = {
      legend: {
        labels: { fontColor: 'white' }
      },
      scales: {
        xAxes: [{
          ticks: { fontColor: 'white' },
          gridLines: { color: 'rgba(255,255,255,0.1)' }
        }],
        yAxes: [{
          ticks: { fontColor: 'white' },
          gridLines: { color: 'rgba(255,255,255,0.1)' }
        }]
      }
    };
    this.themeService.setColorschemesOptions(overrides);
  }

  constructor(
    private projectService: ProjectService, 
    private taskService: TaskService,
    private timeSpendedPipe: TimeSpendedPipe,
    private datePipe: TaskDatePipe,
    private sectionsPipe: TaskSectionsPipe,
    private themeService: ThemeService,
    private storageService: StorageService
  ) { }
}
