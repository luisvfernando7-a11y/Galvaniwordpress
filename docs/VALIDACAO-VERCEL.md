# Validação do portfólio independente — 10/10/2026

## Origem das informações

Os dados abaixo foram fornecidos pelo usuário a partir do painel, não consultados via API privada:

| Campo informado | Valor |
| --- | --- |
| Projeto | `raccoltogalvani` |
| URL principal | https://raccoltogalvani.vercel.app/ |
| URL do deployment | https://raccoltogalvani-p1uh1ddgf-luis-projects-e3d5069f.vercel.app |
| Status exibido | Ready (Production) |
| Repositório | https://github.com/luisvfernando7-a11y/Galvaniwordpress |
| Branch | `main` |
| Commit informado | `9aaef57d070c5653082938cb3337bb5bf7c6ac32` |
| Mensagem | Valida retomada da EC2 e corrige interface de conta demonstrativa |
| Integração Git informada | Pushes na main atualizam a produção |

Ready indica o status mostrado para esse deployment anterior; não comprova a existência, publicação ou funcionamento da versão independente. Na preparação inicial não havia acesso a configurações privadas Vercel; a publicação autenticada posterior está registrada ao final deste relatório. Tokens nunca foram lidos para documentação.

## Estado público verificado antes do push desta versão

Consulta HTTPS real com curl/urllib ao domínio principal, sem alterar DNS nem usar loopback para Vercel:

| Caminhos consultados | Resultado |
| --- | --- |
| `/`, `/nossa-historia/`, `/enoteca/`, `/gastronomia/`, `/experiencia/`, `/contato/` | Todos HTTP 404; cabeçalho Vercel `NOT_FOUND` |
| `/conta/`, `/carrinho/`, `/termos/`, `/privacidade/` | Todos HTTP 404; Vercel `NOT_FOUND` |
| `/assets/ambiente.jpg`, `/assets/site.js`, `/data/catalog.json` | Todos HTTP 404; Vercel `NOT_FOUND` |
| Deployment informado, sem seguir redirect | HTTP 302, host de destino `vercel.com` |
| Deployment informado, seguindo redirect | HTTP 200 em `vercel.com`; não representa resposta do site Raccolto |

A ferramenta web também não conseguiu abrir o domínio principal. Como a URL principal retorna 404 e a URL de deployment redireciona à Vercel, **não foi possível testar interações de uma versão publicada**. O redirecionamento é compatível com proteção de acesso, mas a configuração de proteção precisa ser confirmada no painel. Não há evidência para atribuir o 404 a um campo específico sem consultar o projeto.

## Implementação e preservação AWS

- `vercel-portfolio/` não existia na inspeção inicial; criado nesta tarefa.
- Leitura seletiva via WP-CLI de cinco páginas publicadas e somente campos públicos dos produtos: nome, slug, categoria, preço ilustrativo, descrição, imagem local, ficha e classificações. Nada de usuários, pedidos, sessão, cookies, nonces, credenciais ou dados privados foi exportado.
- A home foi adaptada do template vigente do tema; páginas institucionais vieram do conteúdo publicado. Conta, carrinho, termos e privacidade foram reescritos para os comportamentos estáticos.
- Nenhuma escrita em `/var/www/html`, banco, arquivos instalados, URLs WordPress ou Apache. Arquivos WordPress do repositório preservados. Os testes WordPress existentes não foram executados nesta tarefa, pois alguns mutam dados.
- 23 páginas HTML: home, nove internas e 13 fichas de produto; uma página 404 adicional.
- Quatro fotos locais comparadas byte a byte com os originais licenciados do tema/plugin: idênticas. Fonte/licença documentadas em `FONTES-IMAGENS.md`.
- Carrinho usa somente localStorage de produtos públicos, quantidades e retirada/entrega. Sem endpoint comercial, autenticação ou dados pessoais. Conta é uma prévia explícita com botão, sem campos de senha/e-mail/endereço.

## Build, sintaxe e independência

