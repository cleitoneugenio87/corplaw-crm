# Verificação — 23/11/2026

## Executado neste workspace

- `npm ci --offline --ignore-scripts --cache .npm-cache --no-audit --no-fund`: instalação reproduzível concluída pelo lockfile, 42 pacotes de teste. Dependências obtidas de recursos locais; nenhuma mudança de dependência em outro projeto.
- `npm test`: testes de servidor e comportamento em DOM. Os quatro percursos finais passam em 18 verificações funcionais, além das 27 verificações de regressão da proposta. Casos adicionais cobrem etapa ocupada, nomes de funil únicos, cenário de falha de Agenda, navegação por hash e acesso ao conteúdo. Os testes do servidor verificam entrada/recursos, tipos de conteúdo e recusa de escrita/acesso a arquivos internos.
- `node --check app.js` e `node --check tests/e2e/crm.spec.mjs`: sintaxe válida.
- `npm run build`: distribuição estática local gerada em `dist/`.
- Conferência dos assets e das capturas fornecidas na proposta final: identidade CorpLaw, Montserrat, verde `#00A499`, texto `#1E1A34` e estrutura dos percursos reutilizados.

Os testes de DOM usam substitutos de `dialog.showModal`, `dialog.close` e `scrollTo`. Validam estado e transições, sem motor de layout. A asserção geométrica do roteiro original foi explicitamente removida desses testes; não há alegação de verificação visual por jsdom.

## Navegador: execução bloqueada pelo ambiente

Tentativas feitas:

1. `orca tab create --url http://localhost:4189/percursos.html --json`: `runtime_access_denied`, conexão recusada com `EPERM`.
2. `npm run test:e2e`: `spawn EPERM` ao iniciar worker do Playwright.
3. Inicialização direta do Chromium pelo Playwright: `browserType.launch: spawn EPERM`.

Não houve alteração de permissões, reinício do Orca nem contorno das restrições. Nenhuma captura nova da implementação foi produzida. As capturas da proposta não são evidências de teste desta implementação.

## Pendente

Executar `npm run test:e2e` em um terminal com acesso normal ao Chromium. A suíte já contém nove cenários: três testes em cada largura de 1440, 390 e 320 px. Cobre os quatro percursos completos com interações de usuário, invalidação de aprovação, ausência de tráfego externo, navegação por todas as áreas, filtros e dashboard, perfil de consulta, foco dentro do diálogo, Escape, restauração de foco, movimentação pela ficha e contenção horizontal. Gera capturas por área e da fila, relatório HTML e traces em falhas.

Conferência visual real de alinhamento, responsividade em 320/390 px, rolagem e teclado permanece pendente devido ao bloqueio de processos. CSS de contenção e diálogos responsivos foi implementado; o resultado precisa dessa conferência.

Integrações reais, autenticação, persistência e regras comerciais definitivas estão fora deste escopo local. Agenda, ClickUp e Meta continuam destacados como simulações; alterações reiniciam ao recarregar.
