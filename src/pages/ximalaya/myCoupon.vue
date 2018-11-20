<template>
	<div class="coupon-container">
		<head-top headTitle='优惠券' ref="topHead">
            <!--这里后退买金页时把选中优惠券的id带过去-->
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push('/storeGold')">
		</head-top>
		<!--有优惠券时显示-->
		<div class="couponBox" v-if="hasCoupon">
			<!-- 福利券 -->
			<section class="welfare" v-for="(item,index) in couponList" :class="{'has-used':item.status==1||item.status==2,'Invalid-used':invalid(item.expireTime)}">
				<!-- 右侧金额 -->
				<div class="left-price">
					<p class="price"><span>¥</span>{{parseFloat(item.amount)}}</p>
					<p class="name">福利券</p>
				</div>
				<!-- 左侧说明 -->
				<div class="right-wrap">
					<div class="right-info">
						<h4>存金实测毛重≥{{parseFloat(item.useLimit)}}g</h4>
						<p class="date" v-if="item.expireTime">有效期至<a href="javascript:void(0);">{{item.expireTime | changeTime}}</a></p>
						<p class="use-limit">*仅限存金回购业务使用</p>
					</div>
					<!-- 使用情况 -->
					<div class="useStatus">
						<div class="use-rightNow" v-if="item.status==0 && !invalid(item.expireTime)" @click="$router.push({path:'/stor',query:{from:'coupon'}})">立即使用</div>
						<!-- 已使用 -->
						<div class="cup-has-used" v-else-if="item.status==1 || item.status==2"></div>
						<!-- 已失效 -->
						<div class="cup-invalid" v-else-if="invalid(item.expireTime)"></div>
					</div>
				</div>
			</section>
		</div>
		<!--没有优惠券时显示-->
		<div class="noCoupon" v-else>
			<img src="../../images/noCoupon.png">
			<p>您没有任何优惠券,是否错过了什么?</p>
			<span @click="goBack">返回</span>
		</div>
		<!-- 抽取的奖品 -->
        <mt-popup v-model="popupVisible" position="center" :closeOnClickModal="false">
            <!-- 优惠券奖品 -->
            <div class="welfare-prize">
                <p class="title">恭喜您获得以下奖励</p>
                <ul>
                    <li v-for="(item,index) in couponList" :key="index">
                        <!-- 右侧金额 -->
    					<div class="left-price">
    						<p class="price"><span>¥</span>{{parseFloat(item.amount)}}</p>
    						<p class="name">福利券</p>
    					</div>
    					<!-- 左侧说明 -->
    					<div class="right-info">
    						<h4>存金实测毛重≥{{parseFloat(item.useLimit)}}g</h4>
    						<p class="date">有效期至{{item.expireTime}}</p>
    						<p class="use-limit">*仅限存金回购业务使用</p>
    					</div>
                    </li>
                </ul>
                <div class="btn-wrap">
                    <span class="get-rightNow" @click="$router.push('/stor')">立即使用</span>
                </div>
                <div class="close-btn" @click="closeWonPrize()">
                    <span></span>
                </div>
            </div>
        </mt-popup>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
    import { couponsList,coupons } from '@/service/getData'
    import { setStore,getStore } from '@/config/mUtils'
    import {mapState} from 'vuex'
	import { MessageBox,Toast,Popup} from 'mint-ui'

	export default {
		data(){
			return {
				hasCoupon:true,
				popupVisible:true,  //奖品弹窗
				couponList:[
					{
						'amount':'18.00',
						'useLimit':10,
						'expireTime':'2018-12-02 12:13:14',
						'status':0,
					},
					{
						'amount':38,
						'useLimit':10,
						'expireTime':'2018-12-02 12:13:14',
						'status':1,
					},
					{
						'amount':108,
						'useLimit':10,
						'expireTime':'2018-12-02 12:13:14',
						'status':2,
					},
					{
						'amount':318,
						'useLimit':10,
						'expireTime':'2018-09-02 12:13:14',
						'status':0,
					},
					{
						'amount':748,
						'useLimit':10,
						'expireTime':'2018-12-02 12:13:14',
						'status':0,
					},
				],
			}
		},
        created(){
        },
        computed:{
            ...mapState([
                'token','activityId'
            ])
        },
		mounted() {
          	this.token ? this.couponsList() : '';
		},
        filters:{
           formatTime(val){
               return val.split(' ')[0];
           },
		   /* 改变时间样式(月-日 时-分) */
		   changeTime(val){
			   if(val.indexOf(":") != -1){
				   var arr=val.split(' ');

			       var timeArr1=arr[0].split('-');
			       timeArr1=timeArr1.join('-');

			       var timeArr2=arr[1].split(':');
			       timeArr2.pop();
			       timeArr2=timeArr2.join(':');
			       return timeArr1;
			   }else{
				   return val
			   }
		   }
        },
		methods:{
			// 福利券失效判断
			invalid(val){
				var now = Date.parse(new Date());
				var newVal = val.replace(/-/g,"/");
				var time = 　Date.parse(new Date(newVal))
				if(now>time){
					return true
				}else{
					return false
				}
			},
			// 请求福利券信息
			async couponsList(){
				var tg=getStore('tg','session')?getStore('tg','session'):'#';
				var browser=getStore('browser','local')?getStore('browser','local'):'#';
				var yw=getStore('yw','session')?getStore('yw','session'):"#";

				if(getStore('yw','session')!='undefined'&&getStore('yw','session')!=null&&getStore('yw','session')!=''){//业务类型为非自营
					var source = yw+'_'+tg+'_'+'H5'+'_'+browser;
				}else{
					var source='ZYPT'+'_'+tg+'_'+'H5'+'_'+browser;
				}

				var res = await couponsList(this.activityId,source)
				if(res.code==100){
					if(res.content.length==0){
						this.hasCoupon = false;
					}else{
						this.hasCoupon = true;
						this.couponList = res.content;
						setStore('couponStatus',true,'local')
					}
				}else if(res.code==8002){
					this.popupVisible = false;
					this.coupons();
				}
			},
			// 如已经领取过，在进入优惠券页面，则调用存金优惠券接口
			async coupons(){
				var res = await coupons(4)
				if(res.code==100){
					if(res.content.length==0){
						this.hasCoupon = false;
					}else{
						this.hasCoupon = true;
						this.couponList = res.content.usable;
					}
				}
			},
			closeWonPrize(){
				this.popupVisible = false;
			}
		},
        watch:{

        },
        components:{
            headTop
        },
	}
