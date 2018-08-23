<template>
    <div class="jifen_container" :class="{'bottom':!helpShow}">
        <head-top headTitle='我的鲸鱼分'>
            <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="toMine">
            <img slot="custom" src="../../images/jifenHelp.png" class="jifen_help" @click="helpShow=true">
        </head-top>
        <!--主要内容-->
        <div v-show="!helpShow" class="main_container">
            <div class="jifen_amount">
                <p class="amount_text">我的鲸鱼分</p>
                <p class="amount_number">{{integralAmount}}</p>
            </div>
            <!--进入其他页面的入口-->
            <div class="jifen_operate">
                <div @click="toJingYu">
                    <img src="../../images/toExtract.png">
                    <p class="operate_name">爱有金</p>
                    <p class="operate_award" style="margin-bottom:.06rem;">指定商品</p>
                    <p class="operate_award">每消费1元＋1</p>
                </div>
                <div :class="{'hasName':nameBg}" style="margin-left:.24rem;margin-right:.24rem;" @click="toRealName">
                    <img :src="isRealName">
                    <p class="operate_name" v-show="nameBg">已实名</p>
                    <p class="operate_name" v-show="!nameBg">实名认证</p>
                    <p class="operate_award" v-show="!nameBg">首次认证＋50</p>
                </div>
                <div @click="$router.push('/inviteFriend')">
                    <img src="../../images/invite.png">
                    <p class="operate_name">邀请好友</p>
                    <p class="operate_award" style="margin-bottom:.06rem;">每邀请1个好友＋20</p>
                    <p class="operate_award">好友提金＋20%</p>
                </div>
            </div>
            <!--总量恒定 只送不卖-->
            <div class="constant" :class="{'bigHeight':!details || !details.length}">
                <img src="../../images/zlhd.png">
            </div>
            <!--交易明细-->
            <mt-loadmore  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false"  ref="loadmore"  class="loadmore_jifen" v-show="details && details.length">
            <section class="jifen_detail">
                <h4>交易明细</h4>
                <div v-for="(item,index) in details" :key="index">
                    <p class="detail_p1">
                        <span class="detail_p1_name">{{item.integralReasonType==0?'去买黄金':(item.integralReasonType==1?'实名认证':(item.integralReasonType==2?'邀请好友':(item.integralReasonType==3?'好友助力':(item.integralReasonType==4?'好友转让':'转让成功'))))}}</span>
                        <span class="detail_p1_amount" :class="{'green':item.integralReasonType==5}" style="font-family:PingFang-SC-Regular;">{{item.integralReasonType==5?'-':'+'}}{{item.integral}}</span>
                    </p>
                    <p class="detail_p2">{{item.createTime | formatTime}}</p>
                </div>
            </section>
            </mt-loadmore>
            <mt-button type="primary" class="give_btn" @click="popupVisibleGiveOther=true">转让鲸鱼分</mt-button>
            <!--转让好友弹出层-->
            <mt-popup
            v-model="popupVisibleGiveOther"
            position="middle" id="popupVisibleGiveOther">
                <h4>转让鲸鱼分</h4>
                <div class="to_user">
                    <p class="to_user_p1">TO：</p>
                    <input type="number" v-model="giveUser" placeholder="请输入对方手机号" class="to_user_p2" @focus="noUser=false">
                    <p class="no_user" v-show="noUser"><img src="../../images/gantanhao.png">此用户不存在，请重新输入</p>
                </div>
                <div class="to_number">
                    <p class="to_number_p1">鲸鱼分数量：</p>
                    <input type="number" v-model="giveAmount" placeholder="请输入数量" class="to_number_p2" @focus="noEnough=false">
                    <p class="no_user" v-show="noEnough"><img src="../../images/gantanhao.png">鲸鱼分太少拿不出手， 至少放1000鲸鱼分</p>
                </div>
                <div class="give_other_btn">
                    <p style="border-right:1px solid #EEEEEE;" @click="popupVisibleGiveOther=false">取消</p>
                    <p @click="giveOther">转让</p>
                </div>
            </mt-popup>
            <!--确认转让-->
            <mt-popup
            v-model="popupVisibleGive"
            position="middle" id="popupVisibleGive" :modal="boo">
              <p>土豪大大，鲸鱼分已转出</p>
            </mt-popup>
        </div>
        <!--鲸鱼币攻略-->
        <div v-show="helpShow" class="help_container">
            <h4>鲸鱼分攻略</h4>
            <p class="help_p1">1、鲸鱼分是基于区块链技术推出的积分体系， 限量发行，其应用功能也将陆续开放。鲸鱼分每两年产出量减少一半，随着时间的推移获取难度将越来越大；</p>
            <p class="help_p2">2、如何获得鲸鱼分？</p>
            <p class="help_p3">1）成功购买指定商品（爱有金商城标注送鲸鱼分的）每消费1元+1鲸鱼分；</p>
            <p class="help_p4">2）首次完成实名注册＋50鲸鱼分；</p>
            <p class="help_p5">3）所邀请好友实名注册＋20鲸鱼分；</p>
            <p class="help_p6">4）所邀请好友成功购买指定商品（爱有金商城标注送鲸鱼分的）＋20%鲸鱼分；</p>
            <div class="close_help">
                <img src="../../images/closeHelp.png" @click="helpShow=false">
            </div>
        </div>
    </div>
