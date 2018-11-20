<template>
    <div class="get">
        <!-- logo -->
       <section class="logo"><img src="../../images/cjt-logo.png" alt=""></section>
       <!-- title -->
       <section class="title"><img src="../../images/text.png" alt=""></section>
       <!-- Voucher -->
       <section class="Voucher">
           <p class="voucher-title">组合福利券</p>
           <p class="voucher-time">有效期：2018/11/28--2018/12/28</p>
           <div class="get_button"><span @click="get_voucher">立即领取</span></div>
       </section>
       <!-- icon -->
       <section class="icon">
           <img class="icon_left" src="../../images/shiziline-l.png" alt="">
           <img class="icon_right" src="../../images/shiziline-r.png" alt="">
       </section>
       <!-- des -->
       <section class="des">
           <h4><img src="../../images/adv-title.png" alt=""></h4>
           <p>中信战略合作</p>
       </section>
       <!-- adv -->
       <section class="adv">
           <p><img src="../../images/adv-des.png" alt=""></p>
           <h5>使用福利券最高多拿1230元</h5>
        </section>
        <!-- 估价 -->
        <section class="estima_button">
            <div @click="to_estima">立即免费估价</div>
        </section>
        <!-- activity-des -->
        <section class="activity-des">
            <div>
                <p class="des_title">活动说明</p>
                <ul>
                    <li>点击“立即领取”按钮，领取成功后，通过本页面跳转至存金通下单时直接使用；</li>
                    <li>福利券领取成功后，系统会按照您的黄金预估克重自动匹配福利券，以最终实际检测克重为准；</li>
                    <li>该福利券活动最终解释权归存金通所有，感谢喜马拉雅支持；</li>
                    <li>如您对福利券有任何疑问，欢迎致电存金通客服电话：4008-196-199。</li>
               </ul>
            </div>
        </section>
        <!-- 遮罩层 -->
        <section class="cover" v-show="cover_show"></section>
        <!-- popup -->
        <section class="popup" v-show="cover_show">
            <img src="../../images/wh.png" alt="">
            <p>您已领取过了</p>
            <p>可直接前往卖金哦～</p>
            <div class="pop_button_outer">
                <div class="pop_button_inner" @click="to_estima">立即前往</div>
            </div>
            <div class="closepopup">
                <img @click="closepop" src="../../images/closepop.png" alt="">
            </div>
        </section>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import {couponsList} from '@/service/getData'
    export default {
    	data(){
            return{
                cover_show:false,
                activityId:'2c93808f672a09f801672b45e5d40014',
            }
        },
        mounted(){
        },
        computed: {
            ...mapState([
                'token'
            ])
        },
        methods: {
            //立即领取
            async get_voucher(){
                if(this.token){//有token进行优惠券领取，没有进行领取
                        if(sessionStorage.getItem('couponStatus')=='true'){
                            this.cover_show=true
                        }else{
                            this.$router.push('/myCoupon');
                        }
                }else{
                    this.$router.push({
                        path:'/loginIn',
                        query:{
                            redirect:'/myCoupon',
                        }
                    });
                }
            },
            //去估价
            to_estima(){
                this.$router.push('/stor');
            },
            //关闭弹框
            closepop(){
                this.cover_show=false
            }
        },

    }

</script>

