import { Component } from '@angular/core';
import { TaskService } from 'src/app/service/task/task.service';
import { ProjectService } from 'src/app/service/project/project.service';
import { environment } from 'src/environments/environment';
import { Task } from 'src/app/domain/task';
import { StorageService } from 'src/app/service/storage/storage.service';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Velocity } from 'src/app/domain/velocity';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  private kanbanTasks: Task[] = [];
  private backlogTasks: Task[] = [];
  private proposalTasks: Task[] = [];

  private velocity: Velocity;
  private updateTimeout: any;

  //UI components binded variables
  loading: boolean = false;
  loadingSteps: boolean[] = [];

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.getTasksStatus();
      });
  }

  receiveVelocity($event) {
    this.velocity = $event;
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

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private storageService: StorageService,
    private route: ActivatedRoute
  ) { }
}
