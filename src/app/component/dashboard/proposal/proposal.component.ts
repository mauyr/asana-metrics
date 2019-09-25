import { Component, OnInit, Input } from '@angular/core';
import { Task } from 'src/app/domain/task';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnInit {

  @Input()
  private data: Task[] = [];

  value: Number;
  unit: String;

  calculateProposalAvg() {
    return this.calculateAvgFromStartDate(this.proposalTasks, environment.sections.proposals, []);
  }

  constructor() { }

  ngOnInit() {
  }

}
