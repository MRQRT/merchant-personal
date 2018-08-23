<template>
	<div class="sell">
		<head-top headTitle='卖金'>
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push('/myGold')">
      <span slot="custom" class="custom myGold" @click="goToGold" style="font-size:.26rem;">我的黄金</span>
		</head-top>
		<section class="sellPart">
			<p class="currenGold"><span></span>实时金价(元/克)</p>
			<p class="price">{{currentPrice}}</p>
			<p class="allGoldGram">可卖出黄金<span>{{allGoldGram}}</span>克</p>
			<!--数量输入部分-->
			<div class="outer-input">
				<div class="inputNum">
					<span class="symbol" v-show="isShow">¥</span>
					<input type="number" ref="number" placeholder="请输入卖出克重" :class="has?'number distance':'number'" v-model="number" @keyup="checkInput(number+'')">
					<img src="../../images/clearinput.png" class="clearInput" v-show="clearInput" @click="clear">
					<span class="refer" ref="refer" @click="autoInput">全部卖出</span>
				</div>
					<!-- 实时提示预估金额和手续费窗口 -->
				<div class="tipPop" v-show="YoNShow">预估金额:{{RMB}}元&nbsp;&nbsp;&nbsp;&nbsp;手续费：<span>{{factorage}}</span>元</div>
			</div>
			<p class="notEnough" v-show="noEnough">大于可卖克重</p>
			<p class="notEnough" v-show="checkDefeat">{{orderCheckMsg}}</p>
		</section>
		<!--最低卖出价格设置-->
		<router-link to="/sell/makePrice2" tag="div">
			<section class="highPrice">
				<div class="brief">
					<div class="flexL">
						<p class="p1">最低卖出价格</p>
						<p class="p2">最终成交价格≥<span>{{initMinSell}}</span>元/克(<span>实时金价</span>-<span>{{depParts}}</span>元)</p>
					</div>
					<div class="flexR">
						<span>{{initMinSell}}元/克</span>
						<img :src="rightJian">
					</div>
				</div>
			</section>
		</router-link>
		<!--协议-->
		<section class="argument">
			<input type="checkBox" class="check">
			<strong :class="{'change1':bg,'change2':!bg}" @click="changeBg" ref="arg"></strong>
			<router-link to="/arguments" tag="div">
				<span class="txt">已阅读并同意《黄金消费服务协议》</span>
			</router-link>
			<div class="tips">
				<h6>温馨提示：</h6>
				<li><p>1、</p><div>每个用户每日累计买入、卖出黄金克重上限各1000克；</div></li>
				<li><p>2、</p><div>卖出后资金转移到您的现金余额账户中；</div></li>
				<li><p>3、</p><div>卖出手续费0.3元/克；</div></li>
				<li><p>4、</p><div>交易时间为周一至周五9:00-24:00，法定节假日除外。</div></li>
			</div>
		</section>
		<div class="sellBtn" :class="(this.number!='' && this.number!=0 && !this.noEnough && this.bg && !this.code)?'sellBtnYes':'sellBtnNo'" @click="confirm_sell">立即卖出</div>
		<transition name="router-slid" mode="out-in">
			<router-view></router-view>
		</transition>
		</div>
</template>
<script>
import {mapState,mapMutations} from 'vuex';
import { clearNoNum,hankPositionErr } from '../../config/mUtils.js';
import headTop from '../../components/header/head.vue';

import { queryMyProfil,orderCheck,demandSellOrder } from '@/service/getData.js'

