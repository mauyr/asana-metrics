// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  asanaUrl: "https://app.asana.com/api/1.0",
  asanaKey: "0/0b4891b579fc50a790966badb330255d",
  dateFormat: 'dd/MM/yyyy',
  labels: {
    bug: ["bug"],
    feature: ["feature", "change"],
    technicalDebt: ["technicall-debt"]    
  },
  projects: {
    kanban: "Kanban",
    proposal: "Orçamentos",
    backlog: "Backlog",
    inception: "Inception"
  },
  sections: {
    backlog: {
      actualWeek: ['Actual week'],
      priorized: ['Candidate for next week'],
      unpriorized: ['Classificar', 'Backlog']
    },
    kanban: {
      todo: ['A fazer'],
      doing: ['Em andamento', 'Review'],
      done: ['Feito']
    },
    proposals: {
      todo: ['Pendentes'],
      doing: ['Em andamento', 'Em revisão'],
      done: ['Enviados', 'Recusados', 'Aprovados']
    },
    inception: {
      todo: ['Inception'],
      doing: ['Doing'],
      done: ['Done']
    }
  },
  commands: {
    startDate: '/started:',
    finishDate: '/finished:',
    spendedTime: '/elapsed:',
    estimateTime: '/estimated:',
    ignoreForStats: '/ignore'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
