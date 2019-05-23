import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Avg. feature', cols: 1, rows: 1, value: "5.3d", footer: "Last 7 days" },
        { title: 'Avg. bug', cols: 1, rows: 1, value: "0.4d", footer: "Last 7 days" },
        { title: 'Avg. tech debt', cols: 1, rows: 1, value: "2.0d", footer: "Last 7 days" },
        { title: 'Avg. migration', cols: 1, rows: 1, value: "3.6d", footer: "Last 7 days" },
        { title: 'Backlog Evolution', cols: 2, rows: 1, value: "Graph", footer: "Backlog estimate on last 2 months" },
        { title: 'Development Division', cols: 2, rows: 1, value: "Graph", footer: "How many time spended by type" },
        { title: 'Backlog Estimate', cols: 1, rows: 1, value: "8.3d", footer: "Estimative to close all issues" },
        { title: 'Avg. Proposal', cols: 1, rows: 1, value: "0·8d", footer: "Average time to make a proposal" },
        { title: 'MR Created/Avg', cols: 1, rows: 1, value: "4/7", footer: "Last 7 days" },
        { title: 'Bug Created/Closed', cols: 1, rows: 1, value: "5/3", footer: "Last 7 days" }
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) { }
}
