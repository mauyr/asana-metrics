import { Injectable } from '@angular/core';
import { AsanaService } from '../asana.service';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../domain/project';
import { Task } from 'src/app/domain/task';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends AsanaService {
  
  private service: string = 'projects/';

  constructor(http: HttpClient) {
    super(http);
   }

   public getAll(): Promise<Project[]> {
    let builder = this.urlBuilder.buildRestURL(this.service);
    return super.get(builder.get()).toPromise();
   }

   public getByName(name: string): Promise<Project> {
    return this.getAll().then(projects => {
      let project = projects.filter(p => p.name === name);
      return project.length > 0 ? project[0] : null; 
    })
   }

   public getAllTasksOfProject(projectId: string): Promise<Task[]> {
    let methodUrl = this.service + ':projectId/tasks';
    let builder = this.urlBuilder.buildRestURL(methodUrl);
    builder.setNamedParameter('projectId', projectId);  
    return super.get(builder.get()).toPromise();
  }
}
