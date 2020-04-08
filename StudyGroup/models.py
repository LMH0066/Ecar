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
    people_num = models.IntegerField(default=2)
    # 创建时间
    c_time = models.DateTimeField(auto_now_add=True)


class Chat(models.Model):
    chat_id = models.AutoField(primary_key=True)
    # 发言者
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ChatToFromUser")
    # 评论的Group
    group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE)
    # 内容
    content = models.TextField(blank=True)
    # 评论时间
    c_time = models.DateTimeField(auto_now_add=True)


class TaskList(models.Model):
    task_list_id = models.AutoField(primary_key=True)
    # 所属卡组
    group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE)
    # 标题
    title = models.TextField(blank=True)
    # 内容
    content = models.TextField(blank=True)
    # 复习数量
    review_nums = models.IntegerField(default=0)
    # 创建日期
    c_time = models.DateTimeField(auto_now_add=True)


class Task(models.Model):
    task_id = models.AutoField(primary_key=True)
    # 任务持有者
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # 处于哪个任务列表中
    task_list = models.ForeignKey(TaskList, on_delete=models.CASCADE)
    # 是否重要
    is_importance = models.BooleanField(default=False)
    # 是否完成
    is_accomplish = models.BooleanField(default=False)
    # 是否处于垃圾桶中
    is_read_delete = models.BooleanField(default=False)
    # 创建日期
    c_time = models.DateTimeField(auto_now_add=True)
