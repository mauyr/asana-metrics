export const environment = {
  production: true,
  asanaUrl: "https://app.asana.com/api/1.0",
  asanaKey: "your-asana-key",
  dateFormat: 'dd/MM/yyyy',
  maxVelocity: 3.5,
  labels: {
    bugs: ["bug"],
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
    },
    leadtime: {
      onHold: ['A fazer'],
      doing: ['Em andamento'],
      review: ['Review'],
      done: ['Feito'],
      launch: ['completed_at'] //Asana complete action
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
