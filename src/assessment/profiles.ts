/**
 * Result copy, keyed by the PRIMARY pattern to observe (participant copy in PT-BR).
 *
 * PLACEHOLDER PROFILES — REQUIRE WORKSPEAK REVIEW BEFORE COMMERCIAL USE.
 * This Map is self-report only. Keep all language hypothesis-framed
 * ("Suas respostas sugerem…", "pode", "vale observar se…") and never claim
 * that English knowledge, proficiency, confidence or motivation was measured.
 *
 * `patternName` is the internal WorkSpeak profile name (kept in English for
 * data/methodology); `patternLabel` is the participant-facing PT-BR label.
 */
import type { ContextKey, DimensionId } from './types'

export interface Profile {
  patternName: string
  patternLabel: string
  observation: string
  hypothesis: string
  trainingPriority: { title: string; detail: string }
  workExamples: Partial<Record<ContextKey, string>>
}

export const PROFILES: Record<DimensionId, Profile> = {
  access: {
    patternName: 'Knowledge-rich, Access-limited',
    patternLabel: 'Padrão sensível ao acesso sob pressão',
    observation:
      'Entre os comportamentos explorados neste Map, suas respostas apontaram com mais frequência para situações de acesso sob pressão: momentos em que o tempo é curto ou a conversa avança rápido. Você relatou com mais frequência pausas, respostas mais curtas ou ideias deixadas de lado nesses momentos.',
    hypothesis:
      'Uma hipótese de trabalho é que parte da sua comunicação fique menos disponível quando você precisa recuperar e organizar o inglês em tempo real. Vale observar se esse padrão aparece com mais força em perguntas inesperadas do que em situações que você consegue preparar.',
    trainingPriority: {
      title: 'Início rápido de resposta + estrutura simples em tempo real',
      detail:
        'Um comportamento que vale testar é começar uma resposta com uma estrutura simples e sustentá-la, mesmo quando a palavra exata não vem de imediato.',
    },
    workExamples: {
      meetings: 'Pode acontecer de você saber o que quer contribuir, mas entrar na discussão depois do momento que pretendia.',
      interviews: 'Respostas preparadas podem parecer estáveis, enquanto perguntas de acompanhamento inesperadas pedem mais tempo de organização.',
      clients: 'Vale observar se você simplifica ideias que gostaria de explicar com mais nuance.',
      presentations: 'A parte preparada pode fluir bem, enquanto as perguntas no final pedem mais tempo para responder.',
      technical: 'Pode haver pausas enquanto você procura o termo técnico preciso.',
      leadership: 'Quando pedem uma opinião rápida, sua resposta pode sair mais curta do que você gostaria.',
      networking: 'A conversa pode ficar em um nível mais geral quando aprofundar exige resposta rápida.',
      negotiation: 'Vale observar se você identifica o momento de responder, mas chega a ele quando a conversa já avançou.',
    },
  },
  interaction: {
    patternName: 'Prepared-stable, Interaction-sensitive',
    patternLabel: 'Mais estável no que é preparado, sensível à interação',
    observation:
      'Entre os comportamentos explorados neste Map, suas respostas apontaram com mais frequência para momentos em que a outra pessoa muda o rumo da conversa. Você relatou mais quebras diante de perguntas de acompanhamento, interrupções ou trechos que não ficaram totalmente claros.',
    hypothesis:
      'Uma hipótese de trabalho é que o ponto a observar esteja menos no que você diz e mais em sustentar a troca — responder, esclarecer e retomar sua linha de raciocínio quando a conversa muda de direção.',
    trainingPriority: {
      title: 'Recuperação + continuidade na troca ao vivo',
      detail:
        'Um comportamento que vale testar é responder a uma pergunta ou interrupção e, em seguida, voltar de forma explícita ao ponto que você estava desenvolvendo.',
    },
    workExamples: {
      meetings: 'Depois de uma interrupção, pode acontecer de o seu ponto original não voltar à discussão.',
      interviews: 'Uma pergunta de acompanhamento pode afastar a resposta do exemplo que você preparou.',
      clients: 'Quando um cliente pede esclarecimento, vale observar se você encurta a explicação em vez de reconstruí-la.',
      presentations: 'A apresentação pode ser estável, enquanto a parte de perguntas parece menos estruturada.',
      technical: 'Perguntas no meio de uma explicação podem dificultar a conclusão da sequência.',
      leadership: 'Perguntas rápidas da liderança podem levar você a concordar antes de expressar sua visão por completo.',
      networking: 'Conversas podem terminar antes do que você gostaria quando continuar exige mais esforço.',
      negotiation: 'Uma contraproposta pode mudar o rumo da conversa antes de você retomar sua posição.',
    },
  },
  clarity: {
    patternName: 'Idea-rich, Structure-limited',
    patternLabel: 'Padrão sensível à estrutura da mensagem',
    observation:
      'Entre os comportamentos explorados neste Map, suas respostas apontaram com mais frequência para o caminho entre a ideia e a mensagem. Você relatou situações em que o ponto principal demora a aparecer, a explicação se alonga ou parte da ideia fica incompleta.',
    hypothesis:
      'Uma hipótese de trabalho é que a organização da mensagem seja um ponto relevante para observar. Esse padrão pode aparecer com mais força quando a ideia é complexa ou precisa ser adaptada para um interlocutor específico.',
    trainingPriority: {
      title: 'Estrutura da mensagem + ponto principal primeiro',
      detail:
        'Um comportamento que vale testar é se começar pelo ponto principal e usar frases mais curtas torna suas explicações mais fáceis de acompanhar.',
    },
    workExamples: {
      meetings: 'Suas contribuições podem começar pelo contexto, e o ponto principal chegar quando a atenção já mudou.',
      interviews: 'As respostas podem ter o conteúdo certo, mas levar mais tempo para chegar à conclusão.',
      clients: 'Vale observar se explicações corretas ficam mais difíceis de acompanhar do que você pretende.',
      presentations: 'Os slides podem estar claros, enquanto as transições faladas entre ideias ficam menos diretas.',
      technical: 'Os detalhes podem vir antes da visão geral, o que pode dificultar o acompanhamento da lógica.',
      leadership: 'Atualizações podem ficar mais longas do que a liderança espera, com a decisão principal menos visível.',
      networking: 'Descrever o que você faz pode levar algumas tentativas até soar preciso.',
      negotiation: 'Sua posição pode estar presente no que você diz, mas não aparecer com clareza suficiente para orientar a conversa.',
    },
  },
  independence: {
    patternName: 'Capable, Support-dependent',
    patternLabel: 'Funcional com suporte, sensível à autonomia',
    observation:
      'Entre os comportamentos explorados neste Map, suas respostas apontaram com mais frequência para o papel do suporte — roteiros, anotações, tradução ou a ajuda de outra pessoa. Você relatou que a comunicação tende a funcionar melhor quando esse suporte está disponível.',
    hypothesis:
      'Uma hipótese de trabalho é que a preparação esteja sustentando uma parte grande da sua comunicação. Vale observar o que acontece quando você precisa continuar sem roteiro ou simplificar uma mensagem por conta própria.',
    trainingPriority: {
      title: 'Menos preparação + recuperação com autonomia',
      detail:
        'Um comportamento que vale testar é falar a partir de alguns pontos-chave e continuar com uma versão mais simples quando o inglês exato não estiver disponível.',
    },
    workExamples: {
      meetings: 'Pode ser mais fácil contribuir em itens da pauta que você preparou do que em discussões abertas.',
      interviews: 'Respostas memorizadas podem parecer estáveis, enquanto perguntas não planejadas parecem menos.',
      clients: 'Vale observar se você prefere retomar um ponto por escrito em vez de resolvê-lo durante a ligação.',
      presentations: 'A apresentação pode depender de ficar próxima do roteiro.',
      technical: 'Você pode recorrer à documentação escrita para explicar algo que também poderia explicar falando.',
      leadership: 'Você pode preferir se preparar antes de falar com a liderança, mesmo em atualizações de rotina.',
      networking: 'Conversas sem roteiro podem parecer mais difíceis de sustentar do que as estruturadas.',
      negotiation: 'Você pode depender de uma posição preparada e sentir mais dificuldade para ajustá-la no momento.',
    },
  },
  transfer: {
    patternName: 'Practice-stable, Transfer-limited',
    patternLabel: 'Mais estável na prática, transferência a observar',
    observation:
      'Entre os comportamentos explorados neste Map, suas respostas apontaram com mais frequência para a distância entre o que acontece em aula, treino ou ensaio e o que aparece em situações reais de trabalho.',
    hypothesis:
      'Uma hipótese de trabalho é que a passagem da prática para o uso real seja um ponto relevante para observar. Esse padrão pode aparecer com mais força em situações espontâneas do que em situações preparadas.',
    trainingPriority: {
      title: 'Prática contextualizada + transferência para situações reais',
      detail:
        'Um comportamento que vale testar é se praticar dentro de cenários profissionais realistas ajuda o que foi treinado a aparecer em reuniões, ligações e entrevistas reais.',
    },
    workExamples: {
      meetings: 'Formas de responder que você praticou podem não aparecer quando a discussão acontece ao vivo.',
      interviews: 'Respostas ensaiadas podem parecer estáveis, enquanto a conversa em torno delas parece menos.',
      clients: 'Vale observar se você volta a frases familiares mesmo depois de praticar alternativas.',
      presentations: 'A apresentação ensaiada pode ser diferente de como você se comunica quando as perguntas começam.',
      technical: 'Termos que você usa por escrito podem ser mais difíceis de usar em explicações faladas.',
      leadership: 'O que parece disponível em aula pode ser mais difícil de acessar em conversas de maior impacto.',
      networking: 'Conversas informais que você praticou podem parecer menos naturais em um evento real.',
      negotiation: 'Estruturas que você treinou podem não aparecer quando a conversa fica imprevisível.',
    },
  },
}

