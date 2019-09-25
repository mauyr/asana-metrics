import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Task } from 'src/app/domain/task';
import TaskUtils from 'src/app/service/task/task-utils';
import { environment } from 'src/environments/environment';
import { MatGridTile } from '@angular/material';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent extends MatGridTile implements OnChanges {

  @Input()
  data: Task[] = [];

  value: Number = 0;
  unit: String = 'd';

  ngOnChanges(changes: SimpleChanges): void {
    this.value = this.calculateProposalAvg();
  }

  calculateProposalAvg() {
    let completedProposals = this.data.filter(t => TaskUtils.getFinishedDate(t, environment.sections.proposals));
    return TaskUtils.calculateAvgFromStartDate(completedProposals, environment.sections.proposals, []);
  }

}
