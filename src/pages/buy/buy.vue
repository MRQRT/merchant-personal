<template>
	<div class="buy">
		<div class="buy-message" v-show="hasShow">
			<head-top headTitle='买金'>
				<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push({'path':'/buyGold'})">
				<span slot="custom" class="custom myGold" @click="goToGold">我的黄金</span>
			</head-top>
			<section class="buyPart">
				<p class="currenGold"><span></span>实时金价(元/克)</p>
				<p class="price">{{currentPrice}}</p>
				<!--数量输入部分-->
				<div class="outer-input">
					<div class="inputNum">
						<p class="symbolCash" v-show="hasSymbol">
							<!-- <span>金额</span> -->
						</p>
						<!-- <span class="symbolWeight" v-show="!hasSymbol" style="top:0;left:0;font-size:.34rem;color:#333;">克重</span> -->
						<!--最少输入金额不得超过0.3元-->
						<input type="number" ref="number" :placeholder="placeholder" class="number"   v-model="number"  @keyup="checkInput(number+'')" @blur="checkNum">
						<img src="../../images/clearinput.png" class="clearInput" v-show="number" @click="clear">
						<p class="refer" ref="refer" @click="toggle" style="width:.92rem;height:.9rem;">
                            <span style="display: block;line-height: .3rem;">切换为</span>
                            <span style="display: block;line-height: .3rem;">{{dependOn}}</span>
						</p>
						<!--购买量的单位-->
						<span style="position: absolute;top:0.02rem;font-size:0.34rem;line-height:1.12rem;" id="sp" v-show="number*1">{{myUnit}}</span>
					</div> 
					<!--实时提示可买克重或需付金额窗口-->
					<div class="tipPop" v-show="number*1"><span>预估{{ hasSymbol ?'克重' : '金额'}}：{{calAmount}}{{ hasSymbol ?'克' : '元'}}</span></div>
				</div>
				<div class="option" v-show="!hasSymbol">
					<div class="opt1" @click="changeColor($event,'1','1.00')" :class="{'activeBg':ind === '1','noActiveBg':!(ind === '1')}">1.00g</div>
					<div class="opt2" @click="changeColor($event,'2','5.00')" :class="{'activeBg':ind === '2','noActiveBg':!(ind === '2')}">5.00g</div>
					<div class="opt3" @click="changeColor($event,'3','10.00')" :class="{'activeBg':ind === '3','noActiveBg':!(ind === '3')}">10.00g</div>
				</div>
				<div class="option" v-show="hasSymbol">
					<div class="opt1" @click="changeColor($event,'1','100')" :class="{'activeBg':ind === '1','noActiveBg':!(ind === '1')}"><span>¥</span><span>100</span></div>
					<div class="opt2" @click="changeColor($event,'2','1000')" :class="{'activeBg':ind === '2','noActiveBg':!(ind === '2')}"><span>¥</span><span>1,000</span></div>
					<div class="opt3" @click="changeColor($event,'3','5000')" :class="{'activeBg':ind === '3','noActiveBg':!(ind === '3')}"><span>¥</span><span>5,000</span></div>
				</div>
				<p class="notEnough" v-show="noEnough">余额不足,请先充值</p>
				<p class="notEnough" v-show="limitMore">{{orderCheckMsg}}</p>
				<span class="help" @click="$router.push('/benefitHelp')">攻略</span>
			</section>
			<!--现金余额-->
			<section class="balance">
				<div class="sli"  @click="$router.push({path:'/recharge'})">
					<div class="left1">
						<p class='dec'>现金余额</p>
						<p class="yue">可用余额{{availableMoney | formatPrice}}元</p>
					</div>
					<div class="right">
						<span class="rechargePart">去充值</span>
						<img src="../../images/right_jian.png">
					</div>
				</div>
			</section>
			<!--最高买入价格设置-->
			<div>
				<section class="highPrice">
					<div class="brief" @click="$router.push({path:'/buy/makePrice'})">
						<div class="flexL">
							<p class="p1">最高买入价格</p>
							<p class="p2">最终成交价格≤{{maxBuyPrice}}元/克(实时金价+{{buyMargin}}元)</p>
						</div>
						<div class="flexR">
							<span>{{maxBuyPrice}}元/克</span>
							<img src="../../images/right_jian.png" class="rightArr">
						</div>
					</div>
				</section>
			</div>
			<!--优惠券-->
			<!--判断有没有可用的优惠券-->
			<div>
				<section class="coupon"  @click="goCoupon">
					<!--这里的'无可用'是输入的金额过小，没有符合条件的优惠券可用,不是没有优惠券-->
					<div class="coup">优惠券 <span class="noAvailable" v-show="!hasUsedCoupon">无可用</span></div>
					<div class="coupEnter">
						<span v-show="hasUsedCoupon">-{{(defaultCoupon.id?defaultCoupon.faceAmount:0) | formatPrice}}元</span>
						<img src="../../images/right_jian.png" class="rightArr">
					</div>
				</section>
			</div>
			<!--协议-->
			<section class="argument">
				<input type="checkBox" class="check">
				<strong :class="{'change1':bg,'change2':!bg}" @click="changeBg" ref="arg"></strong>
				<router-link to="/arguments" tag="div">
					<span class="txt">已阅读并同意《黄金消费综合服务协议》</span>
				</router-link>
			</section>
			<a class="buyBtn"  :class="(this.number*1 && !this.noEnough && !this.limitMore && this.bg)?'buyBtnYes':'buyBtnNo'" @click="payment">立即买入</a>
			<!--最终支付-->
			<mt-popup
			v-model="popupVisibleBuy"
			position="bottom" id="popupVisibleBuy">
			<section class="payment">
				<div class="payTitle">
					<img src="../../images/blackClose.png" class='close' @click="hide">
					<p>支付</p>
				</div>
				<div class="payMessage">
					<p class="payCurrentPrice">
						<span class="currentLeft">实时金价</span>
						<span class="currentRight">{{currentPrice}}元/克</span>
					</p>
					<p class="payKilo">
						<span class="kiloLeft">克重</span>
						<!--克重保留4位小数，向下截取-->
						<span class="kiloRight">{{lastGram}}克</span>
					</p>

					<!--判断有没有使用优惠券,有则显示这一条，没有不显示-->
					<!--由于金价实时变动，克重&总金额随之变化
					1、按金额：总金额不变，克重随金价的变化而变化
                    2、按克重：克重不变，总金额随金价的变化而变化-->

                    <!--若没使用优惠券,则不显示此条内容-->
					<p class="payCoupon" v-show="defaultCoupon.id">
						<span class="couponLeft">优惠券</span>
						<span class="couponRight">-{{defaultCoupon.faceAmount | formatPrice}}元</span>
					</p>
					<p class="payTotal">
						<span class="totalLeft">需付款</span>
						<!--克重保留2位小数，向上截取-->
						<span class="totalRight">{{lastMoney}}元</span>
					</p>
				</div>
				<a class="payConfirm" @click="confirmPay" id="click_btn">确认支付</a>
			</section>
		   </mt-popup>
		</div>

		<!--实时金价超过最高买入金额或其他原因无法生成订单弹窗-->
		<mt-popup
		v-model="popupVisibleErr"
		position="middle" id="popupVisibleErr">
		<div class="identity">
			<h4 class="tipTitle">提示</h4>
			<h4 class="tipDesc">{{errMsg}}</h4>
			<div class="identifyBtn" @click="okNoBuy">我知道了</div>
		</div>
	    </mt-popup>

		<transition name="router-slid" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>
