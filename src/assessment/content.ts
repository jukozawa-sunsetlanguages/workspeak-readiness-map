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

/**
 * Official WhatsApp number for the result conversation CTA: digits only, with
 * country and area code (e.g. 55 + DDD + number). While it
 * is empty, the CTA is hidden on the Results page and in the email, so no
 * dead or placeholder link is ever shown.
 */
export const WHATSAPP_NUMBER = '+5511977266232'

export const WHATSAPP_MESSAGE =
  'Oi, Juliana! Fiz o Communication Readiness Map e quero entender quais práticas WorkSpeak fazem sentido para o meu resultado.'

/** wa.me click-to-chat link with the pre-filled message, or null if unset. */
export function whatsappUrl(): string | null {
  const digits = WHATSAPP_NUMBER.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}` : null
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
      'Estas respostas ajudam a contextualizar seu mapa e não entram no cálculo das dimensões.',
    ],
  },
  readiness: {
    number: '03',
    title: 'Communication Readiness',
    note: [
      'Escolha a opção que mais se aproxima do que costuma acontecer, e não do que você gostaria que acontecesse.',
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
 * Dimension names stay in English as methodological labels; the explanatory
 * question is PT-BR.
 */
export const DIMENSIONS: Record<
  DimensionId,
  { label: string; question: string }
> = {
  clarity: {
    label: 'Clarity',
    question: 'Você consegue transformar uma ideia em uma mensagem que outra pessoa acompanha?',
  },
  interaction: {
    label: 'Interaction',
    question: 'Você consegue responder, esclarecer, se recuperar e sustentar uma troca?',
  },
  access: {
    label: 'Access Under Pressure',
    question:
      'Você consegue acessar o inglês que já conhece quando tempo, incerteza ou interação criam pressão?',
  },
  independence: {
    label: 'Independence',
    question: 'De quanto suporte você precisa antes ou durante a comunicação?',
  },
  transfer: {
    label: 'Transfer',
    question:
      'O que você pratica aparece no contexto profissional em que realmente importa?',
  },
}

/** Participant-facing dimension name: the English methodological label only. */
export const dimensionName = (id: DimensionId) => DIMENSIONS[id].label

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
    text: 'Pelo que você relatou, a prática deliberada parece viável com alguns ajustes, como reservar tempo na rotina ou se acostumar com gravação e repetição.',
  },
  constrained: {
    label: 'Condições atuais limitadas',
    text: 'Pelo que você relatou, fatores como tempo, ambiente ou acesso prático podem dificultar uma prática deliberada regular neste momento. Isso descreve circunstâncias, não comprometimento.',
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
  privacy:
    'Usaremos seus dados e respostas para gerar, armazenar e enviar seu Communication Readiness Map.',
  /** Optional, unchecked by default, and independent of result delivery. */
  marketingConsent:
    'Quero receber conteúdos e novidades da Sunset Languages sobre comunicação profissional em inglês.',
  cta: 'Ver meu mapa',
}

/**
 * Result labels and fixed result copy. Shared by the on-screen Results and the
 * result email so both present the same interpretation.
 */
export const RESULT_COPY = {
  currentPattern: 'Seu padrão atual relatado',
  hypothesisNote:
    'Esta é uma hipótese inicial baseada nas suas respostas. Não é um diagnóstico de proficiência.',
  observation: 'O que suas respostas sugerem',
  strongest: 'Dimensão mais estável',
  primary: 'Padrão prioritário para observar',
  secondary: 'Padrão secundário para observar',
  noPrimary: 'Nenhum padrão prioritário claro',
  noSecondary: 'Nenhum padrão secundário claro',
  hypothesis: 'Hipótese de trabalho',
  trainingPriority: 'Prioridade de treino',
  trainingReadiness: 'Prontidão para o treino',
  nextEvidence: {
    label: 'Próxima evidência',
    title: 'O que valeria observar agora?',
    body: 'Este Map parte do que você relatou sobre sua comunicação e cria uma hipótese inicial. A performance real de comunicação pode oferecer evidências mais fortes. Uma tarefa curta de performance pode ajudar a observar se esse mesmo padrão aparece quando você precisa usar inglês em tempo real.',
  },
  map: {
    label: 'Seu mapa',
    title: 'Cinco dimensões de trabalho',
    note: 'Leituras qualitativas baseadas no que você relatou. Elas descrevem comportamentos relatados, não desempenho medido.',
    primaryTag: 'Prioritário para observar',
    secondaryTag: 'Secundário',
  },
  nextStep: 'Próximo passo',
  /** Methodology-level next step, identical for every participant. */
  nextFocus: {
    title: 'Seu próximo foco',
    body: [
      'Este mapa é uma leitura inicial baseada no que você relatou sobre sua comunicação. Seu próximo passo é observar como esse padrão aparece em situações reais e produzir evidências de performance.',
      'A partir daqui, práticas, ferramentas ou experiências WorkSpeak podem ajudar você a trabalhar o padrão identificado e comparar percepção com desempenho real.',
    ],
  },
  /** Same for every participant; links to `whatsappUrl()`. */
  conversation: {
    title: 'Quer trabalhar o padrão que apareceu no seu mapa?',
    body: 'As práticas e ferramentas WorkSpeak são desenhadas para transformar padrões como este em treino aplicado a situações profissionais reais.',
    cta: 'Quero entender meu próximo passo →',
  },
  methodNote:
    'Este Map é baseado em autorrelato. Não é um teste de proficiência em inglês, uma avaliação CEFR nem um instrumento psicométrico validado. Considere-o uma hipótese de trabalho inicial.',
}

/** Restrained status line for the emailed copy of the result. */
export const DELIVERY_COPY = {
  pending: 'Enviando uma cópia do seu mapa por e-mail.',
  sent: (email: string) => `Enviamos uma cópia do seu mapa para ${email}.`,
  failed:
    'Seu resultado está disponível nesta página. Não conseguimos enviar a cópia por e-mail neste momento.',
  retry: 'Tentar enviar novamente',
}
