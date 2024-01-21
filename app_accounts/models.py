from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


# Create your models here.
class UserManager(BaseUserManager):
    use_in_migrations = True

    def create(self,**kwargs):
        user = self.create_user(email=kwargs.pop('email'), password=kwargs.pop('password'))
        for key, value in kwargs.items():
            setattr(user, key, value)
        user.save(using=self._db)
        return user

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
    department = models.ForeignKey('Department', on_delete=models.CASCADE, null=True, related_name='users')
    slack_member_id = models.CharField(max_length=30, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f'User {self.email}'

    @property
    def is_staff(self):
        return self.is_admin

    class Meta:
        db_table = 'app_accounts_user'


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=30)
    phone = models.CharField(max_length=30, blank=True)
    anonymous_name = models.CharField(verbose_name='익명이름', max_length=30)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'app_accounts_profile'

class Department(models.Model):
    department_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=30)
    boss = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='departments')

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'app_accounts_department'
