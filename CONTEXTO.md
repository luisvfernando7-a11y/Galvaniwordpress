# Raccolto Galvani — contexto do projeto

## Objetivo
Site WordPress de restaurante fictício para portfólio.
Público: classe média alta. Foco em experiência, vinhos e frios italianos.

## Marca e narrativa fictícia
Nome: Raccolto Galvani.
Fundação na história da marca: Mônaco, 1982, pelo chef Luis Galvani.
Localização conceitual atual: Roma, Itália.
Identificar o projeto como fictício; não inventar endereço ou avaliações reais.

## Direção visual
Vermelho vinho, branco/marfim, dourado e contraste com verde.
Estética sofisticada, títulos em serifas itálicas, fotos de ambiente e gastronomia.
Textos legíveis, navegação simples, responsividade e foco em UX/UI.
Animações no scroll respeitando preferência por movimento reduzido.

## Estrutura prevista
Início, Nossa História, Enoteca, Gastronomia, Experiência, Contato,
Conta, Carrinho, Termos e Política de Privacidade.

## Catálogo
Carrosséis por especialidade, filtros e detalhes.
Informações rápidas por hover; clique/toque e teclado para detalhes completos.
Atributos: produtor, região, uvas, safra, ano de engarrafamento,
método de colheita, cultivo, vinificação, notas e harmonização.
Não confundir safra com ano de fabricação.

Classificações independentes:
- Cor: tinto, branco, rosé e laranja/âmbar.
- Açúcar: seco, demi-sec e suave/doce.
- Efervescência: tranquilo, frisante e espumante.
- Especiais: fortificado, colheita tardia, botritizado e icewine.
- Cultivo: convencional, orgânico, biodinâmico e natural.
Um vinho pode ter várias classificações, sem duplicar o produto.

## Funcionalidades futuras
Catálogo persistente e edição administrativa.
Contas, cadastro e carrinho usando recursos do WordPress/WooCommerce.
Retirada e entrega como fluxos demonstrativos de portfólio.
Sem cobrança, pagamento ou pedidos reais nesta etapa.
Consentimento de cookies conforme os scripts efetivamente usados.
SEO: títulos, descrições, URLs, sitemap e conteúdo semântico.
Não apresentar o restaurante fictício como negócio real em dados estruturados.

## Ambiente confirmado pelo usuário
AWS EC2, Debian 13, terminal pelo code-server.
Arquivos WordPress: /var/www/html.
Banco: wordpress_db.
Usuário do banco: wordpress_user, localhost.
Senha definida pelo usuário — nunca registrar neste repositório.
Instalador do WordPress concluído; usuário entrou no painel.
Codex CLI 0.162.0 instalado.
Login por dispositivo habilitado; usuário informou ter concluído.
Confirmar sessão com codex login status quando necessário.

## Estado atual — WordPress/AWS

Tema e plugin próprios estão versionados e instalados; WooCommerce ativo e catálogo persistente com 13 produtos. Páginas, conta e carrinho demonstrativo implementados. Não retomar a partir do antigo starter nem reinstalar WordPress.

Repositório: https://github.com/luisvfernando7-a11y/Galvaniwordpress

Endereço vigente, confirmado por IMDSv2 em 10/10/2026: http://ec2-100-29-12-33.compute-1.amazonaws.com/ (IPv4 `100.29.12.33`). Painel: http://ec2-100-29-12-33.compute-1.amazonaws.com/wp-admin/.

## Implementação — 09/10/2026

