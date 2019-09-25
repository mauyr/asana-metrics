import { Pipe, PipeTransform, Inject } from '@angular/core';
import { Task } from '../domain/task';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import business from 'moment-business';
import { TaskSectionsPipe } from './task-sections.pipe';
import { TaskDatePipe } from './task-date.pipe';
import { TaskCommandsPipe } from './task-commands.pipe';
import TaskUtils from '../service/task/task-utils';

/*
 * Calcula o tempo gasto em dias de uma task
*/
@Pipe({
    name: 'timeSpent',
    pure: false
})
export class TimeSpentPipe implements PipeTransform {

  transform(task: Task, project: string): number {
    return TaskUtils.timeSpent(task, project);
  }
}