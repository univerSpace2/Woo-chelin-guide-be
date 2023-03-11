from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Restaurant(models.Model):
    type_choices = (
        ('L', 'Lunch'),
        ('M', 'Mess'),
        ('C', 'Cafe')
    )
    genre_choices = (
        ('C', 'Chinese'),
        ('I', 'Indian'),
        ('K', 'Korean'),
        ('j', 'Japanese'),
        ('I', 'Italian'),
        ('B', 'Bar'),
        ('W', 'Western'),
        ('Ch', 'Chicken'),
        ('P', 'Pizza'),
        ('Cf', 'Cafe'),
        ('D', 'Dessert'),
    )

    name = models.CharField(max_length=120)
    description = models.TextField()
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0)
    average_price = models.DecimalField(max_digits=6, decimal_places=0)
    address_ko = models.CharField(max_length=120)
    address_en = models.CharField(max_length=120, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    latitude = models.DecimalField(max_digits=10, decimal_places=6)
    type = models.CharField(max_length=1, choices=type_choices)
    genre = models.CharField(max_length=2, choices=genre_choices)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'restaurant'


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
        db_table = 'user_review'
