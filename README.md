# Raccolto Galvani

Portfólio de restaurante **fictício**, com duas versões: WordPress/WooCommerce na AWS e site estático independente em `vercel-portfolio/`. História criativa: Mônaco, 1982, chef Luis Galvani; localização conceitual em Roma. Sem restaurante, endereço, depoimentos ou certificações reais.

## Portfólio independente / Vercel

URL principal informada pelo usuário: https://raccoltogalvani.vercel.app/

A versão independente foi criada em `vercel-portfolio/`, preservando layout, cores, fotos, páginas e catálogo público do WordPress. Conta é uma prévia sem autenticação ou dados pessoais; carrinho é local. Nenhuma conexão ao WordPress/AWS é necessária para construir ou usar esta versão. Alterações futuras no WordPress **não sincronizam automaticamente** com o portfólio estático.

### Dados fornecidos pelo usuário a partir do painel

- Projeto: `raccoltogalvani`.
- URL principal: https://raccoltogalvani.vercel.app/
- URL do deployment informado: https://raccoltogalvani-p1uh1ddgf-luis-projects-e3d5069f.vercel.app
- Status exibido: **Ready (Production)**.
- Repositório: https://github.com/luisvfernando7-a11y/Galvaniwordpress
- Branch de produção: `main`.
- Commit do deployment informado: `9aaef57d070c5653082938cb3337bb5bf7c6ac32`.
- Mensagem: `Valida retomada da EC2 e corrige interface de conta demonstrativa`.
- O painel informa que pushes na `main` atualizam a produção.

Esses dados descrevem um deployment anterior à criação da versão estática e não comprovam seu funcionamento.

### Estado atual verificado — publicação concluída

A URL principal https://raccoltogalvani.vercel.app/ responde **HTTP 200**. O projeto existente estava configurado com Root Directory `.`; corrigido por CLI/API autenticada para `vercel-portfolio`, Framework `Other`, Build `node build.mjs`, Output `public` e Install vazio. WordPress/AWS preservados.

Deployment de produção confirmado em estado **READY**, com alias principal ativo. O push seguinte também gerou um deployment automático READY; `/data/build.json` confirmou o SHA enviado para `main` e o marcador `raccolto-static-v1`. Esse endpoint permite conferir o commit vigente; os deployments testados estão registrados no relatório de validação.

Teste de navegador executado **no domínio público Vercel**, sem mapeamento para loopback: PASS em 23 páginas desktop/móvel e 23 destinos internos, incluindo fotos, catálogo/filtros, teclado/foco, carrinho persistente, retirada/entrega, conta demonstrativa, armazenamento bloqueado e ficha sem JavaScript. Nenhuma chamada à AWS, POST comercial, cookie da aplicação ou erro JavaScript capturado. Teste local também repetido e aprovado. Resultados anteriores de 404 são históricos, antes da correção do projeto.

Importe o mesmo repositório, ou ajuste o projeto existente, com **Root Directory = `vercel-portfolio`**, **Framework Preset = `Other`**, **Build Command = `node build.mjs`**, **Output Directory = `public`** e **Install Command com override vazio**. Não são necessários segredos ou variáveis de ambiente. A configuração está apenas em `vercel-portfolio/vercel.json`.

