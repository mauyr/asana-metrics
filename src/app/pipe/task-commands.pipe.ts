import { Pipe, PipeTransform } from '@angular/core';
import { Story } from '../domain/asana/story';
import TaskUtils from '../service/task/task-utils';

@Pipe({
  name: 'taskCommands'
})
export class TaskCommandsPipe implements PipeTransform {

  transform(stories: Story[], command: string): any {
    return TaskUtils.extractCommand(stories, command);
  }

}
