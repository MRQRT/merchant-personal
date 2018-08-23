<template>
	<div class="infomationBox">
		<head-top headTitle='买金成功' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push('/buyGold')">
		</head-top>
		<!--成功失败标志-->
		<div class="buySuccess">
			<div class="symbol">
				<div class="imageLogo"></div>
				<p class="desc">黄金买入成功</p>
			</div>
			<div class="buiedInfomation">
				<p><span class="infoLeft">买入金价</span><span class="infoRight">{{pageMsg.price || ''}}元</span></p>
				<p><span class="infoLeft">买入克重</span><span class="infoRight">{{pageMsg.weight || ''}}克</span></p>
				<p v-show="pageMsg.couponsPayAmount"><span class="infoLeft">优惠券</span><span class="infoRight">-{{pageMsg.couponsPayAmount}}元</span></p>
				<p><span class="infoLeft">买入金额</span><span class="infoRight">{{pageMsg.amount || ''}}元</span></p>
				<p><span class="infoLeft">计息日</span><span class="infoRight">{{pageMsg.incomeDate || ''}}</span></p>
				<p><span class="infoLeft">买入时间</span><span class="infoRight">{{pageMsg.createTime || ''}}</span></p>
			</div>
			<a class="goldAssets" id="click_btn" @click="$router.push('/myGold')">查看黄金资产</a>
			<!-- <div class="liking" v-if="regularProduct">
				<div class="likingTile" @click="$router.push('/buyInvestment')">
					<span class="likeLeft">猜你喜欢</span>
					<span class="likeRight"><img src="../../images/right_jian.png"></span>
				</div>
				<div class="likingPicture" @click="goTo_set(regularProduct.id)">
					<img :src="regularProduct.thumbPath">
                    <span class="already" v-if="regularProduct.isJoin==1">已加入</span>
				</div>
				<div class="likingName" @click="goTo_set(regularProduct.id)">
					<p class="likingNameP1">{{regularProduct.name}}</p>
					<p class="likingNameP2">{{regularProduct.description}}</p>
				</div>
			</div> -->
		</div>
        <!--遮罩区域-->
        <div class="mask" v-show="receive"></div>
        <!--买金成功获得金卡-->
        <div class="receiveCard" v-show="receive">
            <p class="suprise">恭喜,获得"{{cardName}}"金卡</p>
            <p class="desc">集西游人物,领黄金大礼</p>
            <img :src="src">
            <p class="moreCards" @click="$router.push('/receiveCard')">查看我的卡片</p>
            <div class="closeCard" @click="receive=false"></div>
        </div>
        <!-- <div class="buyError"  style="display:none;">
            <div class="symbol">
                <div class="imageLogo"></div>
                <p class="desc">黄金买入失败</p>
            </div>
            <div class="errorExplain">交易失败,尚未生成订单</div>
        </div> -->
	</div>
</template>
<script>
	import headTop from '@/components/header/head.vue';
    import tang from '@/images/tang.png'
    import { queryRegularProductHasLogin } from '@/service/getData.js'
    import {mapState,mapMutations} from 'vuex'
	export default {
		data(){
			return {
                cardName:'唐僧',
                src:tang,
                receive:false,
                pageMsg:{},
                regularProduct:{}
			}
		},
        created(){
            this.pageMsg=this.$route.query.msg;
        },
		mounted() {
            this.queryRegularProductHasLogin();
            //发送请求,若返回有金卡的结果，则：
			// this.receive=true;
		},
		computed:{
			...mapState([
                'token'
              ])
		},
		methods:{
            ...mapMutations([
                'RECORD_REGULARPRODUCTS','RECORD_REGULARPRODUCTPARAMS'
                ]),
			async queryRegularProductHasLogin(){
                var userId=this.token.split("_")[0]
                var res=await queryRegularProductHasLogin(userId);
                if(res.code==100 && res.content && res.content.length){
                    this.regularProduct=res.content[0];
                    this.RECORD_REGULARPRODUCTS(res.content);
                }
            },
            //跳转设置定投的开始页
            goTo_set(id){
                this.RECORD_REGULARPRODUCTPARAMS(id)
                this.$router.push({path:'/investmentDetail'})
            },
		},
		components:{
			headTop,
		}
	}
</script>

