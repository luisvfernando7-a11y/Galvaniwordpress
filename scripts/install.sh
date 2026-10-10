#!/bin/bash
set -euo pipefail
# Execute from repository root, AFTER scripts/backup.sh.
wp_cli=(php /tmp/rg-wp.phar --allow-root --path=/var/www/html)
"${wp_cli[@]}" core is-installed
unzip -q -o /tmp/rg-woocommerce.zip -d /var/www/html/wp-content/plugins
cp -a wp-content/plugins/raccolto-core /var/www/html/wp-content/plugins/
cp -a wp-content/themes/raccolto-galvani /var/www/html/wp-content/themes/
chown -R www-data:www-data /var/www/html/wp-content/plugins/raccolto-core /var/www/html/wp-content/plugins/woocommerce /var/www/html/wp-content/themes/raccolto-galvani
"${wp_cli[@]}" plugin activate woocommerce
"${wp_cli[@]}" plugin activate raccolto-core
"${wp_cli[@]}" theme activate raccolto-galvani
"${wp_cli[@]}" eval-file scripts/configure.php
"${wp_cli[@]}" language core install pt_BR --activate
"${wp_cli[@]}" language plugin install woocommerce pt_BR
"${wp_cli[@]}" rewrite flush
