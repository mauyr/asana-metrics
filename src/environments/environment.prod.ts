export const environment = {
  production: true,
  asanaUrl: "https://app.asana.com/api/1.0",
  asanaKey: "0/0b4891b579fc50a790966badb330255d",
  dateFormat: 'dd/MM/yyyy',
  labels: {
    bugs: ["bug"],
    feature: ["feature", "change"],
    technicalDebt: ["technical-debt"],
    support: ["support"],
    customization: ["customization"]
  },
  estimate: {
    bug: 0.5,
    feature: 2,
    technicalDebt: 5,
    other: 2
  },
  projects: {
    kanban: "Kanban",
    proposal: "Orçamentos",
    backlog: "Backlog",
    inception: "Inception",
    support: "Support"
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