| Verificação executada | Resultado |
| --- | --- |
| `node vercel-portfolio/build.mjs` | PASS: 23 páginas + 404, 13 produtos |
| Cópia de apenas `vercel-portfolio/` para diretório temporário e build | PASS sem arquivos WordPress ou outros arquivos do repositório |
| `node --check` de build.mjs, site.js, portfolio.js e tests/browser-test.cjs | Sem erros |
| `php -l` dos 11 PHP existentes do tema/plugin/scripts | Sem erros; arquivos preservados |
| Parse de todos os JSON da pasta | Válidos |
| Auditoria textual de HTML/JS/CSS/JSON publicados | Sem hostname AWS, URLs/endpoints WordPress, admin-post, wp-json ou nonces |
| `git diff --check` | Aprovado |

## Testes locais de navegador realmente executados

Comando: `RG_PLAYWRIGHT_PATH=/tmp/rg-browser/node_modules/playwright-core node vercel-portfolio/tests/browser-test.cjs`.

Chromium local, servidor estático temporário próprio do teste, cabeçalhos CSP da configuração Vercel aplicados. **Todas as requisições externas foram bloqueadas**, sem parar a EC2 ou alterar o WordPress. Execução final: PASS, exit 0.

| Teste | Resultado |
| --- | --- |
| Todas as 23 páginas em desktop 1440×1000 e celular 390×844 | HTTP 200 local e sem transbordamento horizontal |
| H1, descrição e ficção | Um H1/descrição por página; rodapé identifica projeto fictício |
| Fotos e recursos | Imagens decodificadas com largura natural; nenhum recurso quebrado capturado |
| Links | 23 destinos internos distintos consultados: HTTP 200; nenhum link de navegação para AWS ou origem externa |
| Filtros | 9 vinhos → orgânico 4 → âmbar 1 → natural 1 → espumante 0 com aviso → reset 9 |
| Gastronomia | 4 especialidades |
| Carrosséis | Setas do teclado deslocam; botão anterior retorna; percurso móvel preservado |
| Detalhes e foco | Enter abre, Escape fecha e restaura foco; engarrafamento presente; abrir/fechar por toque |
| Teclado | Skip link recebe foco e tem outline visível |
| Carrinho | Adicionar, alterar quantidade para 2, persistir após recarregar, remover e limpar localStorage |
| Simulação | Entrega e retirada; preferência persiste; confirmação informa ausência de pedido |
| Entrada local desconhecida | Produto desconhecido ignorado e preferência inválida normalizada |
| Armazenamento bloqueado | Aviso e simulação em memória na página; adicionar informa limitação sem redirecionar e perder seleção |
| Conta | Sem inputs; botão abre prévia com aria-expanded; nenhuma autenticação criada |
| Sem JavaScript | Link do catálogo abre ficha HTML nativa e visível |
| Móvel e movimento reduzido | Menu abre/navega; detalhe e adição ao carrinho por toque; classe de animação não ativada |
| Página inexistente | HTTP 404 local |
| Privacidade/rede | Zero requisições externas tentadas, zero POSTs, zero cookies nos contextos desktop/móvel, zero erros JavaScript/console |

Capturas `/tmp/rg-portfolio-desktop.png` e `/tmp/rg-portfolio-mobile.png` revisadas visualmente. A primeira captura rápida da home ainda mostrava áreas em animação; o teste foi ajustado para percorrer com scroll instantâneo e esperar a transição. A captura final mostra todas as seções. Não se trata de auditoria formal WCAG; apenas Chromium foi testado.

A independência da EC2 foi verificada por build isolado, auditoria de recursos e bloqueio de toda rede externa no navegador, **sem desligar a EC2**. Isso comprova o funcionamento local dessa versão com apenas seu servidor estático disponível.

## Configuração necessária na preparação inicial (agora verificada)

Root Directory `vercel-portfolio`, Framework Preset `Other`, Build Command `node build.mjs`, Output Directory `public`, Install Command override vazio, Git no repositório correto, Production Branch `main` e domínio principal vinculado ao projeto. Não há variáveis secretas necessárias. A configuração `vercel.json` está apenas na pasta estática.

Após configurar, criar um deployment de um commit contendo esta versão. Conferir build/logs, domínio e `/data/build.json` com marcador `raccolto-static-v1` e SHA Git quando disponível. Ready antigo e sucesso do push não equivalem a um novo deployment verificado.

Instruções completas: `vercel-portfolio/README.md`. Mudanças futuras no WordPress não sincronizam automaticamente com JSON/templates desta versão.

## Verificação após envio dos fontes