</script>


<style media="screen">
	.coupon-container .mint-popup{
		background:none !important;
	}
</style>

<style scoped>
    .coupon-container {
    	background-color: #fff;
        padding-top:0.88rem;
    }
    .coupon-container .couponBox{
    	min-height: 100vh;
     	padding:.3rem .3rem .2rem;
		background-color: #F5F5F5;
     }
	 /* 福利券 */
	 .couponBox .welfare{
	 	width: 100%;
		margin-bottom: .2rem;
		display: flex;
		position: relative;
		display: flex;
		overflow: hidden;
	 }
	 .right-wrap{
	 	height: 1.8rem;
		padding-left:.2rem;
		background-color: #fff;
		flex-grow: 2;
		overflow: hidden;
	 }
	  .couponBox .has-used .left-price,.couponBox .Invalid-used .left-price{
		background:url('../../images/coupon-grey.png') no-repeat !important;
		background-size: 100% 100% !important;
	  }
	  .couponBox .has-used .use-limit,.couponBox .Invalid-used .use-limit{
	  	color: #BCBCBC !important;
	  }
	 .welfare .left-price{
	 	width: 2rem;
		height: 1.8rem;
		color: #fff;
		font-size: .22rem;
		text-align: center;
		background:url('../../images/couponBg.png') no-repeat;
		background-size: 100% 100%;
	 }
	 .welfare .left-price .price{
	 	font-size: .88rem;
		font-weight: bold;
		font-family:PingFangSC-Medium;
	 }
	 .welfare .left-price .price span{
	 	font-size: .34rem;
	 }
	 .welfare .left-price .name{
	 	margin-top:-.15rem;
	 }
	  .welfare .right-info{
		  font-size: .24rem;
		  padding:.2rem 0;
	  }
	  .welfare .right-info h4{
	  	color: #333;
		font-size: .3rem;
		font-family:PingFangSC-Medium;
		font-weight:500;
	  }
	  .welfare .right-info .date{
	  	color: #999;
	  }
	  .welfare .right-info .date a{
	  	color:#999;
	  }
	  .welfare .right-info .use-limit{
	  	color: #EDA835;
		font-size: .22rem;
		margin-top:.3rem;
	  }
	   .welfare .useStatus{
	   	overflow: hidden;
	   }
	   .welfare .useStatus .use-rightNow{
	   		width: 1.2rem;
			height: .44rem;
			color: #fff;
			text-align: center;
			line-height: .44rem;
			font-size: .22rem;
			border-radius: 2.2rem;
			background-color: #F2B643;
			position: absolute;
			right:.3rem;
			top:40%;
	   }
	   .has-used .useStatus .cup-has-used{
	   		width: 1.3rem;
			height: 1.3rem;
			position: absolute;
			right: -.01rem;
			bottom:-.01rem;
			background:url('../../images/coupon-used.png') no-repeat;
			background-size: 100%;
	    }
	    .Invalid-used .useStatus .cup-invalid{
			width: 1.3rem;
			height: 1.3rem;
			position: absolute;
			right: -.01rem;
			bottom:-.01rem;
			background:url('../../images/coupon-updated.png') no-repeat;
			background-size: 100%;
	   }
    .couponBox .couponMess{
     	height:1.82rem;
     	margin-bottom:.3rem;
     	display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
     	box-shadow: rgba(193,193,193,.5) 10px 2px 18px;
        -webkit-box-shadow: rgba(193,193,193,.5) 10px 2px 18px;
        -moz-box-shadow: rgba(193,193,193,.5) 10px 2px 18px;
        -o-box-shadow: rgba(193,193,193,.5) 10px 2px 18px;
        box-sizing: content-box;
     }
    .couponMess .left-coupon{
        width:2.24rem;
     	position: relative;
     	overflow: hidden;
		padding-top:.15rem;
        background-image:url(../../images/couponBg.png);
        background-size: 100%;
     }
     .couponMess .left-coupon p{
        color:#fff;
     }
     .couponMess .left-coupon span{
        color:#fff;
     }
     .couponMess .right-coupon{
        width:4.66rem;
     	padding-left:.18rem;
     	padding-top: .42rem;
     }
     .denomination{
		text-align: center;
     }
     .denomination span:nth-child(2){
     	font-size:.7rem;
     }
     .left-coupon .limited-kilo{
     	text-align:center;
     	font-size:.25rem;
     }
     .right-coupon .suit-product{
     	height:.76rem;
     	font-size:.26rem;
     	color:#333333;
     }
     .right-coupon .with-in-time{
     	font-size:.26rem;
     	color:#ABABAB;
     }
     .coupon-container .noCoupon{
     	height: 100vh;
     	text-align: center;
     	padding-top:2.24rem;
     	background-color: #F5F5F5;
     }
     .coupon-container .noCoupon img{
     	width:3.11rem;
     	height:2.39rem;
     }
     .coupon-container .noCoupon p{
     	padding-top:.5rem;
     	font-size:.32rem;
     	color:#666666;
     }
     .coupon-container .noCoupon span{
     	display: inline-block;
     	width:2.22rem;
     	height:.72rem;
     	line-height:.72rem;
     	background-color:#F2B643;
     	text-align: center;
     	font-size:.28rem;
     	color:#fff;
     	margin-top:.4rem;
     	border-radius: 3px;
     }
     .selected{
        box-sizing: border-box;
        border: .04rem solid #f2b643;
        border-left: none;
     }
     .couponMess .darkBg{
        background-image:url(../../images/couponDark.png);
     }

	.welfare-prize{
        width: 7.07rem;
        height: 9.3rem;
        padding-top:.96rem;
        text-align: center;
        position: relative;
		background: url('../../images/prize-record-bg.png') no-repeat;
		background-size: 100%;
	}
	.welfare-prize .title{
		color: #fff;
		font-size: .3rem;
		padding-left:.5rem;
		font-family:PingFangSC-Medium;
	}
	.welfare-prize ul{
		height: 5.5rem;
		overflow: scroll;
		margin-top:1rem;
		padding-left:.25rem;
	}
	.welfare-prize li{
		width:5.5rem;
		height: 1.4rem;
		margin:0 auto .3rem;
		padding-top:.1rem;
		background-color: #fff;
		display: flex;
		position: relative;
		background: url('../../images/popup-wel.png') no-repeat;
		background-size: 100%;
	}
	.welfare-prize li .left-price{
		width: 1.4rem;
	   height: 1.4rem;
	   color: #666;
	   font-size: .22rem;
	   text-align: center;
	}
	.welfare-prize .left-price .price{
		color: #EF3B20;
		font-size: .6rem;
		font-weight: bold;
		font-family:PingFangSC-Regular;
	}
	.welfare-prize .left-price .price span{
		font-size: .26rem;
		font-family:PingFangSC-Medium;
	}
	.welfare-prize .left-price .name{
		margin-top:-.1rem;
	}
	.welfare-prize  .right-info{
		font-size: .2rem;
		padding:.2rem 0 .2rem .1rem;
		text-align: left;
		flex-direction: column;
		justify-content: space-around;
		display: flex;
	}
	.welfare-prize  .right-info h4{
		color: #333;
		font-size: .26rem;
		font-family:PingFangSC-Medium;
		font-weight:500;
	}
	.welfare-prize  .right-info .date{
		color: #999;
	}
	.welfare-prize  .right-info .use-limit{
		color: #EDA835;
		font-size: .2rem;
	}
	.btn-wrap{

	}
	.btn-wrap span{
		line-height: .88rem;
		text-align: center;
		color: #824E20;
		font-size: .34rem;
		background-color: #FFDD54;
		border-radius: .44rem;
	}
	.btn-wrap .get-rightNow{
		display: inline-block;
		width: 5.2rem;
		height: .88rem;
		position: absolute;
		bottom: .3rem;
		left: 50%;
		margin-left:-2.45rem;
	}
	.close-btn span{
		width: .6rem;
		height: .6rem;
		display: inline-block;
		position: absolute;
		bottom:-.9rem;
		left:50%;
		margin-left:-.3rem;
		background: url('../../images/close-btn.png') no-repeat;
		background-size: 100%;
	}
</style>