Instruções completas: [versão estática](vercel-portfolio/README.md). Resultados e limites: [validação Vercel](docs/VALIDACAO-VERCEL.md). Referência: [configuração de build da Vercel](https://vercel.com/docs/builds/configure-a-build).

## WordPress / AWS

Site instalado (IMDSv2 confirmado em 10/10/2026): http://ec2-100-29-12-33.compute-1.amazonaws.com/

Painel: http://ec2-100-29-12-33.compute-1.amazonaws.com/wp-admin/, com as credenciais já existentes do administrador. Não há credenciais neste repositório.

A home respondeu HTTP 200 por loopback e pelo DNS público a partir da própria EC2. Acesso HTTP de fora da EC2 ainda não foi comprovado; veja [relatório de validação](docs/VALIDACAO.md).

## Estrutura

- `wp-content/themes/raccolto-galvani`: tema clássico, CSS e JavaScript sem compilação, homepage editorial e integração WooCommerce.
- `wp-content/plugins/raccolto-core`: catálogo, classificações, campos administrativos e proteções da demonstração; funciona independentemente do tema.
- `scripts/configure.php`: configuração idempotente de páginas, menu, produtos e mídia. Não sobrescreve conteúdo de páginas ou produtos já existentes.
- `scripts/cleanup-test-user.php`: limpeza restrita à conta sintética registrada pelo teste de navegador.
- `scripts/backup.sh`: backup privado do banco e de arquivos, fora do repositório e document root.
- `scripts/install.sh`: instalação no laboratório existente, depois do backup.
- `scripts/wordpress-routing.sh`: correção específica das URLs amigáveis do laboratório; não é necessária em servidores já configurados.
- `FONTES-IMAGENS.md`: arquivos locais e licença das fotografias.

Não versionar núcleo WordPress, WooCommerce de terceiros, uploads, credenciais, logs, dumps ou backups.

## Instalação / retomar

Requisitos: WordPress instalado, PHP 8.0+ (ambiente atual 8.4), Apache com reescrita e MariaDB. WooCommerce deve ter seus requisitos atendidos. WP-CLI é executado neste laboratório como `php /tmp/rg-wp.phar --allow-root --path=/var/www/html`; fora do laboratório use a identidade de serviço apropriada.

1. Leia `AGENTS.md` e `CONTEXTO.md`; confirme serviços, site e plugins ativos. Nunca imprima `wp-config.php`.
2. Baixe WP-CLI de `https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar` para `/tmp/rg-wp.phar` e WooCommerce de `https://downloads.wordpress.org/plugin/woocommerce.latest-stable.zip` para `/tmp/rg-woocommerce.zip`, se ainda não existirem. Em manutenção, prefira a versão testada e verifique a compatibilidade antes de atualizar.
3. Execute `bash scripts/backup.sh` com permissões para `/var/backups`. O diretório é 700 e os arquivos privados. O backup inclui a configuração, apenas dentro do arquivo privado; nunca o publique.
4. Valide os fontes: `find wp-content scripts -name '*.php' -exec php -l {} \;` e `node --check wp-content/themes/raccolto-galvani/assets/site.js`.
5. Para uma primeira instalação, execute `bash scripts/install.sh` com permissão de escrita em `/var/www/html`. O script instala WooCommerce, copia/ativa tema e plugin, configura páginas, menu, homepage, catálogo e traduções.
6. **Manutenção:** não reinstale WooCommerce a cada alteração. Copie apenas os arquivos do tema/plugin próprio alterados após novo backup. Execute a configuração novamente somente se necessário; ela preserva conteúdo e evita duplicações, mas reaplica opções de demonstração, menu, SEO e homepage.
7. Se as URLs amigáveis retornarem 404 por ausência de `mod_rewrite`/`AllowOverride`, avalie `scripts/wordpress-routing.sh`. Ele salva `/etc/apache2` privadamente, habilita reescrita, permite `FileInfo` só em `/var/www/html`, prioriza `index.php`, preserva o `index.html` padrão no backup e recarrega Apache. Não aplique a outros projetos sem autorização.

Não reinstalar WordPress ou recriar o banco. Os temas, plugins e conteúdos anteriores foram preservados.

## Editar pelo painel

- **Produtos → Todos os produtos:** nomes, descrição, preço demonstrativo, imagem e categoria. As categorias `vinho` e `especialidade` definem os carrosséis.
- Na aba **Geral** do produto, os campos Raccolto incluem região, produtor, uvas, safra, ano de engarrafamento, colheita, cultivo, vinificação, notas e harmonização. Safra não é engarrafamento.
- As caixas de taxonomia **Cor, Açúcar, Efervescência, Especiais e Cultivo** aceitam múltiplas classificações. Um único produto pode aparecer em vários filtros. O texto de cultivo na ficha deve ser mantido coerente com os termos marcados.
- Use os termos previstos, com seus slugs originais; adicionar novos termos requer também atualizar `rg_classifications()` para incluí-los nos filtros.
- **Páginas:** textos institucionais e legais. Não remova os shortcodes de conta e carrinho. A homepage visual é o template `front-page.php`; seus textos estão no tema. Menu em **Aparência → Menus**.
- Catálogo em páginas: `[rg_catalog type="vinho"]` ou `[rg_catalog type="especialidade" filters="no"]`. `limit="6"` limita o conjunto exibido; sem limite mostra todo o catálogo publicado da categoria. Cada grupo aceita uma seleção; os grupos se combinam com AND e produtos multiclasse permanecem únicos.

## Comportamento comercial e privacidade

Contas e login são nativos de WordPress/WooCommerce, com senha definida no cadastro. Carrinho permite adicionar, alterar quantidades, remover e escolher retirada/entrega demonstrativa. A simulação só salva a preferência na sessão e mostra confirmação; não coleta endereço.

**Mantenha Raccolto Core ativo:** ele bloqueia gateways, checkout clássico, API de checkout e salvamento de pedidos (incluindo HPOS), e impede todo envio via `wp_mail`, inclusive redefinição de senha. Administrador recupera contas pelo painel. Não configurar SMTP, gateways ou e-mails enquanto o laboratório for demonstrativo. Os bloqueios globais são deliberados para este ambiente; não copie o plugin para uma loja real. A guarda de pedidos pode gerar um log WooCommerce esperado quando se testa uma tentativa bloqueada.

Não foram instalados analytics, pixels ou cookies opcionais. Só cookies/sessões essenciais de conta e carrinho; fotografias e fontes são locais. Caso sejam adicionados rastreadores opcionais, implemente consentimento com aceitar, rejeitar e rever antes de carregar os scripts e atualize os textos legais.

`blog_public=0` permanece ativo; WordPress fornece `noindex`. O sitemap nativo é compatível, mas o WordPress o desabilita durante a não indexação. Não altere esta opção sem uma decisão de publicação. Dados estruturados de produto/site do WooCommerce foram suprimidos; o projeto não se apresenta como um restaurante real.

## Testes

Ver `docs/VALIDACAO.md` para resultados e limites. Testes reproduzíveis:

```bash
find wp-content scripts -name '*.php' -exec php -l {} \;
node --check wp-content/themes/raccolto-galvani/assets/site.js
node --check scripts/browser-test.cjs
php /tmp/rg-wp.phar --allow-root --path=/var/www/html eval-file scripts/server-test.php
```

Teste de navegador requer Node.js, Chromium e `playwright-core`. No laboratório foi instalado em `/tmp/rg-browser`, fora do repositório:

```bash
npm install --prefix /tmp/rg-browser playwright-core
RG_PLAYWRIGHT_PATH=/tmp/rg-browser/node_modules/playwright-core node scripts/browser-test.cjs
```

O teste consulta `home` via WP-CLI para usar o endereço atual; pode definir `RG_SITE_URL` para outro endereço. Também verifica decodificação das imagens e a página nativa de detalhes do produto. O teste mapeia o hostname para loopback no Chromium; execute no servidor que hospeda o site. O teste cria uma conta de teste com domínio `.invalid`, nunca imprime a senha e grava apenas o e-mail em `/tmp/rg-qa-user.json` privado para limpeza posterior. Depois do teste, execute `php /tmp/rg-wp.phar --allow-root --path=/var/www/html eval-file scripts/cleanup-test-user.php`; ele verifica o padrão do e-mail e o papel de cliente antes de remover somente essa conta. Capturas ficam em `/tmp/rg-home-desktop.png` e `/tmp/rg-enoteca-mobile.png`.

## Pendências operacionais

- O laboratório usa HTTP: configurar domínio e HTTPS antes de disponibilizar contas com dados reais; permanecer em demonstração até lá.
- Confirmar acesso externo após reativação do laboratório e alterações de IP/DNS. A validação de navegador é feita localmente, com o hostname do site apontado para loopback.
- A fotografia genérica é reutilizada nos vinhos e algumas especialidades. Pode-se refiná-la com imagens específicas licenciadas; não apresentar os rótulos fictícios como rótulos reais.
- Backups em `/var/backups` precisam de política de retenção e armazenamento seguro definida pelo administrador.
- Não há canal público de contato ou reservas; a página Contato explica o caráter fictício e orienta procurar o administrador do laboratório.