import strategyImg from '@/images/strategy.png'
import rightJian from '@/images/right_jian.png'
import { Toast } from 'mint-ui'

	export default {
		data() {
			return {
				isShow: false,
				   has: false,
				number: '',
				    bg: true,
			   YoNShow: false,//预估金额和手续费提示窗口开关
			clearInput: false,
		   strategyImg: strategyImg,
		   allGoldGram: '',//持仓黄金总克重
			 factorage: '',//手续费
			 rightJian: rightJian,
				  code: '',//订单校验code值，code为0,订单可以提交，code为1，订单不能提交
		   checkDefeat: false,//校验失败提示
		  screenHeight: document.documentElement.clientHeight,//记录高度值(这里是给到了一个默认值)
		 orderCheckMsg: '',//订单校验失败提示内容
		   btnCtroller: true,//卖金按钮控制

			}
		},
		mounted() {
			var that=this;
			if(window.mytimer){
			   clearInterval(window.mytimer)
		    }
			this.queryMyProfil();
			//处理键盘弹出的沉底按钮顶上去的兼容问题
            window.onresize = () => {
                var h=document.documentElement.clientHeight
		    	if((this.screenHeight-h)>50){
		        	document.querySelector('.sellBtn').style.position = 'relative'
		    	}else{
		        	document.querySelector('.sellBtn').style.position = 'fixed'
		    	}
            }
		},
		computed:{
			...mapState([
                'depPart','currentPrice'
            ]),
            //返回预估金额
			RMB() {
				return parseInt((this.currentPrice*this.number)*100)/100;
			},
			noEnough() {
				return +this.number>+this.allGoldGram?true:false;
			},
			//最终成交价
			initMinSell() {
				return (+this.currentPrice-(+this.depPart)).toFixed(2)
			},
			depParts() {
				return this.depPart
			}
		},
		watch:{
			number:function(val) {
				if(val!='' && val<this.allGoldGram){
					this.orderCheck();
					this.clearInput=true;

				}else{
					this.YoNShow=false;
					this.clearInput=false;
				}
			},
			$route(to,from){
				this.watchRouter(to,from);
			},
			screenWidth(val){
				alert(val)
			},
			//实时金价
			currentPrice(val){
				return val
			}
		},
		methods:{
			...mapMutations([
                'RECORD_DEPPART'
            ]),
            //获取用户信息
            async queryMyProfil(){
            	const res = await queryMyProfil();
            	if(res.code==100){
            		this.allGoldGram = res.content.demandGoldBalance?res.content.demandGoldBalance:"0"
            	}
            },
            //黄金消费服务协议是否已读
			changeBg(){
				this.bg=!this.bg;
			},
			checkInput: function (val) {
				this.number=clearNoNum(val,4);
            },
            clear() {
            	this.number='';
            },
            changeView() {
            	this.hasShow=false;
            },
            setData() {
            	this.hasShow=true;
            },
            watchRouter(to,from) {
            	if(from.path=='/sell/makePrice2'){
					this.setData();
				}else if(to.path=='/sell/makePrice2'){
					this.changeView();
				}
            },
            autoInput(){
				this.number = this.allGoldGram
				this.orderCheck();
			},
			//订单校验
			async orderCheck(){
				const res = await orderCheck(this.number,'',2)
				if(res.code==100){
					this.code=res.content.code//订单校验的code，0校验失败，1校验成功
					if(res.content.code==1){
						this.checkDefeat=true//订单校验失败开关
						this.orderCheckMsg=res.content.msg;
					}else{
						this.YoNShow=true;//预估金额和手续费提示窗口开关
						this.factorage = res.content.sellFee;//手续费
					}
				}
			},
			//点击“立即卖出”
			async confirm_sell($event){
				if(this.code==0 && $event.target.classList.contains('sellBtnYes')){
					if(this.btnCtroller){
						this.btnCtroller=false
						const res = await demandSellOrder(this.number,this.initMinSell);
						if(res.code==100){
							this.$router.push({
								path: '/sellResult',
								query:{
									result:res.content,
									result2:res.message
								}
							})
						}else{
							Toast(res.message)
						}
					}else{
						Toast('频繁操作')
					}
				}
			},
      		goToGold(){  //点击"我的黄金"
        		this.$router.push('/myGold')
      		},
		},
		components: {
			headTop
		},
		destroyed(){
			this.RECORD_DEPPART('0.5')
		}
	}
