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

Ready indica o status mostrado para esse deployment anterior; não comprova a existência, publicação ou funcionamento da versão independente. Nesta execução não há acesso a configurações privadas Vercel, tokens, logs de build ou API de administração do projeto.

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

## Configuração que precisa ser conferida no painel

Root Directory `vercel-portfolio`, Framework Preset `Other`, Build Command `node build.mjs`, Output Directory `public`, Install Command override vazio, Git no repositório correto, Production Branch `main` e domínio principal vinculado ao projeto. Não há variáveis secretas necessárias. A configuração `vercel.json` está apenas na pasta estática.

Após configurar, criar um deployment de um commit contendo esta versão. Conferir build/logs, domínio e `/data/build.json` com marcador `raccolto-static-v1` e SHA Git quando disponível. Ready antigo e sucesso do push não equivalem a um novo deployment verificado.

Instruções completas: `vercel-portfolio/README.md`. Mudanças futuras no WordPress não sincronizam automaticamente com JSON/templates desta versão.
