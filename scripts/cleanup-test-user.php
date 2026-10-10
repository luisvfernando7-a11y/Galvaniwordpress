<?php
// Remove only the synthetic account recorded by browser-test.cjs.
if (!defined('WP_CLI') || !WP_CLI) { exit; }
$record = '/tmp/rg-qa-user.json';
if (!is_file($record)) { WP_CLI::success('Nenhuma conta de teste registrada para limpeza.'); return; }
$data = json_decode(file_get_contents($record), true);
$email = $data['email'] ?? '';
if (!is_string($email) || !preg_match('/^rg-qa-[0-9]+@example\.invalid$/D', $email)) {
    WP_CLI::error('Registro de teste inválido; nenhuma conta removida.');
}
$user = get_user_by('email', $email);
if ($user) {
    if ($user->roles !== ['customer']) { WP_CLI::error('Papel inesperado; nenhuma conta removida.'); }
    require_once ABSPATH . 'wp-admin/includes/user.php';
    if (!wp_delete_user($user->ID)) { WP_CLI::error('Não foi possível remover a conta de teste.'); }
}
unlink($record);
WP_CLI::success('Conta sintética e registro temporário removidos; demais usuários preservados.');
