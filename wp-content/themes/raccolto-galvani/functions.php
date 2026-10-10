<?php
if (!defined('ABSPATH')) { exit; }
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);
    register_nav_menus(['primary' => 'Navegação principal']);
});
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('raccolto', get_theme_file_uri('assets/site.css'), [], '1.0.1');
    wp_enqueue_script('raccolto', get_theme_file_uri('assets/site.js'), [], '1.0.1', true);
});
function rg_image($name) { return get_theme_file_uri('assets/' . $name . '.jpg'); }
function rg_link($slug) { return home_url('/' . $slug . '/'); }
add_filter('woocommerce_enqueue_styles', '__return_empty_array');
