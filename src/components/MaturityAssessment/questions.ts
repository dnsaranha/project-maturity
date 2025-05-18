
// Define all the questions for each level

export interface Question {
  id: number;
  text: string;
  details: {
    label: string;
    questions: string[];
  };
}

// Define questions by level
const level2Questions: Question[] = [
  {
    id: 1,
    text: "Nos últimos 12 meses, os profissionais do setor participaram de treinamentos internos ou externos relacionados a aspectos básicos de gerenciamento de projetos?",
    details: {
      label: "Se \"Atende ao requisito\", por favor, detalhe:",
      questions: [
        "Quais foram os temas abordados nos treinamentos?",
        "Quantos profissionais participaram?",
        "Com que frequência os treinamentos ocorreram?",
      ],
    },
  },
  {
    id: 2,
    text: "O setor utilizou softwares para gerenciamento de tempo (como sequenciamento de tarefas, cronogramas, gráficos de Gantt) nos últimos 12 meses?",
    details: {
      label: "Se \"Atende ao requisito\", por favor, detalhe:",
      questions: [
        "Quais softwares foram utilizados?",
        "Quantos profissionais foram treinados para utilizá-los?",
        "Em quantos projetos esses softwares foram aplicados?",
      ],
    },
  },
  {
    id: 3,
    text: "Os profissionais do setor têm experiência recente no planejamento, acompanhamento e encerramento de projetos, utilizando padrões reconhecidos (como PMBOK) e ferramentas computacionais?",
    details: {
      label: "Se \"Atende ao requisito\", por favor, detalhe:",
      questions: [
        "Quantos projetos foram gerenciados com base nesses padrões?",
        "Quais ferramentas computacionais foram utilizadas?",
        "Quais foram os principais resultados obtidos?",
      ],
    },
  },
  {
    id: 4,
    text: "A alta administração do setor reconhece a importância do gerenciamento de projetos e tem promovido iniciativas para seu desenvolvimento nos últimos 12 meses?",
    details: {
      label: "Se \"Atende ao requisito\", por favor, detalhe:",
      questions: [
        "Quais iniciativas foram promovidas?",
        "Quantos membros da alta administração participaram?",
        "Quais foram os principais resultados dessas iniciativas?",
      ],
    },
  },
  {
    id: 5,
    text: "A alta administração do setor reconhece a importância de possuir uma metodologia de gerenciamento de projetos e tem promovido iniciativas para seu desenvolvimento nos últimos 12 meses?",
    details: {
      label: "Se \"Atende ao requisito\", por favor, detalhe:",
      questions: [
        "Quais iniciativas foram promovidas?",
        "Quantos membros da alta administração participaram?",
        "Quais foram os principais resultados dessas iniciativas?",
      ],
    },
  },
  {
    id: 6,
    text: "A alta administração do setor reconhece a importância de possuir um sistema informatizado para o gerenciamento de projetos e tem promovido iniciativas para seu desenvolvimento nos últimos 12 meses?",
    details: {
      label: "Se \"Atende ao requisito\", por favor, detalhe:",
      questions: [
        "Quais iniciativas foram promovidas?",
        "Quantos membros da alta administração participaram?",
        "Quais foram os principais resultados dessas iniciativas?",
      ],
    },
  },
  {
    id: 7,
    text: "A alta administração do setor reconhece a importância dos componentes da estrutura organizacional (como Gerentes de Projeto, PMO, Comitês, Sponsor) e tem promovido iniciativas para seu desenvolvimento nos últimos 12 meses?",
    details: {
      label: "Se \"Atende ao requisito\", por favor, detalhe:",
      questions: [
        "Quais iniciativas foram promovidas?",
        "Quantos membros da alta administração participaram?",
        "Quais foram os principais resultados dessas iniciativas?",
      ],
    },
  },
  {
    id: 8,
    text: "A alta administração do setor reconhece a importância de alinhar os projetos com as estratégias e prioridades da organização e tem promovido iniciativas para esse alinhamento nos últimos 12 meses?",
    details: {
      label: "Se \"Atende ao requisito\", por favor, detalhe:",
      questions: [
        "Quais iniciativas foram promovidas?",
        "Quantos membros da alta administração participaram?",
        "Quais foram os principais resultados dessas iniciativas?",
      ],
    },
  },
  {
    id: 9,
    text: "A alta administração do setor reconhece a importância de desenvolver competências comportamentais (como liderança, negociação, comunicação, resolução de conflitos) e tem promovido iniciativas para esse desenvolvimento nos últimos 12 meses?",
    details: {
      label: "Se \"Atende ao requisito\", por favor, detalhe:",
      questions: [
        "Quais iniciativas foram promovidas?",
        "Quantos membros da alta administração participaram?",
        "Quais foram os principais resultados dessas iniciativas?",
      ],
    },
  },
  {
    id: 10,
    text: "A alta administração do setor reconhece a importância de desenvolver competências técnicas e contextuais (relacionadas ao produto, negócios, estratégia da organização, clientes) e tem promovido iniciativas para esse desenvolvimento nos últimos 12 meses?",
    details: {
      label: "Se \"Atende ao requisito\", por favor, detalhe:",
      questions: [
        "Quais iniciativas foram promovidas?",
        "Quantos membros da alta administração participaram?",
        "Quais foram os principais resultados dessas iniciativas?",
      ],
    },
  },
];

