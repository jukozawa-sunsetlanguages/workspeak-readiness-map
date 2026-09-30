/**
 * ============================================================================
 *  ASSESSMENT ITEMS — CENTRALIZED CONFIGURATION (participant copy in PT-BR)
 * ============================================================================
 *
 *  Communication Readiness items (section 03) are the reviewed WorkSpeak V1
 *  items. Training Readiness items (section 05) are still flagged `draft: true`.
 *
 *  These weights rank self-reported response patterns for MVP interpretation.
 *  They do not represent interval measurement, validated severity,
 *  proficiency or psychometric scoring.
 *
 *  To replace items: edit the arrays below. Components render whatever is
 *  here; interpretation rules only depend on `dimension` and `weight`.
 * ============================================================================
 */
import { CONTEXT_LABELS } from './content'
import type { ContextKey, Question } from './types'

const contextOptions = (keys: ContextKey[]) =>
  keys.map((k) => ({ id: k, label: CONTEXT_LABELS[k], opensText: k === 'other' }))

const ALL_CONTEXTS: ContextKey[] = [
  'meetings',
  'interviews',
  'presentations',
  'clients',
  'technical',
  'leadership',
  'networking',
  'negotiation',
]

/* -------------------------------------------------------------------------- */
/*  02 — PROFESSIONAL CONTEXT (context only — never scored)                    */
/* -------------------------------------------------------------------------- */

