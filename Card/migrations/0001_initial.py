# Generated by Django 3.0.4 on 2020-03-16 09:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Login', '0001_initial'),
        ('Deck', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Card',
            fields=[
                ('card_id', models.IntegerField(primary_key=True, serialize=False)),
                ('q_text', models.TextField(blank=True, null=True)),
                ('q_img', models.ImageField(blank=True, null=True, upload_to='question')),
                ('ans_text', models.TextField(blank=True, null=True)),
                ('ans_img', models.ImageField(blank=True, null=True, upload_to='answer')),
                ('recall_secs', models.IntegerField(default=10)),
                ('c_time', models.DateTimeField(auto_now_add=True)),
                ('deck', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Deck.Deck')),
            ],
        ),
        migrations.CreateModel(
            name='MemoryInfo',
            fields=[
                ('info_id', models.IntegerField(primary_key=True, serialize=False)),
                ('memory_integral', models.IntegerField(default=0)),
                ('last_memory_time', models.DateField(null=True)),
                ('review_time', models.DateField(null=True)),
                ('now_correct_times', models.IntegerField(default=0)),
                ('now_error_times', models.IntegerField(default=0)),
                ('need_correct_times', models.IntegerField(default=4)),
                ('is_memory_over', models.BooleanField(default=False)),
                ('memory_times', models.IntegerField(default=0)),
                ('card', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='InfoToCard', to='Card.Card')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='InfoToUser', to='Login.User')),
            ],
        ),
    ]
