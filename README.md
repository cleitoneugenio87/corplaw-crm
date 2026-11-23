# CorpLaw CRM

Interface comercial local com fixtures fictícias. O workspace estava vazio, sem Git, framework ou convenções existentes. Implementação em HTML/CSS/JavaScript, baseada na revisão final de 23/11/2026 da proposta `corplaw-crm-20261123`. Logo, Montserrat, estilos de alinhamento e percursos foram reutilizados dos arquivos locais autorizados. A licença da fonte acompanha `assets/Montserrat-OFL.txt`.

## Abrir

Requer Node.js 22.8 ou superior para os testes. Para usar a interface não é necessário instalar dependências:

```sh
npm run dev
```

Abra **http://localhost:4190/**. A porta 4189 da proposta permanece independente. Outra porta: `npm run dev -- --port 4191`.

As áreas são acessadas pelas abas ou por `/#funis`, `/#atividades`, `/#insights`, `/#catalogo`, `/#sdr`, `/#segmentos` e `/#ajustes`.

## Percursos

1. Funis → Nova oportunidade → preencher e criar → Editar oportunidade → salvar → Localizar no quadro. O recorte se ajusta para mostrar o cartão atualizado. Os filtros podem ser revistos pelo botão Filtros.
2. Ficha → Vincular produto → Cadastrar produto nesta ficha → preencher. O código `DEMO-001` demonstra a rejeição de duplicidade, sem apagar os campos; um código novo permite cadastrar e voltar à mesma ficha com o produto vinculado.
3. Atividades → Retomar contato (`DEMO-101`) → Agendar pela tarefa → escolher membro individual e revisar → editar ou registrar simulação → retorno à tarefa. Agendar não conclui a tarefa. O seletor de cenário permite simular falha de conexão.
4. Segmentos → Revisar público e texto → conferir elegíveis/exclusões e seleção manual → confirmar revisão → editar texto → aprovar → prévia personalizada da fila. Alterar texto invalida aprovação; rever público exige nova revisão. A fila não é operacional.

Atalhos para revisão: `/?view=nova#funis`, `/?view=ficha#funis`, `/?view=tarefa#atividades`, `/?view=campanha#segmentos`.

## Escopo e dados

Toda alteração fica em memória e reinicia ao recarregar. A data fictícia do cenário é 23/11/2026. Agenda, ClickUp e Meta são simulações identificadas. Sem autenticação, persistência, dados reais, convites, disparos, sincronização ou deploy. O seletor de perfil é apenas uma hipótese de interface. O navegador bloqueia conexões da aplicação por CSP (`connect-src 'none'`). Nenhum arquivo do projeto `corplaw` foi alterado.

Etapas, campos obrigatórios, permissões, classificação de produtos, consentimento, critérios de público, aprovação e integrações reais dependem de validação futura com Saulo e Gustavo.

## Verificações

```sh
npm ci
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm run build` gera `dist/` para uso estático local. A suíte E2E cobre os quatro percursos, todas as áreas, filtros/dashboard, consulta, teclado e contenção em 1440, 390 e 320 px. Resultados efetivamente executados e limitações estão em `VERIFICACAO.md`.

## Arquivos

- `index.html`: entrada normal, recursos locais e CSP.
- `app.js`, `data.js`: telas, fluxos e fixtures adaptados da proposta final.
- `style.css`, `alinhamento.css`, `flows.css`, `interface.css`: identidade, alinhamento, percursos e ajustes responsivos/acessíveis.
- `assets/`: logo, fontes e licença.
- `scripts/`: servidor local e build estático.
- `tests/`, `playwright.config.mjs`: verificações de servidor, comportamento e navegador.
- `package.json`, `package-lock.json`, `.gitignore`: comandos e dependências de teste.
