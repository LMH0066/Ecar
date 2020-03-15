from django.db import models
from Deck.models import Deck

"""
记忆功能：
* 点击进入Deck
* 根据卡组id找到对应的Deck
* 点击记忆按钮，开始记忆模式【先复习|后记忆新卡片】
##基本功能：修改卡片
##功能0：将所选卡片移动到所选卡组
    将Card.deck设置为所选卡组
    
##功能1：复习
#卡组初始化：每日需要将Deck.now_review_nums置零
*   if(Deck中有Card.review_time为今天且Card.is_memory_over为False的卡片):
        从卡组中复习日期为今日的卡片中随机抽取一张卡片
        执行功能3
        执行功能1
    else:
        执行功能2
        
##功能2：新的记忆
*   if(Deck.now_review_nums < Deck.need_review_nums):
        从卡组中Card.review_time为null且Card.is_memory_over为False的卡片中随机抽取一张卡片,若无卡片满足则结束
        执行功能3
        执行功能2
    else:
        记忆完成，可喜可贺
        
##功能3：卡片复习|记忆
#卡片初始化: Card.now_correct_times置零,Card.now_error_times置零
*   if(等待时间小于Card.recall_secs):
        if(左-遗忘查看答案): 
            Card.now_correct_times置零
            Card.now_error_times加一
        else if(右-记住)：
            Card.now_correct_times加一
            if(Card.now_correct_times >= Card.need_correct_times):
                #今日记忆完成
                Card.last_memory_time设为今天
                #下次复习时间改变
                Card.review_time设为今天之后n天,n>0,n=4-Card.now_error_times
                if(Card.now_error_times == 0):
                    #下次记忆时间减半
                    Card.need_correct_times /= 2
                if(Card.need_correct_times == 0):
                    #该卡片记忆完成
                    Card.is_memory_over = True
                    Deck.memory_count += 1         
        else:
            无
    else:
        按空格键查看答案
        if(左-遗忘查看答案): 
            Card.now_correct_times置零
            Card.now_error_times加一
        else if(右-记住)：
            Card.now_correct_times加一
            if(Card.now_correct_times >= Card.need_correct_times):
                #今日记忆完成
                Card.last_memory_time设为今天
                #下次复习时间改变
                Card.review_time设为今天之后n天,n>0,n=4-Card.now_error_times
                if(Card.now_error_times == 0):
                    #下次记忆时间减半
                    Card.need_correct_times /= 2
                if(Card.need_correct_times == 0):
                    #该卡片记忆完成
                    Card.is_memory_over = True         
        else:
            无
"""


class Card(models.Model):
    card_id = models.IntegerField(primary_key=True)
    # 正面文本、图像
    q_text = models.TextField(null=True, blank=True)
    q_img = models.ImageField(upload_to="question", null=True, blank=True)
    # 反面文本、图像
    ans_text = models.TextField(null=True, blank=True)
    ans_img = models.ImageField(upload_to="answer", null=True, blank=True)
    # 回忆时间：单位s，默认10s
    recall_secs = models.IntegerField(default=10)
    # 记忆积分
    memory_integral = models.IntegerField(default=0)
    # 所属卡组
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    # 创建时间
    c_time = models.DateTimeField(auto_now_add=True)
    # 上次记忆时间
    last_memory_time = models.DateField(null=True)
    # 下次复习时间
    review_time = models.DateField()
    # 本次连续答对次数
    now_correct_times = models.IntegerField(default=0)
    # 本次累计错误次数
    now_error_times = models.IntegerField(default=0)
    # 需要连续答对的次数
    need_correct_times = models.IntegerField(default=4)
    # 是否记忆完成
    is_memory_over = models.BooleanField(default=False)
