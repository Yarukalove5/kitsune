# Generated by Django 4.2.11 on 2024-06-11 05:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0008_auto_20240606_2111"),
    ]

    operations = [
        migrations.CreateModel(
            name="TopicSlugHistory",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("slug", models.SlugField(max_length=255, unique=True)),
                ("created", models.DateTimeField(auto_now_add=True)),
                (
                    "topic",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="slug_history",
                        to="products.topic",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Topic slug history",
                "ordering": ["-created"],
            },
        ),
    ]
