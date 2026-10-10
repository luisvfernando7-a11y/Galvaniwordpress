<?php
if (!defined('WP_CLI') || !WP_CLI) { exit; }
function rg_assert($condition,$message) { if (!$condition) { WP_CLI::error($message); } }
rg_assert(get_option('blog_public')==='0','Não indexação deve permanecer ativa.');
rg_assert(count(wc_get_products(['category'=>['vinho'],'limit'=>-1]))===9,'Nove vinhos demonstrativos esperados.');
rg_assert(count(wc_get_products(['category'=>['especialidade'],'limit'=>-1]))===4,'Quatro especialidades esperadas.');
rg_assert(wp_mail('qa@example.invalid','Teste bloqueado','Não deve sair')===false,'E-mails devem ser bloqueados.');
rg_assert(apply_filters('woocommerce_available_payment_gateways',['dummy'=>'gateway'])===[],'Gateways devem estar bloqueados.');
$blocked=false;
try { $order=new WC_Order();$blocked=$order->save()===0 && $order->get_id()===0; } catch (Exception $e) { $blocked=str_contains($e->getMessage(),'Demonstração'); }
rg_assert($blocked,'Criação de pedidos deve falhar antes de persistir.');
rg_assert(count(wc_get_orders(['limit'=>-1]))===0,'Nenhum pedido deve ser criado.');
foreach (['POST','GET'] as $method) {
    $request=new WP_REST_Request($method,'/wc/store/v1/checkout');
    $response=rest_do_request($request);
    rg_assert($response->get_status()===403,'Checkout Store API deve estar bloqueado para '.$method);
}
WP_CLI::success('Não indexação, produtos persistentes, e-mail, gateways, guarda de pedidos e Store API verificados. Nenhum pedido criado.');
