<?php get_header(); while (have_posts()) : the_post(); ?>
<header class="page-heading"><p class="eyebrow">RACCOLTO GALVANI / <?php echo esc_html(get_post_meta(get_the_ID(), '_rg_italian', true) ?: 'LA CASA'); ?></p><h1><?php the_title(); ?></h1><p><?php echo esc_html(get_post_meta(get_the_ID(), '_rg_description', true)); ?></p></header>
<article class="page-content section"><?php the_content(); ?></article>
<?php endwhile; get_footer(); ?>