<script>
import {mapState,mapMutations} from 'vuex';
import { clearNoNum,getStore,getStyle,getRem} from '../../config/mUtils.js';
import headTop from '../../components/header/head.vue';
import { queryMyProfil, demandBuyOrder, orderCheck, queryCoupons } from '@/service/getData.js'
import { Toast,Indicator,Popup } from 'mint-ui'

	export default {
		data() {
			return {
				hasSymbol:true,  //如果是按克重,输入金额需要人民币符号
				ind:'',  //给选中的项设置样式
				number:'',  //输入的金额克重
				bg:true,  //是否阅读了协议
				availableMoney:null, //可用余额
				hasShow:true, //一级路由二级路由切换显示
				placeholder:'请输入购买金额',
				hasUsedCoupon:true,// 有没有优惠券可用
				dependOn:'按克重',  //默认是'按金额'
				limitMore:false,  //是否超过当日购买限额
				orderCheckMsg:"",  //订单校验之错误原因
				coupons:[],     //优惠券
				minAmount:[],//满金额
				minWeight:[],//满克重
				defaultCoupon:{},//默认使用的优惠券
				defaultCouponId:"",//要使用的优惠券Id
				canUsedCoupon:[],  //可以使用的优惠券id集合
				errMsg:'', //买金失败错误提示
				btnCtroller:true,//买金按钮是否可点击
				iptEle:null, //输入金额克重的输入框
				myUnit:'元', //默认单位是元
				popupVisibleBuy:false, //最终支付弹窗出现不出现
				popupVisibleErr:false//支付失败弹窗是否出现
			}
		},
		mounted() {
			this.iptEle=document.querySelector('#sp')
			this.hasUsedCoupon=false;
			this.queryMyProfil(); 
			this.queryCoupons();
		},
		filters:{
			formatPrice(val){ //设置金额为两位小数
				return (val*1).toFixed(2);
			}
		},
		methods:{
			...mapMutations([
				'RECORD_COUPONID','RECORD_BUYMARGIN'
			]),
            async queryCoupons(){  //请求优惠券信息
            	var result=await queryCoupons(1,600,getStore("token","local").split("_")[0],"1")
            	if(result.code==100){
            		this.coupons=result.content.list;
            		for(var i=0;i<this.coupons.length;i++){
            			var obj={};
            			if(this.coupons[i].used !==0) {continue;}
            			obj.id=this.coupons[i].id;
            			obj.faceAmount=this.coupons[i].faceAmount;

            			(this.coupons[i].useableMinAmount) ? obj.useableMinAmount=this.coupons[i].useableMinAmount : obj.useableMinWeight=this.coupons[i].useableMinWeight;
            			if(obj.useableMinAmount){
            				this.minAmount.push(obj);
            			}else{
            				this.minWeight.push(obj);
            			}

            		}
            	}
            },
            async orderCheck(){  //订单校验
            	if(this.hasSymbol){//按金额购买
            		var res=await orderCheck('',this.number*1,1);
            	}else{//按克重购买
            		var res=await orderCheck(this.number*1,'',1);
            	}
            	if(res.code==100){
            			if(res.content.code==1){  //校验失败
                            this.limitMore=true;
                            if(this.noEnough){  //如果已经提示余额不足,则不再显示该错误
            					this.limitMore=false;
            				}
                            this.orderCheckMsg=res.content.msg;
            		   }else{
            		   	    this.limitMore=false;
                            this.orderCheckMsg="";
            		   }
            	}
            },
			toggle(){  //切换买金方式
				if(this.dependOn=='按金额'){
					this.dependOn='按克重';
					this.placeholder="请输入购买金额";
					this.hasSymbol=true;//如果是按克重,输入金额需要人民币符号
					this.number='';
					this.ind='';
					this.defaultCoupon={};
					this.defaultCouponId="";//要使用的优惠券Id
					this.canUsedCoupon=[];//可以使用的优惠券集合
					this.limitMore=false;//是否超过当日购买限额
                    this.orderCheckMsg="";//订单校验之错误原因
                    this.myUnit="元";
				}else{
					this.dependOn='按金额';
					this.placeholder="请输入购买克重";
					this.hasSymbol=false;//如果是按克重,输入金额需要人民币符号
					this.number='';
					this.ind='';
					this.defaultCoupon={};
					this.defaultCouponId="";//要使用的优惠券Id
					this.canUsedCoupon=[];//可以使用的优惠券集合
					this.limitMore=false;//是否超过当日购买限额
                    this.orderCheckMsg="";//订单校验之错误原因
                    this.myUnit="克";
				}
			},
			//切换购买金额克重
			changeColor($event,index,cou){
				this.ind=index;
				this.number=cou;
				if(cou.length==3){
					this.iptEle.style.left='0.65rem'
				}
				if(cou.length==4){
					this.iptEle.style.left='0.85rem'
				}
				if(cou.length==5){
					this.iptEle.style.left='0.95rem'
				}
			},
			//协议阅读与否
			changeBg(){
				this.bg=!this.bg;
			},
			checkInput: function (val) {  //保留位数;输入数量实时带出可用最大金额的优惠券(没有可用的则显示无可用;进入优惠券无可用则全部置灰，不可选择;有可用则默认带出的默认选中,也可选中其他)
				this.ind='';
				(this.hasSymbol==true)?this.number=clearNoNum(val,2):this.number=clearNoNum(val,3);
				this.orderCheck();

				//输入金额克重时后面带上单位（元）或（克）
				var p=document.querySelector('pre')
				if(p){
					p.parentNode.removeChild(p)
				}
				var pre=document.createElement('pre')
				pre.style.display="inline"
				pre.style.fontSize="0.36rem"
				pre.style.fontWeight="bold"
				pre.style.color="rgba(255,255,255,0)"
				pre.innerText=this.number;
				
				document.querySelector('body').appendChild(pre)
				var e=document.querySelector('pre')
				this.iptEle.style.left=e.offsetWidth+4+'px'
				
            },
            //输入框失去焦点时校验数字
            checkNum(){
            	this.number=this.number.replace(/[^0-9.]/g,'');
            },
            clear() {  //清空输入框
            	this.number='';
            	this.ind='';
            },
            watchRouter(to,from) {
            	  if(from.path=='/buy/coupon'){
            	  	var id=this.selectCouponId;
            	  	if(!id) {
						this.defaultCoupon={}; //在优惠券没有选择优惠券，则没有可用优惠券
						this.defaultCouponId='';
						return;
					}
					this.defaultCouponId=id;
					for(var i=0;i<this.coupons.length;i++){
						if(this.coupons[i].id==this.defaultCouponId){
							this.defaultCoupon=this.coupons[i];
							break;
						}
					}
            	  }
            },
            payment($event){  //点击"立即买入"
                if(this.$refs.arg.classList.contains('change2')){
           	    	this.myToast('请阅读相关协议');
           	    	return;}
           	    if($event.target.classList.contains('buyBtnNo')) return;
           	    	this.popupVisibleBuy=true
           	    	
            },
            hide(){  //关闭买金确认容器
            	this.popupVisibleBuy=false
            },
            async confirmPay() {  //点击确认支付
            	if(!this.btnCtroller) {
            		this.myToast('操作频繁！');
            		return;
            	}
            	if(this.hasSymbol){  
            		this.btnCtroller=false
            		var res=await demandBuyOrder(this.number*1,0,this.maxBuyPrice*1,this.defaultCouponId)
            	}else{
            		this.btnCtroller=false
            		var res=await demandBuyOrder(0,this.number*1,this.maxBuyPrice*1,this.defaultCouponId)
            	}
            	if(res.code==100){
            		this.$router.push({
            			path:'/buyResult',
            			query:{
            				msg:res.content
            			}
            		});
            	}else{
            		this.btnCtroller=true
            		this.popupVisibleBuy=false
            		this.popupVisibleErr=true
            		this.errMsg=res.message;
            	}
            },
            goToGold(){  //点击"我的黄金"
            	this.$router.push('/myGold')
            },
            okNoBuy(){//点击我知道了
            	this.popupVisibleErr=false
            },
            //获取用户基本信息
            async queryMyProfil(){
            	var res=await queryMyProfil();
            	if(res.code==100){
            		this.availableMoney=res.content.cashBalance;
            	}
            },
            myToast(txt){
				Toast({
                        message: txt,
                        position: 'bottom',
                        duration: 3000
                 });
			},
			goCoupon(){
				this.$router.push({
					path:'/buy/coupon',
					query:{
						default:this.defaultCoupon,
						canOthers:this.canUsedCoupon
					}
				});
			},
		},
		computed:{
			...mapState([
                'currentPrice',
                'buyMargin',
                'selectCouponId'
            ]),
            //最大成交价格
            maxBuyPrice(){
            	return (this.currentPrice*1+this.buyMargin*1).toFixed(2);
            },
            //买金输入时预估克重或预估金额
			calAmount() {
                if(this.hasSymbol){//输入值为金额(提示预估克重)
                	var res=(this.number/this.currentPrice).toFixed(5)*10000+'';
                	if(res.split('.')[1] && res.split('.')[1][0]*1){
                		if(res.split('.')[1][0]>=5){
                			var temp=(this.number/this.currentPrice).toFixed(4)-0.0001
                			return temp.toFixed(4);
                		}else{
                			return (this.number/this.currentPrice).toFixed(4)
                		}
                	}else{
                		return (this.number/this.currentPrice).toFixed(4)
                	}

                }else{//输入值为克重(提示预估金额)
                	var res=(this.number*this.currentPrice).toFixed(3)*100+'';
                	if(res.split('.')[1] && res.split('.')[1][0]*1){
                		if(res.split('.')[1][0]>=5){
                			return (this.number*this.currentPrice).toFixed(2);
                		}else{
                			return (this.number*this.currentPrice).toFixed(2)*1+0.01
                		}
                	}else{
                		return (this.number*this.currentPrice).toFixed(2);
                	}

                }
			},
			//现金余额是否充足
			noEnough(){
				if(this.hasSymbol){//输入值为金额，若输入值大于可用金额，显示余额不足提示
					return (this.number*1) > (this.availableMoney*1) ? true:false;
				}else{//输入值为克重，若估值大于可用余额，提示余额不足
					return (this.calAmount*1) > (this.availableMoney*1) ? true:false;
				}
			},
			//最终的买入克重
			lastGram(){
				if(this.hasSymbol){  //输入金额
					var res=(this.number/this.currentPrice).toFixed(5)*10000+'';
                	if(res.split('.')[1] && res.split('.')[1][0]*1){
                		if(res.split('.')[1][0]>=5){
                			var temp=(this.number/this.currentPrice).toFixed(4)-0.0001
                			return temp.toFixed(4);
                		}else{
                			return (this.number/this.currentPrice).toFixed(4)
                		}
                	}else{
                		return (this.number/this.currentPrice).toFixed(4)
                	}
				}else{
					return (this.number*1).toFixed(4);
				}
			},
			//最终的付款金额
			lastMoney(){
				if(this.defaultCoupon.id){
					var cha=this.defaultCoupon.faceAmount*1;
				}else{
					var cha=0;
				}
				if(this.hasSymbol){
					return ((this.number*1)-cha).toFixed(2);
				}else{
					var res=(this.number*this.currentPrice).toFixed(3)*100+'';
					var result;
                	if(res.split('.')[1] && res.split('.')[1][0]*1){
                		if(res.split('.')[1][0]>=5){
                			result= (this.number*this.currentPrice).toFixed(2);
                		}else{
                			result= (this.number*this.currentPrice).toFixed(2)*1+0.01
                		}
                	}else{
                		result= (this.number*this.currentPrice).toFixed(2);
                	}
                	return (result-cha).toFixed(2);
				}
			},

		},
		watch:{
			/*实时金价*/
			currentPrice(val){
				return val
			},
			$route(to,from){
				this.watchRouter(to,from);
			},
			limitMore(val){
				if(val){
					this.canUsedCoupon=[];
                	this.defaultCoupon={};
				}
			},
			number(val){
				if(!this.number*1){
					this.empty=true;
					this.has=false;
				}else{
					this.empty=false;
					this.has=true;
				}
                if(!this.number){
                	this.canUsedCoupon=[];
                	this.defaultCoupon={};
                	return;
                }
                if(this.noEnough){
                	this.canUsedCoupon=[];
                	this.defaultCoupon={};
                	return;
                }
                if(this.hasSymbol){  //按金额输入
                		this.canUsedCoupon=[];
                	    for(var i=0;i<this.minAmount.length;i++){
                	    	if(this.number*1>=this.minAmount[i].useableMinAmount){

                	    		this.canUsedCoupon.push(this.minAmount[i])

                	    	}
                	    }

                	    for(var i=0;i<this.minWeight.length;i++){
                	    	if(this.calAmount*1>=this.minWeight[i].useableMinWeight){

                	    		this.canUsedCoupon.push(this.minWeight[i])

                	    	}
                	    }

                }else{  //按克重输入
                	this.canUsedCoupon=[];
                	for(var i=0;i<this.minAmount.length;i++){
                	    if(this.calAmount*1>=this.minAmount[i].useableMinAmount){

                	    	this.canUsedCoupon.push(this.minAmount[i])

                	    }
                	}

                	for(var i=0;i<this.minWeight.length;i++){
                	    if(this.number*1>=this.minWeight[i].useableMinWeight){

                	    	this.canUsedCoupon.push(this.minWeight[i])

                	    }
                	}
                }
                //判断又没可用的优惠券
                this.canUsedCoupon.length==0 ? this.hasUsedCoupon=false:this.hasUsedCoupon=true;
                if(!this.canUsedCoupon.length) return;
                //找出最大面额的优惠券
                var theBigAmount={
                	faceAmount:0,
                	id:''
                };
                for(var i=0;i<this.canUsedCoupon.length;i++){
                	if(this.canUsedCoupon[i].faceAmount>theBigAmount.faceAmount){
                		theBigAmount=this.canUsedCoupon[i];
                	}
                }
                if(theBigAmount.id=='') return;
                this.defaultCoupon=theBigAmount;
                this.defaultCouponId=this.defaultCoupon.id;
			},
		},
		components: {
			headTop,
		},
		destroyed(){
			this.RECORD_COUPONID(null)
			this.RECORD_BUYMARGIN('0.5')
		}
	}
