import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Task } from 'src/app/domain/asana/task';
import TaskUtils from 'src/app/service/task/task-utils';
import { environment } from 'src/environments/environment';
import { MatGridTile } from '@angular/material';
import * as moment from 'moment';
import { Project } from 'src/app/domain/project';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnChanges {

  private project: Project = environment.projects.proposal;

  @Input()
  data: Task[] = [];

  value: number = 0;
  unit: string = 'd';

  ngOnChanges(changes: SimpleChanges): void {
    this.value = this.calculateProposalAvg();
  }

  calculateProposalAvg() {
    let dateFinish = moment().subtract(8, 'weeks');

    let completedProposals = this.data.filter(t => {
      let finishedDate = TaskUtils.getFinishedDate(t, this.project, this.project.sections);
      if (finishedDate) {
        return dateFinish.isBefore(moment(finishedDate));
      }
      return false;
    });

    return TaskUtils.calculateAvgFromStartDate(completedProposals, this.project, this.project.sections, []);
  }

}
