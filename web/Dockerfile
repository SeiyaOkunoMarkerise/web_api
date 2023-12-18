FROM php:8.1-apache-bullseye
WORKDIR /var/www

RUN apt-get update && apt-get --no-install-recommends install libpq-dev -y \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && docker-php-ext-install pdo_pgsql \
  && a2enmod rewrite

COPY ./config/php.ini /usr/local/etc/php/
COPY ./config/000-default.conf /etc/apache2/sites-available
COPY ./config/default-ssl.conf /etc/apache2/sites-available
COPY ./data ./data
