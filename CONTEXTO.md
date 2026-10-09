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
