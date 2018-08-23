<template>
	<div class="fillInOrder">
		<head-top headTitle='填写订单' class="head-top">
            <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goToDetail">
		</head-top>
		<!--订单详情-->
		<section class="orderMessage">
		    <!--产品名称-->
            <div class="produce-name" @click="goToDetail">
                <img :src="physicalObj.imageUrl">
                <div class="name-price">
                	<p class="name-price-p1">{{physicalObj.name}}</p>
                	<p><span class="name-price-sp1" style="font-size:.18rem;font-weight: bold;">¥</span><span  class="name-price-sp2">{{(physicalObj.price ? physicalObj.price :0) | formatPrice}}</span></p>
                </div>
            </div>
            <!--规格-->
            <div class="buyFormat">
            	<div class="buy-format-core">
            		<span class="format-left">规格</span>
            		<span class="format-right">{{(physicalObj.weight ? physicalObj.weight :0)| formatWeight}}g</span>
            	</div>
            </div>
            <!--数量-->
            <div class="buyCount">
            	<div class="buy-count-core">
            		<span class="count-left">数量</span>
            		<span class="count-right">{{count || 0}}件</span>
            	</div>
            </div>
            <!--工费-->
            <div class="buyFee">
            	<div class="buy-fee-core">
            		<span class="fee-left">工费<strong>{{(physicalObj.labourFee ? physicalObj.labourFee :0)| formatPrice}}元/克</strong></span>
            		<span class="fee-right">-{{TotalFee || 0.00}}元</span>
            	</div>
            </div>
            <!--运费-->
            <div class="buyFreight">
            	<div class="buy-freight-core">
            		<span class="freight-left">运费</span>
            		<span class="freight-right">-{{(physicalObj.expressFee ? physicalObj.expressFee :0)| formatPrice}}元</span>
            	</div>
            </div>
            <!--地址-->
            <div class="address">
            	<div class="address-core">
            		<span class="address-left">地址</span>
                    <!--没有地址-->
            		<div class="no" v-if="noAddress" @click="goAddress">
                        <span>去设置</span>
                        <img src="../../images/right_jian.png">
                    </div>
                    <!--有地址-->
                    <div class="address-right" v-if="!noAddress" @click="goAddress">
                        <div class="showAddress">
                            <p style="font-size: .28rem">{{address.contact}} {{telephone}}</p>
                            <p style="font-size: .24rem">{{address.address}}</p>
                        </div>
                        <div class="rightAddress">
                        <img src="../../images/right_jian.png">
                        </div>
                    </div>
            	</div>
            </div>
        </section>

        <!--协议-->
        <section class="argument">
            <input type="checkBox" class="check">
            <strong :class="{'change1':bg,'change2':!bg}" @click="bg=!bg" ref="arg"></strong>
            <div  @click="$router.push({path:'/physicalArg',query:{'address':address,'physicalId':physicalId,'count':count}})">
                <span class="txt">已阅读并同意《黄金管家提金服务协议》</span>
            </div>
        </section>

        <!--底部提交-->
        <section class="botton-submit">
        	<div class="botton-submit-left">
        	    <div class="bottom-left">
        	    	<span>合计</span>
        	    </div>
        		<div class="bottom-right">
        	    	<p class="p1"><span class="sp1">克重:</span><span class="sp2">{{totalWeight || 0.0000}}g</span></p>
        	    	<p class="p2"><span class="sp1">工费:</span><span class="sp2">{{TotalFee || 0.00}}元</span></p>
        	    </div>
        	</div>
        	<a class="botton-submit-right" :class="{'lightBtn':bg,'darkBtn':!bg}" id="click_btn" @click="extractGold">立即提金</a>
        </section>
        <!--现金余额不足弹窗-->
        <mt-popup
        v-model="popupVisibleMoney"
        position="middle" id="popupVisibleMoney">
        <section class="money-no-enough">
        	<h4>提示</h4>
        	<p class="tip-p1">您的现金余额不足,无法支付工费,请先充值</p>
        	<p class="tip-btns">
        		<span class="tip-btns-cancel" @click="closeMoney">取消</span>
        		<span @click="$router.push('/recharge')">充值</span>
        	</p>
        </section>
        </mt-popup>
        <!--没有设置地址弹窗-->
        <mt-popup
        v-model="popupVisibleHasAddress"
        position="middle" id="popupVisibleHasAddress">
        <section class="money-no-enough">
        	<h4>提示</h4>
        	<p class="tip-p1">您还没有设置收货地址</p>
        	<p class="tip-btns">
        		<span class="tip-btns-cancel" @click="closeAddress">取消</span>
        		<span @click="goAddress">设置</span>
        	</p>
        </section>
        </mt-popup>
        <!--黄金不足弹窗-->
        <mt-popup
        v-model="popupVisibleGoldEnough"
        position="middle" id="popupVisibleGoldEnough">
        <section class="goldEnough">
           <h4>提示</h4>
           <p>您的活期黄金余额不足,请买入后再提取</p>
           <div class="btns">
               <span @click="cancelExtract" style="border-right:1px solid #EFEFEF;">取消</span>
               <span @click="$router.push('/buy')">买金</span>
           </div>
        </section>
        </mt-popup>
        <!--最终支付弹窗-->
        <mt-popup
        v-model="popupVisibleEndRecharge"
        position="bottom" id="popupVisibleEndRecharge">
        <section class="last-recharge">
        	<div class="payTitle">
				<img src="../../images/blackClose.png" class='close' @click="closeWindow">
				<p>支付</p>
			</div>
			<div class="payMessage">
			    <p class="proName">{{physicalObj.name}}</p>
				<p class="payFormat">
					<span class="payFormatLeft">规格</span>
					<span class="payFormatRight">{{(physicalObj.weight ? physicalObj.weight :0) | formatWeight}}克</span>
				</p>
				<p class="payCount">
					<span class="payCountLeft">数量</span>
					<span class="payCountRight">{{count || 0}}件</span>
				</p>
				<p class="payTotalWeight">
					<span class="payTotalWeightLeft">提取总克重</span>
					<span class="payTotalWeightRight">{{totalWeight || 0.0000}}克</span>
				</p>
				<p class="payGongFei">
					<span class="payGongFeiLeft">工费</span>
					<span class="payGongFeiRight">{{TotalFee || 0.00}}元</span>
				</p>
			</div>

            <a class="payConfirm" @click="lastConfirm" id="click_btn">
            确认支付
            </a>
        </section>
        </mt-popup>
	</div>
