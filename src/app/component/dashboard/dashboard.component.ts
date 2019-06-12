import { Component } from '@angular/core';
import { TaskService } from 'src/app/service/task/task.service';
import { ProjectService } from 'src/app/service/project/project.service';
import { Project } from 'src/app/domain/project';
import { environment } from 'src/environments/environment';
import { Task } from 'src/app/domain/task';
import { TimeSpentPipe } from 'src/app/pipe/time-spent.pipe';
import { ChartData } from 'src/app/domain/chart-data';
import * as moment from 'moment';
import { TaskDatePipe } from 'src/app/pipe/task-date.pipe';
import { TaskSectionsPipe } from 'src/app/pipe/task-sections.pipe';
import { ThemeService } from 'ng2-charts';
import { StorageService } from 'src/app/service/storage/storage.service';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  private kanbanTasks: Task[] = [];
  private backlogTasks: Task[] = [];
  private proposalTasks: Task[] = [];

  private featureAvg: number = 0;
  private bugAvg: number = 0;
  private technicalDebtAvg: number = 0;
  private support: number = 0;
  private customization: number = 0;
  
  private updateTimeout: any;
  
  //UI components binded variables
  loading: boolean = false;
  loadingSteps: boolean[] = [];
  cards: any[];

  taskAvg: number = 0;
  estimatedBacklog: number = 0;
  proposalAvg: number = 0;
  velocity: number = 0;

  backlogEvolutionChart: ChartData;
  developmentDivisionChart: ChartData;

  ngOnInit() {
    this.cards = this.getCardsValue();
    this.backlogEvolutionChart = this.getBacklogEvolutionChartData();
    this.developmentDivisionChart = this.getDevelopmentDivisionChartData();
    this.getTasksStatus();
  }

  clearLocal(): void {
    this.storageService.delete(environment.projects.kanban);
    this.storageService.delete(environment.projects.proposal);
    this.storageService.delete(environment.projects.backlog);

    this.backlogTasks = [];
    this.kanbanTasks = [];
    this.proposalTasks = [];
  }

  refresh(): void {
    this.getTasksStatus();
  }

  updateCards(): void {
    if (this.loadingSteps.filter(l => !l).length == 0) {
      this.loading = false;
    }

    //calculate avg's
    this.taskAvg = this.calculateKanbanAvgs();
    this.proposalAvg = this.calculateProposalAvg();
    this.velocity = this.calculateVelocity();
    this.estimatedBacklog = this.calculateBacklogEstimate();

    this.backlogEvolutionChart = this.getBacklogEvolutionChartData();
    this.developmentDivisionChart = this.getDevelopmentDivisionChartData();

    console.log('Updating cards value');
    this.cards = this.getCardsValue();
  }
  
  getCardsValue(): any[] {
    return [
      { title: 'Avg. task', cols: 1, rows: 1, value: this.taskAvg, footer: "Last 2 weeks" },
      { title: 'Avg. proposal', cols: 1, rows: 1, value: this.proposalAvg, footer: "Last 2 weeks" },
      { title: 'Velocity', cols: 1, rows: 1, value: this.velocity, footer: "Last 2 weeks" },
      { title: 'Backlog Estimate', cols: 1, rows: 1, value: this.estimatedBacklog, footer: "Estimative to close all issues with actual velocity" }
    ];
  }

  getTasksStatus() {
    this.loadingSteps = [];
    this.loading = true;
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
    let step = false;
    this.loadingSteps.push(step);
    this.projectService.getByName(environment.projects.kanban).then(project => {
      this.projectService.getAllTasksOfProject(project.gid).then(tasks => {
        from(tasks).pipe(
          mergeMap(t => this.taskService.getTaskWithDetails(t.gid))
        ).subscribe(d => {
          this.kanbanTasks.push(d);
          this.storageService.save(environment.projects.kanban, this.kanbanTasks);
          clearTimeout(this.updateTimeout);
          this.updateTimeout = setTimeout(function(){
            this.updateCards()
          }, 2000)
          step = true;
        })
      });
    })
  }

  getBacklogStatus() {
    let step = false;
    this.loadingSteps.push(step);
    this.projectService.getByName(environment.projects.backlog).then(project => {
      this.projectService.getAllTasksOfProject(project.gid).then(tasks => {
        from(tasks).pipe(
          mergeMap(t => this.taskService.getTaskWithDetails(t.gid))
        ).subscribe(d => {
          this.backlogTasks.push(d);
          this.storageService.save(environment.projects.backlog, this.backlogTasks);
          clearTimeout(this.updateTimeout);
          this.updateTimeout = setTimeout(function(){
              this.updateCards()
          }, 2000)
          step = true;
        });
      })
    })
  }

  getProposalStatus() {
    let step = false;
    this.loadingSteps.push(step);
    this.projectService.getByName(environment.projects.proposal).then(project => {
      this.projectService.getAllTasksOfProject(project.gid).then(tasks => {
        from(tasks).pipe(
          mergeMap(t => this.taskService.getTaskWithDetails(t.gid))
        ).subscribe(d => {
          this.proposalTasks.push(d)
          this.storageService.save(environment.projects.proposal, this.proposalTasks);
          clearTimeout(this.updateTimeout);
          this.updateTimeout = setTimeout(function(){
            this.updateCards()
          }, 2000)
          step = true;
        });
      })
    })
  }

  calculateKanbanAvgs() {
    this.featureAvg = this.calculateAvgByTag(this.kanbanTasks, environment.projects.kanban, environment.labels.feature);
    this.bugAvg = this.calculateAvgByTag(this.kanbanTasks, environment.projects.kanban, environment.labels.bug);
    this.technicalDebtAvg = this.calculateAvgByTag(this.kanbanTasks, environment.projects.kanban, environment.labels.technicalDebt);
    this.support = this.calculateAvgByTag(this.kanbanTasks, environment.projects.kanban, environment.labels.support);
    this.customization = this.calculateAvgByTag(this.kanbanTasks, environment.projects.kanban, environment.labels.customization);

    let countAvgs: number = [this.featureAvg, this.bugAvg, this.technicalDebtAvg, this.support, this.customization].filter(a => a > 0).length;
    return countAvgs > 0 ? this.featureAvg + this.bugAvg + this.technicalDebtAvg + this.support + this.customization / countAvgs : 0;
  }

  calculateProposalAvg() {
    return this.calculateAvgByTag(this.proposalTasks, environment.projects.proposal, []);
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

  getTaskEstimated(task: Task) {
    if (this.getTaskType(task) == "feature") {
      return this.featureAvg;
    } else if (this.getTaskType(task) == "bug") {
      return this.bugAvg;
    } else if (this.getTaskType(task) == "technicalDebt") {
      return this.technicalDebtAvg;
    } else if (this.getTaskType(task) == "support") {
      return this.support;
    } else if (this.getTaskType(task) == "customization") {
      return this.customization;
    } else {
      let countAvgs: number = [this.featureAvg, this.bugAvg, this.technicalDebtAvg, this.support, this.customization].filter(a => a > 0).length;
      return countAvgs > 0 ? this.featureAvg + this.bugAvg + this.technicalDebtAvg + this.support + this.customization / countAvgs : 0;
    }
  }

  getTaskType(task: Task) {
    if (task.tags.find(t => environment.labels.feature.filter(l => t.name === l).length > 0)) {
      return "feature";
    } else if (task.tags.find(t => environment.labels.bug.filter(l => t.name === l).length > 0)) {
      return "bug";
    } else if (task.tags.find(t => environment.labels.technicalDebt.filter(l => t.name === l).length > 0)) {
      return "technicalDebt"
    } else if (task.tags.find(t => environment.labels.support.filter(l => t.name === l).length > 0)) {
      return "support";
    } else if (task.tags.find(t => environment.labels.customization.filter(l => t.name === l).length > 0)) {
      return "customization";
    } else {
      return "other";
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
      data:this.getDevelopmentDivisionData()
    };

    return chartData;
  }
  
  getDevelopmentDivisionData(): { data: number[]; label: string; }[] {
    let sections = this.sectionsPipe.transform(environment.projects.kanban);
    let dateStart = moment().subtract(2, 'weeks');
    let lastTwoWeeksTasks = this.kanbanTasks.filter(task => 
      this.datePipe.transform(task, 'finishDate', sections) != null &&
      dateStart.isBefore(moment(moment(this.datePipe.transform(task, 'finishDate', sections))))
    );

    let tasksByType = new Map()
    let totalSpent = 0
    lastTwoWeeksTasks.forEach(task => {
      let type: string = this.getTaskType(task);
      let typeSum: number = tasksByType.get(type);

      let taskEstimate: number = this.getTaskEstimated(task);

      typeSum = (typeSum == undefined ? 0 : typeSum) + taskEstimate;
      tasksByType.set(type, typeSum);
      totalSpent += taskEstimate;
    });

    if (totalSpent == 0) {
      return [
        {data: [5, 0], label: 'Bug'},
        {data: [40, 0], label: 'Feature'},
        {data: [30, 0], label: 'Technical Debt'},
        {data: [10, 0], label: 'Proposal'},
        {data: [10, 0], label: 'Support'},
        {data: [5, 0], label: 'Others'}
      ];
    }
    
    return [
      {data: [5, tasksByType.get("bug") / totalSpent * 100], label: 'Bug'},
      {data: [40, tasksByType.get("feature") / totalSpent * 100], label: 'Feature'},
      {data: [30, tasksByType.get("technicalDebt") / totalSpent * 100], label: 'Technical Debt'},
      {data: [10, tasksByType.get("proposal") / totalSpent * 100], label: 'Proposal'},
      {data: [10, tasksByType.get("support") / totalSpent * 100], label: 'Support'},
      {data: [5, tasksByType.get("other") / totalSpent * 100], label: 'Others'}
    ];
  }

  calculateBacklogEstimate() {
    let estimatedBacklog: number = this.getWeekBacklogEstimated(0);

    return estimatedBacklog / this.velocity;
  }

  getWeekBacklogEstimated(weekSubtract: number) {
    //Sections backlog and kanban mix
    let backlogStart = environment.sections.backlog.priorized;
    environment.sections.backlog.actualWeek.forEach(s => backlogStart.push(s));
    let sections = {todo: [], doing: backlogStart, done: environment.sections.kanban.done};

    let dateFinish = moment().subtract(weekSubtract, 'weeks');
    let weekTasks = this.backlogTasks.filter(t => 
      this.datePipe.transform(t, 'startDate', sections) != null &&
      dateFinish.isAfter(moment(moment(this.datePipe.transform(t, 'startDate', sections)))) &&
      (this.datePipe.transform(t, 'finishDate', sections) == null ||
        dateFinish.isBefore(moment(moment(this.datePipe.transform(t, 'finishDate', sections)))))
    );
    let estimatedBacklog = 0;
    weekTasks.forEach(t => estimatedBacklog += this.getTaskEstimated(t));
    return estimatedBacklog;
  }

  getWeeksBacklogEvolution(): number[] {
    if (this.backlogTasks) {
      let weeksEvolution: number[] = [];
      for (let i: number=1; i<=8; i++) {
        weeksEvolution.push(this.getWeekBacklogEstimated(8-i));
      }
      return weeksEvolution;
    }
    return [0,0,0,0,0,0,0,0];
  }

  constructor(
    private projectService: ProjectService, 
    private taskService: TaskService,
    private timeSpendedPipe: TimeSpentPipe,
    private datePipe: TaskDatePipe,
    private sectionsPipe: TaskSectionsPipe,
    private storageService: StorageService
  ) { }
}
