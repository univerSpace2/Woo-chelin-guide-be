from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, organization, password):

        if not email:
            raise ValueError('must have user email')
        if not password:
            raise ValueError('must have user password')

        user = self.model(
            email=self.normalize_email(email),
            organization=organization
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):

        user = self.create_user(
            email=self.normalize_email(email),
            password=password
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
    team_id = models.CharField(verbose_name='팀ID',max_length=30)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['organization']

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

    def __str__(self):
        return self.name

class UserWorkStatus(models.Model):
    WORK_STATUS = (
        (1, '출근'),
        (2, '재택근무'),
        (3, '휴가'),
        (4, '오전반차/출근'),
        (5, '오전반차/휴가'),
        (6, '오후반차/출근'),
        (7, '오후반차/휴가'),
        (8, '오전반차/재택근무'),
        (9, '오후반차/재택근무'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    work_status = models.IntegerField(choices=WORK_STATUS, default=1)

    def __str__(self):
        return self.user.email