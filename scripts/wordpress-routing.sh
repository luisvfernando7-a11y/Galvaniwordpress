#!/bin/bash
set -euo pipefail
umask 077
backup_dir="/var/backups/raccolto-routing-$(date -u +%Y%m%d-%H%M%S)"
mkdir -p "$backup_dir"
cp -a /etc/apache2 "$backup_dir/apache2"
if [ -f /var/www/html/index.html ]; then mv /var/www/html/index.html "$backup_dir/apache-default-index.html"; fi
cat > /etc/apache2/conf-available/raccolto-wordpress.conf <<'APACHE'
# WordPress routing, confined to the existing authorized document root.
<Directory /var/www/html>
    AllowOverride FileInfo
    DirectoryIndex index.php index.html
</Directory>
APACHE
a2enmod rewrite
a2enconf raccolto-wordpress
apache2ctl configtest
systemctl reload apache2
printf 'Configuração anterior preservada em %s\n' "$backup_dir"
