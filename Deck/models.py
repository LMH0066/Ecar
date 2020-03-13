from django.db import models
from Login.models import User


class Deck(models.Model):
    deck_id = models.IntegerField(primary_key=True)
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
    c_time = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return u'<%s,%d>' % (self.name, self.deck_id)