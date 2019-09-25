import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../domain/task';
import { TaskCommandsPipe } from './task-commands.pipe';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { Story } from '../domain/story';
import TaskUtils from '../service/task/task-utils';

@Pipe({
  name: 'taskDatePipe'
})
export class TaskDatePipe implements PipeTransform {

  transform(task: Task, dateType: string, sections: {todo: string[], doing: string[], done: string[]}): Date {
    try {
      if (dateType.toLowerCase() === 'startdate') {
        return TaskUtils.getStartedDate(task, sections);
      } else if (dateType.toLowerCase() === 'finishdate') {
        return TaskUtils.getFinishedDate(task, sections);
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
