FROM php:8.2-apache

# Install PDO MySQL extension for database connectivity
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache rewrite module
RUN a2enmod rewrite

# Copy API files to Apache document root
COPY api/ /var/www/html/

# Expose default HTTP port
EXPOSE 80

CMD ["apache2-foreground"]
