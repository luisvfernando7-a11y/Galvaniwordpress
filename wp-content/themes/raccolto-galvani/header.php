<?php if (!defined('ABSPATH')) { exit; } ?><!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>><?php wp_body_open(); ?>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<div class="topline">ROMA, NEL CUORE · UMA HISTÓRIA IMAGINADA DESDE 1982</div>
<header class="site-header">
<a class="brand" href="<?php echo esc_url(home_url('/')); ?>"><span class="crest" aria-hidden="true">RG</span><span>Raccolto Galvani<small>CUCINA ITALIANA & ENOTECA</small></span></a>
<button class="menu-toggle" aria-controls="navigation" aria-expanded="false">Menu <span aria-hidden="true">☰</span></button>
<nav id="navigation" aria-label="Principal"><?php wp_nav_menu(['theme_location'=>'primary','container'=>false,'fallback_cb'=>false,'depth'=>1]); ?></nav>
<div class="utility"><a href="<?php echo esc_url(rg_link('conta')); ?>">Conta</a><a href="<?php echo esc_url(rg_link('carrinho')); ?>">Carrinho <span aria-hidden="true">↗</span></a></div>
</header>
<main id="conteudo">
