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

## Base já preparada
Pacote: raccolto-galvani-starter.zip, entregue no chat.
Tema clássico com homepage, paleta, história, carrossel,
filtros por cor e modal de detalhes.
Produtos ilustrativos; ainda sem fotos, catálogo persistente,
contas, carrinho ou checkout.
JavaScript verificado; PHP e funcionamento em WordPress ainda precisam de teste.
Upload e ativação do tema no servidor ainda não confirmados.

## Próximos passos
1. Adicionar o tema inicial a este repositório.
2. Validar PHP e testar ativação no WordPress.
3. Refinar layout e adicionar imagens licenciadas.
4. Implementar catálogo persistente em plugin separado.
5. Implementar os demais fluxos demonstrativos.
6. Atualizar este documento a cada etapa.

Repositório:
https://github.com/luisvfernando7-a11y/Galvaniwordpress

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
- EC2 mudou de IP após parada do laboratório. Hostname/IP atuais confirmados consultando apenas metadados públicos do próprio servidor: `ec2-35-173-239-89.compute-1.amazonaws.com`, `35.173.239.89`.
- URLs antigas foram substituídas com WP-CLI seguro para serialização, sem alterar GUIDs (10 substituições). Site atual: http://ec2-35-173-239-89.compute-1.amazonaws.com/ ; painel em `/wp-admin/`.
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