<style scoped>
*{
    box-sizing: border-box;
    margin:0;
    padding:0;
}
.get{
    width:100%;
    min-height:100vh;
    background-image: url("../../images/xbg.jpg");
    background-repeat: no-repeat;
    position: relative;
}
.logo{
    text-align:center;
    padding-top:.81rem;
}
.logo img{
    width: 1.85rem;
    height: .52rem;
}
.title img{
    width: 5.68rem;
    height: .5rem;
}
.title{
    text-align: center;
    padding-top: .2rem;
}
.Voucher{
    height: 2rem;
    position: relative;
    text-align: center;
    background-image: url("../../images/Voucher.png");
    background-repeat: no-repeat;
    background-size:6.5rem 2rem;
    background-position: center;
    margin-top:.58rem;
    padding-top:.3rem;
    position: relative;
}
.voucher-title{
    width:100%;
    font-size:.28rem;
    font-family:"PingFangSC-Medium";
    font-weight:500;
    color:rgba(0,0,0,1);
}
.voucher-time{
    font-size:.22rem;
    font-family:"PingFangSC-Regular";
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:.38rem;
    text-align: left;
    padding-left:3rem;
}
.get_button{
    width: 100%;
    margin-top:.15rem;
    padding-left:4.5rem;
}
.get_button span{
    display: inline-block;
    width:1.5rem;
    height:.5rem;
    line-height: .5rem;
    background:linear-gradient(-45deg,rgba(192,156,96,1),rgba(221,200,153,1));
    border-radius:.25rem;
    font-size:.24rem;
    font-family:"PingFangSC-Regular";
    font-weight:400;
    color:rgba(255,255,255,1);
}
.icon{
    overflow: hidden;
    padding: 0 .4rem 0 .4rem;
    margin-top: .82rem;
}
.icon img{
    width: .6rem;
}
.icon img:nth-child(1){
    float: left;
}
.icon img:nth-child(2){
    float: right;
}
.des{
    width: 100%;
    position: relative;
}
.des h4{
    text-align:center;
}
.des h4 img{
    width: 1.07rem;
    height: .34rem;
}
.des p{
    text-align: center;
    background-image: url("../../images/doubleline.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size:3.5rem;
    color:#DDC899;
    font-size:.24rem;
}
.adv p{
    text-align: center;
    margin-top:.25rem;
}
.adv img{
    width: 6.1rem;
    height: .51rem;
}
.adv h5{
    font-size:.3rem;
    color:#fff;
    text-align:center;
    line-height:.85rem;
    font-weight: normal;
}
.estima_button{
    width: 100%;
    height: .88rem;
    text-align:center;
    margin-top:.2rem;
}
.estima_button div{
    line-height:.88rem;
    text-align:center;
    color:#fff;
    display: inline-block;
    width:5.6rem;
    height:.88rem;
    background:linear-gradient(-45deg,rgba(192,156,96,1),rgba(221,200,153,1));
    border-radius:.44rem;
}
.activity-des{
    width: 100%;
    text-align:center;
    padding-top:.4rem;
    padding-bottom:.8rem;
}
.activity-des>div{
    display: inline-block;
    width:6.5rem;
    height:4.76rem;
    background:rgba(255,255,255,.3);
}
.des_title{
    font-size:.3rem;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:.55rem;
    margin-top:.3rem;
}
ul{
    text-align:left;
    color:#fff;
    font-size: .26rem;
}
ul li{
    padding-left:.7rem;
    padding-right: .4rem;
    line-height: .4rem;
    position: relative;
}
ul li:nth-child(1):before{
    display: inline-block;
    content:"1、";
    height: 100%;
    position: absolute;
    left:.3rem;
}
ul li:nth-child(2):before{
    display: inline-block;
    content:"2、";
    height: 100%;
    position: absolute;
    left:.3rem;
}
ul li:nth-child(3):before{
    display: inline-block;
    content:"3、";
    height: 100%;
    position: absolute;
    left:.3rem;
}
ul li:nth-child(4):before{
    display: inline-block;
    content:"4、";
    height: 100%;
    position: absolute;
    left:.3rem;
}
.cover{
    width:100%;
    min-height:100vh;
    background-color:rgba(0,000,0000,.5);
    z-index: 1000;
    position: fixed;
    top:0; 
}
.popup{
    width:4.90rem;
    height:2.71rem;
    background:rgba(255,255,255,1);
    border-radius:10px;
    z-index: 1001;
    position: fixed;
    left:50%;
    margin-left:-2.45rem;
    top:50%;
    margin-top:-1.35rem;
    padding-top:.74rem;
}
.popup>img{
    width:1.82rem;
    height:1.4rem;
    position: absolute;
    top:-.7rem;
    left:50%;
    margin-left:-0.91rem;
}
.popup p{
    font-size:.26rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:.36rem;
    text-align:center;
}
.pop_button_outer{
    width: 100%;
    text-align:center;
}
.pop_button_inner{
    display: inline-block;
    width: 3.6rem;
    height: .7rem;
    line-height: .7rem;
    color:#fff;
    text-align:center;
    background:linear-gradient(-45deg,rgba(192,156,96,1),rgba(221,200,153,1));
    border-radius:.35rem;
    margin-top:.23rem;
}
.closepopup{
    position: absolute;
    left:50%;
    margin-left:-.32rem;
    bottom: -1.25rem;
}
.closepopup img{
    width: .64rem;
    opacity: 1;
}
</style>
