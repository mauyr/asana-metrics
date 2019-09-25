// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  asanaUrl: "https://app.asana.com/api/1.0",
  asanaKey: "0/0b4891b579fc50a790966badb330255d",
  dateFormat: 'dd/MM/yyyy',
  maxVelocity: 3.5,
  labels: {
    bug: ["bug"],
    feature: ["feature", "change"],
    technicalDebt: ["technical-debt"],
    support: ["support"],
    customization: ["customization"]
  },
  estimate: {
    bug: 0.5,
    feature: 3,
    technicalDebt: 5,
    support: 0.5,
    customization: 3,
    other: 2
  },
  projects: {
    kanban: "Kanban",
    proposal: "Orçamentos",
    backlog: "Backlog",
    inception: "Inception",
    support: "Support",
    roadmap: "Roadmap - 2019/2010"
  },
  sections: {
    backlog: {
      actualWeek: ['Actual week'],
      priorized: ['Candidate for next week'],
      unpriorized: ['Backlog']
    },
    kanban: {
      todo: ['A fazer'],
      doing: ['Em andamento', 'Review'],
      done: ['Feito']
    },
    proposals: {
      todo: [],
      doing: ['Pendentes', 'Em andamento', 'Em revisão'],
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
