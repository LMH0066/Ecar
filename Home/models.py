from django.db import models
from Deck.models import Deck
from Login.models import User


# Create your models here.


# 公共卡组
class PublicDecks(models.Model):
    public_id = models.AutoField(primary_key=True)
    # 关联卡组
    deck_id = models.IntegerField()
    # 赞赏数
    star_num = models.IntegerField(default=0)
    # 赞赏的人
    star_users = models.ManyToManyField(User, related_name='UserToStarDeck')
    # 评论数
    comment_num = models.IntegerField(default=0)
    # 发布者
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    # 发布时间
    c_time = models.DateTimeField(auto_now_add=True)


# 评论
class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    # 评论者
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # 评论的Deck
    public_deck = models.ForeignKey(PublicDecks, on_delete=models.CASCADE)
    # 内容
    content = models.TextField(blank=True)
    # 评论时间
    c_time = models.DateTimeField(auto_now_add=True)