</script>
<style scoped>
    *{
        margin: 0;
        padding: 0;
   	    box-sizing: border-box;
     }
    .sell{
   	    background-color:#F5F5F5;
   	    width:100%;
   	    position: absolute;
   	    min-height: 100vh;
     }
    .sell-message {
    	padding-top:1.08rem;
    	position: relative;
    }
	.sellPart {
		width:100%;
		height:4.5rem;
		background-color: #fff;
		margin:0 auto;
		padding:0 .32rem;
		position: relative;
		margin-top: 1.1rem;
	}
	.currenGold {
		font-size:0.3rem;
		text-align:center;
		height:.9rem;
		padding-top:.6rem;
		position:relative;
		line-height:.32rem;
	}
	.currenGold span{
		width:.24rem;
		height:.24rem;
		position: absolute;
		left:1.8rem;
		top:.64rem;
		background: url('../../images/currPrice.png') no-repeat;
		background-size: 100% 100%;
	}
	.price {
		height:1.14rem;
		line-height:1.14rem;
		text-align:center;
		font-size:.75rem;
		font-weight: bold;
		color:#EDA835;
		margin-top: 0;
	}
	.allGoldGram{
		font-size: .25rem;
		color: #eda835;
		margin-top: .2rem;
		width: 100%;
		height: .5rem;
		line-height: .5rem;
	}
	.clearInput{
		width:.36rem;
		height:.36rem;
		position:absolute;
		top:0.03rem;
		left:4.8rem;
	}
	.refer{
		float:right;
		font-size:.3rem;
		color:#F0B966;
	}
	.outer-input{
		margin-top:.45rem;
		height:.8rem;
		position:relative;
	}
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.outer-input:after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #e1e1e1;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2)(-o-min-device-pixel-ratio:1.5){
	.outer-input:after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #e1e1e1;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
	}
}
	.inputNum{
		position:relative;
	}
	.number{
		width:5.18rem;
		color:#000;
		font-size:.35rem;
		border:none;
		outline:none;
	}
	.distance{
		padding-left:0.62rem;
	}
	.symbol{
		font-weight:bold;
		position: absolute;
		top:0.05rem;
		left:0rem;
		font-size:.38rem;
	}
	.tipPop{
		height:.42rem;
		max-width: 5rem;
		background-color: #F2B643;
		border-radius: 5px;
		-webkit-border-radius: 5px;
		-moz-border-radius: 5px;
		-o-border-radius: 5px;
		position: relative;
		line-height: .42rem;
		padding-left:.25rem;
		padding-right:.25rem;
		color:#fff;
		font-size:.2rem;
		position: absolute;
		top:0.6rem;
		left:.22rem;
		z-index: 2;
	}
	.tipPop:before{
		content:'';
		width:.14rem;
		height:.14rem;
		background-color:#F2B643;
		position: absolute;
		top:-.07rem;
		left:1rem;
		transform: rotate(45deg);
		-webkit-transform: rotate(45deg);
		-moz-transform: rotate(45deg);
		-o-transform: rotate(45deg);
	}
	.notEnough{
		color:#FF713F;
		font-size:.24rem;
		height:.35rem;
		line-height: .35rem;
		padding-left:.34rem;
		position: relative;
		margin-top: 3px;
		padding-top: 2px;
	}
	.notEnough:before{
		content:'';
		width:.24rem;
		height:.24rem;
		background:url('../../images/gantanhao.png') no-repeat;
		background-size: 100% 100%;
		position:absolute;
		top:0.07rem;
		left:0;
	}
	.highPrice{
		margin-top:.22rem;
		height:1.44rem;
		background-color: #fff;
		padding-top:.28rem;
		padding-left:.3rem;
		padding-right:.3rem;
	}
	.brief{
		display: flex;
	    display: -webkit-flex;
	    display: -moz-flex;
	    display: -o-flex;
		height:1.16rem;
		border-bottom:1px solid #F2F2F2;

	}
	.flexL{
		flex:3.8;
		-webkit-flex:3.8;
		-moz-flex:3.8;
		-o-flex:3.8;
	}
	.flexL p{
		margin:0;
	}
	.flexL .p1{
		font-size:.3rem;
		height:.57rem;
	}
	.flexL .p2{
		font-size:.24rem;
		color:#9D9D9D;
	}
	.flexR{
		flex:1.5;
		-webkit-flex:1.5;
		-moz-flex:1.5;
		-o-flex:1.5;
		font-size:.24rem;
		height:.5rem;
		line-height: .5rem;
		text-align: right;
		color:#F2B643;
		margin-top:.25rem;
	}
	.flexR>img{
		width: .15rem;
		height: .22rem;
	}
	.flexR>span{
		margin-right:.2rem;
	}
    .sellBtn{
    	height:.98rem;
    	width:100%;
    	line-height: .98rem;
    	text-align:center;
    	position:fixed;
    	bottom:0;
    	font-size: .34rem;
    	color:#fff;
    }
    .sellBtnNo{
    	background-color: #F3D59C;
    }
    .sellBtnYes{
    	background-color: #F2B643;
    }
    .argument{
    	margin-top:.18rem;
    	height:4.8rem;
    	font-size:.24rem;
    	color:#9E9E9E;
    	padding-left:.3rem;
    	position: relative;
    }
    .check{
    	display:none;
    }
    strong{
    	width:.24rem;
    	height:.24rem;
    	position:absolute;
    	left:0.3rem;
    	top:.03rem;
    }
    .change1{
    	background: url('../../images/readed.png') no-repeat;
    	background-size: 100% 100%;
    }
    .change2{
    	background: url('../../images/reading.png') no-repeat;
    	background-size: 100% 100%;
    }
    .txt{
    	margin-left:.38rem;
    }
    .router-slid-enter-active, .router-slid-leave-active {
    	transition: all .4s;
    	-webkit-transition: all .4s;
    	-moz-transition: all .4s;
    	-o-transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
    	transform: translate3d(2rem, 0, 0);
    	-webkit-transform: translate3d(2rem, 0, 0);
    	-moz-transform: translate3d(2rem, 0, 0);
    	-o-transform: translate3d(2rem, 0, 0);
    	opacity: 0;
    }
    .sellPart>.strategy{
    	position: absolute;
    	right: .25rem;
    	top: .18rem;
    	font-size: .28rem;
    	color: #eda835;
    }
    .sellPart>.strategy>img{
    	width: .28rem;
    	height: .32rem;
    	vertical-align: middle;
    	margin-right: .05rem;
    	margin-bottom: .04rem;
    }
	.tips{
		width: 100%;
		margin-top: .2rem;
		color: #9D9D9D;
		padding: 0 .3rem 0 0;
	}
	.tips>h6{
		font-size: .23rem;
		height: .45rem;
		line-height: .45rem;
		font-weight: normal;
	}
	.tips>li{
		font-size: .23rem;
		line-height: .4rem;
		list-style: none;
		overflow: hidden;
	}
	.tips>li>p{
		float: left;
		width: 5%;
	}
	.tips>li>div{
		width: 95%;
		font-size: .23rem;
		float: left;
	}
    </style>