const level3Questions: Question[] = [
  {
    id: 11,
    text: "A organização possui metodologia de gerenciamento de projetos formalizada e divulgada?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "A metodologia é baseada em algum referencial (ex: PMBOK, PRINCE2)?",
        "Desde quando está formalizada?",
        "Como e com que frequência é divulgada?",
      ],
    },
  },
  {
    id: 12,
    text: "A metodologia de gerenciamento de projetos é aplicada em grande parte dos projetos do setor?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Qual o percentual de projetos que seguem a metodologia?",
        "Há auditorias ou verificações para garantir a aplicação?",
      ],
    },
  },
  {
    id: 13,
    text: "A metodologia de gerenciamento de projetos contempla processos de iniciação, planejamento, execução, controle e encerramento?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Quais desses processos são mais consolidados?",
        "Há documentos ou templates padronizados para cada fase?",
      ],
    },
  },
  {
    id: 14,
    text: "A organização possui um sistema informatizado de gerenciamento de projetos que apoia a aplicação da metodologia?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Qual sistema é utilizado?",
        "Quais funcionalidades estão em uso (ex: cronograma, riscos, custos)?",
        "Há integração com outros sistemas corporativos?",
      ],
    },
  },
  {
    id: 15,
    text: "Existe um Escritório de Projetos (PMO) com papel definido para apoiar a gestão dos projetos?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Quais são as principais atribuições do PMO?",
        "Qual a estrutura (equipe, hierarquia)?",
        "O PMO atua de forma consultiva, diretiva ou controladora?",
      ],
    },
  },
  {
    id: 16,
    text: "O setor realiza reuniões de lições aprendidas no encerramento dos projetos?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Qual a frequência das reuniões?",
        "Como as lições aprendidas são registradas e disseminadas?",
        "Elas são reutilizadas em projetos futuros?",
      ],
    },
  },
  {
    id: 17,
    text: "Existem indicadores de desempenho utilizados para avaliação de projetos (ex: prazo, custo, escopo, qualidade)?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Quais indicadores são utilizados?",
        "Como são medidos e com que periodicidade?",
        "Quem analisa os resultados?",
      ],
    },
  },
  {
    id: 18,
    text: "Existe padronização de documentos, relatórios e templates para os projetos?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Quais documentos estão padronizados?",
        "Onde estão armazenados e como são acessados?",
        "Quem é responsável pela atualização?",
      ],
    },
  },
  {
    id: 19,
    text: "Os papéis e responsabilidades das partes interessadas nos projetos estão claramente definidos?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Há matriz de responsabilidades (ex: RACI)?",
        "Os papéis são comunicados aos envolvidos?",
        "Existem conflitos de atribuições?",
      ],
    },
  },
  {
    id: 20,
    text: "Os projetos são formalmente autorizados antes de iniciar?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Quem é responsável pela autorização?",
        "Que tipo de documento é utilizado (termo de abertura, e-mail, etc.)?",
        "Esse processo é obrigatório para todos os projetos?",
      ],
    },
  },
];

