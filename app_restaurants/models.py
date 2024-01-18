from django.db import models

from app_accounts.models import User


class Restaurant(models.Model):
    type_choices = (
        ('점심', '점심'),
        ('회식', '회식'),
        ('카페', '카페')
    )
    genre_choices = (
        ('중식', '중식'),
        ('인도음식', '인도음식'),
        ('동남아음식', '동남아음식'),
        ('한식', '한식'),
        ('일식', '일식'),
        ('이탈리아음식', '이탈리아음식'),
        ('바', '바'),
        ('양식', '양식'),
        ('치킨', '치킨'),
        ('피자', '피자'),
        ('카페', '카페'),
        ('디저트', '디저트'),
        ('호프', '호프'),
        ('주점','주점'),
    )

    name = models.CharField(max_length=120)
    description = models.TextField(default="")
    rating = models.FloatField(default=0)
    average_price = models.IntegerField(default=0)
    address_ko = models.CharField(default="",max_length=120)
    address_en = models.CharField(max_length=120, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    latitude = models.DecimalField(max_digits=10, decimal_places=6)
    type = models.CharField(max_length=2, choices=type_choices)
    genre = models.CharField(max_length=10, choices=genre_choices)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'app_restaurants_restaurant'


class Review(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    content = models.TextField()
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    good_cnt = models.IntegerField(default=0)
    bad_cnt = models.IntegerField(default=0)

    def __str__(self):
        return self.content

    class Meta:
        db_table = 'app_restaurants_review'
