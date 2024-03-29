# Generated by Django 4.2 on 2024-01-18 16:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app_accounts', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='eng_name',
        ),
        migrations.AddField(
            model_name='user',
            name='slack_member_id',
            field=models.CharField(max_length=30, null=True),
        ),
        migrations.CreateModel(
            name='Department',
            fields=[
                ('department_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=30)),
                ('boss', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='departments', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'app_accounts_department',
            },
        ),
        migrations.AddField(
            model_name='user',
            name='department',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='users', to='app_accounts.department'),
        ),
    ]
