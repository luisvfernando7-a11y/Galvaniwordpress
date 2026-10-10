# Validação do Raccolto Galvani — 10/10/2026

Projeto fictício de portfólio. Esta execução preservou a instalação, o conteúdo existente; copiou somente quatro arquivos próprios corrigidos após backup; não reinstalou WordPress ou WooCommerce e não alterou Apache/MariaDB.

## Ambiente e endereço

| Verificação executada | Resultado |
| --- | --- |
| IMDSv2: PUT do token e GET de `public-ipv4` / `public-hostname` | `100.29.12.33` e `ec2-100-29-12-33.compute-1.amazonaws.com`; token não impresso |
| `systemctl is-active apache2 mariadb` | Ambos `active` |
| `apache2ctl configtest` | `Syntax OK`; aviso de ServerName global ausente, sem falha de sintaxe |
| WP-CLI `core version` | WordPress 7.1.3 |
| WP-CLI `plugin list` e `theme list` | WooCommerce 11.2.0, Raccolto Core e tema Raccolto Galvani inicialmente 1.0.0, atualizados para 1.0.1 após correções, ativos; Akismet/Hello inativos |
| `diff -qr` de tema/plugin próprios versus `/var/www/html` | Nenhuma divergência |
| `home` e `siteurl` depois da correção | Ambos `http://ec2-100-29-12-33.compute-1.amazonaws.com` |

Site: http://ec2-100-29-12-33.compute-1.amazonaws.com/

Painel: http://ec2-100-29-12-33.compute-1.amazonaws.com/wp-admin/

## Backup e correção das URLs

Antes de qualquer mutação de banco nesta retomada, `bash scripts/backup.sh` criou `/var/backups/raccolto-20261010-113631`. Diretório 700, `database.sql` e `wordpress.tar.gz` 600. Backup fora do repositório e document root, sem exposição de configuração ou credenciais.

Executado WP-CLI `search-replace --all-tables-with-prefix --skip-columns=guid --precise`, precedido por dry-run. Foram corrigidas 10 ocorrências do DNS da sessão anterior; a conferência posterior encontrou zero ocorrências fora de GUIDs. Outras 3 referências do DNS mais antigo foram corrigidas: duas ações administrativas WooCommerce e um diretório de downloads. O método processa dados serializados e excluiu GUIDs explicitamente.

## Validação de sintaxe e servidor

- `php -l` em todos os 11 arquivos PHP de `wp-content` e `scripts`: sem erros; PHP CLI 8.4.26.
- `node --check` em `assets/site.js` e `scripts/browser-test.cjs`: aprovados; Node.js v20.19.2.
- `scripts/server-test.php` via WP-CLI: aprovado. Confirmou `blog_public=0`, 9 vinhos e 4 especialidades, `wp_mail` bloqueado, gateways vazios, tentativa de salvar pedido impedida e nenhum pedido persistido.
- Store API checkout em GET e POST: HTTP 403 esperado.

A guarda de pedidos gera uma exceção deliberada na tentativa de teste; isso não representa falha comercial. Recuperação de senha por e-mail permanece desativada conforme os textos do laboratório.

## Navegador e revisão visual

Executado `RG_PLAYWRIGHT_PATH=/tmp/rg-browser/node_modules/playwright-core node scripts/browser-test.cjs` com Chromium local. **Execução final: PASS, exit 0.**

| Teste realmente executado | Resultado |
| --- | --- |
| Home, História, Gastronomia, Experiência, Contato, Termos, Privacidade, Conta, Carrinho e Enoteca | HTTP 200; descrição única nas páginas internas previstas; home com um H1 e aviso de projeto fictício |
| Fotos das páginas, catálogo e página nativa de produto | Imagens carregadas e decodificadas, largura natural maior que zero |
| Catálogo e filtros combinados | 9 vinhos; orgânico: 4; orgânico + âmbar: 1; âmbar + natural: 1; acrescentar espumante: 0 com aviso; reset: 9 |
| Carrossel | ArrowRight desloca; botão anterior retorna; percurso responsivo preservado |
| Informações rápidas e detalhes | Foco exibe resumo; Enter abre; Escape fecha; foco volta ao link; ficha inclui ano de engarrafamento; página nativa de produto também validada |
| Carrinho | Adicionar 1 produto, atualizar quantidade para 2, remover; botão de checkout ausente |
| Retirada e entrega | Ambas opções persistem na sessão; confirmação informa que nenhum pedido foi criado |
| Checkout | Página redireciona ao carrinho e Store API POST retorna 403 |
| Conta | Aviso de privacidade em português; botão mostrar/ocultar senha com texto visual e alternância de tipo do campo; cadastro, logout e login aprovados |
| Desktop 1440×1000 e móvel 390×844 | Sem transbordamento horizontal nos caminhos verificados; menu móvel abre e navega à Enoteca; detalhe abre/fecha por toque |
| Preferência por movimento reduzido | Classe de animação não ativada no contexto móvel |
| Erros e recursos | Nenhum `pageerror` ou recurso local HTTP >=400 capturado na página desktop monitorada; 403 de checkout é resposta esperada de teste |
| Cookies | Sem cookie `sbjs_*` no carregamento inicial; não houve auditoria universal de cookies de todos os fluxos |