### Entrega instalada
- Tema clássico `wp-content/themes/raccolto-galvani`: homepage editorial, paleta vinho/marfim/dourado/verde, títulos serifados em itálico, seis destinos institucionais, conta/carrinho/legais, navegação móvel, foco e skip link.
- Plugin `wp-content/plugins/raccolto-core`: produtos persistentes WooCommerce, campos administrativos da ficha técnica, cinco taxonomias independentes multivalor, filtros combinados, carrosséis por botões/toque/teclado, informações rápidas em hover/foco e detalhes em diálogo nativo (Enter/Escape/foco restaurado). Link nativo de produto serve de fallback sem JS.
- WooCommerce 11.2.0 instalado e ativo, com tradução pt_BR. Conta e cadastro nativos; usuário define senha. Carrinho clássico com preços ilustrativos, alteração/remoção e simulação de retirada/entrega sem endereço ou pedido.
- 9 vinhos e 4 especialidades fictícias: frios, queijos, massa e burrata. Produtos marcados “Demo”; produtor, ficha e preços declarados ilustrativos. Safra e engarrafamento separados. Vinho âmbar multiclasse demonstra orgânico/biodinâmico/natural sem duplicação.
- Páginas, menu e homepage criados por `scripts/configure.php`, preservando conteúdo existente e evitando duplicar produtos e mídia. Homepage visual reside no tema; páginas internas são editáveis no painel.
- Fotografias Unsplash baixadas localmente, fontes em `FONTES-IMAGENS.md`. Fotos genéricas, inclusive de produtos, explicitamente ilustrativas.
- Animações por IntersectionObserver, scroll natural, reduced-motion; sem fontes remotas.
- Títulos via WordPress, descrições por página, URLs amigáveis e supressão dos schemas de produto/website WooCommerce. `blog_public=0` mantido. Sitemap nativo permanece desativado pelo WordPress durante não indexação.
- Termos e privacidade descrevem o comportamento efetivo; Contato informa que não há restaurante, endereço ou reservas reais. Rodapé identifica projeto fictício.

### Proteções comerciais e privacidade
- Raccolto Core bloqueia todos os envios por `wp_mail`, inclusive recuperação de senha. Recuperação assistida pelo administrador do laboratório.
- Gateways vazios; checkout clássico redirecionado ao carrinho; API Store checkout bloqueada (GET e mutações); guarda de salvamento de pedidos WooCommerce e guarda CPT. Nenhum pedido comercial será criado.
- Atribuição de origem opcional WooCommerce, que criava cookies `sbjs_*` por padrão, desativada por opção e filtro persistente do plugin. Analytics/pixels não instalados; apenas cookies essenciais. Sem banner opcional nesta versão.
- WooCommerce “em breve” desativado para permitir acesso de visitantes às páginas demonstrativas; isso não altera a não indexação ou permite comprar.

### Ambiente, backups e endereço
- Apache e MariaDB ativos; WordPress existente preservado. Nunca foi impresso `wp-config.php`; não houve reinstalação de WordPress ou recriação do banco.
- Backup privado de banco e arquivos: `/var/backups/raccolto-20261009-134424`, fora do repositório e document root, diretório 700.
- URLs retornavam 404: `mod_rewrite` estava ausente e `AllowOverride None`. Backup Apache em `/var/backups/raccolto-routing-20261009-135724`; habilitado rewrite e arquivo `raccolto-wordpress.conf` restrito a `/var/www/html` com `AllowOverride FileInfo`. Configtest aprovado e reload realizado. Não alterada MariaDB ou outros projetos.
- Página padrão Apache `index.html` preservada no backup de roteamento; `index.php` priorizado.
- Histórico de 09/10: a EC2 então usava outro IP/DNS. O endereço vigente está na seção Estado atual; não reutilizar o DNS histórico.
- Em 09/10, URLs foram corrigidas com WP-CLI seguro para serialização, sem alterar GUIDs. Nova correção após mudança da EC2 foi executada em 10/10, registrada abaixo.
- Node.js, npm e Chromium instalados para validação; Playwright Core temporário em `/tmp/rg-browser`. WP-CLI em `/tmp/rg-wp.phar`; WooCommerce ZIP temporário em `/tmp/rg-woocommerce.zip`.

