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