export const CONTEXT_QUESTIONS: Question[] = [
  {
    id: 'ctx_matters_most',
    section: 'context',
    kind: 'multi',
    maxSelections: 3,
    prompt: 'Onde o inglês mais importa na sua vida profissional hoje?',
    helper: 'Selecione até 3.',
    options: contextOptions([...ALL_CONTEXTS, 'other']),
  },
  {
    id: 'ctx_frequency',
    section: 'context',
    kind: 'single',
    prompt: 'Com que frequência você usa inglês no trabalho hoje?',
    options: [
      { id: 'rarely', label: 'Raramente ou nunca' },
      { id: 'monthly', label: 'Algumas vezes por mês' },
      { id: 'weekly', label: 'Algumas vezes por semana' },
      { id: 'almost_daily', label: 'Quase todos os dias' },
      { id: 'daily', label: 'Todos os dias' },
    ],
  },
  {
    id: 'ctx_most_demanding',
    section: 'context',
    kind: 'single',
    prompt: 'Qual situação mais exige de você hoje?',
    options: contextOptions(ALL_CONTEXTS),
  },
  {
    id: 'ctx_unprepared',
    section: 'context',
    kind: 'single',
    prompt: 'Com que frequência você precisa responder sem ter tempo de se preparar?',
    options: [
      { id: 'rarely', label: 'Raramente (a maioria das situações pode ser preparada)' },
      { id: 'sometimes', label: 'Às vezes (algumas vezes por mês)' },
      { id: 'often', label: 'Com frequência (na maioria das semanas)' },
      { id: 'constantly', label: 'Constantemente (faz parte da maioria das conversas)' },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*  03 — COMMUNICATION READINESS (ASSESSMENT PATTERN) — reviewed V1 items      */
/*  Weight (internal only): 3 = more functional / stable reported behavior,    */
/*  2 = functional with some friction, 1 = relevant reported breakdown,        */
/*  0 = strong reported breakdown.                                             */
/*  These weights rank self-reported response patterns for MVP                 */
/*  interpretation. They do not represent interval measurement, validated      */
/*  severity, proficiency or psychometric scoring.                             */
/*  Option order is intentional and must NOT be sorted by weight.              */
/* -------------------------------------------------------------------------- */

export const READINESS_QUESTIONS: Question[] = [
  // ---- CLARITY -------------------------------------------------------------
  {
    id: 'clr_complex_idea',
    section: 'readiness',
    dimension: 'clarity',
    kind: 'single',
    prompt:
      'Quando você precisa explicar uma ideia complexa em inglês no trabalho, o que costuma acontecer?',
    options: [
      { id: 'a', weight: 2, label: 'Consigo transmitir a ideia, mas às vezes preciso reorganizar parte da explicação para deixá-la clara.' },
      { id: 'b', weight: 1, label: 'Costumo começar pelos detalhes ou contexto, e o ponto principal demora a aparecer.' },
      { id: 'c', weight: 3, label: 'Geralmente apresento o ponto principal primeiro e acrescento detalhes conforme necessário.' },
      { id: 'd', weight: 0, label: 'Costumo construir frases longas, perder o fio da explicação e deixar parte da ideia incompleta.' },
    ],
  },
  {
    id: 'clr_adapt_listener',
    section: 'readiness',
    dimension: 'clarity',
    kind: 'single',
    prompt:
      'Quando você precisa explicar o mesmo assunto para interlocutores diferentes (por exemplo, um colega próximo e uma liderança), o que costuma acontecer?',
    options: [
      { id: 'a', weight: 1, label: 'Costumo manter praticamente a mesma explicação, mesmo quando o interlocutor precisaria de outro nível de detalhe.' },
      { id: 'b', weight: 3, label: 'Consigo ajustar o nível de detalhe, os exemplos e a linguagem de acordo com o interlocutor.' },
      { id: 'c', weight: 0, label: 'Tento simplificar, mas às vezes retiro informações importantes para a compreensão.' },
      { id: 'd', weight: 2, label: 'Consigo adaptar a explicação, mas ela costuma ficar mais longa do que o necessário.' },
    ],
  },

  // ---- INTERACTION ---------------------------------------------------------
  {
    id: 'int_follow_up',
    section: 'readiness',
    dimension: 'interaction',
    kind: 'single',
    prompt:
      'Quando alguém faz uma pergunta de acompanhamento que muda ou aprofunda o rumo da conversa, o que costuma acontecer?',
    options: [
      { id: 'a', weight: 3, label: 'Consigo responder à nova pergunta e conectá-la ao que já estava discutindo.' },
      { id: 'b', weight: 2, label: 'Consigo responder, mas minha resposta tende a ficar mais curta ou menos desenvolvida do que eu gostaria.' },
      { id: 'c', weight: 1, label: 'Respondo à pergunta, mas tenho dificuldade para retomar ou conectar minha resposta ao restante da conversa.' },
      { id: 'd', weight: 0, label: 'A mudança de direção costuma quebrar minha participação e tenho dificuldade para continuar a troca.' },
    ],
  },
  {
    id: 'int_interrupted',
    section: 'readiness',
    dimension: 'interaction',
    kind: 'single',
    prompt: 'Quando alguém interrompe você no meio de uma explicação, o que costuma acontecer?',
    options: [
      { id: 'a', weight: 2, label: 'Respondo à interrupção, mas frequentemente não volto ao ponto original.' },
      { id: 'b', weight: 0, label: 'Costumo deixar a outra pessoa assumir a conversa e não retomo minha ideia.' },
      { id: 'c', weight: 3, label: 'Respondo à interrupção e depois retomo o ponto em que estava.' },
      { id: 'd', weight: 1, label: 'Perco o fio e preciso reconstruir a explicação desde o início.' },
    ],
  },
  {
    id: 'int_clarify',
    section: 'readiness',
    dimension: 'interaction',
    kind: 'single',
    prompt:
      'Quando você não entende completamente o que alguém acabou de dizer em inglês, o que costuma fazer?',
    options: [
      { id: 'a', weight: 1, label: 'Respondo com base no que acho que a pessoa quis dizer e vejo se a conversa continua fazendo sentido.' },
      { id: 'b', weight: 3, label: 'Faço uma pergunta específica para esclarecer o que não entendi e continuo a conversa a partir disso.' },
      { id: 'c', weight: 0, label: 'Costumo concordar ou ficar em silêncio e tento esclarecer depois, por mensagem ou com outra pessoa.' },
      { id: 'd', weight: 2, label: 'Peço para a pessoa repetir, mas às vezes continuo sem confirmar exatamente a parte que não entendi.' },
    ],
  },

  // ---- ACCESS UNDER PRESSURE -----------------------------------------------
  // Framed as observable behavior, not as anxiety.
  {
    id: 'acc_word_missing',
    section: 'readiness',
    dimension: 'access',
    kind: 'single',
    prompt:
      'Durante uma conversa ao vivo, você precisa de uma palavra específica em inglês e ela não vem. O que costuma acontecer?',
    options: [
      { id: 'a', weight: 1, label: 'Paro tentando encontrar a palavra exata e a fala perde continuidade.' },
      { id: 'b', weight: 3, label: 'Descrevo a ideia de outra forma e continuo falando.' },
      { id: 'c', weight: 2, label: 'Faço uma breve pausa, encontro uma alternativa e continuo.' },
      { id: 'd', weight: 0, label: 'Abandono aquela ideia e passo para algo mais simples de dizer.' },
    ],
  },
  {
    id: 'acc_opinion_no_notice',
    section: 'readiness',
    dimension: 'access',
    kind: 'single',
    prompt:
      'Em uma reunião em inglês, pedem sua opinião sem que você tenha se preparado para responder. O que costuma acontecer?',
    options: [
      { id: 'a', weight: 2, label: 'Demoro um pouco para começar, mas depois consigo desenvolver a resposta.' },
      { id: 'b', weight: 1, label: 'Sei o que quero dizer, mas quando consigo organizar a resposta em inglês a conversa já avançou.' },
      { id: 'c', weight: 0, label: 'Dou uma resposta muito curta ou concordo com alguém para evitar ficar muito tempo em silêncio.' },
      { id: 'd', weight: 3, label: 'Dou uma primeira resposta e desenvolvo o raciocínio enquanto falo.' },
    ],
  },
  {
    id: 'acc_self_correction',
    section: 'readiness',
    dimension: 'access',
    kind: 'single',
    prompt: 'Quando percebe um erro enquanto fala inglês sob pressão, o que costuma acontecer?',
    options: [
      { id: 'a', weight: 3, label: 'Se a mensagem continua clara, normalmente sigo falando sem interromper o raciocínio.' },
      { id: 'b', weight: 2, label: 'Corrijo quando considero necessário e geralmente consigo continuar de onde estava.' },
      { id: 'c', weight: 1, label: 'Costumo voltar e reconstruir parte da frase, o que às vezes quebra o ritmo da resposta.' },
      { id: 'd', weight: 0, label: 'A correção frequentemente passa a ocupar minha atenção e eu perco parte do raciocínio que estava desenvolvendo.' },
    ],
  },

  // ---- INDEPENDENCE --------------------------------------------------------
  {
    id: 'ind_preparation',
    section: 'readiness',
    dimension: 'independence',
    kind: 'single',
    prompt:
      'Antes de uma conversa profissional importante em inglês, de quanto suporte você costuma precisar para conseguir se comunicar como pretende?',
    options: [
      { id: 'a', weight: 1, label: 'Preciso preparar grande parte do que vou dizer em frases completas para conseguir conduzir a conversa.' },
      { id: 'b', weight: 3, label: 'Alguns pontos-chave costumam ser suficientes; consigo desenvolver o restante durante a conversa.' },
      { id: 'c', weight: 0, label: 'Costumo formular primeiro em português e depois traduzir o que pretendo dizer.' },
      { id: 'd', weight: 2, label: 'Preparo as ideias principais e algumas expressões específicas, mas consigo adaptar o restante durante a conversa.' },
    ],
  },
  {
    id: 'ind_language_unavailable',
    section: 'readiness',
    dimension: 'independence',
    kind: 'single',
    prompt:
      'Durante uma conversa, você não consegue acessar exatamente o inglês de que precisa. O que costuma fazer?',
    options: [
      { id: 'a', weight: 2, label: 'Continuo com uma versão mais simples e, se necessário, complemento alguma precisão depois por escrito.' },
      { id: 'b', weight: 0, label: 'Frequentemente outra pessoa precisa assumir ou completar a explicação por mim.' },
      { id: 'c', weight: 1, label: 'Preciso consultar tradução ou minhas anotações antes de conseguir continuar.' },
      { id: 'd', weight: 3, label: 'Reformulo a mensagem com os recursos que tenho e continuo a conversa.' },
    ],
  },

  // ---- TRANSFER ------------------------------------------------------------
  {
    id: 'trf_practice_to_work',
    section: 'readiness',
    dimension: 'transfer',
    kind: 'single',
    prompt:
      'Quando você pratica uma nova forma de responder, explicar ou organizar uma ideia em inglês, o que costuma acontecer depois em uma situação real de trabalho?',
    options: [
      { id: 'a', weight: 2, label: 'Consigo usar parte do que pratiquei, mas normalmente primeiro em situações mais controladas ou por escrito.' },
      { id: 'b', weight: 0, label: 'Na situação real, costumo voltar automaticamente ao mesmo padrão de comunicação que já usava antes.' },
      { id: 'c', weight: 3, label: 'Geralmente consigo experimentar o que pratiquei em uma situação real pouco tempo depois.' },
      { id: 'd', weight: 1, label: 'Durante o treino sei o que deveria fazer, mas na situação real raramente consigo acessar esse novo comportamento.' },
    ],
  },
  {
    id: 'trf_prepared_vs_spontaneous',
    section: 'readiness',
    dimension: 'transfer',
    kind: 'single',
    prompt:
      'Comparando situações preparadas (como aulas, ensaios ou apresentações planejadas) com situações espontâneas de trabalho, o que costuma acontecer?',
    options: [
      { id: 'a', weight: 1, label: 'Quando estou preparado(a), minha comunicação funciona bem, mas perde bastante estabilidade quando algo sai do planejado.' },
      { id: 'b', weight: 3, label: 'Minha comunicação tende a permanecer relativamente estável nos dois tipos de situação.' },
      { id: 'c', weight: 2, label: 'Em situações espontâneas perco um pouco de precisão, mas consigo sustentar a comunicação.' },
      { id: 'd', weight: 0, label: 'Boa parte do que consigo fazer em aula, treino ou ensaio não aparece quando preciso usar inglês espontaneamente no trabalho.' },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*  04 — PERCEIVED FRICTION (SELF-PERCEIVED — not used to compute the pattern) */
/* -------------------------------------------------------------------------- */

export const FRICTION_QUESTIONS: Question[] = [
  {
    id: 'frc_obstacles',
    section: 'friction',
    kind: 'multi',
    maxSelections: 2,
    prompt: 'O que mais costuma atrapalhar quando você precisa se comunicar em inglês no trabalho?',
    helper: 'Escolha até 2.',
    options: [
      { id: 'finding_words', label: 'Encontrar as palavras com rapidez' },
      { id: 'organizing_thoughts', label: 'Organizar meu raciocínio' },
      { id: 'understanding', label: 'Entender a outra pessoa' },
      { id: 'fear_mistakes', label: 'Medo de errar' },
      { id: 'structuring', label: 'Estruturar minha mensagem' },
      { id: 'keeping_going', label: 'Sustentar minha resposta' },
      { id: 'recovering', label: 'Me recuperar quando algo sai do planejado' },
      { id: 'lack_practice', label: 'Falta de prática em situações reais' },
      { id: 'vocabulary', label: 'Vocabulário' },
      { id: 'other', label: 'Outro', opensText: true },
    ],
  },
  {
    id: 'frc_focus_situation',
    section: 'friction',
    kind: 'text',
    optional: true,
    prompt:
      'Se pudesse melhorar uma situação de comunicação profissional nos próximos 30 dias, qual seria?',
    helper: 'Uma frase curta é suficiente.',
    placeholder: 'Por exemplo: dar atualizações na reunião semanal do projeto',
  },
]

/* -------------------------------------------------------------------------- */
/*  05 — TRAINING READINESS (behavioral feasibility — not motivation)          */
/*  DRAFT — REQUIRES WORKSPEAK REVIEW BEFORE COMMERCIAL USE                    */
/*  Weight: 2 = feasible now, 1 = feasible with adjustment, 0 = constrained.   */
/* -------------------------------------------------------------------------- */

export const TRAINING_QUESTIONS: Question[] = [
  {
    id: 'trn_time',
    section: 'training',
    draft: true,
    kind: 'single',
    prompt:
      'Em uma semana típica, o quanto é realista reservar 15–25 minutos de prática focada na maioria dos dias?',
    options: [
      { id: 'a', weight: 2, label: 'Realista: consigo reservar esse tempo.' },
      { id: 'b', weight: 1, label: 'Possível em alguns dias, mas não na maioria.' },
      { id: 'c', weight: 0, label: 'Difícil no momento, por causa da carga de trabalho ou de outros compromissos.' },
    ],
  },
  {
    id: 'trn_repetition',
    section: 'training',
    draft: true,
    kind: 'single',
    prompt:
      'Parte da prática envolve repetir a mesma tarefa de comunicação várias vezes, com pequenos ajustes. O que você provavelmente faria?',
    options: [
      { id: 'a', weight: 1, label: 'Faria, embora a repetição possa parecer lenta.' },
      { id: 'b', weight: 2, label: 'Repetiria e observaria o que muda de uma tentativa para outra.' },
      { id: 'c', weight: 0, label: 'Seguiria em frente depois de uma ou duas tentativas.' },
    ],
  },
  {
    id: 'trn_recording',
    section: 'training',
    draft: true,
    kind: 'single',
    prompt: 'Algumas tarefas pedem que você grave uma resposta curta em áudio ou vídeo. O que é mais provável?',
    options: [
      { id: 'a', weight: 2, label: 'Eu gravaria e revisaria a gravação.' },
      { id: 'b', weight: 1, label: 'Eu gravaria, mas talvez evitasse ouvir depois.' },
      { id: 'c', weight: 0, label: 'Gravar não é viável para mim agora (privacidade, ambiente ou equipamento).' },
    ],
  },
  {
    id: 'trn_weakness_exposed',
    section: 'training',
    draft: true,
    kind: 'single',
    prompt:
      'Se uma prática deixasse evidente um ponto frágil da sua comunicação, o que você provavelmente faria?',
    options: [
      { id: 'a', weight: 0, label: 'Me concentraria em tarefas em que já me saio bem.' },
      { id: 'b', weight: 2, label: 'Trataria isso como informação e tentaria a tarefa de novo com um ajuste.' },
      { id: 'c', weight: 1, label: 'Faria uma pausa e voltaria a ela depois.' },
    ],
  },
  {
    id: 'trn_feedback',
    section: 'training',
    draft: true,
    kind: 'single',
    prompt: 'Quando você recebe um feedback específico sobre como se comunicou, o que costuma acontecer?',
    options: [
      { id: 'a', weight: 2, label: 'Tento aplicar uma mudança concreta na próxima vez.' },
      { id: 'b', weight: 1, label: 'Entendo, mas preciso de alguns lembretes para conseguir aplicar.' },
      { id: 'c', weight: 1, label: 'Tenho dificuldade de usar se não vier com um exemplo prático.' },
      { id: 'd', weight: 0, label: 'Raramente tenho oportunidade de aplicar antes da próxima situação.' },
    ],
  },
]

export const QUESTIONS_BY_SECTION = {
  context: CONTEXT_QUESTIONS,
  readiness: READINESS_QUESTIONS,
  friction: FRICTION_QUESTIONS,
  training: TRAINING_QUESTIONS,
} as const

export function findQuestion(id: string): Question | undefined {
  return Object.values(QUESTIONS_BY_SECTION)
    .flat()
    .find((q) => q.id === id)
}
