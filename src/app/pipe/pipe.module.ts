import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSpendedPipe } from './time-spended.pipe';
import { TaskDatePipe } from './task-date.pipe';
import { TaskSectionsPipe } from './task-sections.pipe';
import { TaskCommandsPipe } from './task-commands.pipe';

@NgModule({
  declarations: [TimeSpendedPipe, TaskDatePipe, TaskSectionsPipe, TaskCommandsPipe],
  exports: [TimeSpendedPipe, TaskDatePipe, TaskSectionsPipe, TaskCommandsPipe],
  providers: [TimeSpendedPipe, TaskDatePipe, TaskSectionsPipe, TaskCommandsPipe],
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
