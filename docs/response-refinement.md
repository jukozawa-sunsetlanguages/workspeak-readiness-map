# CRM-v2 — refinamento da coleta e armazenamento

## Resultado e escopo

As 12 perguntas comportamentais mantêm suas perguntas, alternativas, ordem, IDs e pesos.
Cada uma oferece um complemento opcional expansível, com até 1000 caracteres. A escolha
continua obrigatória. Não há interpretação automática nem pontuação do texto aberto.

`CRM-v2` identifica a nova coleta/representação. Clientes antigos sem versão explícita
continuam sendo registrados como `CRM-v1`, com o formato original de IDs/JSON. Não houve
alteração de Bootcamp Fit, Training Readiness, perfis, escores ou recomendações.

## Arquitetura conferida antes da implementação

- `src/assessment/questions.ts`: configuração única das perguntas e opções (`id`, `label`, `weight`).
- `src/components/QuestionScreen.tsx` e `OptionList.tsx`: renderização e seleção nativa de alternativas.
- `src/assessment/useAssessment.ts`: estado por seção/pergunta e persistência em `sessionStorage`.
- `src/assessment/steps.ts`: sequência e validação; alternativa obrigatória permanece igual.
- `src/assessment/interpretation.ts`: cálculo compartilhado pelo navegador e servidor; não alterado.
- `src/assessment/submission.ts`: entrega e repetição de tentativas por `submissionId`.
- `netlify/functions/submit-map.mts`: valida, recalcula, envia o resultado por Resend e grava a linha.
- `src/server/sheetRow.ts`: monta o objeto de armazenamento; nunca calcula o resultado.
- `google-apps-script/Code.gs`: recebe o webhook e associa valores a cabeçalhos por nome.
  Não depende de posições fixas. `findRow_` procura o `submissionId`.

Base examinada: commit `313268b0fca7d867628e22cae5d4b73d8acaf83c`.

## Comportamento e integridade

`Answer.openText` fica associado exclusivamente ao ID da pergunta em `responses.readiness`.
É independente de `Answer.text`, já usado pelos campos antigos e pela opção Outro.
A troca de alternativa preserva `openText`; navegação e recarregamento usam a persistência
já existente, sem invalidar sessões antigas. O disclosure usa `<details>/<summary>` e
textarea com label, foco visível, navegação por teclado e cores/tipografia existentes.
Ao retornar, um complemento preenchido aparece expandido. Limpar o texto não fecha o campo.

O navegador captura somente os labels selecionados da mesma configuração que renderiza.
O servidor valida IDs, versão e correspondência exata do snapshot; divergências são rejeitadas,
sem associar silenciosamente texto de outro instrumento. Versões futuras deverão ter sua
configuração preservada antes de ampliar o suporte; não basta aceitar um novo número de versão.

Textos abertos preservam acentos, inglês/português, tabs e quebras de linha; controles não
textuais são removidos. Há limite de 1000 caracteres por complemento e 128 KiB por envio.
Texto que possa iniciar fórmula recebe escape no aplicativo e novamente no limite de gravação
Apps Script; não há avaliação de fórmulas do lead. O JSON técnico retém o texto validado sem
esse escape de transporte.

Em um `submissionId` já existente, o receiver altera somente os campos de entrega de e-mail.
Ele não sobrescreve respostas, escores, versão, data inicial, notas da trainer ou colunas extras.
O status `sent` não é rebaixado. Respostas alteradas pelo participante continuam gerando um
novo `submissionId` pelo fingerprint já existente da aplicação.

## Estrutura da planilha

Destino: https://docs.google.com/spreadsheets/d/1LnpQLZYsM0Bfej-JxtsBFayK4BhRmEzg8Rm1dDbcd2o/edit

A aba `Responses` tem **63 colunas (A:BK)**, preservando todos os 44 nomes anteriores:

