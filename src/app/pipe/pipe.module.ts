import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSpentPipe } from './time-spent.pipe';
import { TaskDatePipe } from './task-date.pipe';
import { TaskSectionsPipe } from './task-sections.pipe';
import { TaskCommandsPipe } from './task-commands.pipe';

@NgModule({
  declarations: [TimeSpentPipe, TaskDatePipe, TaskSectionsPipe, TaskCommandsPipe],
  exports: [TimeSpentPipe, TaskDatePipe, TaskSectionsPipe, TaskCommandsPipe],
  providers: [TimeSpentPipe, TaskDatePipe, TaskSectionsPipe, TaskCommandsPipe],
  imports: [
    CommonModule
  ]
})
export class PipeModule {
  static forRoot() {
    return {
        ngModule: PipeModule,
        providers: [],
    };
  }
}
