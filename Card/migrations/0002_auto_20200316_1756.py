# Generated by Django 3.0.4 on 2020-03-16 09:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Card', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='card',
            name='card_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='memoryinfo',
            name='info_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
