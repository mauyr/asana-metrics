import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSpentPipe } from './time-spent.pipe';
import { TaskDatePipe } from './task-date.pipe';
import { TaskCommandsPipe } from './task-commands.pipe';

@NgModule({
  declarations: [TimeSpentPipe, TaskDatePipe, TaskCommandsPipe],
  exports: [TimeSpentPipe, TaskDatePipe, TaskCommandsPipe],
  providers: [TimeSpentPipe, TaskDatePipe, TaskCommandsPipe],
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
