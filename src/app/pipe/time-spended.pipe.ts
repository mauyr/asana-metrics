import { Pipe, PipeTransform, Inject } from '@angular/core';
import { Task } from '../domain/task';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import business from 'moment-business';
import { TaskSectionsPipe } from './task-sections.pipe';
import { TaskDatePipe } from './task-date.pipe';
import { TaskCommandsPipe } from './task-commands.pipe';

/*
 * Calcula o tempo gasto em dias de uma task
*/
@Pipe({
    name: 'timeSpended',
    pure: false
})
export class TimeSpendedPipe implements PipeTransform {

  constructor(private sectionsPipe: TaskSectionsPipe, private datePipe: TaskDatePipe, private commandPipe: TaskCommandsPipe) {

  }

  transform(task: Task, project: string): number {
    let sections = this.sectionsPipe.transform(project);

    try {
        let command = this.commandPipe.transform(task.stories, environment.commands.spendedTime);
        if (command) {
            return Number(command);
        }

        let startedDate = this.datePipe.transform(task, 'startDate', sections);
        let finishedDate = this.datePipe.transform(task, 'finishDate', sections);    
        let businessDays = business.weekDays(moment(startedDate), moment(finishedDate))        
        return Math.ceil(businessDays) + (businessDays % 1 * 3);
    } catch (error) {
        return 0;
    }
  }
}