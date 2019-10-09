import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../domain/asana/task';
import TaskUtils from '../service/task/task-utils';
import { Project } from '../domain/project';

@Pipe({
  name: 'taskDatePipe'
})
export class TaskDatePipe implements PipeTransform {

  transform(task: Task, dateType: string, project: Project, sections: {todo: string[], doing: string[], done: string[]}): Date {
    try {
      if (dateType.toLowerCase() === 'startdate') {
        return TaskUtils.getStartedDate(task, project, sections);
      } else if (dateType.toLowerCase() === 'finishdate') {
        return TaskUtils.getFinishedDate(task, project, sections);
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
