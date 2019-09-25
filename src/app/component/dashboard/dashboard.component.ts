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
import business from 'moment-business';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  private kanbanTasks: Task[] = [];
  private backlogTasks: Task[] = [];
  private proposalTasks: Task[] = [];

  //FIXME: Apagar váriaveis daqui para baixo
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
  priorizedBacklog: number = 0;
  backlogEstimate: number = 0;
  proposalAvg: number = 0;
  velocity: number = 0;
  maxVelocity: number = 0;
  velocityFooter: string = "";
  roadmapFocus: number = 0;

  backlogEvolutionChart: ChartData;
  developmentDivisionChart: ChartData;


  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.maxVelocity = params.teamSize || environment.maxVelocity;
        this.velocityFooter = "of max " + this.maxVelocity
    
        this.cards = this.getCardsValue();
        this.backlogEvolutionChart = this.getBacklogEvolutionChartData();
        this.developmentDivisionChart = this.getDevelopmentDivisionChartData();
        this.getTasksStatus();
      });
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
    if (this.loadingSteps.filter(l => l).length == 0) {
      this.loading = false;
    }

    //calculate avg's
    this.taskAvg = this.calculateKanbanAvgs();
    console.log("taskAvg: " + this.taskAvg);
    this.proposalAvg = this.calculateProposalAvg();
    this.velocity = this.calculateVelocity();
    this.priorizedBacklog = this.calculatePiorizedBacklogEstimate(0) / this.velocity;
    this.backlogEstimate = this.calculateBacklogEstimate() / this.velocity;
    this.roadmapFocus = this.calculateRoadmapFocus();

    this.backlogEvolutionChart = this.getBacklogEvolutionChartData();
    this.developmentDivisionChart = this.getDevelopmentDivisionChartData();

    console.log('Updating cards value');
    this.cards = this.getCardsValue();
  }

  getCardsValue(): any[] {
    return [
      { title: 'Avg. proposal', cols: 1, rows: 1, value: this.proposalAvg, unit: 'd', footer: "time to response in days " },
      { title: 'Velocity', cols: 1, rows: 1, value: this.velocity, unit: '', footer: this.velocityFooter },
      { title: 'Priorized Estimate', cols: 1, rows: 1, value: this.priorizedBacklog, unit: 'd', footer: "estimative to close all priorized issues" },
      { title: 'Roadmap Focus', cols: 1, rows: 1, value: this.roadmapFocus, unit: '%', footer: "last month" }
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
    this.loadingSteps.push(true);
    this.projectService.getByName(environment.projects.kanban).then(project => {
      this.projectService.getAllTasksOfProject(project.gid).then(tasks => {
        from(tasks).pipe(
          mergeMap(t => this.taskService.getTaskWithDetails(t.gid))
        ).subscribe(d => {
          this.kanbanTasks.push(d);
          this.storageService.save(environment.projects.kanban, this.kanbanTasks);
          clearTimeout(this.updateTimeout);
          let controller = this
          this.updateTimeout = setTimeout(function () {
            controller.updateCards()
          }, 2000)
          this.loadingSteps.pop();
        })
      });
    })
  }

  getBacklogStatus() {
    this.loadingSteps.push(true);
    this.projectService.getByName(environment.projects.backlog).then(project => {
      this.projectService.getAllTasksOfProject(project.gid).then(tasks => {
        from(tasks).pipe(
          mergeMap(t => this.taskService.getTaskWithDetails(t.gid))
        ).subscribe(d => {
          this.backlogTasks.push(d);
          this.storageService.save(environment.projects.backlog, this.backlogTasks);
          clearTimeout(this.updateTimeout);
          let controller = this
          this.updateTimeout = setTimeout(function () {
            controller.updateCards()
          }, 2000)
          this.loadingSteps.pop();
        });
      })
    })
  }

  getProposalStatus() {
    this.loadingSteps.push(true);
    this.projectService.getByName(environment.projects.proposal).then(project => {
      this.projectService.getAllTasksOfProject(project.gid).then(tasks => {
        from(tasks).pipe(
          mergeMap(t => this.taskService.getTaskWithDetails(t.gid))
        ).subscribe(d => {
          this.proposalTasks.push(d)
          this.storageService.save(environment.projects.proposal, this.proposalTasks);
          clearTimeout(this.updateTimeout);
          let controller = this
          this.updateTimeout = setTimeout(function () {
            controller.updateCards()
          }, 2000)
          this.loadingSteps.pop()
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

    console.log("featureAvg: " + this.featureAvg);
    console.log("bugAvg: " + this.bugAvg);
    console.log("technicalDebtAvg: " + this.technicalDebtAvg);
    console.log("support: " + this.support);
    console.log("customization: " + this.customization);

    let countAvgs: number = [this.featureAvg, this.bugAvg, this.technicalDebtAvg, this.support, this.customization].filter(a => a > 0).length;
    return countAvgs > 0 ? this.featureAvg + this.bugAvg + this.technicalDebtAvg + this.support + this.customization / countAvgs : 0;
  }

  calculateRoadmapFocus() {
    let sections = environment.sections.kanban;
    let dateFinish = moment().subtract(4, 'weeks');
    let weekTasks = this.kanbanTasks.filter(t =>
      this.datePipe.transform(t, 'startDate', sections) != null &&
      (this.datePipe.transform(t, 'finishDate', sections) == null ||
        dateFinish.isBefore(moment(moment(this.datePipe.transform(t, 'finishDate', sections)))))
    );
    let roadmapEstimated = 0;
    let totalEstimated = 0;
    weekTasks.forEach(t => {
      let taskEstimated = this.getTaskEstimated(t);
      if (t.memberships.filter(m => m.project.name == environment.projects.roadmap).length > 0) {
        roadmapEstimated += taskEstimated;
      } 
      totalEstimated += taskEstimated;
    
    });

    console.log(weekTasks);

    return (this.velocity/this.maxVelocity) * (totalEstimated == 0 ? 0 : roadmapEstimated / totalEstimated * 100);

  }

  calculateProposalAvg() {
    return this.calculateAvgFromStartDate(this.proposalTasks, environment.sections.proposals, []);
  }

  calculateAvgFromStartDate(tasks: Task[], sections: { todo: string[], doing: string[], done: string[] }, tags: string[]) {
    let totalSpended: number = 0;
    let countSpended: number = 0;
    tasks.forEach(task => {
      if (tags.length == 0 || task.tags.filter(t => tags.filter(tag => t.name === tag).length > 0).length > 0) {
        let startedDate = task.created_at
        let finishedDate = this.datePipe.transform(task, 'finishDate', sections)
        if (!finishedDate)
          finishedDate = new Date()

        let timeSpended: number = business.weekDays(moment(startedDate), moment(finishedDate))
        totalSpended += timeSpended;
        countSpended++;
      }
    });
    return countSpended > 0 ? totalSpended / countSpended : 0;
  }

  calculateAvgByTag(tasks: Task[], project: string, tags: string[]) {
    let totalSpended: number = 0;
    let countSpended: number = 0;
    tasks.forEach(task => {
      if (tags.length == 0 || task.tags.filter(t => tags.filter(tag => t.name === tag).length > 0).length > 0) {
        let timeSpended: number = this.timeSpendedPipe.transform(task, project);
        if (timeSpended > 0) {
          totalSpended += timeSpended;
          countSpended++;
        }
      }
    });
    return countSpended > 0 ? totalSpended / countSpended : 0;
  }

  calculateVelocity() {
    let sections = this.sectionsPipe.transform(environment.projects.kanban);
    let dateStart = moment().subtract(3, 'weeks');
    let lastTwoWeeksTasks = this.kanbanTasks.filter(task =>
      this.datePipe.transform(task, 'finishDate', sections) != null &&
      dateStart.isBefore(moment(moment(this.datePipe.transform(task, 'finishDate', sections))))
    );

    let totalSpended: number = 0;
    lastTwoWeeksTasks.forEach(task => {
      totalSpended += this.getTaskEstimated(task);
    });

    let twoWeeksBusinessDays = 10;

    return totalSpended / twoWeeksBusinessDays;
  }

  getTaskEstimated(task: Task) {
    if (this.getTaskType(task) == "feature") {
      return environment.estimate.feature;
    } else if (this.getTaskType(task) == "bug") {
      return environment.estimate.bug;
    } else if (this.getTaskType(task) == "technicalDebt") {
      return environment.estimate.technicalDebt;
    } else if (this.getTaskType(task) == "support") {
      return environment.estimate.support;
    } else if (this.getTaskType(task) == "customization") {
      return environment.estimate.customization;
    } else {
      return environment.estimate.other;
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
        { data: [5, 0], label: 'Bug' },
        { data: [40, 0], label: 'Feature' },
        { data: [30, 0], label: 'Technical Debt' },
        { data: [10, 0], label: 'Proposal' },
        { data: [10, 0], label: 'Support' },
        { data: [5, 0], label: 'Others' }
      ];
    }

    //Adiciona produtividade ao total
    let lostProductivity: number = (this.velocity/this.maxVelocity);
    totalSpent = totalSpent/lostProductivity;

    return [
      { data: [5, (tasksByType.get("bug") || 0) / totalSpent * 100], label: 'Bug' },
      { data: [40, (tasksByType.get("feature") || 0) / totalSpent * 100], label: 'Feature' },
      { data: [30, (tasksByType.get("technicalDebt") || 0) / totalSpent * 100], label: 'Technical Debt' },
      { data: [10, (tasksByType.get("proposal") || 0) / totalSpent * 100], label: 'Proposal' },
      { data: [10, (tasksByType.get("support") || 0 ) / totalSpent * 100], label: 'Support' },
      { data: [5,  (((tasksByType.get("others") || 0 ) / totalSpent) + (1-lostProductivity)) * 100], label: 'Others' }
    ];
  }

  calculatePiorizedBacklogEstimate(week: number) {
    //Sections backlog and kanban mix
    let backlogStart = environment.sections.backlog.priorized;
    environment.sections.backlog.actualWeek.forEach(s => backlogStart.push(s));
    let sections = { todo: [], doing: backlogStart, done: environment.sections.kanban.done };

    return this.getWeekBacklogEstimated(week, sections);
  }

  calculateBacklogEstimate() {
    //Sections backlog and kanban mix
    let backlogStart = environment.sections.backlog.priorized
      .concat(
        environment.sections.backlog.actualWeek
      ).concat(
        environment.sections.backlog.unpriorized
      );
    let sections = { todo: [], doing: backlogStart, done: environment.sections.kanban.done };

    return this.getWeekBacklogEstimated(0, sections);
  }

  getWeekBacklogEstimated(weekSubtract: number, sections: { todo: any[], doing: any[], done: any[] }) {
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
      for (let i: number = 1; i <= 8; i++) {
        weeksEvolution.push(this.calculatePiorizedBacklogEstimate(8 - i));
      }
      return weeksEvolution;
    }
    return [0, 0, 0, 0, 0, 0, 0, 0];
  }

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private timeSpendedPipe: TimeSpentPipe,
    private datePipe: TaskDatePipe,
    private sectionsPipe: TaskSectionsPipe,
    private storageService: StorageService,
    private route: ActivatedRoute
  ) { }
}
