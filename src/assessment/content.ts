/**
 * Static copy and labels (participant-facing copy is PT-BR). Keep interface
 * text here so it can be revised without touching components or
 * interpretation rules.
 */
import type {
  ContextKey,
  DimensionId,
  DimensionState,
  TrainingReadinessLevel,
} from './types'

export const BRAND = {
  parent: 'Sunset Languages',
  system: 'WorkSpeak™',
  product: 'Communication Readiness Map',
  principle: 'Evidência antes da confiança.',
  /** Official parent-brand logo (navy canvas trimmed; mark itself untouched). */
  logo: { src: '/brand/sunset-languages-logo.png', width: 480, height: 168 },
}

/** Placeholder destination until the Bootcamp page exists. */
export const BOOTCAMP_URL = '#bootcamp'

export const INTRO = {
  headline: 'O quanto seu inglês está pronto para situações reais de pressão profissional?',
  support:
    'Mapeie o que acontece com sua comunicação quando você precisa explicar, responder, interagir ou pensar na hora.',
  clarification: [
    'Isto não é um teste de proficiência em inglês.',
    'É uma leitura inicial de como sua comunicação tende a se comportar em situações profissionais.',
  ],
  facts: [
    { value: '~5 minutos', label: 'Duração' },
    { value: 'Leitura inicial imediata', label: 'Resultado' },
    { value: 'Comunicação profissional', label: 'Foco' },
  ],
  cta: 'Mapear minha comunicação',
}

/** Interface actions and small system messages. */
export const UI = {
  continue: 'Continuar',
  back: 'Voltar',
  progressLabel: 'Progresso da avaliação',
  stageOf: (current: number, total: number, label: string) =>
    `Etapa ${current} de ${total}: ${label}`,
  selectedCount: (count: number, max: number) => `${count} de ${max} selecionadas`,
  describeOther: 'Descreva “Outro” em poucas palavras',
  restartConfirm: 'Recomeçar? Suas respostas atuais serão apagadas.',
}

export const VALIDATION = {
  textRequired: 'Escreva uma resposta curta para continuar.',
  multiRequired: 'Selecione pelo menos uma opção para continuar.',
  singleRequired: 'Selecione a opção mais próxima da sua experiência para continuar.',
  tooMany: (max: number) => `Selecione até ${max} opções.`,
  otherText: 'Descreva “Outro” em poucas palavras ou desmarque essa opção.',
  firstName: 'Informe seu nome.',
  email: 'Informe seu e-mail.',
  emailFormat: 'Este e-mail parece incompleto. Confira, por favor.',
  role: 'Informe seu cargo ou área profissional.',
}

/** Progress stages shown in the progress rail. */
export const STAGES = [
  { id: 'context', label: 'Contexto' },
  { id: 'readiness', label: 'Comunicação' },
  { id: 'friction', label: 'Fricção' },
  { id: 'training', label: 'Treino' },
  { id: 'result', label: 'Resultado' },
] as const

export type StageId = (typeof STAGES)[number]['id']

export const SECTION_META: Record<
  StageId,
  { number: string; title: string; note: string[] }
> = {
  context: {
    number: '02',
    title: 'Contexto profissional',
    note: [
      'Onde o inglês precisa funcionar.',
      'Estas respostas ajudam a contextualizar seu mapa — elas não entram no cálculo das dimensões.',
    ],
  },
  readiness: {
    number: '03',
    title: 'Communication Readiness',
    note: [
      'Escolha a opção que mais se aproxima do que costuma acontecer — não do que você gostaria que acontecesse.',
    ],
  },
  friction: {
    number: '04',
    title: 'Fricção percebida',
    note: [
      'O que você percebe como obstáculo. Fica separado do padrão das suas respostas.',
    ],
  },
  training: {
    number: '05',
    title: 'Prontidão para o treino',
    note: [
      'Agora não estamos avaliando sua comunicação.',
      'Queremos entender se este é um momento viável para praticar de forma deliberada e consistente.',
    ],
  },
  result: {
    number: '06',
    title: 'Acesso ao resultado',
    note: [],
  },
}

