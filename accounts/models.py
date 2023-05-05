from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password):

        if not email:
            raise ValueError('must have user email')
        if not password:
            raise ValueError('must have user password')
        user = self.model(
            email=self.normalize_email(email),
            )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):

        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
        )
        user.is_admin = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    objects = UserManager()

    email = models.EmailField(verbose_name='이메일',
                              max_length=255,
                              unique=True,
                              )
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    @property
    def is_staff(self):
        return self.is_admin


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=30)
    eng_name = models.CharField(max_length=30)
    phone = models.CharField(max_length=30, blank=True)
    anonymous_name = models.CharField(verbose_name='익명이름', max_length=30)

    def __str__(self):
        return self.name