const level4Questions: Question[] = [
  {
    id: 21,
    text: "Existe um processo formal para priorização e seleção de projetos alinhados às estratégias da organização?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Qual critério é utilizado na priorização (ROI, impacto estratégico, etc.)?",
        "Quem participa da definição?",
        "Há revisão periódica dessas prioridades?",
      ],
    },
  },
  {
    id: 22,
    text: "Os projetos são agrupados e tratados como portfólios ou programas?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Quais critérios definem o agrupamento (tipo, área, objetivo)?",
        "Como é feita a gestão integrada?",
        "Há gestores de portfólio ou programa?",
      ],
    },
  },
  {
    id: 23,
    text: "Existe controle centralizado e padronizado dos indicadores de desempenho dos projetos?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Quais são os indicadores padronizados?",
        "Onde são registrados (dashboard, sistema)?",
        "Com que frequência são analisados?",
      ],
    },
  },
  {
    id: 24,
    text: "A organização realiza auditorias ou avaliações periódicas nos projetos para verificar aderência à metodologia?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Qual a frequência dessas auditorias?",
        "Quem as realiza?",
        "Como os resultados são utilizados para melhoria?",
      ],
    },
  },
  {
    id: 25,
    text: "Existe um processo formal de gestão de mudanças nos projetos (controle de escopo, aprovações, impactos)?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Há registro e análise formal das mudanças?",
        "Quem aprova as mudanças?",
        "Qual o impacto no cronograma, custo e escopo?",
      ],
    },
  },
  {
    id: 26,
    text: "Os planos de projeto incluem planejamento de recursos humanos, comunicações, riscos e aquisições?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Todos os projetos incluem esses planos?",
        "Como são documentados e atualizados?",
        "Como esses planos são utilizados na execução?",
      ],
    },
  },
  {
    id: 27,
    text: "Existe um processo para gerenciamento de riscos, com identificação, análise, plano de resposta e monitoramento?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Os riscos são classificados por impacto e probabilidade?",
        "Há plano de contingência documentado?",
        "Quem é responsável pelo monitoramento?",
      ],
    },
  },
  {
    id: 28,
    text: "Os projetos contam com patrocínio ativo (sponsor), apoiando decisões críticas e removendo barreiras?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Quem atua como sponsor?",
        "Com que frequência participa das decisões?",
        "Como o apoio se manifesta (reuniões, decisões, recursos)?",
      ],
    },
  },
  {
    id: 29,
    text: "Existe capacitação regular para os gerentes de projeto e equipes, com foco técnico e comportamental?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Quais temas são abordados nos treinamentos?",
        "Com que frequência são realizados?",
        "Quem ministra os treinamentos?",
      ],
    },
  },
  {
    id: 30,
    text: "A gestão de projetos é considerada crítica para o sucesso organizacional, sendo acompanhada pela alta direção?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Quais mecanismos demonstram esse acompanhamento?",
        "A alta direção participa de reuniões ou relatórios periódicos?",
        "Há ações da alta direção com base nesses acompanhamentos?",
      ],
    },
  },
];

const level5Questions: Question[] = [
  {
    id: 31,
    text: "Existe um processo formal de melhoria contínua da metodologia de gerenciamento de projetos?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Com que frequência a metodologia é revisada?",
        "Quem participa da revisão?",
        "Quais melhorias recentes foram implementadas?",
      ],
    },
  },
  {
    id: 32,
    text: "As lições aprendidas são sistematicamente coletadas, analisadas e utilizadas em novos projetos?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Onde são armazenadas as lições aprendidas?",
        "Como são disseminadas?",
        "Cite exemplos de reaproveitamento efetivo.",
      ],
    },
  },
  {
    id: 33,
    text: "Os indicadores de desempenho são utilizados para tomada de decisão e melhoria da gestão de projetos?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Como os dados são analisados?",
        "Há ações corretivas com base nos resultados?",
        "Quem participa da análise?",
      ],
    },
  },
  {
    id: 34,
    text: "Há benchmark interno e externo para comparação da performance dos projetos?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Com quem são feitas as comparações (internas ou empresas externas)?",
        "Que critérios são usados?",
        "Que melhorias surgiram a partir do benchmark?",
      ],
    },
  },
  {
    id: 35,
    text: "A cultura de gerenciamento de projetos está disseminada entre todas as áreas da organização?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Quais áreas utilizam práticas formais de GP?",
        "Há incentivo ou obrigatoriedade de uso?",
        "Há resistência em algum setor?",
      ],
    },
  },
  {
    id: 36,
    text: "Existe um plano de carreira para profissionais de gerenciamento de projetos?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "O plano é estruturado por níveis de experiência?",
        "Quais competências são consideradas?",
        "Há avaliação de desempenho ligada ao plano?",
      ],
    },
  },
  {
    id: 37,
    text: "A organização possui certificações em gerenciamento de projetos ou exige isso de seus profissionais?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Quais certificações são exigidas ou incentivadas (ex: PMP, CAPM)?",
        "Quantos profissionais certificados existem?",
        "Há apoio institucional (reembolso, tempo para estudo)?",
      ],
    },
  },
  {
    id: 38,
    text: "Existe uma comunidade de práticas ou fórum interno de discussão sobre gerenciamento de projetos?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Qual a frequência dos encontros?",
        "Que temas são abordados?",
        "Quem participa?",
      ],
    },
  },
  {
    id: 39,
    text: "A organização realiza autoavaliações periódicas do grau de maturidade em gerenciamento de projetos?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Com que frequência são realizadas?",
        "Que metodologia é utilizada?",
        "Quais ações foram tomadas após as avaliações?",
      ],
    },
  },
  {
    id: 40,
    text: "O Escritório de Projetos (PMO) atua estrategicamente, influenciando decisões da alta direção?",
    details: {
      label: "Se \"Atende ao requisito\", detalhe:",
      questions: [
        "Em quais decisões o PMO influencia diretamente?",
        "Como a alta direção responde às recomendações do PMO?",
        "Cite exemplos de impacto estratégico.",
      ],
    },
  },
];

// Export questions by level
export const levelQuestions: { [key: number]: Question[] } = {
  2: level2Questions,
  3: level3Questions,
  4: level4Questions,
  5: level5Questions,
};
