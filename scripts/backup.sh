#!/bin/bash
set -euo pipefail
umask 077
backup_dir="/var/backups/raccolto-$(date -u +%Y%m%d-%H%M%S)"
mkdir -p "$backup_dir"
php /tmp/rg-wp.phar --allow-root --path=/var/www/html db export "$backup_dir/database.sql" --quiet
# Private complete file snapshot: includes config only inside restricted backup, never output.
tar -czf "$backup_dir/wordpress.tar.gz" -C /var/www/html .
chmod 700 "$backup_dir"
printf 'Backup privado concluído: %s\n' "$backup_dir"