</template>

<script>
import headTop from '../../components/header/head.vue';
import {queryGoodsByPhysicalId,queryAddress,addGoodsOrder,queryMyProfil} from '@/service/getData'
import { getStore,setStore } from '@/config/mUtils'
import { Toast,Popup } from 'mint-ui'
import { mapState,mapMutations } from 'vuex'
	export default {
		data(){
			return {
                  physicalObj:{},//根据克重查询的商品详情
                  count:null,
                  noAddress:false,  //没有地址的情况
                  address:{},//地址
                  addressId:"",//存放地址id
                  physicalId:"",
                  cashBalance:null, //现金余额
                  bg:true,  //是否阅读了协议(默认阅读)
                  pic:'',//上传证件照地址
                  btnCtroller:true, //提金按钮是否可点击
                  popupVisibleEndRecharge:false, //最终支付弹窗是否出现
                  popupVisibleMoney:false,//现金余额不足弹窗
                  popupVisibleHasAddress:false,//没有设置地址弹窗
                  popupVisibleGoldEnough:false,//黄金不足弹窗
				}
		},
        created(){
            //跳转我的地址或添加地址，往session里存填写订单所需数据，页面渲染先判断有没有这些数据。有的话就是从地址跳转回来的
              
               if(this.fillExtractInfo){
                  this.count=this.fillExtractInfo.count;
                  this.physicalId=this.fillExtractInfo.physicalId;
                  return;
               }
               //从上传证件照处跳转
                this.count=this.$route.query.count;
                this.physicalId=this.$route.query.physicalId;
        },
		mounted() {
            this.queryMyProfil();
            if(!this.idCardUrl){
                 this.RECORD_IDCARDURL(this.$route.query.url || '')
                 this.pic=this.$route.query.url || '';
            }else{
                this.pic=this.idCardUrl || ''
            }
           
			this.queryGoodsByPhysicalId();//进入页面根据所选规格请求数据
            if(this.$route.query.address){
                this.address=this.$route.query.address;
                this.addressId=this.$route.query.address.id;
                return;
            }
            this.queryAddress();//请求地址
		},
        filters: {
              formatWeight(val){
                return (val*1).toFixed(4)
              },
              formatPrice(val){
                return (val*1).toFixed(2)
              },
        },
		computed:{
            ...mapState([
                 'fillExtractInfo','idCardUrl'
                ]),
            totalWeight(){
                return (this.physicalObj.weight*this.count).toFixed(4);
            },
            TotalFee(){ //总工费
                return (this.physicalObj.weight*this.count*this.physicalObj.labourFee).toFixed(2);
            },
            expressAndlabour(){ //工费加运费总费用
                return (this.TotalFee*1+this.physicalObj.expressFee*1).toFixed(2)
            },
            telephone(){
                if(this.address.telephone){
                    var formatTel = this.address.telephone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                }
                return formatTel;
            }
		},
		methods:{
            ...mapMutations([
                'RECORD_FILLEXTRACTINFO','RECORD_IDCARDURL'
                ]),
            goToDetail(){   //点击产品进入产品详情
                this.$router.push({
                    path:'productDetail',
                    query:{
                        id:getStore('goodsId','local')
                    }
                })
            },
			closeWindow(){  //关闭提金最终确认弹窗
                this.popupVisibleEndRecharge=false
			},
            extractGold(){ //先判断现金余额是否充足，再判断有么有收货地址
                if(!this.bg){
                    Toast({
                        message: '请阅读相关协议', 
                        position: 'bottom',
                        duration: 3000
                   });
                    return;
                }
                
                if(this.expressAndlabour*1>this.cashBalance*1){  //先判断现金余额是否充足
                    this.popupVisibleMoney=true
                    return;
                }
               
                if(this.noAddress){  //判断有么有收货地址
                    this.popupVisibleHasAddress=true
                    return;
                }
                this.popupVisibleEndRecharge=true
            },
            async queryMyProfil(){  //查看现金余额
                var res=await queryMyProfil();
                if(res.code==100) {
                    this.cashBalance=res.content.cashBalance;
                }
            },
            closeMoney(){  //关闭现金不足弹窗
                this.popupVisibleMoney=false
            },
            closeAddress(){ //关闭地址设置弹窗
                this.popupVisibleHasAddress=false
            },
            cancelExtract(){ //关闭黄金余额不足弹窗
                this.popupVisibleGoldEnough=false
            },
            goAddress(){  //点击地址部分进行跳转
                var fillExtractInfo={ //对象保存页面渲染需要的数据
                        physicalId:this.physicalId,
                        count:this.count
                }
                this.RECORD_FILLEXTRACTINFO(fillExtractInfo)
                if(this.noAddress){  //没有地址时跳转添加地址
                    
                    this.$router.push({
                        path:'/personHomepage/addAddress',
                        query:{
                            from:'1', //表示从提金跳到我的地址
                        }
                    })
                }else{ //有地址时跳转我的地址
                    
                    this.$router.push({
                        path:'/personHomepage/address',
                        query:{
                            from:'1', //表示从提金跳到我的地址
                        }
                    })
                }
            },
            async queryGoodsByPhysicalId(){  //根据所选规格查看商品详情
                var res=await queryGoodsByPhysicalId(this.physicalId);
                if(res.code==100){
                   this.physicalObj=res.content;
                }
            },
            async queryAddress(){  //请求地址
                var res=await queryAddress();
                if(res.code==100){
                    var addressArray=res.content;
                    if(addressArray.length==0){
                        this.noAddress=true;
                        return;
                    }
                    var t=this;
                    addressArray.forEach(function(v,i){
                        if(v.isDefault==1){
                            t.address=v;
                            t.addressId=v.id;
                        }
                    })
                }
            },
            async addGoodsOrder(){ //创建提金订单 已经上传过证件照并审核通过 idPic则不传该字段或传空
                if(!this.btnCtroller) {
                    Toast({
                        message: '操作频繁', 
                        position: 'bottom',
                        duration: 3000
                    });
                    return;
                }
                this.btnCtroller=false;
                var res=await addGoodsOrder(this.physicalId,this.count,this.addressId,this.pic);
                var orderNo=null;
                if(res.code==100){
                    this.RECORD_FILLEXTRACTINFO('')
                    this.RECORD_IDCARDURL(null)
                    this.btnCtroller=true;
                    if(res.content.state==1){
                        var result=res.content.data;
                        if(result.orderNo){
                        //提金成功后拿到订单号跳转提金成功页
                           orderNo=result.orderNo;
                        }
                        this.$router.push({
                            path:'/extractGoldResult',
                            query:{
                              orderNo:orderNo
                            }
                        })
                    }else{ //200101 黄金余额不足 200102 现金余额不足 200103 地址不存在 200001 其他异常
                        if(res.content.errCode==200102){//现金余额不足errMsg
                              this.popupVisibleEndRecharge=false
                              this.popupVisibleMoney=true
                        }else if(res.content.errCode==200103){//地址不存在
                            this.popupVisibleEndRecharge=false
                            Toast({
                               message: res.content.errMsg, 
                               position: 'bottom',
                               duration: 3000
                            });
                        }else if(res.content.errCode==200101){//黄金余额不足
                            this.popupVisibleEndRecharge=false
                            this.popupVisibleGoldEnough=true
                        }else{
                            this.popupVisibleEndRecharge=false
                            Toast({
                               message: res.content.errMsg, 
                               position: 'bottom',
                               duration: 3000
                            });
                        }
                    }
                }else{
                    this.RECORD_FILLEXTRACTINFO('')
                    this.RECORD_IDCARDURL(null)
                    this.btnCtroller=true;
                    this.popupVisibleEndRecharge=false
                    Toast({
                            message: res.message, 
                            position: 'bottom',
                            duration: 3000
                    });
                }
                
            },
            lastConfirm(){  //最终提交订单
                this.addGoodsOrder(); //点击按钮提交订单
            },
		},
		components:{
			headTop,
		}
	}