</template>
<script>
import headTop from '../../components/header/head.vue';
import { Button,Popup,Toast,Indicator } from 'mint-ui'
import { queryMyProfil,queryIntegralBalance,queryIntegralList,turnIntegral,queryProductId } from '@/service/getData'
import smrz from '@/images/smrz.png'//未实名
import hasSm from '@/images/hasSm.png'//未实名

    export default {
        data() {
            return {
                isRealName:smrz,//是否已实名(显示图片)
                nameBg:false,//实名时选择的样式
                helpShow:false,//攻略是否展示
                allLoaded:false,
                false:false,
                details:[],//积分来源列表
                popupVisibleGiveOther:false,//转入用户弹出层
                giveUser:null,//被转赠的用户
                giveAmount:null,//输入的转赠数量
                noUser:false,//此用户不是已注册用户
                noEnough:false,//转让鲸鱼币过少
                popupVisibleGive:false,//确认转让弹出层
                boo:false,//确认转让弹出框不显示遮罩层
                integralAmount:null,//鲸鱼币持有
                searchCondition: {  //分页属性
                     pageNo: 1,  
                   pageSize: 5
                },//接口加载数据时需要
                pages:null,//总页数
                productId:null//鲸鱼币产品id
            }
        },
        mounted() {
           this.queryMyProfil()
           this.queryIntegralBalance()
           this.queryIntegralList()
           this.queryProductId()
        },
        filters:{
            formatTime(val){
                if(!val) return;
                var arrTime=val.split(':')
                return arrTime.splice(0,arrTime.length-1).join(':')
            }
        },
        methods:{
            //查询鲸鱼币产品ID
            async queryProductId(){
                var res=await queryProductId()
                if(res.code==100){
                    this.productId=res.content.productId
                }
            },
            //查询用户总积分（鲸鱼币）
            async queryIntegralBalance(){
                var res=await queryIntegralBalance()
                if(res.code==100){
                    if(res.content && res.content.integralBalance){
                        this.integralAmount=res.content.integralBalance
                    }else{
                        this.integralAmount=0
                    }
                }
            },
            //跳转实名认证
            toRealName(){
                if(this.nameBg) return;
                this.$router.push('/personHomepage/authentication')
            },
            //购买鲸鱼章
            toJingYu(){
                this.$router.push({
                    path:'/productDetail',
                    query:{
                        id:this.productId //鲸鱼币的id
                    }
                })
            },
            //查询用户积分列表
            async queryIntegralList(){
                Indicator.open({
                    spinnerType: 'snake'
                });
                this.searchCondition.pageNo=1
                var res=await queryIntegralList(this.searchCondition.pageNo,this.searchCondition.pageSize)
                if(res.code==100){ //0购买黄金，1实名认证，2邀请好友，3好友助力，4好友转让，5转让成功',
                    this.details=res.content.list
                    this.pages=res.content.pages
                    if(this.searchCondition.pageNo>=this.pages){
                        this.allLoaded=true
                    }
                    Indicator.close()
                }else{
                    Indicator.close()
                }
            },
            //查询用户积分列表(更多)
            async loadMore(){
                this.searchCondition.pageNo+=1
                var res=await queryIntegralList(this.searchCondition.pageNo,this.searchCondition.pageSize)
                if(res.code==100){
                    this.details=this.details.concat(res.content.list)
                    if(this.searchCondition.pageNo>=this.pages){
                        this.allLoaded=true
                    }
                }
            },
            //上拉加载更多
            loadBottom(){
                var that = this;
                setTimeout(function(){
                    that.loadMore();
                    that.$refs.loadmore.onBottomLoaded();
                },800)
            },
            //请求接口判断此用户用没有实名认证
            async queryMyProfil(){
              var res=await queryMyProfil()
              if(res.code==100){
                if(res.content.realnamed==1){
                    this.isRealName=hasSm 
                    this.nameBg=true
                }else{
                    this.isRealName=smrz
                    this.nameBg=false
                }
              }
            },
            //返回页面
            toMine(){
                Indicator.close()
                this.$router.push('/mine')
            },
            //点击转让 调用接口判断用户有没有注册过
            async giveOther(){
                var reg = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9]|19[0-9])[0-9]{8}$/;
                //若没有注册过 则红色提示没有改用户
                if(this.giveAmount*1<1000){
                    this.noEnough=true
                    return
                }else{
                     this.noEnough=false
                }
                if(this.giveUser && this.giveUser.length){
                    if(!reg.test(this.giveUser)){
                        Toast({
                            message:'手机格式错误!',
                            position:'bottom',
                            duration:2000
                        })
                    }else{
                        //调用接口 判断此用户是否存在
                        var res=await turnIntegral(this.giveUser,this.giveAmount)
                        if(res.code==-1002){//用户不存在
                            this.noUser=true
                        }else if(res.code==-4001){//积分余额不足
                            Toast({
                                message:res.message,
                                position:'bottom',
                                duration:2000
                            })
                        }else if(res.code==-4002){//转赠积分不得少于1000
                            this.noEnough=true
                        }else{
                            this.popupVisibleGiveOther=false;
                            var that=this;
                            setTimeout(function(){
                                that.popupVisibleGive=true
                                that.queryIntegralBalance()
                                that.queryIntegralList()
                            },40)
                            setTimeout(function(){
                                that.popupVisibleGive=false
                            },1500)
                            this.giveUser=null
                            this.giveAmount=null
                        }
                    }
                }else{
                    Toast({
                        message:'用户不能为空!',
                        position:'bottom',
                        duration:2000
                    })
                }
            }
        },
        watch:{
            
        },
        components: {
            headTop,
        },
        destroyed(){
            
        }
    }
