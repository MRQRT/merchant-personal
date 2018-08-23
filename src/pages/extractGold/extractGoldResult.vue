<template>
	<div class="infomationBox">
		<head-top headTitle='提金成功' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push('/buyGold')">
		</head-top>
		<!--成功失败标志-->
		<div class="buySuccess" v-if="orderObj">
			<div class="symbol">
				<div class="imageLogo"></div>
				<p class="desc">黄金提取成功</p>
			</div>
			<div class="buiedInfomation">
				<p><span class="infoLeft">订单编号</span><span class="infoRight">{{orderObj.orderNo || ''}}</span></p>
				<p><span class="infoLeft">名称</span><span class="infoRight">{{orderObj.productName || ''}}</span></p>
				<p><span class="infoLeft">规格</span><span class="infoRight">{{orderObj.productWeight | formatWeight}}克</span></p>
				<p><span class="infoLeft">件数</span><span class="infoRight">{{orderObj.quantity || ''}}个</span></p>
				<p><span class="infoLeft">总克重</span><span class="infoRight">{{orderObj.weight | formatWeight}}克</span></p>
				<p><span class="infoLeft">工费</span><span class="infoRight">{{orderObj.labourFeeAmount | formatPrice}}元</span></p>
                <p><span class="infoLeft">运费</span><span class="infoRight">{{orderObj.expressFeeAmount | formatPrice}}元</span></p>
                <p><span class="infoLeft">下单时间</span><span class="infoRight">{{orderObj.createTime | formatTime}}</span></p>
			</div>

            <div class="goldAssets" @click="$router.push('/myExtractOrder')">查看我的订单</div>
			<div class="goldAssets" style="color:#F2B643;background-color: #fff;border:1px solid #F2B643" @click="$router.push('/myGold')">查看黄金资产</div>
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
        <!-- <div class="buyError"   v-if="errExtract">
            <div class="symbol">
                <div class="imageLogo"></div>
                <p class="desc">黄金买入失败</p>
            </div>
            <div class="errorExplain">交易失败,尚未生成订单</div>
        </div> -->
	</div>
</template>
<script>
	import headTop from '../../components/header/head.vue';
    import {mapState,mapMutations} from 'vuex'
    import {queryPhysicalDetailByOrderNo,queryRegularProductHasLogin} from '@/service/getData'
	export default {
		data(){
			return {
                id:'',//订单编号
                orderObj:null, //订单详情
                regularProduct:null,//定投产品
                // errExtract:false //提金失败
			}
		},
		mounted() {
			var orderNo=this.$route.query.orderNo;
            this.id=orderNo;
            // if(!this.id){
            //     this.errExtract=true;
            //     return;
            // }
            this.queryPhysicalDetail();
            this.queryRegularProductHasLogin();
		},
		computed:{
			...mapState([
                'token'
              ])
		},
        filters: {
              formatTime : function(value){   //过滤后台给的时间格式
                if(!value) return '';
                var arr=value.split(':');
                arr.pop()
                var newTime=arr.join(':');
                return newTime;
              },
              formatWeight(val){
                if(!val) return '';
                return (val*1).toFixed(4)
              },
              formatPrice(val){
                if(!val) return '';
                return (val*1).toFixed(2)
              },
        },
		methods:{
            ...mapMutations([
                'RECORD_REGULARPRODUCTS','RECORD_REGULARPRODUCTPARAMS'
                ]),
            async queryPhysicalDetail(){
                var res=await queryPhysicalDetailByOrderNo(this.id);
                if(res.code==100){
                    this.orderObj=res.content;
                }
            },
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
			headTop
		}
	}
</script>

<style scoped>
    .infomationBox{
    	padding-top:0.88rem;
    	padding-left:0.3rem;
    	padding-right:0.26rem;
        background-color: #fff;
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
        border-radius: 3px;
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
</style>