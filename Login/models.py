from django.db import models


# Create your models here.
class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    user_name = models.CharField(max_length=32, unique=True)
    password = models.CharField(max_length=32)
    email = models.EmailField()
    avatar = models.ImageField(upload_to="avatar", null=True, blank=True)
    bio = models.TextField(blank=True)
    c_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user_id

    class Meta:
        ordering = ["c_time"]
        verbose_name = verbose_name_plural = "用户"


# 过去时间的记忆信息.
class PastInfo(models.Model):
    # 用户
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # 当天记忆数目
    memory_count = models.IntegerField(default=0)
    # 当天复习数目
    review_count = models.IntegerField(default=0)
    # 时间
    time = models.DateField(auto_now_add=True)