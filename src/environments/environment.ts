// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  asanaUrl: "https://app.asana.com/api/1.0",
  asanaKey: "your-asana-key",
  dateFormat: 'dd/MM/yyyy',
  calculateTaskTime: true,
  maxVelocity: 2.5,
  averageTaskTimeWeeks: 10,
  taskType: {
    bug: { 
      name: "bug",
      labels: ["bug"],
      estimate: 0.5
    },
    feature: { 
      name: "feature",
      labels: ["feature", "change"],
      estimate: 3
    },
    technicalDebt: {
      name: "technicalDebt",
      labels: ["technical-debt"],
      estimate: 5
    },
    support: {
      name: "support",
      labels : ["support"],
      estimate: 0.5
    },
    other: {
      name: "other",
      estimate: 2
    }
  },
  projects: {
    kanban: { 
      name: "Kanban",
      sections: {
        todo: ['A fazer'],
        doing: ['Em andamento', 'Review'],
        done: ['Feito']
      },
      leadtime: {
        todo: ['A fazer'],
        doing: ['Em andamento'],
        review: ['Review'],
        done: ['Feito'],
        launch: ['completed_at'] //Asana complete action
      }
    },
    proposal: { 
      name: "Orçamentos",
      sections: {
        todo: [],
        doing: ['Pendentes', 'Em andamento', 'Em revisão'],
        done: ['Enviados', 'Recusados', 'Aprovados']
      }
    },
    backlog: { 
      name: "Backlog",
      sections: {
        doing: ['Actual week'],
        todo: ['Candidate for next week'],
        unpriorized: ['Backlog']
      },
    },
    inception: { 
      name: "Inception",
      sections: {
        todo: ['Inception'],
        doing: ['Doing'],
        done: ['Done']
      }
    },
    support: { 
      name: "Support",
      sections: {
        todo: ['A fazer'],
        doing: ['Em andamento', 'Review'],
        done: ['Feito']
      }
    },
    roadmap: { 
      name: "Roadmap - 2019/2010",
      sections: {
        todo: ['A fazer'],
        doing: ['Em andamento', 'Review'],
        done: ['Feito']
      }
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
