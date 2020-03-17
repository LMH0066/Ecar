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
    # 卡组内以记忆总数
    memory_count = models.IntegerField(default=0)
    # 创建者
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    # 管理员
    admins = models.ManyToManyField(User, related_name='AdminsToDeck')
    # 卡组用户
    staffs = models.ManyToManyField(User, related_name='StaffsToDeck')
    # 单次需要复习个数
    need_review_nums = models.IntegerField(default=10)
    # 本日已经复习个数
    now_review_nums = models.IntegerField(default=10)
    # 共享ID
    share_id = models.CharField(max_length=32)
    # 共享密码
    share_password = models.CharField(max_length=32)
    # 拷贝ID
    copy_id = models.CharField(max_length=32)
    # 创建时间
    c_time = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return u'<%s,%d>' % (self.name, self.deck_id)
