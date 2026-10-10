<?php
/**
 * Plugin Name: Raccolto Core — demonstração
 * Description: Catálogo persistente e proteção comercial do portfólio fictício Raccolto Galvani. Bloqueia pedidos, pagamentos e e-mails.
 * Version: 1.0.1
 * Requires Plugins: woocommerce
 * Requires PHP: 8.0
 */
if (!defined('ABSPATH')) { exit; }
function rg_classifications() {
    return [
        'cor' => ['Cor', ['tinto'=>'Tinto','branco'=>'Branco','rose'=>'Rosé','laranja'=>'Laranja / âmbar']],
        'acucar' => ['Açúcar', ['seco'=>'Seco','demi-sec'=>'Demi-sec','doce'=>'Suave / doce']],
        'efervescencia' => ['Efervescência', ['tranquilo'=>'Tranquilo','frisante'=>'Frisante','espumante'=>'Espumante']],
        'especiais' => ['Especiais', ['fortificado'=>'Fortificado','colheita-tardia'=>'Colheita tardia','botritizado'=>'Botritizado','icewine'=>'Icewine']],
        'cultivo' => ['Cultivo', ['convencional'=>'Convencional','organico'=>'Orgânico','biodinamico'=>'Biodinâmico','natural'=>'Natural']],
    ];
}
function rg_fields() {
    return ['regiao'=>'Região','produtor'=>'Produtor (demonstrativo)','uvas'=>'Uvas','safra'=>'Safra','engarrafamento'=>'Ano de engarrafamento','colheita'=>'Método de colheita','cultivo'=>'Cultivo','vinificacao'=>'Vinificação','notas'=>'Notas sensoriais','harmonizacao'=>'Harmonização'];
}
add_action('init', function () {
    foreach (rg_classifications() as $key => $data) {
        register_taxonomy('rg_' . $key, 'product', ['label'=>$data[0], 'public'=>false, 'show_ui'=>true, 'show_admin_column'=>true, 'show_in_rest'=>true, 'hierarchical'=>true, 'capabilities'=>['manage_terms'=>'manage_product_terms','edit_terms'=>'edit_product_terms','delete_terms'=>'delete_product_terms','assign_terms'=>'assign_product_terms']]);
    }
});
add_action('woocommerce_product_options_general_product_data', function () {
    echo '<div class="options_group"><p>Ficha Raccolto — dados demonstrativos. Safra e engarrafamento são independentes.</p>';
    foreach (rg_fields() as $key => $label) { woocommerce_wp_text_input(['id'=>'_rg_' . $key, 'label'=>$label]); }
    echo '</div>';
});
add_action('woocommerce_admin_process_product_object', function ($product) {
    // WooCommerce checks nonce and product-edit permissions before this hook.
    if (!current_user_can('edit_post', $product->get_id())) { return; }
    foreach (rg_fields() as $key => $label) {
        if (isset($_POST['_rg_' . $key])) { $product->update_meta_data('_rg_' . $key, sanitize_text_field(wp_unslash($_POST['_rg_' . $key]))); }
    }
});
// Disable WooCommerce's optional attribution cookies even if settings change.
add_filter('pre_option_woocommerce_feature_order_attribution_enabled', function () { return 'no'; });
add_filter('wc_order_attribution_allow_tracking', '__return_false');
// These guards remain active independently of the theme.
add_filter('pre_wp_mail', '__return_false', PHP_INT_MAX); // No outgoing mail in this laboratory.
add_filter('woocommerce_available_payment_gateways', '__return_empty_array', PHP_INT_MAX);
add_filter('woocommerce_structured_data_product', '__return_empty_array');
add_filter('woocommerce_structured_data_website', '__return_empty_array');
add_action('woocommerce_before_order_object_save', function () { throw new Exception('Demonstração: criação e alteração de pedidos desabilitadas. Nenhuma compra real.'); }, PHP_INT_MAX);
add_filter('wp_insert_post_data', function ($data) {
    if (in_array($data['post_type'] ?? '', ['shop_order','shop_order_refund'], true)) { wp_die('Pedidos desabilitados nesta demonstração.', 'Demonstração', ['response'=>403]); }
    return $data;
}, PHP_INT_MAX);
add_filter('rest_pre_dispatch', function ($result, $server, $request) {
    if (preg_match('#^/wc/store/[^/]+/checkout(/|$)#', $request->get_route()) || (preg_match('#^/wc/v[0-9]+/orders(/|$)#', $request->get_route()) && $request->get_method() !== 'GET')) {
        return new WP_Error('rg_demo_only', 'Demonstração: pedidos e pagamentos desabilitados.', ['status'=>403]);
    }
    return $result;
}, 10, 3);
add_action('template_redirect', function () {
    if (function_exists('is_checkout') && is_checkout()) { wp_safe_redirect(wc_get_cart_url()); exit; }
});
add_action('woocommerce_proceed_to_checkout', function () {
    remove_action('woocommerce_proceed_to_checkout', 'woocommerce_button_proceed_to_checkout', 20);
}, 1);
function rg_demo_cart() {
    if (!WC()->cart || WC()->cart->is_empty()) { return; }
    $mode = WC()->session->get('rg_fulfilment', 'retirada'); ?>
    <aside class="demo-panel"><h2>Uma experiência demonstrativa</h2><p>Os valores são ilustrativos. Nenhuma cobrança, pedido ou entrega será realizada.</p>
    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>"><input type="hidden" name="action" value="rg_simulate"><?php wp_nonce_field('rg_simulate'); ?>
    <fieldset><legend>Como você imaginaria receber?</legend><label><input type="radio" name="fulfilment" value="retirada" <?php checked($mode, 'retirada'); ?>> Retirada demonstrativa</label><label><input type="radio" name="fulfilment" value="entrega" <?php checked($mode, 'entrega'); ?>> Entrega demonstrativa (sem endereço)</label></fieldset><button type="submit">Simular escolha</button></form></aside>
<?php }
add_action('woocommerce_after_cart', 'rg_demo_cart');
function rg_simulate() {
    check_admin_referer('rg_simulate');
    wc_load_cart();
    WC()->cart->get_cart(); // Load the existing session before mutating from admin-post.
    WC()->session->set_customer_session_cookie(true);
    $mode = sanitize_key(wp_unslash($_POST['fulfilment'] ?? ''));
    if (!in_array($mode, ['entrega','retirada'], true)) { wp_die('Escolha inválida.', '', ['response'=>400]); }
    WC()->session->set('rg_fulfilment', $mode);
    wc_add_notice('Simulação de ' . $mode . ' registrada na sessão. Nenhum pedido foi criado e nenhuma compra será realizada.', 'success');
    wp_safe_redirect(wc_get_cart_url()); exit;
}
add_action('admin_post_rg_simulate', 'rg_simulate');
add_action('admin_post_nopriv_rg_simulate', 'rg_simulate');
function rg_add_product() {
    check_admin_referer('rg_add_product');
    wc_load_cart();
    WC()->cart->get_cart(); // Load the existing session before mutating from admin-post.
    WC()->session->set_customer_session_cookie(true);
    $id = absint($_POST['product_id'] ?? 0);
    $product = wc_get_product($id);
    if (!$product || $product->get_status() !== 'publish' || !$product->is_purchasable()) { wp_die('Produto indisponível.', '', ['response'=>400]); }
    if (!WC()->cart->add_to_cart($id, 1)) { wp_safe_redirect(wc_get_cart_url()); exit; }
    wc_add_notice('Produto adicionado ao carrinho demonstrativo. Nenhuma compra real.', 'success');
    wp_safe_redirect(wc_get_cart_url()); exit;
}
add_action('admin_post_rg_add_product', 'rg_add_product');
add_action('admin_post_nopriv_rg_add_product', 'rg_add_product');
add_action('woocommerce_before_customer_login_form', function () { echo '<p class="demo-notice">Conta de demonstração: use apenas dados de teste. E-mails, inclusive recuperação de senha, estão desativados. Para recuperar acesso, solicite ao administrador do laboratório.</p>'; });
add_filter('woocommerce_get_privacy_policy_text', function ($text, $type) {
    if ($type === 'registration') {
        return 'Use somente dados de teste. Os dados da conta são usados para gerenciar seu acesso à demonstração, conforme nossa [privacy_policy]. Nenhuma compra real será realizada.';
    }
    return $text;
}, 10, 2);
function rg_product_details($product) {
    echo '<p class="demo-tag">Produto demonstrativo · informações ilustrativas</p><p>' . esc_html(wp_strip_all_tags($product->get_description())) . '</p><dl class="wine-facts">';
    foreach (rg_fields() as $key=>$label) {
        $value = $product->get_meta('_rg_' . $key);
        if ($value !== '') { echo '<div><dt>' . esc_html($label) . '</dt><dd>' . esc_html($value) . '</dd></div>'; }
    }
    echo '</dl>';
}
add_action('woocommerce_single_product_summary', function () { global $product; if ($product) { rg_product_details($product); } }, 25);
add_shortcode('rg_catalog', function ($atts) {
    if (!function_exists('wc_get_products')) { return '<p>O catálogo requer WooCommerce ativo.</p>'; }
    $atts = shortcode_atts(['type'=>'vinho','limit'=>-1,'filters'=>'yes'], $atts);
    $products = wc_get_products(['status'=>'publish','limit'=>max(-1, intval($atts['limit'])),'category'=>[sanitize_title($atts['type'])],'orderby'=>'menu_order','order'=>'ASC']);
    $uid = wp_unique_id('catalog-');
    ob_start(); ?>
    <div class="catalog" id="<?php echo esc_attr($uid); ?>">
    <p class="demo-tag">SELEÇÃO DEMONSTRATIVA · PREÇOS ILUSTRATIVOS</p>
    <?php if ($atts['filters'] === 'yes' && $atts['type'] === 'vinho') : ?>
    <form class="filters" aria-label="Filtrar vinhos"><p>Combine classificações. Dentro de cada grupo, escolha uma opção.</p><div class="filter-fields">
    <?php foreach (rg_classifications() as $key=>$data) : ?><label><?php echo esc_html($data[0]); ?><select name="<?php echo esc_attr($key); ?>"><option value="">Todos</option><?php foreach ($data[1] as $slug=>$label) : ?><option value="<?php echo esc_attr($slug); ?>"><?php echo esc_html($label); ?></option><?php endforeach; ?></select></label><?php endforeach; ?>
    <button type="reset" class="reset-filters">Limpar filtros</button></div></form><?php endif; ?>
    <div class="carousel-toolbar"><p class="result-count" role="status" aria-live="polite"><?php echo esc_html(count($products)); ?> produtos</p><div><button type="button" data-direction="-1" aria-label="Produtos anteriores" aria-controls="<?php echo esc_attr($uid); ?>-track">←</button><button type="button" data-direction="1" aria-label="Próximos produtos" aria-controls="<?php echo esc_attr($uid); ?>-track">→</button></div></div>
    <div class="product-track" id="<?php echo esc_attr($uid); ?>-track" tabindex="0" role="region" aria-label="Produtos: use as setas para percorrer">
    <?php foreach ($products as $product) :
        $id = $product->get_id(); $terms = [];
        foreach (rg_classifications() as $key=>$data) { $terms[$key] = wp_get_post_terms($id, 'rg_' . $key, ['fields'=>'slugs']); }
        $image = $product->get_image_id() ? wp_get_attachment_image_url($product->get_image_id(), 'large') : plugins_url('assets/vinho.jpg', __FILE__);
        $dialog_id = $uid . '-product-' . $id; ?>
        <article class="product-card" data-terms="<?php echo esc_attr(wp_json_encode($terms)); ?>"><div class="product-image"><img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($product->get_name() . ' — fotografia ilustrativa'); ?>" loading="lazy"><div class="quick-info"><span><?php echo esc_html($product->get_meta('_rg_uvas')); ?></span><span>Safra <?php echo esc_html($product->get_meta('_rg_safra') ?: 'não se aplica'); ?></span><span><?php echo esc_html($product->get_meta('_rg_harmonizacao')); ?></span></div></div><div class="product-copy"><p class="eyebrow"><?php echo esc_html($product->get_meta('_rg_regiao') ?: 'SAPORI ITALIANI'); ?></p><h3><a class="product-detail" data-dialog="<?php echo esc_attr($dialog_id); ?>" href="<?php echo esc_url($product->get_permalink()); ?>"><?php echo esc_html($product->get_name()); ?> <span aria-hidden="true">↗</span></a></h3><p><?php echo esc_html($product->get_meta('_rg_produtor')); ?></p><div class="price"><?php echo wp_kses_post($product->get_price_html()); ?><span>demonstrativo</span></div></div></article>
    <?php endforeach; ?></div><p class="empty-results" hidden>Nenhum vinho combina com esses filtros. Experimente outra combinação.</p>
    <?php foreach ($products as $product) : $dialog_id = $uid . '-product-' . $product->get_id(); ?>
    <dialog id="<?php echo esc_attr($dialog_id); ?>" class="product-dialog" aria-labelledby="<?php echo esc_attr($dialog_id); ?>-title"><button type="button" class="close-dialog" aria-label="Fechar detalhes">Fechar ×</button><h2 id="<?php echo esc_attr($dialog_id); ?>-title"><?php echo esc_html($product->get_name()); ?></h2><?php rg_product_details($product); ?><form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post"><input type="hidden" name="action" value="rg_add_product"><input type="hidden" name="product_id" value="<?php echo esc_attr($product->get_id()); ?>"><?php wp_nonce_field('rg_add_product'); ?><button type="submit">Adicionar ao carrinho demonstrativo</button></form></dialog>
    <?php endforeach; ?></div>
    <?php return ob_get_clean();
});
add_action('wp_head', function () {
    $desc = is_front_page() ? 'Raccolto Galvani: um portfólio fictício de cozinha italiana, vinhos e encontros à mesa. Explore a enoteca e a gastronomia em modo demonstrativo.' : get_post_meta(get_queried_object_id(), '_rg_description', true);
    if (!$desc && is_singular('product')) { $desc = 'Produto demonstrativo Raccolto Galvani. Conheça a ficha e explore o carrinho sem compras reais.'; }
    if ($desc) { echo '<meta name="description" content="' . esc_attr($desc) . '">' . "\n"; }
});
