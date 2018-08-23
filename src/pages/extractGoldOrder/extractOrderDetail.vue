<template>
	<div class="my-extractGold-detail">
		<head-top headTitle='提金详情' class="head-top" id="head_top" ref="topHead">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
		</head-top>
		<!--主要内容区域-->
		<section class="extractGold-detail-area" ref="detailArea">
			<!--收货地址-->
                <div class="delivery-address">
                    <p class="delivery-address-p1"><span style="margin-right:.4rem;">{{orderDetail.contact}}</span><span style="font-size:0.24rem;">{{orderDetail.telephone | formatTel}}</span></p>
                    <p class="delivery-address-p2">{{orderDetail.address}}</p>
                    <img src="../../images/address.png">
                </div>
            <!--订单详情-->
                <div class="order-brief">
                    <!--订单状态-->
                    <!--点击跳转商品详情-->
                    <div class="delivery-state" @click="JumpProduct">
                        <img :src="orderDetail.imageUrl || default1">
                        <div class="delivery-state-right">
                            <p class="delivery-state-right-p1">
                              <span class="right-p1-sp1">{{orderDetail.productName}}</span>
                              <span class="right-p1-sp2">{{ orderDetail.status==0 ? '待审核' : (orderDetail.status==1 ? '待发货' : (orderDetail.status==2 ? '付款失败' : (orderDetail.status==3 ? '已发货' :'已签收'))) }}</span>
                            </p>
                            <p class="delivery-state-right-p2">
                              <span class="right-p2-sp1">规格:</span>
                              <span class="right-p2-sp2">{{orderDetail.productWeight}}g</span>
                            </p>
                        </div>
                    </div>
                    <!--订单详情-->
                    <div class="order-message">
                        <p><span>订单编号</span><span class="No">{{orderDetail.orderNo}}</span></p>
                        <p><span>总克数</span><span class="No">{{orderDetail.weight}}克</span></p>
                        <p><span>件数</span><span class="No">{{orderDetail.quantity}}件</span></p>
                        <p><span>工费</span><span class="No">{{orderDetail.labourFeeAmount}}元</span></p>
                        <p><span>运费</span><span class="No">{{orderDetail.expressFeeAmount?orderDetail.expressFeeAmount:0}}元</span></p>
                        <p><span>提金日期</span><span class="No">{{orderDetail.createTime | formatTime}}</span></p>
                    </div>
                </div>
                <!--查看物流按钮-->
                <div class="find-delivery" @click="goToDelivery" v-show="orderDetail.status==3">查看物流</div>
		</section>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
    import {queryPhysicalDetail} from '@/service/getData'
    import default1 from '@/images/defaltExtract.png'
    import { Toast } from 'mint-ui'
	export default {
		data(){
			return {
                orderNo:null, //所查订单的订单号
                orderDetail:{}, //存储订单信息
                default1:default1,
                canJump:false //是否可点击图片跳转提金产品
			}
		},
		created(){
			var orderNo=this.$route.query.orderNo;  //获得进入该页所带的订单号参数
            this.orderNo=orderNo;
		},
		mounted() {
			var hgt=window.innerHeight;
			document.querySelector('.my-extractGold-detail').style.height=hgt+'px';
            this.queryPhysicalDetail();
		},
		computed:{
			
		},
        filters:{
            formatTime : function(value){   //过滤后台给的时间格式
                if(!value) return;
                var arr=value.split(':');
                arr.pop()
                var newTime=arr.join(':');
                return newTime;
              },
            formatTel : function(value){ //过滤电话
                if(!value) return;
                return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
            }
        },
		methods:{
			goToDelivery(){ //查看物流信息
                this.$router.push({
                    path:'/findDelivery',
                    query:{
                        expressNo:this.orderDetail.expressNo,
                        imageUrl:this.orderDetail.imageUrl
                    }
                })
            },
            //点击详情跳转产品详情
            JumpProduct(){
                if(this.canJump){
                    this.$router.push({path:'/productDetail',query:{id:this.orderDetail.productId}})
                }else{
                    Toast({
                        message: '该商品目前不在售',
                        position: 'bottom',
                        duration: 3000
                    });
                }
            },
            async queryPhysicalDetail(){
                var res=await queryPhysicalDetail(this.orderNo);
                if(res.code==100) {
                    this.orderDetail=res.content;
                    if(res.content.prodState==2){
                        this.canJump=true;
                    }
                }
            }
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
    .my-extractGold-detail{
   	   width:100%;
   	   background-color: #F5F5F5;
   	   overflow-y: scroll;
    }
    .my-extractGold-detail .extractGold-detail-area{
   	    margin-top:.88rem;
    }
    .my-extractGold-detail .extractGold-detail-area .delivery-address{
        background-color: #fff;
        padding-left:1.02rem;
        padding-top:.3rem;
        padding-bottom:.3rem;
        position: relative;
    }
    .extractGold-detail-area .delivery-address img{
        width:.44rem;
        height:.44rem;
        position: absolute;
        top:0.54rem;
        left:.3rem;
    }
    .extractGold-detail-area .delivery-address .delivery-address-p1{
        font-size:.3rem;
        height:.5rem;
        color:#333333;
    }
    .extractGold-detail-area .delivery-address .delivery-address-p2{
        font-size:.24rem;
        color:#333333;
        height:.36rem;
        width:6.48rem;
        line-height:.36rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .my-extractGold-detail .extractGold-detail-area .order-brief{
        margin-top:.22rem;
        background-color:#fff ;
        padding-left:.3rem;
        padding-right:.3rem;
    }
    .extractGold-detail-area .order-brief .delivery-state{
        height:2.1rem;
        border-bottom:1px solid #F1F1F1;
        padding-top:.4rem;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .delivery-state .delivery-state-right{
        flex:4;
        -webkit-flex:4;
        -moz-flex:4;
        -o-flex:4;
        margin-left:.32rem;
    }
    .order-brief .delivery-state img{
        width:1.3rem;
        height:1.3rem;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        -o-border-radius: 50%;
        flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
    }
    .delivery-state-right-p1 .right-p1-sp1{
        font-size:.28rem;
        font-weight: bold;
        color:#000000;
    }
    .delivery-state .delivery-state-right-p1{
        height:.58rem;
    }
    .delivery-state-right-p1 .right-p1-sp2{
        font-size:.28rem;
        float:right;
        color:#EDA835;
    }
    .delivery-state .delivery-state-right-p2{
        color:#666666;
    }
    .delivery-state .delivery-state-right-p2 .right-p2-sp1{
        font-size:.24rem;
    }
    .delivery-state .delivery-state-right-p2 .right-p2-sp2{
        margin-left:.16rem;
        font-size:.2rem;
    }
    .extractGold-detail-area .order-brief .order-message{
        padding-top:.36rem;
    }
    .order-brief .order-message p{
        font-size:.28rem;
        color:#666666;
        height:.66rem;
    }
    .order-brief .order-message .No{
        color:#333333;
    }
    .order-brief .order-message p span:nth-child(2){
        float:right;
    }
    .extractGold-detail-area .find-delivery{
        width:2.2rem;
        height:.7rem;
        font-size:.26rem;
        background-color:#F2B643;
        color:#fff;
        text-align: center;
        line-height: .7rem;
        border-radius: 3px;
        margin-top:.64rem;
        margin-left:5rem;
    }
</style>
