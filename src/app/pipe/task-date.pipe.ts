import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../domain/task';
import { TaskCommandsPipe } from './task-commands.pipe';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { Story } from '../domain/story';

@Pipe({
  name: 'taskDatePipe'
})
export class TaskDatePipe implements PipeTransform {

  constructor(private commandPipe: TaskCommandsPipe) {

  }

  transform(task: Task, dateType: string, sections: {todo: string[], doing: string[], done: string[]}): Date {
    try {
      if (dateType.toLowerCase() === 'startdate') {
        return this.getStartedDate(task, sections);
      } else if (dateType.toLowerCase() === 'finishdate') {
        return this.getFinishedDate(task, sections);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private getFinishedDate(task: Task, sections: {todo: string[], doing: string[], done: string[]}) {
    if (task.stories) {
        let command = this.commandPipe.transform(task.stories, environment.commands.finishDate);
        if (command) {
            return moment(command, environment.dateFormat).toDate();
        }

        let sectionChangedStories: Story[] = task.stories.filter(s => s.resource_subtype === 'section_changed');
        let finishedSection = sectionChangedStories.filter(s => sections.done.filter(d => s.text.indexOf('to ' + d) >= 0 ).length > 0)
        if (finishedSection.length > 0 ) {
            return finishedSection.sort((a,b) => (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) * -1)[0].created_at;
        }
    }
    if (task.completed) {
        return task.completed_at;
    }

    throw new Error("Task not finished yet!");
  }
    
  private getStartedDate(task: Task, sections: {todo: string[], doing: string[], done: string[]}) {
    if (task.stories) {
        let command = this.commandPipe.transform(task.stories, environment.commands.startDate);
        if (command) {
            return moment(command, environment.dateFormat).toDate();
        }

        let sectionChangedStories: Story[] = task.stories.filter(s => s.resource_subtype === 'section_changed');

        let startedSection = sectionChangedStories.filter(s => sections.doing.filter(d => s.text.indexOf('to ' + d) >= 0 ).length > 0)
        if (startedSection.length > 0 ) {
            return startedSection.sort((a,b) => (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))[0].created_at;
        }
    }
    if (task.start_on != null) {
        return task.start_on;
    }

    throw new Error("Task not started yet!");
  }

}