<style scoped>
    .infomationBox{
    	padding-top:0.88rem;
    	padding-left:0.3rem;
    	padding-right:0.26rem;
        background-color:#fff;
    }
    .buySuccess .symbol,.buyError .symbol{
    	height:3.3rem;
    	padding-top:.76rem;
    }
    .buySuccess .symbol .imageLogo{
    	width:1.06rem;
    	height:1.08rem;
    	background:url(../../images/buySuccess.png) no-repeat;
    	margin:0 auto;
    	background-size: 100%;
    }
    .buyError .symbol .imageLogo{
        width:1.06rem;
        height:1.08rem;
        background:url(../../images/buyError.png) no-repeat;
        margin:0 auto;
        background-size: 100%;
    }
    .errorExplain{
        height:1rem;
        line-height: 1rem;
        text-align: center;
        color:#BBBBBB;
        font-size:.32rem;
        margin-top:.42rem;
    }
    .buySuccess .symbol .desc,.buyError .symbol .desc{
    	margin-top:0.4rem;
    	text-align: center;
    	font-size:0.34rem;
    	margin-bottom: 0;
        font-weight: bold;
    }
    .buiedInfomation p{
    	height:0.7rem;
    }
    .buiedInfomation .infoLeft{
    	float:left;
        font-size:.28rem;
        color:#666666;
    }
    .buiedInfomation .infoRight{
    	float:right;
        font-size:.24rem;
        color:#333333;
    }
    .goldAssets{
    	height:0.92rem;
    	background-color: #F2B643;
    	line-height: 0.92rem;
    	text-align: center;
    	color:#fff;
    	font-size: 0.4rem;
        border-radius: 4px;
        margin-top:.37rem;
    }
    .liking{
    	height:5.22rem;
    	padding-top:0.77rem;
    }
    .likingTile{
    	height:0.74rem;
    	font-size:0.32rem;
    	color:#333333;
        font-weight: bold;
    }
    .likingTile .likeLeft{
    	float: left;
    	font-weight: bold;
    }
    .likingTile .likeRight{
    	float: right;
        color:#A1A1A1;
    }
    .likingTile .likeRight img{
        width:.13rem;
        height:.24rem;
    }
    .likingPicture{
        position: relative;
    }
    .likingPicture .already{
        display: inline-block;
        font-size: .25rem;
        color: #fff;
        width: 1.2rem;
        text-align: center;
        height: .34rem;
        background-image: url(../../images/already.png);
        background-size: 100%;
        position: absolute;
        top: -.1rem;
    }
    .likingPicture img{
    	width:6.88rem;
    	height:2.3rem;
    	display: block;
    }
    .likingName{
    	margin:0;
    	height:1.42rem;
    	padding-top:0.32rem;
    }
    .likingNameP1{
    	height:0.48rem;
    	font-size:0.3rem;
    	color:#333333;
    }
    .likingName p{
    	margin:0;
    }
    .likingNameP2{
    	height:0.63rem;
    	font-size:0.24rem;
    	color:#999999;
    }
    /*获取金卡*/
    .infomationBox .mask{
        position: fixed;
        width:100%;
        height:100%;
        top:0;
        left:0;
        z-index: 101;
        background-color: rgba(0,0,0,.5);
    }
    .infomationBox .receiveCard{
        position: fixed;
        top:2.3rem;
        left:50%;
        margin-left:-3rem;
        width:6rem;
        height:8rem;
        z-index: 102;
        background-color: #fff;
        border-radius: 10px;
        text-align: center;
        padding-top:.78rem;
    }
    .infomationBox .receiveCard .suprise{
        font-size:.36rem;
        font-weight:bold;
    }
    .infomationBox .receiveCard .desc{
        font-size:.28rem;
        color:#979797;
        height:.86rem;
    }
    .infomationBox .receiveCard .moreCards{
        color:#EDA835;
        font-size:.34rem;
        padding-bottom:.05rem;
        text-decoration: underline;
    }
    .infomationBox .receiveCard img{
        width:4.19rem;
        height:4.53rem;
    }
    .infomationBox .receiveCard .closeCard{
        width:22px;
        height:22px;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        -o-border-radius: 50%;
        background:url(../../images/cardClose.png);
        background-size: 100%;
        position: absolute;
        top:-.84rem;
        right:.75rem;
    }
    .infomationBox .receiveCard .closeCard:before{
        content:'';
        width:.02rem;
        height:.4rem;
        background-color: #fff;
        position: absolute;
        bottom:-.4rem;
        left:50%;
        margin-left:-.01rem;
    }
</style>