import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsanaService } from '../asana.service';
import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends AsanaService {

  private service: string = 'projects/{project}/tasks'

  constructor(http: HttpClient) { 
    super(http)
  }

  public getAllTasksOfProject(project: string): Promise<Task[]> {
    return super.get(this.getUrl(project)).toPromise();
  }

  private getUrl(project: string): string {
    return this.service.replace('{project}', project);
  }
}