/**
 * Dimension names stay in English as methodological labels, paired with
 * PT-BR for clarity.
 */
export const DIMENSIONS: Record<
  DimensionId,
  { label: string; labelPt: string; question: string }
> = {
  clarity: {
    label: 'Clarity',
    labelPt: 'Clareza',
    question: 'Você consegue transformar uma ideia em uma mensagem que outra pessoa acompanha?',
  },
  interaction: {
    label: 'Interaction',
    labelPt: 'Interação',
    question: 'Você consegue responder, esclarecer, se recuperar e sustentar uma troca?',
  },
  access: {
    label: 'Access Under Pressure',
    labelPt: 'Acesso sob pressão',
    question:
      'Você consegue acessar o inglês que já conhece quando tempo, incerteza ou interação criam pressão?',
  },
  independence: {
    label: 'Independence',
    labelPt: 'Independência',
    question: 'De quanto suporte você precisa antes ou durante a comunicação?',
  },
  transfer: {
    label: 'Transfer',
    labelPt: 'Transferência',
    question:
      'O que você pratica aparece no contexto profissional em que realmente importa?',
  },
}

/** "Clarity — Clareza" */
export const dimensionName = (id: DimensionId) =>
  `${DIMENSIONS[id].label} — ${DIMENSIONS[id].labelPt}`

export const DIMENSION_ORDER: DimensionId[] = [
  'clarity',
  'interaction',
  'access',
  'independence',
  'transfer',
]

/** Ordered from least to most stable — used by the dimension map scale. */
export const DIMENSION_STATES: { id: DimensionState; label: string }[] = [
  { id: 'priority', label: 'A observar' },
  { id: 'developing', label: 'Em desenvolvimento' },
  { id: 'functional', label: 'Funcional' },
  { id: 'strong', label: 'Mais estável' },
]

export const TRAINING_READINESS_LABELS: Record<
  TrainingReadinessLevel,
  { label: string; text: string }
> = {
  high: {
    label: 'Alta',
    text: 'Pelo que você relatou, suas condições atuais parecem favorecer prática deliberada regular, com repetição, gravação e feedback.',
  },
  moderate: {
    label: 'Moderada',
    text: 'Pelo que você relatou, a prática deliberada parece viável com alguns ajustes — por exemplo, reservar tempo na rotina ou se acostumar com gravação e repetição.',
  },
  constrained: {
    label: 'Condições atuais limitadas',
    text: 'Pelo que você relatou, as condições atuais — tempo, ambiente ou acesso prático — podem dificultar uma prática deliberada regular neste momento. Isso descreve circunstâncias, não comprometimento.',
  },
}

export const CONTEXT_LABELS: Record<ContextKey, string> = {
  meetings: 'Reuniões',
  interviews: 'Entrevistas de emprego',
  presentations: 'Apresentações',
  clients: 'Conversas com clientes',
  technical: 'Explicações técnicas',
  leadership: 'Conversas com liderança',
  networking: 'Networking',
  negotiation: 'Negociação',
  other: 'Outro',
}

export const CONTACT_COPY = {
  headline: 'Seu mapa está pronto.',
  explanation:
    'Antes de mostrar a leitura completa, precisamos de algumas informações para identificar seu resultado.',
  fields: {
    firstName: 'Nome',
    email: 'E-mail',
    role: 'Cargo ou área profissional',
  },
  usage: 'Suas respostas serão usadas para gerar seu Communication Readiness Map inicial.',
  // Accurate for the MVP, where nothing is submitted. Update when submission is added.
  privacy:
    'Nesta versão de teste, seus dados e respostas ficam apenas nesta sessão do navegador. Esta tela não inclui consentimento para comunicações de marketing.',
  cta: 'Ver meu mapa',
}