</script>
<style scoped>
    .jifen_container{
        background-color: #eeeeee;
        min-height:100vh;
    }
    .jifen_container.bottom{
        padding-bottom:.98rem;
    }
    .main_container{
        padding-top:.88rem;
    }
    .jifen_container .jifen_help{
        width:.44rem;
        height:.44rem;
        position: absolute;
        right:.3rem;
    }
    .jifen_container .jifen_amount{
        text-align: center;
        padding-top:.8rem;
        background-color:#fff;
    }
    .jifen_amount .amount_text{
        font-size:.24rem;
        color:#999999;
    }
    .jifen_amount .amount_number{
       font-size:.8rem;
       color:#EDA835;
    }
    .jifen_operate{
        display: -webkit-flex;
        display: -o-flex;
        display: -moz-flex;
        display: flex;
        -webkit-justify-content: center;
        -moz-justify-content: center;
        -o-justify-content: center;
        justify-content: center;
        padding-top:.72rem;
        padding-bottom:.4rem;
        text-align: center;
        font-size:.24rem;
        color:#333333;
        background-color:#fff;
    }
    .jifen_operate div{
        width:2.14rem;
        height:2.14rem;
        box-shadow:1px 0 10px rgba(0,0,0,.2);
        padding-top:.4rem;
        font-size:.24rem;
        color:#333333;
    }
    .jifen_operate div.hasName{
        box-shadow:none;
        background-color:#F5F5F5;
    }
    .jifen_operate div:nth-child(2){
        margin-left:.24rem;
        margin-right:.24rem;
    }
    .jifen_operate img{
        width:.5rem;
        height:.5rem;
        margin-bottom:.16rem;
    }
    .jifen_operate .operate_name{
        font-size:.24rem;
        height:.24rem;
        line-height:.24rem;
        color:#333333;
        margin-bottom:.1rem;
    }
    .jifen_operate .operate_award{
        font-size:0.2rem;
        color:#999999;
        height:0.2rem;
        line-height:0.2rem;
    }
    .jifen_detail{
        background-color: #fff;
        padding-left:.3rem;
        padding-right:.3rem;
        margin-bottom:.2rem;
    }
    .jifen_detail h4{
        font-size:.34rem;
        color:#333333;
        height:1.2rem;
        line-height:1.2rem;
        border-bottom:1px solid #E1E1E1;
        font-weight:600;
    }
    .jifen_detail div{
        height:1.4rem;
        border-bottom:1px solid #E1E1E1;
        padding-top:.28rem;
    }
    .jifen_detail div:last-child{
        border-bottom:none;
    }
    .jifen_detail .detail_p1{
        display: flex;
        margin-bottom:.08rem;
    }
    .jifen_detail .detail_p1 .detail_p1_name{
        font-size:.3rem;
        color:#333333;
        flex:3;
    }
    .jifen_detail .detail_p1 .detail_p1_amount{
        font-size:.3rem;
        line-height:.3rem;
        color:#FF6D39;
        flex:2;
        text-align: right;
        position: relative;
        top:0.3rem;
    }
    .jifen_detail .detail_p1 .detail_p1_amount.green{
        color:#5BC872;
    }
    .jifen_detail .detail_p2{
        font-size:.24rem;
        color:#999999;
        letter-spacing:1px;
        word-spacing: 2px;
    }
    .give_btn{
        width:100%;
        height:.98rem;
        background-color: #F2B643;
        line-height:.98rem;
        text-align: center;
        font-size:.34rem;
        color:#FFFFFF;
        position: fixed;
        bottom:0;
    }
    .help_container{
        background-color: #fff;
        height:100vh;
        padding-top:.88rem;
        padding-left:.76rem;
        padding-right:.76rem;
    }
    .help_container h4{
        padding-top:.56rem;
        font-size:.4rem;
        color:#000000;
        text-align: center;
        padding-bottom:.6rem;
        border-bottom:1px solid #EEEEEE;
    }
    .help_container .help_p1{
        padding-top:.4rem;
    }
    .help_container p{
        font-size:.28rem;
        color:#666666;
        line-height:.5rem;
    }
    .help_container .close_help{
        margin-top:3.2rem;
        text-align: center;
    }
    .help_container img{
        width:.44rem;
        height:.44rem;
    }
    #popupVisibleGiveOther.mint-popup{
        width:6.7rem;
        background-color: #fff;
        border-radius: 10px;
    }
    #popupVisibleGiveOther h4{
        font-size:.32rem;
        color:#000000;
        text-align: center;
        padding-top:.3rem;
        font-weight:600;
    }
    #popupVisibleGiveOther .to_user,#popupVisibleGiveOther .to_number{
        padding-left:.4rem;
    }
    .to_user .to_user_p1,.to_number .to_number_p1{
        font-size:.24rem;
        color:#333333;
        padding-top:.4rem;
    }
    .to_user .to_user_p2,.to_number .to_number_p2{
        height:1rem;
        line-height:1rem;
        font-size:.34rem;
        text-align: center;
        color:#333333;
        width:100%;
        border-bottom:1px solid #EEEEEE;
    }
    .to_user_p2::-webkit-input-placeholder,.to_number_p2::-webkit-input-placeholder{
        color:#999999;
    }
    .to_user_p2::-moz-input-placeholder,.to_number_p2::-moz-input-placeholder{
        color:#999999;
    }
    .to_user_p2::-o-input-placeholder,.to_number_p2::-o-input-placeholder{
        color:#999999;
    }
    #popupVisibleGiveOther .give_other_btn{
        display: flex;
        margin-top:.4rem;
        border-top:1px solid #EEEEEE;
        height:.9rem;
    }
    #popupVisibleGiveOther .give_other_btn p{
        flex:1;
        text-align: center;
        line-height:.9rem;
        font-size:.32rem;
        color:#EDA835;
    }
    #popupVisibleGiveOther .no_user{
        font-size:.22rem;
        color:#FF6D39;
        margin-top:.2rem;
    }
    #popupVisibleGiveOther img{
        width:.24rem;
        height:.24rem;
        position: relative;
        top:.04rem;
        margin-right:.1rem;
    }
    #popupVisibleGive.mint-popup{
        width:4.08rem;
        height:1.48rem;
        background-color: rgba(0,0,0,0.6);
        color:#fff;
        line-height:1.48rem;
        text-align: center;
        font-size:.3rem;
        border-radius: 10px
    }
    .jifen_container .constant{
        text-align: center;
        margin-top:.21rem;
        margin-bottom:.19rem;
    }
    .jifen_container .constant.bigHeight{
        margin-top:2rem;
        margin-bottom:3rem;
    }
    .jifen_container .constant img{
        width:5rem;
        height:1rem;
    }
    .mint-button{
        border-radius: 0;
    }
</style>