### Validação e decisões de manutenção
- Sintaxe de todos os PHP e JavaScript validada; resultados finais em `docs/VALIDACAO.md`.
- `scripts/server-test.php` confirmou não indexação, quantidades do catálogo, e-mail/gateways bloqueados, nenhum pedido persistido e API checkout 403.
- Correção identificada no navegador: carregar o carrinho da sessão antes de adicionar produtos pelo endpoint `admin-post`; cookie essencial é estabelecido antes de redirecionar.
- Configuração repetida sem duplicar os 9 vinhos ou 4 especialidades; script preserva edições de conteúdo, mas reaplica opções da demonstração.
- Log Apache apresentou zero ocorrências PHP na consulta realizada. A tentativa bloqueada de salvar pedido gera log WooCommerce esperado; não confundir com falha PHP.
- README contém instalação, manutenção, testes e retomada. Não instalar WooCommerce novamente em cada mudança; copiar apenas fontes próprios alterados após novo backup.

### Pendências operacionais
- Configurar domínio estável/Elastic IP e HTTPS antes de disponibilizar contas com dados reais; manter laboratório demonstrativo.
- Reconfirmar acesso externo após mudanças de IP/DNS ou Security Group; testes de navegador usam o hostname mapeado para loopback no servidor.
- Pode-se refinar fotografias específicas de vinhos, frios e queijos com novas fontes licenciadas, sem transformar nomes ilustrativos em alegações comerciais.
- Administrador deve definir retenção/armazenamento dos backups e remoção periódica de contas de teste; não há exclusão automática.
- Se incluir cookies opcionais futuramente, implementar aceitar/rejeitar/rever antes do carregamento e atualizar políticas.

## Retomada — 10/10/2026

- AGENTS.md e fontes revisados; arquivos instalados do tema/plugin coincidem com o repositório. WordPress 7.1.3, WooCommerce 11.2.0, Raccolto Core 1.0.0 e tema Raccolto Galvani 1.0.0; os três últimos ativos. Apache/MariaDB ativos. Nenhuma reinstalação ou alteração Apache nesta retomada.
- IMDSv2 consultado exclusivamente para `public-ipv4` e `public-hostname`, sem imprimir token. `home` e `siteurl` corrigidos para o endereço vigente.
- Backup privado anterior às mutações: `/var/backups/raccolto-20261010-113631`, diretório 700, banco e snapshot 600. Arquivos instalados preservados.
- WP-CLI `search-replace --all-tables-with-prefix --skip-columns=guid --precise`, após dry-run: 10 substituições do DNS anterior e 3 referências do DNS mais antigo em registros auxiliares WooCommerce. GUIDs excluídos. Nenhuma credencial lida para documentação.
- Script de navegador agora consulta `home` em vez de fixar um DNS que fica obsoleto. Acrescentadas verificações de decodificação de fotos e ficha nativa de produto. A primeira execução adicional falhou por comparar `innerText` transformado em maiúsculas pelo CSS; corrigido para `textContent`, sem alteração da ficha do site.
- Relatório desta retomada criado em `docs/VALIDACAO.md`; README atualizado. Acesso local e DNS público desde a EC2 retornaram HTTP 200. Ferramenta externa não conseguiu verificar HTTP: tentou HTTPS, ainda não configurado. Acesso externo permanece não comprovado; não foi diagnosticada falha de Security Group.

- Revisão visual identificou botão nativo de mostrar senha sem indicação visual (CSS padrão WooCommerce desativado pelo tema) e aviso de privacidade do cadastro em inglês. Corrigidos rótulo visual que acompanha `aria-label` e aviso em português com link da política via filtro WooCommerce. Tema/plugin agora 1.0.1; somente quatro arquivos próprios alterados foram copiados após o backup.
- Teste usa Tab para disparar a validação nativa da senha antes do cadastro e seleciona Sair pelo menu da conta, evitando dois links homônimos. Script de limpeza verifica registro sintético e papel customer e não remove outras contas.

- Validação final do navegador: PASS, incluindo páginas/fotos, filtros, teclado/foco/modal, ficha nativa, carrinho, retirada/entrega, mostrar senha, cadastro/logout/login, móvel e reduced-motion. Duas contas sintéticas efetivamente criadas foram removidas. Teste servidor repetido: PASS, zero pedidos; fontes instalados conferidos sem diferenças. PHP (11 arquivos), JavaScript e `git diff --check` aprovados.

