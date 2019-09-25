import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import TaskUtils from '../service/task/task-utils';

@Pipe({
  name: 'taskSections'
})
export class TaskSectionsPipe implements PipeTransform {

  transform(project: string, args?: any): any {
    return TaskUtils.getSections(project);
  }

}