</script>
<style scoped>
    .buy{
   	    background-color:#F5F5F5;
   	    width:100%;
   	    position: absolute;
   	    min-height: 100vh;
     }
     #head_top{
     	padding:auto;
     }
    .buy .myGold{
    	top:.3rem;
    }
    .buy-message {
    	padding-top:1.12rem;
    	position: relative;
    }
	.buyPart {
		height:5.3rem;
		background-color: #fff;
		padding:.6rem .3rem .24rem;
		position: relative;
		border-radius: 4px;
		-webkit-border-radius: 4px;
		-moz-border-radius: 4px;
		-o-border-radius: 4px;
	}
	.buyPart .help{
		color:#EDA835;
		font-size:.26rem;
		position: absolute;
		right:.32rem;
		top:.2rem;
	}
	.buyPart .help:before{
		content:'';
		width:.22rem;
		height:.24rem;
		background:url('../../images/strategy.png');
		background-size: 100%;
		background-repeat: no-repeat;
		position: absolute;
		left:-.32rem;
		top:.06rem;
	}
	.currenGold {
		font-size:0.28rem;
		text-align:center;
		height:.38rem;
		position:relative;
		color:#333333;
	}
	.currenGold span{
		width:.24rem;
		height:.24rem;
		position: absolute;
		left:1.95rem;
		top:.04rem;
		background: url('../../images/currPrice.png') no-repeat;
		background-size: 100% 100%;
	}
	.price {
		height:1.37rem;
		text-align:center;
		font-size:.88rem;
		color:#EDA835;
		font-weight: bold;
	}
	.clearInput{
		width:.36rem;
		height:.36rem;
		position:absolute;
		top:0.4rem;
		left:4.94rem;
	}
	.refer{
		position: absolute;
		right:0rem;
		top:0.2rem;
		padding-top:.05rem;
		font-size:.28rem;
		color:#eda835;
	}
	.refer:before{
		content:'';
		position: absolute;
		width:.01rem;
		height:.52rem;
		background-color:#E1E1E1;
		top:.1rem;
		left:-.2rem;
	}
	.outer-input{
		height:1.16rem;
		line-height: 1.16rem;
		border-bottom:1px solid #E8E8E8;
		position:relative;
	}
	.inputNum{
		position:relative;
	}
	.number{
		width:5.18rem;
		color:#000;
		font-size:.36rem;
		border:none;
		outline:none;
		font-weight: bold;
	}
	::-webkit-input-placeholder{
		font-weight: normal;
		color:#9D9D9D;
	}
	::-moz-placeholder{
		font-weight: normal;
		color:#9D9D9D;
	}
	:-moz-placeholder{
		font-weight: normal;
		color:#9D9D9D;
	}
	:-ms-input-placeholder{
		font-weight: normal;
		color:#9D9D9D;
	}
	.symbolCash{
        position: absolute;
	}
	.symbolWeight{
        font-weight: bold;
		position: absolute;
	}
	.symbolCash span{
		font-size:.34rem;
		font-weight: bold;
	}
	.tipPop{
		height:.42rem;
		min-width:2.2rem;
		background-color:#F2B643;
		border-radius:3px;
		-webkit-border-radius:3px;
		-moz-border-radius:3px;
		-o-border-radius:3px;
		line-height:.42rem;
		padding-left:.2rem;
		padding-right:.2rem;
		color:#fff;
		font-size:.2rem;
		position: absolute;
		top:0.9rem;
		left:.3rem;
	}
	.tipPop span{
		position: relative;
        z-index: 1;
        color:#fff;
	}
	.tipPop:before{
		content:'';
		width:.28rem;
        height:.28rem;
		background-color:#F2B643;
		position: absolute;
		top:-.05rem;
		left:50%;
		margin-left:-.14rem;
		transform: rotate(45deg);
	}
	.option{
		display:flex;
		display:-webkit-flex;
		display:-moz-flex;
		display:-ms-flex;
		display:-o-flex;
		margin-top:.4rem;
	}
	.option div{
		width:1.94rem;
		height: .68rem;
		text-align:center;
		line-height: .68rem;
		font-size:.24rem;
		border-radius: 4px;
		-webkit-border-radius: 4px;
		-moz-border-radius: 4px;
		-o-border-radius: 4px;
	}
	.option .opt2{
		margin:0 .325rem;
	}
	.option div span{
		margin-right:.12rem;
		font-size: .28rem;
	}
	.notEnough{
		color:#FF713F;
		font-size:.22rem;
		height:.68rem;
		line-height: .6rem;
		padding-left:.34rem;
		position: relative;
	}
	.notEnough:before{
		content:'';
		width:.24rem;
		height:.24rem;
		position:absolute;
		background:url('../../images/gantanhao.png') no-repeat;
		background-size: 100% 100%;
		top:0.17rem;
		left:0;
	}
	.balance{
		height:1.4rem;
		background-color: #fff;
		margin-top:.22rem;
		padding-top:.28rem;
		padding-left:.3rem;
		padding-right:.3rem;
	}
	.sli{
		height:1rem;
		display:flex;
		display:-webkit-flex;
		display:-moz-flex;
		display:-ms-flex;
		display:-o-flex;
	}
	.left1{
		flex:4;
		-webkit-flex:4;
		-moz-flex:4;
		-ms-flex:4;
		-o-flex:4;
	}
	.left1 p{
		margin:0;
	}
	.left1 .dec{
		font-size:.3rem;
		height:.58rem;
		color:#333333;
	}
	.left1 .yue{
		font-size:.24rem;
		color:#eda835;
	}
	.sli .right{
		flex:1;
		-webkit-flex:1;
		-moz-flex:1;
		-ms-flex:1;
		-o-flex:1;
		font-size:.26rem;
		line-height:1rem;
		color:#eda835;
		text-align: right;
	}
	.highPrice{
		margin-top:.18rem;
		height:1.4rem;
		background-color: #fff;
		padding-top:.28rem;
		padding-left:.3rem;
		padding-right:.3rem;
	}
	.brief{
		display:flex;
		display:-webkit-flex;
		display:-moz-flex;
		display:-ms-flex;
		display:-o-flex;
		border-bottom:.02rem solid #eeeeee;
	}
	.brief .flexL{
		flex:2.5;
		-webkit-flex:2.5;
		-moz-flex:2.5;
		-ms-flex:2.5;
		-o-flex:2.5;
	}
	.brief .flexL p{
		margin:0;
	}
	.brief .flexL .p1{
		font-size:.3rem;
		height:.58rem;
		color:#333333;
	}
	.brief .flexL .p2{
		font-size:.24rem;
		color:#9D9D9D;
	}
	.brief .flexR{
		flex:1;
		-webkit-flex:1;
		-moz-flex:1;
		-ms-flex:1;
		-o-flex:1;
		font-size:.26rem;
		line-height: 1.1rem;
		color:#eda835;
		text-align: right;
	}
	.coupon{
		height:1.41rem;
		background-color: #fff;
		padding-left:.3rem;
		padding-right:.3rem;
		display: flex;
		display:-webkit-flex;
		display:-moz-flex;
		display:-ms-flex;
		display:-o-flex;
	}
	.coup{
		flex:3.2;
		-webkit-flex:3.2;
		-moz-flex:3.2;
		-ms-flex:3.2;
		-o-flex:3.2;
		line-height: 1.41rem;
		font-size: .3rem;
		color:#333333;
	}
	.coup .noAvailable{
		font-size:.24rem;
		color:#999999;
	}
	.coupEnter{
		flex:1;
		-webkit-flex:1;
		-moz-flex:1;
		-ms-flex:1;
		-o-flex:1;
		line-height: 1.41rem;
		font-size:.24rem;
		color:#eda835;
		text-align: right;
	}
	.sli .right span,.flexR span,.coupEnter span{
		margin-right:.2rem;
		position: relative;
		top:-.03rem;
	}
	.coupEnter img,.flexR .rightArr,.sli .right img{
		width:.13rem;
		height:.24rem;
	}
    .activeBg{
    	background-color: #F2B643;
    	color:#fff;
    }
    .noActiveBg{
    	background-color: #F5F5F5;
    	color:#666666;
    }
    .buyBtn{
    	height:.98rem;
    	width:100%;
    	line-height: .98rem;
    	text-align:center;
    	position:fixed;
    	bottom:0;
    	z-index:40;
    	font-size: .34rem;
    	color:#fff;
    	display: block;
    }
    .buyBtnNo{
    	background-color: #f8daa1;
    }
    .buyBtnYes{
    	background-color: #F2B643;
    }
    .buyBtnYes:link{
    	background-color: #F2B643;
    }
    .buyBtnYes:hover{
    	background-color: #F2B643;
    }
    .buyBtnYes:active{
    	background-color: #eda835;
    }
    .buyBtnYes:visited{
    	background-color: #F2B643;
    }
    .argument{
    	margin-top:.18rem;
    	height:1.6rem;
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
    .buy .mint-popup{
    	width:100vw;
    }
    #popupVisibleBuy .payment{
    	height:7.7rem;
    	width:100%;
    	background-color: #fff;
    }
    #popupVisibleErr.mint-popup{
    	width:4.9rem;
    	height:2.44rem;
    }
    #popupVisibleBuy  .payTitle{
    	height:1.22rem;
    	border-bottom: 1px solid #EEEEEE;
    	position: relative;
    }
    #popupVisibleBuy .payTitle p{
    	height:1.22rem;
    	line-height: 1.22rem;
    	text-align: center;
    	font-size:.33rem;
    	color:#000;
    	font-weight: bold;
    }
    #popupVisibleBuy .payTitle .close{
    	width:.36rem;
    	height:.36rem;
    	position: absolute;
    	left:0.3rem;
    	top:0.45rem;
    }
    .payment .payMessage{
    	background-color: #fff;
    	padding-left:.5rem;
    	padding-right:.4rem;
    	padding-top:.39rem;
    }
    .payMessage .payCurrentPrice,.payMessage .payKilo,.payMessage .payCoupon{
    	height:.68rem;
    	font-size: .3rem;
    }
    .payMessage .payTotal{
    	height:1.1rem;
    	line-height:1.1rem;
    	font-size: .32rem;
    	border-top:1px solid #F2F2F2;
    }
    .currentLeft,.kiloLeft,.couponLeft,.totalLeft{
    	float:left;
    }
    .currentRight,.kiloRight,.couponRight,.totalRight{
    	float:right;
    }
    .totalRight{
		color:#eda835;
    }
    .payConfirm{
    	height:.86rem;
    	width:6.92rem;
    	background-color:#F2B643;
    	text-align: center;
    	line-height: .86rem;
    	color:#fff;
    	font-size: .34rem;
    	position: absolute;
    	bottom:.4rem;
    	left:50%;
    	margin-left: -3.46rem;
    	border-radius: 4px;
    	-webkit-border-radius: 4px;
    	-moz-border-radius: 4px;
    	-o-border-radius: 4px;
    }
     .identity{
        width:4.9rem;
        height:2.44rem;
        background-color: #fff;
        border-radius: 10px;
        padding-top:.4rem;
    }
    .identity h4{
        text-align: center;
    }
    .identity .tipTitle{
    	font-size:.3rem;
    	height:.48rem;
    }
    .identity .tipDesc{
    	font-size:.28rem;
    	font-weight: normal;
    	color:#333333;
    }
    .identifyBtn{
        border-top:1px solid #EEEEEE;
        margin-top:.3rem;
        line-height:.86rem;
        text-align: center;
        font-size:.32rem;
        color:#eda835;
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
</style>

