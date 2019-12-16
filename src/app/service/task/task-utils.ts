import { Task } from 'src/app/domain/asana/task';
import business from 'moment-business';
import { environment } from 'src/environments/environment';
import { Story } from 'src/app/domain/asana/story';
import * as moment from 'moment';
import { Sections } from 'src/app/domain/section';
import { Project } from 'src/app/domain/project';

export default class TaskUtils {

  public static calculateAvgFromStartDate(tasks: Task[], project: Project, sections: Sections, tags: string[]) {
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

  public static timeSpent(task: Task, project: Project): number {
    let sections = project.sections;

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

  public static getFinishedDate(task: Task, project: Project, sections: Sections): Date {
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
    
  public static getStartedDate(task: Task, project: Project, sections: Sections): Date {
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

  public static getDateOnSection(task: Task, project: Project, section: string[], asc: boolean): Date {
    if (section.filter(s => s == 'completed_at').length > 0) {
      return task.completed_at;
    } else if (task.stories && task.projects.filter(p => p.name === project.name).length > 0) {
      let addedToProjectStories: Story[] = task.stories.filter(s => s.resource_subtype === 'added_to_project' && s.text.indexOf(project.name) >= 0);
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

  public static getTaskEstimated(task: Task, tasks: Task[], project: Project): number {
    if (environment.calculateTaskTime) {
      let doneTasks: Task[] = this.getDoneTasksOfType(this.getTaskType(task), tasks, project);

      let dateStart = moment().subtract(environment.averageTaskTimeWeeks, 'weeks');
      let doneTasksAtLastWeeks: Task[] = doneTasks.filter(t => this.getFinishedDate(task, project, project.sections) != null && dateStart.isBefore(moment(this.getFinishedDate(task, project, project.sections))));
      if (doneTasksAtLastWeeks.length>0) {
        let totalSpent: number = doneTasksAtLastWeeks.map(t => this.timeSpent(t, project)).reduce((a,b) => a + b);
        if (totalSpent > 0) {
          return totalSpent/doneTasksAtLastWeeks.length;
        }
      }
    }

    return this.getFixedTaskEstimate(task);
  }

  public static getFixedTaskEstimate(task: Task) {
    if (this.getTaskType(task) == "feature") {
      return environment.taskType.feature.estimate;
    } else if (this.getTaskType(task) == "bug") {
      return environment.taskType.bug.estimate;
    } else if (this.getTaskType(task) == "technicalDebt") {
      return environment.taskType.technicalDebt.estimate;
    } else if (this.getTaskType(task) == "support") {
      return environment.taskType.support.estimate;
    } else {
      return environment.taskType.other.estimate;
    }
  }

  public static getDoneTasksOfType(taskType: string, tasks: Task[], project: Project) {
    return this.getDoneTasks(tasks, project).filter(t => this.getTaskType(t) == taskType);
  }

  //Not completed at all, only time calculated on development phase without CI/CD
  public static getDoneTasks(tasks: Task[], project: Project) {
    return tasks.filter(t => this.timeSpent(t, project) > 0);
  }

  public static getTaskType(task: Task) {
    if (task.tags.find(t => environment.taskType.feature.labels.filter(l => t.name == l).length > 0)) {
      return environment.taskType.feature.name;
    } else if (task.tags.find(t => environment.taskType.bug.labels.filter(l => t.name == l).length > 0)) {
      return environment.taskType.bug.name;
    } else if (task.tags.find(t => environment.taskType.technicalDebt.labels.filter(l => t.name == l).length > 0)) {
      return environment.taskType.technicalDebt.name;
    } else if (task.tags.find(t => environment.taskType.support.labels.filter(l => t.name == l).length > 0)) {
      return environment.taskType.support.name;
    } else {
      return environment.taskType.other.name;
    }
  }

}