</script>

<style scoped>
    .fillInOrder{
        background-color: #fff;
        padding-top:.88rem;
    }
    .produce-name{
       height:2.22rem;
       border-bottom:1px solid #F5F5F5;
       padding-left:.54rem;
       display: flex;
       display: -webkit-flex;
       display: -moz-flex;
       display: -o-flex;
    }
    .produce-name img{
        width:1.4rem;
        height:1.4rem;
        margin-top:.4rem;
        margin-right:.2rem;
        border: 1px solid #eee;
    }
    .name-price{
		margin-top:.6rem;
    }
    .name-price .name-price-p1{
    	font-size:.32rem;
    	font-weight: bold;
    	height:.56rem;
        color:#000;
    }
    .name-price .name-price-sp1{
    	font-size: .22rem;
    	color:#EDA835;
    }
    .name-price .name-price-sp2{
    	font-size: .4rem;
    	color:#EDA835;
        font-weight:bold;
    }
    .buyFormat,.buyCount,.buyFee,.buyFreight,.address{
    	padding-left:.52rem;
    	padding-right:.5rem;
    }
    .buyFormat .buy-format-core,.buyCount .buy-count-core,.buyFee .buy-fee-core,.buyFreight .buy-freight-core{
    	height:1.12rem;
    	line-height: 1.12rem;
    	font-size: .28rem;
    	color:#333333;
    	border-bottom:1px solid #EEEEEE;
        overflow: hidden;
    }
    .address .address-core{
    	height:1.42rem;
    	border-bottom:1px solid #EEEEEE;
       display: flex;
       display: -webkit-flex;
       display: -moz-flex;
       display: -o-flex;
    }
    .address .address-core .showAddress{
         width:94%;
         padding-top:.36rem;
         font-size:.22rem;
         color:#333333;
    }
    .address .address-core .rightAddress{
        width:6%;
        line-height: 1.4rem;
        text-align: right;
    }
    .address-core .showAddress p{
        text-align: right;
    }
    .address-core .no span{
       font-size:.28rem;
       color:#999999;
       margin-right:.1rem;
    }
    .address .address-core img{
        width:.13rem;
        height:.24rem;
    }
    .address-core .address-left{
        flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
        line-height:1.42rem;
    }
    .address-core .address-right{
        flex:3.5;
        -webkit-flex:3.5;
        -moz-flex:3.5;
        -o-flex:3.5;
        font-size:.28rem;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .address .address-core .no{
        line-height:1.42rem;
        text-align: right;
    }
    .buy-format-core .format-left,.buy-count-core .count-left,.buy-fee-core .fee-left,.buy-freight-core .freight-left{
    	float: left;
    }
    .buy-format-core .format-right,.buy-count-core .count-right,.buy-fee-core .fee-right,.buy-freight-core .freight-right{
    	float: right;
    }
    .buy-fee-core .fee-left strong{
    	font-weight: normal;
    	margin-left:.14rem;
    	font-size:.28rem;
    	color:#999999;
    }
    .buy-fee-core .fee-right,.buy-freight-core .freight-right{
    	color:#EDA835;
    }
    .address-core .address-left{
    	font-size: .28rem;
    	color:#333333;
    }
    .address-core .address-right strong{
    	margin-left:.22rem;
    }
    .botton-submit{
        width:100%;
    	height:1rem;
        position: fixed;
        bottom:0;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .botton-submit .botton-submit-left{
    	flex:2;
        -webkit-flex:2;
        -moz-flex:2;
        -o-flex:2;
    	background-color: #F8F8F8;
    	line-height: 1rem;
    	text-align: center;
    	padding-left:1.18rem;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .botton-submit-left .bottom-left{
    	margin-right:.2rem;
    	font-size:.38rem;
    }
    .botton-submit-left .bottom-right{
    	padding-top:.2rem;
    }
    .botton-submit-left .bottom-right p{
    	line-height: .24rem;
    }
    .bottom-right .p1{
    	margin-bottom:.1rem;
    }
    .bottom-right .sp1{
    	font-size:.24rem;
    	margin-right:.18rem;
    }
    .bottom-right .p2{
        text-align: left;
    }
    .bottom-right .sp2{
    	font-size:.22rem;
    	color:#EDA835;
    }
    .botton-submit .botton-submit-right{
    	flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
    	line-height: 1rem;
    	color:#fff;
    	text-align: center;
    	font-size:.34rem;
    }
     /*可点击按钮背景颜色*/
    .botton-submit .botton-submit-right.lightBtn{
        background-color:#F2B643!important;
    }
    /*不可点击按钮背景颜色*/
    .botton-submit .botton-submit-right.darkBtn{
        background-color: #f8daa1!important;
    }
    #popupVisibleMoney.mint-popup,#popupVisibleHasAddress.mint-popup{
        width:4.9rem;
    }
    .money-no-enough{
    	width:4.9rem;
    	background-color: #fff;
    	border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        -o-border-radius: 10px;
    	padding-top:.38rem;
    }
    .money-no-enough h4{
    	font-size:.3rem;
    	text-align: center;
    	height:.54rem;
        font-weight: bold;
    }
    .money-no-enough .tip-p1{
   	    font-size:.22rem;
   	    color:#333333;
        text-align: center;
   }
    .money-no-enough .tip-btns{
    	margin-top:.24rem;
    	border-top:1px solid #F0F0F0;
    	height:.9rem;
       display: flex;
       display: -webkit-flex;
       display: -moz-flex;
       display: -o-flex;
    }
    .money-no-enough .tip-btns span{
    	flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
    	text-align: center;
    	line-height: .9rem;
    	font-size:.32rem;
    	color:#EDA835;
    }
    .tip-btns .tip-btns-cancel{
    	border-right:1px solid #F0F0F0;
    }
    #popupVisibleEndRecharge.mint-popup{
        width:100%;
    }
    .last-recharge{
    	height:7.7rem;
    	width:100%;
    	background-color: #fff;
    }
    .last-recharge .payTitle{
    	height:1.22rem;
    	border-bottom: 1px solid #EEEEEE;
    	position: relative;
    }
    .last-recharge .payTitle p{
    	height:1.22rem;
    	line-height: 1.22rem;
    	text-align: center;
    	font-size:.34rem;
    	color:#000;
    	font-weight: bold;
    }
    .last-recharge .close{
    	width:.36rem;
    	height:.36rem;
    	position: absolute;
    	left:0.3rem;
    	top:0.45rem;
    }
    .last-recharge .payMessage{
    	padding:.4rem .5rem 0 .52rem;
    }
    .last-recharge .payMessage .proName{
    	font-size:.3rem;
    	font-weight: bold;
    	height:.76rem;
        color:#333333;
    }
    .payFormat,.payCount,.payTotalWeight,.payGongFei{
    	height:.66rem;
    	font-size:.28rem;
    }
    .payFormat .payFormatLeft,.payCount .payCountLeft,.payTotalWeight .payTotalWeightLeft,.payGongFei .payGongFeiLeft{
    	float: left;
        color:#666666;
    }
    .payFormat .payFormatRight,.payCount .payCountRight,.payTotalWeight .payTotalWeightRight,.payGongFei .payGongFeiRight{
    	float: right;
        color:#333333;
    }
    .payConfirm{
    	height:.88rem;
    	width:6.9rem;
    	background-color:#F2B643;
    	margin:0 auto;
    	text-align: center;
    	line-height: .88rem;
    	color:#fff;
    	font-size: .32rem;
    	margin-top:1.55rem;
        border-radius: 4px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        -o-border-radius: 4px;
    }
    .argument{
        margin-top:.18rem;
        height:1.6rem;
        font-size:.24rem;
        color:#9E9E9E;
        padding-left:.3rem;
        position: relative;
    }
    .argument .check{
        display:none;
    }
    .argument strong{
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
    .fillInOrder .argument .txt{
        margin-left:.38rem;
    }
    #popupVisibleGoldEnough.mint-popup{
        width:4.96rem;
    }
    .goldEnough{
        width:4.96rem;
        background-color: #fff;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        -o-border-radius: 10px;
        padding-top:.4rem;
    }
    .goldEnough h4{
        font-size:.3rem;
        text-align: center;
        color:#000;
        font-weight: bold;
    }
    .goldEnough p{
        font-size:.22rem;
        height:.6rem;
        line-height: .6rem;
        text-align: center;
        color:#333333;
    }
    .goldEnough .btns,.identity .btns{
        border-top:1px solid #EEEEEE;
        margin-top:.14rem;
        height:.9rem;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .goldEnough .btns span,.identity .btns span{
        flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
        height:100%;
        line-height: .9rem;
        text-align: center;
        font-size:.3rem;
        color:#EDA835;
    }
</style>
