<template>
	<div class="infomationBox">
		<head-top headTitle='充值结果' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push('/buyGold')">
		</head-top>
		<!--成功失败标志-->
		<div class="buySuccess">
			<div class="symbol">
				<div class="imageLogo"><img :src="resultImg"></div>
				<p class="desc">{{result}}</p>
			</div>
			<div class="buiedInfomation">
				<p><span class="infoLeft">充值金额</span><span class="infoRight">{{pageMsg.amount}}元</span></p>
				<p><span class="infoLeft">手续费</span><span class="infoRight">{{pageMsg.fee}}元</span></p>
				<p><span class="infoLeft">支付方式</span><span class="infoRight">银行卡</span></p>
				<p><span class="infoLeft">充值时间</span><span class="infoRight">{{pageMsg.createTime}}</span></p>
			</div>
			<a class="goldAssets" id="click_btn" @click="$router.push('/balance')">查看现金余额</a>
<!-- 			<div class="liking">
				<div class="likingTile">
					<span class="likeLeft">猜你喜欢</span>
					<span class="likeRight"><img src="../../images/right_jian.png"></span>
				</div>
				<div class="likingPicture">
					<img src="../../images/liking.png">
				</div>
				<div class="likingName">
					<p class="likingNameP1">结婚脱单基金</p>
					<p class="likingNameP2">黄金定投 为最爱的人存最真的金</p>
				</div>
			</div> -->
		</div>
	</div>
</template>
<script>
    import headTop from '@/components/header/head.vue';
    import suc from '@/images/buySuccess.png';
    import err from '@/images/buyError.png';
	export default {
		data(){
			return {
                receive:false,
                pageMsg:{},
                results:null,
              resultImg:'',
			}
		},
        created(){
            this.pageMsg=this.$route.query.msg;
        },
		mounted() {
            //发送请求,若返回有金卡的结果，则：
			this.receive=true;
            this.img()
		},
		computed:{
			result: function(){
                if(this.pageMsg.status==1){
                    return "充值成功"
                }else if(this.pageMsg.status==0){
                    return "充值失败"
                }else{
                    return this.pageMsg.remark.split(':')[1]
                }
            }
		},
		methods:{
			img(){
                if(this.pageMsg.status==1){
                    this.resultImg=suc
                }else if(this.pageMsg.status==0){
                    this.resultImg=err
                }else{
                    this.resultImg=err
                }
            }
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
        text-align: center;
    	height:1.08rem;
    }
    .buySuccess .symbol .imageLogo img{
        display: inline-block;
        width: 1.06rem;
    }
    .buySuccess .symbol .desc,.buyError .symbol .desc{
    	margin-top:0.4rem;
    	text-align: center;
    	font-size:0.36rem;
    	margin-bottom: 0;
        font-weight: bold;
    }
    .buiedInfomation p{
    	height:0.7rem;
        font-size:0.3rem;
        color:#6C6C6C;
    }
    .buiedInfomation .infoLeft{
    	float:left;
    }
    .buiedInfomation .infoRight{
    	float:right;
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
    	font-size:0.33rem;
    	color:#000;
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
    	font-size:0.34rem;
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
</style>