import { Pipe, PipeTransform, Inject } from '@angular/core';
import { Task } from '../domain/asana/task';
import TaskUtils from '../service/task/task-utils';
import { Project } from '../domain/project';

/*
 * Calcula o tempo gasto em dias de uma task
*/
@Pipe({
    name: 'timeSpent',
    pure: false
})
export class TimeSpentPipe implements PipeTransform {

  transform(task: Task, project: Project): number {
    return TaskUtils.timeSpent(task, project);
  }
}