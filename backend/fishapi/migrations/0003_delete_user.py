# Generated by Django 5.2.2 on 2025-06-05 09:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fishapi', '0002_product_is_available_user'),
    ]

    operations = [
        migrations.DeleteModel(
            name='User',
        ),
    ]