Capturas `/tmp/rg-home-desktop.png` e `/tmp/rg-enoteca-mobile.png` inspecionadas visualmente, fora do repositório. Nenhuma auditoria formal WCAG ou teste de navegador externo foi realizado.

As execuções intermediárias identificaram problemas no próprio teste: texto da ficha em maiúsculas via CSS, validação de senha disparada ao sair do campo e dois links “Sair”. Corrigidos para `textContent`, Tab/espera de força da senha e seleção pelo menu da conta. A revisão visual revelou dois problemas reais de interface: botão de senha vazio sem CSS WooCommerce e aviso de cadastro em inglês; ambos corrigidos em tema/plugin 1.0.1 e testados na execução final.

Criadas apenas contas sintéticas `example.invalid`, sem impressão ou gravação de senha. As duas contas que efetivamente foram criadas foram removidas com `scripts/cleanup-test-user.php`, verificando padrão de e-mail e papel `customer`. Registro temporário removido. Teste de servidor repetido após limpeza: PASS, nenhum pedido. Arquivos instalados novamente comparados ao repositório: nenhuma divergência. Conferência final do DNS mais antigo: zero substituições pendentes fora de GUIDs.

## Rede: evidências e limitações

| Origem do teste | Resultado e alcance |
| --- | --- |
| `curl --resolve <DNS>:80:127.0.0.1 --noproxy '*'` na EC2 | Home HTTP 200: Apache/WordPress e Host corretos em loopback |
| `curl --noproxy '*' http://<DNS>/` na própria EC2 | Home HTTP 200 pelo DNS público, mas a origem ainda é a EC2 |
| Ferramenta web externa: DNS HTTP e IPv4 HTTP | Não produziu resposta HTTP utilizável; no DNS tentou HTTPS e informou indisponibilidade. Não comprova bloqueio HTTP nem acesso externo |
| Chromium/Playwright | Hostname explicitamente mapeado para `127.0.0.1`; testes locais |

**Acesso HTTP externo não comprovado.** Nenhuma falha de Security Group foi diagnosticada e não houve mudança de regras AWS. Para conferir, abrir a URL HTTP a partir de outra rede ou executar `curl -I http://ec2-100-29-12-33.compute-1.amazonaws.com/` fora da EC2.

Se esse teste externo apresentar timeout e o Security Group não permitir HTTP, a regra de entrada necessária é **TCP porta 80**, origem **IPv4 público do visitante/32** para acesso restrito, ou **0.0.0.0/0** se a intenção for acesso público irrestrito. Confirmar também rota pública/Internet Gateway e NACL permitindo ida e retorno; sem inspecionar a AWS não é possível atribuir uma causa específica. HTTPS exige configurar certificado e virtual host antes de liberar TCP 443. Não disponibilizar contas com dados reais enquanto o laboratório usar HTTP.

## Comparação com o contexto

As páginas previstas, catálogo persistente administrável, cinco classificações independentes, safra/engarrafamento separados, fotos locais documentadas, conta nativa, carrinho e simulação estão implementados. O rodapé, as fichas e as páginas legais identificam a ficção. Sem pagamentos, pedidos ou endereços de entrega reais. Não indexação mantida; sitemap desabilitado pelo próprio WordPress nessa condição. Consentimento opcional só será necessário se forem incorporados rastreadores opcionais.

Pendências operacionais: domínio/Elastic IP e HTTPS; comprovação externa; política de retenção de backups; refinamento opcional das fotos genéricas. Não é necessário reinstalar componentes para essas pendências.

## Revisão para versionamento

`git diff --check` aprovado. Revisados os arquivos modificados e os caminhos versionados: apenas tema, plugin próprio, fotos com fontes de licença documentadas, scripts e documentação. Núcleo WordPress, WooCommerce de terceiros, uploads, configuração, credenciais, backups, dumps, logs e registro da conta sintética ficam fora do Git. Exclusões adicionais de backups/arquivos de banco reforçadas no `.gitignore`.