| Resposta selecionada CRM-v2 | Complemento opcional |
|---|---|
| q1Clarity | q1ClarityOpen |
| q2Clarity | q2ClarityOpen |
| q3Interaction | q3InteractionOpen |
| q4Interaction | q4InteractionOpen |
| q5Interaction | q5InteractionOpen |
| q6AccessUnderPressure | q6AccessUnderPressureOpen |
| q7AccessUnderPressure | q7AccessUnderPressureOpen |
| q8AccessUnderPressure | q8AccessUnderPressureOpen |
| q9Independence | q9IndependenceOpen |
| q10Independence | q10IndependenceOpen |
| q11Transfer | q11TransferOpen |
| q12Transfer | q12TransferOpen |

Os 12 pares são adjacentes em K:AH. Os demais campos mantêm seus nomes e ordem relativa.
Ao final, BE:BK contém, nesta ordem:

1. `mostDemandingContext` — texto selecionado em `ctx_most_demanding`;
2. `trainingReadinessTime` — texto selecionado em `trn_time`;
3. `trainingReadinessRepetition` — texto selecionado em `trn_repetition`;
4. `trainingReadinessRecording` — texto selecionado em `trn_recording`;
5. `trainingReadinessWeaknessExposed` — texto selecionado em `trn_weakness_exposed`;
6. `trainingReadinessFeedback` — texto selecionado em `trn_feedback`;
7. `technicalResponses` — JSON de respostas validadas por seção, com `values` (IDs),
   `text` (texto anterior/Outro) e `openText` (complemento comportamental).

`professionalContexts` e `perceivedFrictions` contêm apenas os labels selecionados, separados
por quebra de linha. Frequências e demais respostas únicas recebem seu label completo.
`trainingReadinessResponses` conserva o JSON de IDs usado anteriormente. `notes` conserva
seu JSON suplementar anterior por compatibilidade. Nenhuma alternativa não selecionada é gravada.

As novas colunas ficam vazias nos registros históricos. A aba `Data Dictionary` foi atualizada,
incluindo cada nova coluna, formatos, limites, diferenças de versão e backup.

## Backup e verificação histórica executados

Antes da inserção de qualquer coluna, foi criada uma cópia integral do arquivo:
https://docs.google.com/spreadsheets/d/1pmimeZUXsHsmBeCIro9rpwX1Jzftr6BrtAb1RNUfUYM/edit

Foram comparadas **308 células originais dos sete registros existentes**, por nome de cabeçalho,
incluindo valores/fórmulas, validação e chips quando presentes: nenhuma diferença.
As 19 novas células de cada registro antigo permaneceram vazias. Nenhum histórico foi
convertido e nenhum perfil ou escore foi recalculado. Não foram criados leads fictícios na base.
A ordem dos cabeçalhos e a legibilidade do Data Dictionary foram conferidas na interface Google.

## Testes realizados

`pnpm test` executa 17 testes usando o runner nativo Node.js e TypeScript já disponível no projeto.
Requer Node.js 24 no ambiente de desenvolvimento; os serviços externos são simulados.

| Critério | Evidência |
|---|---|
| Sem complementos / um / vários | Payloads completos com 0, 1 e 12 complementos; células corretas e vazias quando omitidas |
| Retornar e trocar alternativa | Navegador: voltar, alterar escolha e recarregar preservaram texto/seleção |
| Isolamento entre perguntas | Navegador: segunda pergunta abriu vazia e recebeu complemento próprio; seguintes permaneceram recolhidas |
| Múltiplas seleções | Navegador com dois contextos; teste de contextos/fricções incluindo Outro |
| Acentos e quebras de linha | Validação, JSON e construção da linha preservaram caracteres e linhas |
| Fórmulas | Casos `=`, `+`, `-`, `@`, espaços, tab e quebra de linha; proteção do receiver testada em sandbox em memória |
| Textos completos e IDs | Snapshot, colunas legíveis, JSON de Training Readiness e `technicalResponses` conferidos |
| Escores/perfis/fit estáveis | 256 combinações: resultado completo e e-mail renderizado iguais com/sem complementos |
| E-mail | Endpoint exercitado com Resend/Sheets simulados, chave de idempotência e status preservados |
| Reenvio e históricos | Receiver em memória com cabeçalhos reordenados, notas/fórmulas históricas e tentativas duplicadas |
| Esquema incompleto | Receiver retorna `schema_upgrade_required`, sem perda silenciosa de campos |
| Mobile | Navegador em 375 × 812: campo expandido, botões utilizáveis e sem overflow horizontal |
| Desktop | Navegador em 1280 × 900: campo de 608 px, sem overflow horizontal |
| Histórico real | Comparação das 308 células após inserção das colunas |