/** Used when every dimension is reported as Strong. */
export const BROADLY_STABLE_PROFILE: Omit<Profile, 'workExamples'> = {
  patternName: 'Broadly stable, Refinement-focused',
  patternLabel: 'Amplamente estável, foco em refinamento',
  observation:
    'Dentro das situações apresentadas, suas respostas descreveram uma comunicação relativamente estável na maioria dos comportamentos explorados. Nenhuma dimensão se destacou como padrão prioritário para observar.',
  hypothesis:
    'Uma hipótese de trabalho é que o próximo desenvolvimento esteja mais em refinamento para contextos específicos de alto impacto do que em um padrão consistente entre situações.',
  trainingPriority: {
    title: 'Refinamento direcionado em contextos de alto impacto',
    detail:
      'Um comportamento que vale testar é se a comunicação se mantém tão estável na sua situação mais exigente quanto no uso do dia a dia.',
  },
}

export const NEXT_STEP_COPY = {
  fit: {
    headline: 'Quer observar esse padrão em prática?',
    body: 'O WorkSpeak Bootcamp transforma uma hipótese inicial de comunicação em prática direcionada, observação e evidências ao longo de 30 dias.',
    cta: 'Conhecer o WorkSpeak Bootcamp',
  },
  notYet: {
    headline: 'O Bootcamp talvez não seja seu melhor próximo passo agora.',
    // PLACEHOLDER recommendations — require WorkSpeak review.
    reasons: {
      'training-constrained':
        'Pelo que você relatou, as condições atuais podem dificultar uma prática diária. O Bootcamp depende de prática regular, então pode ser mais útil quando for possível reservar 15–25 minutos na maioria dos dias. Enquanto isso, você pode observar uma situação por semana e anotar onde o padrão aparece.',
      'broadly-stable':
        'Pelo que você relatou, sua comunicação parece relativamente estável nas situações exploradas. Um programa estruturado de 30 dias pode acrescentar menos do que uma preparação direcionada para uma situação específica de alto impacto, como uma entrevista ou apresentação.',
      foundation:
        'Pelo que você relatou, o padrão aparece nas cinco dimensões. O WorkSpeak foi pensado para profissionais que já usam inglês com alguma regularidade no trabalho. Pode valer a pena fortalecer primeiro uma base mais ampla no idioma e depois voltar ao Map.',
      'low-use':
        'Pelo que você relatou, o inglês ainda não faz parte da sua rotina profissional regular. O WorkSpeak funciona melhor quando existem situações reais para testar a prática. Ele pode ser mais útil quando o uso do inglês se tornar mais frequente.',
    },
  },
}
