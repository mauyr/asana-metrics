import { Pipe, PipeTransform } from '@angular/core';
import { Story } from '../domain/story';

@Pipe({
  name: 'taskCommands'
})
export class TaskCommandsPipe implements PipeTransform {

  transform(stories: Story[], command: string): any {
    return this.extractCommand(stories, command);
  }

  private extractCommand(stories: Story[], command: string): string {
    let commentStories: Story[] = stories.filter(s => s.resource_subtype === 'comment_added');
    let commandStory: Story = commentStories.find(c => c.text.indexOf(command) > 0);
    if (commandStory) {
        let initialPos = commandStory.text.indexOf(command)+command.length;
        return commandStory.text.substring(initialPos).trim();
    }
    return undefined;
  }

}
