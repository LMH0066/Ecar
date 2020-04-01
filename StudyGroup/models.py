from django.db import models

# Create your models here.
from Login.models import User


class StudyGroup(models.Model):
    group_id = models.AutoField(primary_key=True)
    # 名称
    group_name = models.CharField(max_length=30)
    # 关联卡组
    deck_id = models.IntegerField()
    # 人数
    people_num = models.IntegerField(default=1)
    # 创建时间
    c_time = models.DateTimeField(auto_now_add=True)


class Chat(models.Model):
    chat_id = models.AutoField(primary_key=True)
    # 发言者
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ChatToFromUser" )
    # 接收者
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ChatToToUser")
    # 评论的Group
    group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE)
    # 内容
    content = models.TextField(blank=True)
    # 评论时间
    c_time = models.DateTimeField(auto_now_add=True)
