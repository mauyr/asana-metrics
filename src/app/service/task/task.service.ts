import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsanaService } from '../asana.service';
import { Task } from '../../domain/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends AsanaService {

  private service: string = 'tasks/:task_id/'

  constructor(http: HttpClient) { 
    super(http)
  }

  public getTask(taskId: string): Promise<Task> {
    let builder = this.urlBuilder.buildRestURL(this.service);
    builder.setNamedParameter('task_id', taskId);  
    return super.get(builder.get()).toPromise();
  }

  public getTaskWithDetails(taskId: string): Promise<Task> {
    let methodUrl = 'stories';
    return this.getTask(taskId).then(t => {
      let builder = this.urlBuilder.buildRestURL(this.service + methodUrl);
      builder.setNamedParameter('task_id', taskId);
      return super.get(builder.get()).toPromise().then(s => {
        t.stories = s;
        return Promise.resolve(t);
      });
    })
  }
}
