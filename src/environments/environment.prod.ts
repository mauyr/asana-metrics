export const environment = {
  production: true,
  asanaUrl: "https://app.asana.com/api/1.0",
  asanaKey: "123456",
  dateFormat: 'dd/MM/yyyy',
  labels: {
    bugs: ["bug"],
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
    startDate: '/start-date:',
    finishDate: '/finish-date:',
    spendedTime: '/spended-time:',
    ignoreForStats: '/ignore'
  }
};
