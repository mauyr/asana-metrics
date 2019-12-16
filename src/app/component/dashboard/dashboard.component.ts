import { Component } from '@angular/core';
import { TaskService } from 'src/app/service/task/task.service';
import { ProjectService } from 'src/app/service/project/project.service';
import { environment } from 'src/environments/environment';
import { Task } from 'src/app/domain/asana/task';
import { StorageService } from 'src/app/service/storage/storage.service';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  kanbanTasks: Task[] = [];
  backlogTasks: Task[] = [];
  proposalTasks: Task[] = [];

  teamSize: number;
  velocity: number;
  updateTimeout: any;

  //UI components binded variables
  loading: boolean = false;
  loadingSteps: boolean[] = [];

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.teamSize = params.teamSize || environment.maxVelocity;
        this.getTasksStatus();
      });
  }

  receiveVelocity($event) {
    this.velocity = $event;
  }

  clearLocal(): void {
    this.storageService.deleteAll();

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
      this.kanbanTasks = [].concat(this.kanbanTasks);
      this.backlogTasks = [].concat(this.backlogTasks);
      this.proposalTasks = [].concat(this.proposalTasks);
    }
  }

  getTasksStatus() {
    this.loadingSteps = [];
    this.loading = true;
    this.kanbanTasks = [];
    this.getKanbanStatus();
    
    this.backlogTasks = [];
    this.getBacklogStatus();

    this.proposalTasks = [];
    this.getProposalStatus();
  }

  getKanbanStatus() {
    this.loadingSteps.push(true);
    this.projectService.getByName(environment.projects.kanban.name).then(project => {
      this.projectService.getAllTasksOfProject(project.gid).then(tasks => {
        from(tasks).pipe(
          mergeMap(t => this.taskService.getTaskWithDetails(t))
        ).subscribe(d => {
          this.kanbanTasks.push(d);
          this.storageService.save(d.gid, d);
          clearTimeout(this.updateTimeout);
          let controller = this;
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
    this.projectService.getByName(environment.projects.backlog.name).then(project => {
      this.projectService.getAllTasksOfProject(project.gid).then(tasks => {
        from(tasks).pipe(
          mergeMap(t => this.taskService.getTaskWithDetails(t))
        ).subscribe(d => {
          this.backlogTasks.push(d);
          this.storageService.save(d.gid, d);
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
    this.projectService.getByName(environment.projects.proposal.name).then(project => {
      this.projectService.getAllTasksOfProject(project.gid).then(tasks => {
        from(tasks).pipe(
          mergeMap(t => this.taskService.getTaskWithDetails(t))
        ).subscribe(d => {
          this.proposalTasks.push(d)
          this.storageService.save(d.gid, d);
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