Também executados: build de produção (cliente e SSR), `tsc --noEmit` após geração de rotas,
e `git diff --check`. Os arquivos de perguntas, interpretação, perfis, e-mail e estado/persistência
não foram alterados. O emulador local Netlify/Deno falhou por incompatibilidade de argumentos;
a verificação visual usou configuração temporária sem esse adaptador. O build de produção
usa a configuração original Netlify.

## Publicação — ordem necessária

1. Revisar o PR. A planilha de destino já está estendida e documentada; **não repetir inserções**.
2. Na planilha, abrir Extensões → Apps Script. Substituir `Code.gs` pelo arquivo do PR.
3. Salvar e atualizar **o deployment existente**: Deploy → Manage deployments → Edit →
   New version. Manter o mesmo `/exec` e o `WEBHOOK_SECRET` atual. Não criar nem expor novas chaves.
4. Somente então integrar o PR em `main` e executar o deploy Netlify. As variáveis
   `RESEND_API_KEY`, `RESULT_EMAIL_FROM`, `RESULT_EMAIL_REPLY_TO`, `GOOGLE_SHEETS_WEBHOOK_URL`
   e `GOOGLE_SHEETS_WEBHOOK_SECRET` mantêm os mesmos nomes/valores.
5. Fazer uma submissão de homologação em planilha separada e com e-mail controlado, verificando
   delivery real, armazenamento dos textos, caracteres, complementos e ausência de fórmulas.
6. Confirmar `instrumentVersion=CRM-v2`, sem modificar linhas antigas. Monitorar `recorded`
   e `resultEmailStatus` após publicar.

As novas colunas são compatíveis com o aplicativo antigo, mas o receiver antigo não deve
receber submissões CRM-v2: ele não verifica a nova estrutura nem protege os dados em reenvios.
O aplicativo e o Apps Script foram preparados; a publicação do Apps Script e o merge/deploy
Netlify não foram executados nesta entrega. Não há ferramenta conectada para editar/publicar
o projeto Apps Script. O teste com entrega real de e-mail depende das credenciais do ambiente
e não foi simulado como se fosse uma entrega real.

## Migração histórica — proposta separada, não executada

O Git contém versões anteriores das perguntas sob a mesma família CRM-v1. O número da versão
isolado não prova qual commit/deploy foi usado em cada submissão. Portanto, não há evidência
suficiente para traduzir automaticamente os sete registros históricos com a configuração atual.

Se for desejada uma migração futura:

1. Relacionar cada submissão ao deploy/commit exato por registros Netlify e evidência temporal.
2. Recuperar `questions.ts`, labels compartilhados e regras daquele commit, sem usar os atuais
   como substitutos. Registrar hash do mapeamento e grau de certeza.
3. Criar outra cópia integral e gerar relatório de prévia por `submissionId`, sem tocar no original.
4. Acrescentar textos recuperados em aba separada ou novas colunas históricas; preservar IDs,
   versão, escores/perfis e texto original. Registros ambíguos permanecem sem conversão.
5. Submeter a prévia à aprovação antes de executar qualquer migração.

## Arquivos da alteração

- `src/assessment/{types,content,instrument,answerSnapshot,submission}.ts`
- `src/components/{OpenAnswer,OptionList,QuestionScreen}.tsx`
- `src/server/{validateSubmission,sheetRow}.ts`
- `google-apps-script/{Code.gs,README.md}`
- `tests/{register,fixtures,assessment.test,receiver.test}.mjs`
- `package.json`, `README.md` e este relatório.
