from django.db import models
from Login.models import User


# 所需功能
# 功能1：共享[share_id + share_password]
# 功能2：拷贝[copy_id]


class Deck(models.Model):
    deck_id = models.AutoField(primary_key=True)
    # 卡组名
    name = models.CharField(max_length=30)
    # 卡组内卡片总数
    amount = models.IntegerField(default=0)
    # 创建者
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    # 管理员
    admins = models.ManyToManyField(User, related_name='AdminsToDeck')
    # 卡组用户
    staffs = models.ManyToManyField(User, related_name='StaffsToDeck')
    # 单次需要复习个数
    need_review_nums = models.IntegerField(default=0)

    def __unicode__(self):
        return u'<%s,%d>' % (self.name, self.deck_id)


class DeckInfo(models.Model):
    info_id = models.AutoField(primary_key=True)
    # 卡组已记忆卡片数
    memory_count = models.IntegerField(default=0)
    # 本日已经复习个数
    now_review_nums = models.IntegerField(default=0)
    # 所属卡组
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE, related_name="DeckInfoToDeck")
    # 所属用户
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="DeckInfoToUser")


class ShareInfo(models.Model):
    share_id = models.AutoField(primary_key=True)
    # 共享ID
    share_code = models.CharField(max_length=32, unique=True)
    # 共享密码
    share_password = models.CharField(max_length=32)
    # 关联卡组
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    # 创建时间
    c_time = models.DateField(auto_now_add=True)


class CopyInfo(models.Model):
    copy_id = models.AutoField(primary_key=True)
    # 拷贝ID
    copy_code = models.CharField(max_length=32, unique=True)
    # 关联卡组
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    # 创建时间
    c_time = models.DateField(auto_now_add=True)
