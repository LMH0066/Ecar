# Generated by Django 3.0.4 on 2020-03-17 08:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Login', '0002_auto_20200316_1756'),
        ('Deck', '0002_auto_20200316_1756'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='deck',
            name='memory_count',
        ),
        migrations.RemoveField(
            model_name='deck',
            name='now_review_nums',
        ),
        migrations.CreateModel(
            name='DeckInfo',
            fields=[
                ('info_id', models.AutoField(primary_key=True, serialize=False)),
                ('memory_count', models.IntegerField(default=0)),
                ('now_review_nums', models.IntegerField(default=0)),
                ('deck', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='DeckInfoToDeck', to='Deck.Deck')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='DeckInfoToUser', to='Login.User')),
            ],
        ),
    ]