## Portfólio independente / Vercel — 10/10/2026

### Informações fornecidas pelo usuário (painel Vercel)

- Projeto: `raccoltogalvani`.
- URL principal: https://raccoltogalvani.vercel.app/
- URL do deployment informado: https://raccoltogalvani-p1uh1ddgf-luis-projects-e3d5069f.vercel.app
- Status exibido: Ready (Production).
- Repositório: https://github.com/luisvfernando7-a11y/Galvaniwordpress
- Branch de produção: `main`.
- Commit do deployment informado: `9aaef57d070c5653082938cb3337bb5bf7c6ac32`.
- Mensagem: Valida retomada da EC2 e corrige interface de conta demonstrativa.
- O painel informa que pushes na main atualizam a produção.

Não interpretar Ready como confirmação de que a versão estática foi criada, está sendo publicada ou funciona.

### Resultados verificados e implementação desta execução

- `vercel-portfolio/` não existia; criada como projeto estático independente. Configuração Vercel confinada à pasta; arquivos WordPress atuais preservados no repositório.
- Leitura seletiva de páginas publicadas e campos públicos dos 13 produtos, por WP-CLI, sem exportar usuários, pedidos, sessões, cookies, nonces, credenciais ou configuração privada. Home adaptada diretamente do template atual; dados do catálogo em JSON. Nenhuma escrita em `/var/www/html`, no banco, URLs WordPress ou Apache.
- 23 páginas HTML (home, 9 internas e 13 fichas), mais 404. Fotos locais idênticas aos quatro originais licenciados; CSS e JavaScript visuais derivados do tema. Filtros, carrosséis, hover/foco, diálogo e animações preservados. Todos os recursos e links de navegação usam a origem do portfólio.
- Carrinho demonstrativo em localStorage: apenas slugs públicos, quantidades e retirada/entrega; sem endpoints, pedidos, endereço ou pagamento. Conta é prévia explícita, sem formulários pessoais, senha, cadastro ou autenticação simulada. Termos/privacidade adaptados ao armazenamento local e hospedagem.
- Build `node build.mjs`, sem dependências, também executado em cópia isolada da pasta, sem WordPress ou outros arquivos do repositório. Auditoria estática sem URLs AWS, endpoints WordPress ou nonces no conteúdo publicado. Testes locais com todas as requisições externas bloqueadas aprovados. Detalhes em `docs/VALIDACAO-VERCEL.md`.
- Consulta HTTP real ao domínio principal retornou 404 / Vercel NOT_FOUND antes do push. Não há acesso às configurações privadas da Vercel para confirmar root, alias, integração Git ou logs; dados do painel acima permanecem atribuídos ao usuário.

### Configuração e pendências Vercel

- Conferir no painel: Root Directory `vercel-portfolio`, Framework Preset `Other`, Build Command `node build.mjs`, Output Directory `public`, Install Command override vazio, produção `main` e domínio associado ao projeto. Nenhum segredo necessário.
- Um vercel.json na subpasta não altera Root Directory do projeto sozinho. Gerar deployment de um commit que contém esta pasta e verificar build/logs, URL principal, páginas e `/data/build.json`. Não declarar o novo deployment concluído apenas por um push ou pelo status Ready antigo.
- Alterações futuras no WordPress não sincronizam automaticamente com os JSON/templates estáticos. Atualizações são manuais e precisam de nova revisão/build/teste. Não tocar na instalação AWS para publicar esta pasta.

Verificação pública complementar em 10/10/2026, antes do push estático: os 10 caminhos principais e três recursos consultados retornaram 404 / NOT_FOUND. O deployment informado retornou 302 para `vercel.com` (200 ao seguir o redirect, sem comprovar o site). Teste local final: PASS em 23 páginas desktop/móvel e 23 destinos internos, incluindo armazenamento bloqueado, ficha sem JavaScript e 404; zero chamadas externas/POSTs/cookies/erros.
