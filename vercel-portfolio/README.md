# Raccolto Galvani — portfólio estático

Versão independente do restaurante fictício: HTML, CSS, JavaScript, fotos locais e 13 produtos ilustrativos em `public/data/catalog.json`. Sem PHP, WordPress, banco, APIs AWS, autenticação ou cobrança. A pasta inteira pode ser construída sozinha, sem acesso aos arquivos WordPress do repositório.

## Importar na Vercel

Importe `https://github.com/luisvfernando7-a11y/Galvaniwordpress` ou ajuste o projeto existente `raccoltogalvani`:

| Campo | Valor exato |
| --- | --- |
| Root Directory | `vercel-portfolio` |
| Framework Preset | `Other` |
| Build Command (Override) | `node build.mjs` |
| Output Directory (Override) | `public` |
| Install Command (Override) | Campo vazio — nenhuma dependência para construir |
| Development Command | Sem override; não necessário para deployment |
| Production Branch | `main` |
| Variáveis de ambiente / segredos | Nenhuma variável obrigatória |

`vercel.json` está apenas nesta pasta e declara os mesmos build/output, URLs com barra final e cabeçalhos. **Root Directory é configuração do projeto na Vercel e precisa ser conferido no painel**: um arquivo dentro da subpasta não corrige sozinho um projeto que continua publicando a raiz do repositório.

No projeto existente, confira Settings → Build and Deployment (ou Build & Development Settings), Settings → Git para o repositório/branch e Settings → Domains para `raccoltogalvani.vercel.app`. Salve os campos e crie um novo deployment da `main`; confira os logs com `Built 23 static pages + 404` e o commit utilizado. Não basta redeployar um commit anterior que ainda não contém esta pasta.

A validação final do domínio deve conferir `/`, `/enoteca/`, `/gastronomia/`, `/conta/`, `/carrinho/`, imagens e `https://raccoltogalvani.vercel.app/data/build.json`. Esse arquivo contém o marcador `raccolto-static-v1`, hash do catálogo público e, quando disponibilizado pelo ambiente de build da Vercel, o SHA Git. Não contém segredos.

Referência: [configuração de build da Vercel](https://vercel.com/docs/builds/configure-a-build).

## Construir e testar localmente

Node.js 20+ para construir, sem instalação de dependências:

```bash
node vercel-portfolio/build.mjs
python3 -m http.server 8080 --directory vercel-portfolio/public --bind 127.0.0.1
```

Abra `http://127.0.0.1:8080/`. Os arquivos publicados são somente os de `public/`. Não abra com `file://`, pois o carrinho carrega o JSON pela origem do site.

Teste automatizado requer Chromium e Playwright Core já instalados no ambiente de QA, fora do projeto:

```bash
RG_PLAYWRIGHT_PATH=/tmp/rg-browser/node_modules/playwright-core node vercel-portfolio/tests/browser-test.cjs
```

Sem `RG_PORTFOLIO_URL`, o teste inicia/encerra seu próprio servidor temporário e aplica os cabeçalhos da configuração. Com `RG_PORTFOLIO_URL=https://raccoltogalvani.vercel.app`, testa o domínio público, sem servidor local. Em ambos os modos bloqueia requisições fora da origem testada. Não se conecta ao WordPress. Capturas ficam em `/tmp/rg-portfolio-desktop.png` e `/tmp/rg-portfolio-mobile.png`. Resultados realmente executados: `../docs/VALIDACAO-VERCEL.md`.

## Conteúdo e manutenção

- `templates/home.html`: homepage adaptada do tema WordPress atual.
- `templates/pages.json`: textos publicados de História, Enoteca, Gastronomia, Experiência e Contato; revisão manual para manter apenas links locais.
- `public/data/catalog.json`: somente nomes, slugs, categorias, preços demonstrativos, fotos locais, classificações e ficha pública dos 13 produtos.
- `build.mjs`: gera a home, nove páginas internas, 13 páginas de produto e uma 404. Termos, privacidade e conta/carrinho são próprios desta versão.
- `public/assets/site.css` e `site.js`: cópias da base visual e das interações do tema; `portfolio.css` e `portfolio.js` implementam os comportamentos estáticos.
- Fotos idênticas às do WordPress, com fontes/licença registradas em `../FONTES-IMAGENS.md`.

**Não há sincronização automática com WordPress.** Edite JSON/templates e reconstrua HTML, ou faça uma nova leitura seletiva de conteúdo público seguida de revisão. Nunca copie banco, usuários, pedidos, sessões, nonces, credenciais ou uploads indiscriminadamente. Alterações nesta pasta também não atualizam o tema/plugin da AWS.

O carrinho armazena apenas slugs de produtos, quantidades de 1 a 99 e preferência retirada/entrega na chave localStorage `rg-portfolio-cart-v1`. “Limpar seleção” remove a chave; se o armazenamento estiver bloqueado, a seleção permanece somente em memória na página atual. Não há endpoint comercial ou transferência de dados do carrinho. A conta é uma prévia que não cria usuário nem autentica ninguém.

A aplicação não usa cookies, fontes remotas, analytics ou pixels. A hospedagem pode registrar requisições técnicas. Não indexação mantida por meta robots; não há schema de negócio real.
