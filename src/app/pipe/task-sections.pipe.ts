import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'taskSections'
})
export class TaskSectionsPipe implements PipeTransform {

  transform(project: string, args?: any): any {
    return this.getSections(project);
  }

  private getSections(project: string): {todo: string[], doing: string[], done: string[]} {
    if (environment.projects.inception == project) {
        return environment.sections.inception;
    } else if (environment.projects.kanban == project) {
        return environment.sections.kanban;
    } else {
        return environment.sections.proposals;
    }
  }

}
