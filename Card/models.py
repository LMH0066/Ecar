from django.db import models
from Deck.models import Deck
from Login.models import User


class Card(models.Model):
    card_id = models.AutoField(primary_key=True)
    # 正面文本、图像
    q_text = models.TextField(null=True, blank=True)
    q_img = models.ImageField(upload_to="question", null=True, blank=True)
    # 反面文本、图像
    ans_text = models.TextField(null=True, blank=True)
    ans_img = models.ImageField(upload_to="answer", null=True, blank=True)
    # 回忆时间：单位s，默认10s
    recall_secs = models.IntegerField(default=10)
    # 所属卡组
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    # 创建时间
    c_time = models.DateTimeField(auto_now_add=True)


class MemoryInfo(models.Model):
    info_id = models.AutoField(primary_key=True)
    # 记忆积分
    memory_integral = models.IntegerField(default=0)
    # 上次记忆时间
    last_memory_time = models.DateField(null=True)
    # 下次复习时间
    review_time = models.DateField(null=True)
    # 本次连续答对次数
    now_correct_times = models.IntegerField(default=0)
    # 本次累计错误次数
    now_error_times = models.IntegerField(default=0)
    # 需要连续答对的次数
    need_correct_times = models.IntegerField(default=4)
    # 是否记忆完成
    is_memory_over = models.BooleanField(default=False)
    # 记忆次数
    memory_times = models.IntegerField(default=0)
    # 所属卡片
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name="InfoToCard")
    # 所属用户
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="InfoToUser")
