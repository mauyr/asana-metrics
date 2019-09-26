import { Task } from 'src/app/domain/task';
import business from 'moment-business';
import { environment } from 'src/environments/environment';
import { Story } from 'src/app/domain/story';
import * as moment from 'moment';

export default class TaskUtils {

  public static calculateAvgFromStartDate(tasks: Task[], project: string, sections: { todo: string[], doing: string[], done: string[] }, tags: string[]) {
    let totalSpended: number = 0;
    let countSpended: number = 0;
    tasks.forEach(task => {
      if (tags.length == 0 || task.tags.filter(t => tags.filter(tag => t.name === tag).length > 0).length > 0) {
        let startedDate = task.created_at
        let finishedDate = this.getFinishedDate(task, project, sections)
        if (!finishedDate)
          finishedDate = new Date()

        let timeSpended: number = business.weekDays(moment(startedDate), moment(finishedDate))
        totalSpended += timeSpended;
        countSpended++;
      }
    });
    return countSpended > 0 ? totalSpended / countSpended : 0;
  }

  public static timeSpent(task: Task, project: string): number {
    let sections = this.getSections(project);

    try {
        let command = this.extractCommand(task.stories, environment.commands.spendedTime);
        if (command) {
            return Number(command);
        }

        let startedDate = this.getStartedDate(task, project, sections);
        let finishedDate = this.getFinishedDate(task, project, sections);    
        let businessDays = business.weekDays(moment(startedDate), moment(finishedDate))        
        return Math.ceil(businessDays) + (businessDays % 1 * 3);
    } catch (error) {
        return 0;
    }
  }

  public static getSections(project: string): {todo: string[], doing: string[], done: string[]} {
    if (environment.projects.inception == project) {
        return environment.sections.inception;
    } else if (environment.projects.kanban == project) {
        return environment.sections.kanban;
    } else {
        return environment.sections.proposals;
    }
  }

  public static getFinishedDate(task: Task, project:string, sections: {todo: string[], doing: string[], done: string[]}): Date {
    if (task.stories) {
        let command = this.extractCommand(task.stories, environment.commands.finishDate);
        if (command) {
            return moment(command, environment.dateFormat).toDate();
        }

        let finishedDateOnSection = this.getDateOnSection(task, project, sections.done, false);
        if (finishedDateOnSection) {
          return finishedDateOnSection;
        }
    }
    if (task.completed) {
        return task.completed_at;
    }

    return undefined;
  }
    
  public static getStartedDate(task: Task, project: string, sections: {todo: string[], doing: string[], done: string[]}): Date {
    if (task.stories) {
        let command = this.extractCommand(task.stories, environment.commands.startDate);
        if (command) {
            return moment(command, environment.dateFormat).toDate();
        }

        let startedDateOnSection = this.getDateOnSection(task, project, sections.doing, true);
        if (startedDateOnSection) {
          return startedDateOnSection;
        }
    }
    if (task.start_on != null) {
        return task.start_on;
    }

    return undefined;
  }

  public static getDateOnSection(task: Task, project: string, section: string[], asc: boolean): Date {
    if (section.filter(s => s == 'completed_at').length > 0) {
      return task.completed_at;
    } else if (task.stories && task.projects.filter(p => p.name === project).length > 0) {
      let addedToProjectStories: Story[] = task.stories.filter(s => s.resource_subtype === 'added_to_project' && s.text.indexOf(project) >= 0);
      let sectionChangedStories: Story[] = task.stories.filter(s => s.resource_subtype === 'section_changed');
      
      let startedSection = sectionChangedStories.filter(s => section.filter(d => s.text.indexOf('to ' + d) >= 0 ).length > 0)
      if (startedSection.length > 0 ) {
          return startedSection.sort((a,b) => (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) * (asc ? 1 : -1) )[0].created_at;
      }

      try {
        let todoSection: string[] = eval("environment.sections." + project + ".todo");
        if (addedToProjectStories.length > 0 && section.filter(s => todoSection.filter(t=> t==s).length > 0)) {
            return addedToProjectStories.sort((a,b) => (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) * (asc ? 1 : -1))[0].created_at;
        }
      } catch {
        //ignoring projects without todoSection
      }
    }
    return undefined;
  }

  public static extractCommand(stories: Story[], command: string): string {
    let commentStories: Story[] = stories.filter(s => s.resource_subtype === 'comment_added');
    let commandStory: Story = commentStories.find(c => c.text.indexOf(command) >= 0);
    if (commandStory) {
        let initialPos = commandStory.text.indexOf(command)+command.length;
        return commandStory.text.substring(initialPos).trim();
    }
    return undefined;
  }

  public static getFixedTaskEstimated(task: Task) {
    if (this.getTaskType(task) == "feature") {
      return environment.estimate.feature;
    } else if (this.getTaskType(task) == "bug") {
      return environment.estimate.bug;
    } else if (this.getTaskType(task) == "technicalDebt") {
      return environment.estimate.technicalDebt;
    } else if (this.getTaskType(task) == "support") {
      return environment.estimate.support;
    } else if (this.getTaskType(task) == "customization") {
      return environment.estimate.customization;
    } else {
      return environment.estimate.other;
    }
  }

  public static getTaskType(task: Task) {
    if (task.tags.find(t => environment.labels.feature.filter(l => t.name === l).length > 0)) {
      return "feature";
    } else if (task.tags.find(t => environment.labels.bug.filter(l => t.name === l).length > 0)) {
      return "bug";
    } else if (task.tags.find(t => environment.labels.technicalDebt.filter(l => t.name === l).length > 0)) {
      return "technicalDebt"
    } else if (task.tags.find(t => environment.labels.support.filter(l => t.name === l).length > 0)) {
      return "support";
    } else if (task.tags.find(t => environment.labels.customization.filter(l => t.name === l).length > 0)) {
      return "customization";
    } else {
      return "other";
    }
  }

}
