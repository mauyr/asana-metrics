import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsanaService } from '../asana.service';
import { Task } from '../../domain/asana/task';
import { StorageService } from '../storage/storage.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends AsanaService {

  private service: string = 'tasks/:task_id/';

  private storageService: StorageService;

  constructor(http: HttpClient, storageService: StorageService) { 
    super(http);
    this.storageService = storageService;
  }

  public getTask(taskId: string): Promise<Task> {
    let taskDb: Task = this.storageService.get(taskId, false);
    if (taskDb) {
      return Promise.resolve(taskDb);
    } else {
      let builder = this.urlBuilder.buildRestURL(this.service);
      builder.setNamedParameter('task_id', taskId);  
      return super.get(builder.get()).toPromise();
    }
  }

  public getTaskWithDetails(task: Task): Promise<Task> {
    let methodUrl = 'stories';
  
    return this.getTask(task.gid).then(t => {
      let taskDb: Task = this.storageService.get(task.gid, true);
      if (!taskDb || moment(t.modified_at).isAfter(taskDb.modified_at)) {
        let builder = this.urlBuilder.buildRestURL(this.service + methodUrl);
        builder.setNamedParameter('task_id', task.gid);
        return super.get(builder.get()).toPromise().then(s => {
          t.stories = s;
          return Promise.resolve(t);
        });
      } else {
        return Promise.resolve(taskDb);
      }
    });
  }
}
