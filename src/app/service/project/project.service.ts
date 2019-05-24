import { Injectable } from '@angular/core';
import { AsanaService } from '../asana.service';
import { HttpClient } from '@angular/common/http';
import { Project } from './project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends AsanaService {

  private service: string = 'projects'

  constructor(http: HttpClient) {
    super(http);
   }

   public getAll(): Promise<Project[]> {
     return super.get(this.service).toPromise();
   }

   public getByName(name: string): Promise<Project> {
    return this.getAll().then(projects => {
      let project = projects.filter(p => p.name === name);
      return project.length > 0 ? project[0] : null;
    })
   }
}