O commit `f5f509278df9085c3fa08143fc7c1f7aaddc486e` (Cria portfolio estatico independente para Vercel) foi enviado sem force para `origin/main`. `git ls-remote origin refs/heads/main` confirmou esse mesmo SHA no GitHub.

Depois desse push, novas consultas HTTPS à home `/`, `/enoteca/` e `/data/build.json` ainda retornaram **HTTP 404 / Vercel NOT_FOUND**. Não há evidência de um novo deployment funcional; o envio de código foi concluído, mas a configuração/build/publicação da Vercel permanece por conferir no painel. Esta verificação não demonstra que a integração Git falhou ou que um build não esteja em andamento, pois não houve acesso aos logs/status privados.

## Correção e publicação autenticada — 10/10/2026

Após pedido explícito de publicação, novo push retornou Everything up-to-date. A CLI foi instalada com cache temporário em `/tmp`; a primeira tentativa falhou por ENOSPC e foi removido somente o cache npx incompleto criado nessa tentativa. WordPress e backups preservados. Login oficial por dispositivo concluído, sem leitura/exposição de credenciais.

Inspeção autenticada identificou Root Directory `.` no projeto existente. Corrigido via PATCH de projeto para `vercel-portfolio`, Framework Other, Build `node build.mjs`, Output `public` e Install vazio. Inspeção posterior confirmou esses valores; Node.js 24.x mantido. Valores anteriores observados guardados em arquivo privado `/tmp/rg-vercel-settings-before.json`.

Deployment criado via API autenticada a partir do GitHub, sem upload de instalação/banco AWS:

- Commit: `f83481a2f0daf15652b6d6842d16c739a927908a`.
- Deployment: `dpl_9aAH5G7BA5zjBqfRAhSv8MuAiDnZ`.
- URL específica: https://raccoltogalvani-432p0v0f5-luis-projects-e3d5069f.vercel.app.
- Estado final observado na API: **READY**, target production, sem errorCode/errorMessage.
- Alias principal atribuído: https://raccoltogalvani.vercel.app/.
- Home HTTPS: **200**. `/data/build.json`: marcador `raccolto-static-v1` e SHA exatamente igual ao commit acima.

O teste local completo foi repetido: PASS. O mesmo teste foi executado **contra a URL pública**, sem servidor/mapeamento local, por:

```bash
RG_PLAYWRIGHT_PATH=/tmp/rg-browser/node_modules/playwright-core RG_PORTFOLIO_URL=https://raccoltogalvani.vercel.app node vercel-portfolio/tests/browser-test.cjs
```

Resultado remoto: **PASS, exit 0**, nas mesmas 23 páginas desktop/celular e 23 destinos internos descritos na tabela de QA. Incluiu fotos, catálogo, filtros/carrosséis, teclado/foco/diálogo, carrinho persistente, quantidades/remoção, retirada/entrega, conta demonstrativa, armazenamento bloqueado, fallback de produto sem JS, 404 e reduced-motion. Zero requests para outra origem, POSTs comerciais, cookies nos contextos desktop/móvel ou erros JavaScript/console capturados.

O Chromium executou na EC2, mas requisitou HTTPS da Vercel: **não houve loopback nem chamada ao WordPress**. Os arquivos estáticos publicados são independentes da EC2; não foi necessário desligá-la. Nenhum teste comercial criou pedidos ou contas. Não foi testado Safari/Firefox ou realizada auditoria formal WCAG.

Os 404 anteriores ficaram resolvidos após corrigir Root Directory e publicar; foram mantidos neste relatório como histórico real.

### Publicação automática da main confirmada

API de projeto confirmou integração GitHub com `luisvfernando7-a11y/Galvaniwordpress` e productionBranch `main`. O push do commit `9e58270cd8699665cdda41ea68a8047d6a39d819` gerou automaticamente o deployment `dpl_7fLTW4SDtfSxtDjWv8aS4FMvtduQ`, URL https://raccoltogalvani-jjz0pyk1c-luis-projects-e3d5069f.vercel.app, estado READY/production. Home, Enoteca e build.json retornaram HTTP 200; marcador confirmou esse mesmo SHA e hash de catálogo inalterado. Os testes de interação completos já haviam passado na mesma versão da aplicação; esse commit alterou somente documentação e script de QA. A URL principal aponta à produção vigente; consultar `/data/build.json` para o SHA após pushes posteriores.
