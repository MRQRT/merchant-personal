<template>
	<div class="tranDetail">
		<header class="header">
			<img :src="back" @click="$router.push('/myGold')">
			<div @click="checked">
				<span>{{tradeTitle}}</span>
				<transition name="rotate">
					<img :src="pullDown" id="pull">
				</transition>
			</div>
		</header>
		<div class="shade" v-show="is"></div>
		<transition name="fade">
			<ul class="pullDown" v-show="is">
				<li @click="tradeType(0)" :class="{'checked_color':tradeTitle=='交易明细' || a=='0','noChecked_color':a!='0'}">&nbsp;&nbsp;&nbsp;&nbsp;交易明细</li>
				<li @click="tradeType(1)" :class="{'checked_color':tradeTitle=='买入' || a=='1','noChecked_color':a!='1'}"  v-show="contains(this.types,1)">&nbsp;&nbsp;&nbsp;&nbsp;买入</li>
				<li @click="tradeType(2)" :class="{'checked_color':tradeTitle=='卖出' || a=='2','noChecked_color':a!='2'}"  v-show="contains(this.types,2)">&nbsp;&nbsp;&nbsp;&nbsp;卖出</li>
				<li @click="tradeType(3)" :class="{'checked_color':tradeTitle=='定投' || a=='3','noChecked_color':a!='3'}"  v-show="contains(this.types,3)">&nbsp;&nbsp;&nbsp;&nbsp;定投</li>
				<li @click="tradeType(4)" :class="{'checked_color':tradeTitle=='存金' || a=='4','noChecked_color':a!='4'}"  v-show="contains(this.types,4)">&nbsp;&nbsp;&nbsp;&nbsp;存金</li>
				<li @click="tradeType(5)" :class="{'checked_color' :tradeTitle=='提金' || a=='5','noChecked_color':a!='5'}"  v-show="contains(this.types,5)">&nbsp;&nbsp;&nbsp;&nbsp;提金</li>
				<li @click="tradeType(6)" :class="{'checked_color':tradeTitle=='定期' || a=='6','noChecked_color':a!='6'}"  v-show="contains(this.types,6)">&nbsp;&nbsp;&nbsp;&nbsp;定期</li>
				<li @click="tradeType(7)" :class="{'checked_color':tradeTitle=='生息' || a=='7','noChecked_color':a!='7'}"  v-show="contains(this.types,7)">&nbsp;&nbsp;&nbsp;&nbsp;生息</li>
				<li @click="tradeType(8)" :class="{'checked_color':tradeTitle=='任务奖励' || a=='8','noChecked_color':a!='8'}"  v-show="contains(this.types,8)">&nbsp;&nbsp;&nbsp;&nbsp;任务奖励</li>
				<li @click="tradeType(9)" :class="{'checked_color':this.tradeTitle=='挂单买入' || a=='9','noChecked_color':a!='9'}"  v-show="contains(this.types,9)">&nbsp;&nbsp;&nbsp;&nbsp;挂单买入</li>
				<li @click="tradeType(10)" :class="{'checked_color':this.tradeTitle=='挂单卖出' || a=='10','noChecked_color':a!='10'}"  v-show="contains(this.types,10)">&nbsp;&nbsp;&nbsp;&nbsp;挂单卖出</li>
			</ul>
		</transition>
		<!--消息明细列表具体类别-->

		<mt-loadmore  :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" :bottomPullText="bottomPullText" ref="loadmore" v-show="listShow" @top-status-change="handleTopChange">
			<div slot="top" class="mint-loadmore-top">
                <whale :top-status="topStatus">
                </whale>
            </div>
			<!--具体业务的交易明细-->
			<section class="tradeLists" v-if="a!=0">

				<!--每一条明细-->
				<div class="list" v-for="item in dataList" :id="item.id" @click="toDetailInfo(item.id,a)">
					<div class="left-part">
						<p class="left-part-p1" v-if="a!==5 && a!==3 && a!=8 && a!==6">{{tradeTitle}}</p>
						<!--提金标题-->
						<p class="left-part-p1" v-if="a==5">{{tradeTitle}}-{{item.name}}</p>
						<!--定投标题-->
						<p class="left-part-p1" v-if="a==3">{{tradeTitle}}-{{item.productName}}</p>
						<!--定期标题-->
						<p class="left-part-p1" v-if="a==6">{{tradeTitle}}买入-{{item.fixedProductName}}</p>
						<!--赠金标题-->
						<p class="left-part-p1" v-if="a==8">{{tradeTitle}}-{{item.reason}}</p>
						<p class="left-part-p2">{{item.createTime | formatTime}}</p>
					</div>
					<div class="right-part">
						<!--非定投-->
						<p class="right-part-p1" v-if="a!=3" :class="{'textColorG':contains(decColor,a),'textColorR':contains(incColor,a),}">{{contains(decColor,a)?'-':'+'}}{{item.weight ||item.realNetWeight || item.applyWeight}}g</p>
						<!--定投克重金额要区分-->
						<p class="right-part-p1" v-if="a==3" :class="{'textColorG':contains(decColor,a),'textColorR':contains(incColor,a),}">{{contains(decColor,a)?'-':'+'}}{{item.weight ||item.amount}}{{item.weight?'g':'元'}}</p>
						<!--买金状态-->
						<p class="right-part-p2" v-if="a==1">{{item.status==0 ? '处理中':(item.status==1?'成功':'失败')}}</p>
						<!--卖金状态-->
						<p class="right-part-p2" v-if="a==2">成功</p>
						<!--定期状态-->
						<p class="right-part-p2" v-if="a==6">{{item.status==1 ? '正常' :(item.status==2 ? '已赎回' : (item.status==3 ? '处理中':'失败'))}}</p>
						<!--定投状态-->
						<p class="right-part-p2" v-if="a==3">{{item.status==0 ? '执行成功' :'执行失败'}}</p>
						<!--提金状态-->
						<p class="right-part-p2" v-if="a==5">{{item.status==0 ? '待审核' :(item.status==1 ? '待发货' : (item.status==2 ? '付款失败' : (item.status==3 ? '已发货' : '已签收')))}}</p>
						<!--任务金生息状态-->
						<p class="right-part-p2" v-if="a==8 || a==7">{{item.status==0 ? '未收取' :'已收取'}}</p>
						<!--挂单买入卖出状态-->
						<p class="right-part-p2" v-if="a==9 || a==10">{{item.status==0 ? '执行成功' :'执行失败'}}</p>
						<!--存金状态-->
						<p class="right-part-p2" v-if="a==4">{{item.status==0 ? '待审核' :(item.status==1 ? '审核未通过' : (item.status==2 ? '待取货' : (item.status==3 ? '物流中' : (item.status==4 ? '检测中' : (item.status==5 ? '检测不通过' : (item.status==6 ? '待用户确认' : (item.status==7 ? '用户不同意' : (item.status==8 ? '已完成' : (item.status==9 ? '已取消' : '已退货')))))))))}}</p>
					</div>
					<div class="click-link" v-if="a!=7 && a!=8">
						<img src="../../images/right_jian.png">
					</div>
				</div>
				
			</section>
			<!--所有业务的交易明细-->
			<section class="tradeLists" v-if="a==0">

				<!--每一条明细-->
				<div class="list" v-for="item in dataList" :id="item.id" @click="toInfo(item.id,item.type)">
					<div class="left-part">
						<!--所有交易明细业务标题-->
						<p class="left-part-p1" v-if="item.type==1 || item.type==2 || item.type==4 || item.type==7 || item.type==9 || item.type==10">{{item.type==1 ? '活期买入' :(item.type==2 ? '活期卖出' : (item.type==4 ? '存金' :  (item.type==7 ? '生息'  : (item.type==9 ? '挂单-买入' : '挂单-卖出'))))}}</p>
						<!--提金标题-->
						<p class="left-part-p1" v-if="item.type==5">提金-{{item.productName}}</p>
						<!--定投标题-->
						<p class="left-part-p1" v-if="item.type==3">定投-{{item.productName}}</p>
						<!--定期标题-->
						<p class="left-part-p1" v-if="item.type==6">定期买入-{{item.productName}}</p>
						<!--赠金标题-->
						<p class="left-part-p1" v-if="item.type==8">任务奖励-{{item.productName}}</p>
						<p class="left-part-p2">{{item.createTime | formatTime}}</p>
					</div>
					<div class="right-part">
						<!--定投记录之外的克重金额显示-->
						<p class="right-part-p1" v-if="item.type!=3" :class="{'textColorG':contains(Rcolor,item.type),'textColorR':contains(Gcolor,item.type),}">{{contains(Rcolor,item.type)?'-':'+'}}{{item.weight ||item.realNetWeight || item.applyWeight}}g</p>
						<!--定投记录显示克重或金额-->
						<p class="right-part-p1" v-if="item.type==3" :class="{'textColorG':contains(Rcolor,item.type),'textColorR':contains(Gcolor,item.type),}">{{contains(Rcolor,item.type)?'-':'+'}}{{item.weight ||item.amount}}{{item.weight?'g':'元'}}</p>
						<!--买金状态-->
						<p class="right-part-p2" v-if="item.type==1">{{item.status==0 ? '处理中':(item.status==1?'成功':'失败')}}</p>
						<!--卖金状态-->
						<p class="right-part-p2" v-if="item.type==2">成功</p>
						<!--定期状态-->
						<p class="right-part-p2" v-if="item.type==6">{{item.status==1 ? '正常' :(item.status==2 ? '已赎回' : (item.status==3 ? '处理中':'失败'))}}</p>
						<!--定投状态-->
						<p class="right-part-p2" v-if="item.type==3">{{item.status==0 ? '执行成功' :'执行失败'}}</p>
						<!--提金状态-->
						<p class="right-part-p2" v-if="item.type==5">{{item.status==0 ? '待审核' :(item.status==1 ? '待发货' : (item.status==2 ? '付款失败' : (item.status==3 ? '已发货' : '已签收')))}}</p>
						<!--任务金或生息状态-->
						<p class="right-part-p2" v-if="item.type==8 || item.type==7">{{item.status==0 ? '未收取' :'已收取'}}</p>
						<!--挂单买入卖出状态-->
						<p class="right-part-p2" v-if="item.type==9 || item.type==10">{{item.status==0 ? '执行成功' :'执行失败'}}</p>
						<!--存金状态-->
						<p class="right-part-p2" v-if="item.type==4">{{item.status==0 ? '待审核' :(item.status==1 ? '审核未通过' : (item.status==2 ? '待取货' : (item.status==3 ? '物流中' : (item.status==4 ? '检测中' : (item.status==5 ? '检测不通过' : (item.status==6 ? '待用户确认' : (item.status==7 ? '用户不同意' : (item.status==8 ? '已完成' : (item.status==9 ? '已取消' : '已退货')))))))))}}</p>
					</div>
					<div class="click-link" v-if="item.type!=7 && item.type!=8">
						<img src="../../images/right_jian.png">
					</div>
				</div>
			</section>
		</mt-loadmore>
		<!--交易明细为空时的情况-->
		<div class="emptyList" v-if="!dataList">
			<img src="../../images/tradeEmpty.png">
			<p>您没有做过任何买卖，那就先从买黄金开始吧！</p>
			<div class="buyGold" @click="$router.push('/buy')">立即买金</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import back from '@/images/back.png'
	import pullDown from '@/images/pullDown.png'
    import { demandBuyOrderList,demandSellOrderList,queryPhysical,queryFixedBuyOrder,queryRecycleOrder,queryPageAwardOrder,queryRegularRecords,queryPagePendingRecord,queryCommonOrder, queryInterest,queryOrderType} from '@/service/getData'
    import {mapState} from 'vuex'
    import { getRem } from '@/config/mUtils.js'
    import whale from '../../components/whale/whale.vue';
	export default{
		data(){
			return{
				      back: back,
				  pullDown: pullDown,
				tradeTitle: '交易明细',
				        is: 0,
				         a: '',
				  dataList: [], //渲染页面的列表数据	
		   searchCondition: {  //分页属性  
				         pageNo:1,  
				         pageSize:9
				       },
				 allLoaded: false,  //提金列表是否加载完
				     false: false,//避免页面进来时一直执行上拉加载
		    bottomPullText: '上拉加载',
				     pages: null, //总页数
				  incColor: [1,3,4,6,7,8,9],//增加（+）文字为绿色
				  decColor: [2,5,10],//减少(-)文字为红色
				    Gcolor: [1,3,4,6,7,8,9],//所有明细之克重颜色显示(+)
				    Rcolor: [2,5,10],  //(-)
				     types: [],//用户已有的类型
				  listShow: false,//滚动加载的内容
		      clientHeight: document.documentElement.clientHeight,
		      topStatus: null,
		      from:null //上一级路由是哪儿
			}
		},
		mounted(){
			this.queryOrderType();
			this.tradeType(0); //页面进来加载所有
			document.querySelector('#pull').classList.remove('foldAnimate')
			var dom=document.querySelector('.emptyList');
			var dom2=document.querySelector('.shade');
			if(dom){
				dom.style.height=(document.documentElement.clientHeight-0.88*getRem())+'px'
			}
			if(dom2){
				dom2.style.height=this.clientHeight+'px'
			}
		},
		computed:{
			...mapState([
				'token'
				])
        },
        filters:{
        	formatTime(val){
        		if(!val) return '--'
        		if(val.split('.')){
        			return val.split('.')[0]
        		}else{
        			return val;
        		}
        	}
        },
		methods:{
			handleTopChange(status) {
				this.topStatus = status;
			},
			//创建标签 提示内容已到底部 加载完毕
			setDom(){
				var dv=document.querySelector('.hasBottom');
				if(dv){
					dv.parentNode.removeChild(dv)
				}
		        var p=document.createElement('p');
		        p.classList.add('hasBottom')
		        p.innerHTML='已经到底了~';
		        p.style.fontSize='0.24rem';
		        p.style.color = '#999999';
		        p.style.width='100%';
		        p.style.height='0.8rem';
		        p.style.lineHeight ='0.8rem';
		        p.style.textAlign = 'center';
		        document.querySelector('.tranDetail').appendChild(p)
			},
			//从所有交易名细进入详情
			toInfo(id,type){
				if(type==7 || type==8) return;
				if(type==5){ //查询提金详情
					this.$router.push({
						path:'/extractOrderDetail',
						query:{
							orderNo:id,
						}
					})
					return;
				}
				if(type==4){ //查询存金详情
					this.$router.push({
						path:'/storOrderDet',
						query:{
							id:id,
						}
					})
					return;
				}
				this.$router.push({
					path:'/tranDetailInfo',
					query:{
						id:id,
						type:type
					}
				})
			},
			//点击具体类别进入详情
			toDetailInfo(id,ca){
				if(ca==5){ //查询提金详情
					this.$router.push({
						path:'/extractOrderDetail',
						query:{
							orderNo:id,
						}
					})
					return;
				}
				if(ca==4){ //查询存金详情
					this.$router.push({
						path:'/storOrderDet',
						query:{
							id:id,
						}
					})
					return;
				}
				if(ca==7 || ca==8){ //没有赠金详情
					return;
				}
				this.$router.push({
					path:'/tranDetailInfo',
					query:{
						id:id,
						type:ca
					}
				})
			},
			tradeType(val){
				document.querySelector('#pull').classList.remove('pullAnimate','foldAnimate')
				document.querySelector('#pull').classList.add('foldAnimate')
				this.is=false;
				this.listShow=true;
				switch(val)
				{
				case 0:
				  this.tradeTitle = '交易明细';
				  this.a = val;
				  this.is=0;
				  this.dataList=[];
				  this.allLoaded=false;
				  this.queryCommonOrder();
				  break;
				case 1:
				  this.tradeTitle = '买入' ;
				  this.a = val;
				  this.is=0;
				  this.dataList=[];
				  this.allLoaded=false;
				  this.demandBuyOrderList();
				  break;
				case 2:
				  this.tradeTitle = '卖出';
				  this.a = val;
				  this.is=0;
				  this.dataList=[];
				  this.allLoaded=false;
				  this.demandSellOrderList();
				  break;
				case 3:
				  this.tradeTitle = '定投';
				  this.a = val;
				  this.is=0;
				  this.dataList=[];
				  this.allLoaded=false;
				  this.queryRegularRecords();
				  break;
				case 4:
				  this.tradeTitle = '存金'
				  this.a = val
				  this.is=0
				  this.dataList=[];
				  this.allLoaded=false;
				  this.queryRecycleOrder();
				  break;
				case 5:
				  this.tradeTitle = '提金';
				  this.a = val;
				  this.is=0;
				  this.dataList=[];
				  this.allLoaded=false;
				  this.queryPhysical();
				  break;
				case 6:
				  this.tradeTitle = '定期'
				  this.a = val
				  this.is=0
				  this.dataList=[];
				  this.allLoaded=false;
				  this.queryFixedBuyOrder();
				  break;
				case 7:
				  this.tradeTitle = '生息';
				  this.a = val;
				  this.is=0;
				  this.dataList=[];
				  this.allLoaded=false;
				  this.queryInterest();
				  break;
				case 8:
				  this.tradeTitle = '任务奖励';
				  this.a = val;
				  this.is=0;
				  this.dataList=[];
				  this.allLoaded=false;
				  this.queryPageAwardOrder();
				  break;
				case 9:
				  this.tradeTitle = '挂单买入'
				  this.a = val
				  this.is=0
				  this.dataList=[];
				  this.allLoaded=false;
				  this.queryPagePendingRecord(0);
				  break;
				case 10:
				  this.tradeTitle = '挂单卖出';
				  this.a = val;
				  this.is=0;
				  this.dataList=[];
				  this.allLoaded=false;
				  this.queryPagePendingRecord(1);
				  break;
				default:

				}
			},
			//判断一数组中是否包含某元素
			contains(arr, obj) {  
                if(!arr) return false;
                var i = arr.length;
                while (i--) {
                    if (arr[i] === obj) {
                        return true;
                    }
                }
                return false;
            },
            //查询用户已有类型
            async queryOrderType(){
                 var res=await queryOrderType(1,20);
                 if(res.code==100){
                 	var arr=res.content.list;
                 	if(arr){
                 		for(var i=0;i<arr.length;i++){
                 			var type=arr[i].type*1;
                 			this.types.push(type)
                 		}
                 	}
                 	
                 }
            },
			//活期金买入订单查询
			async demandBuyOrderList(){  //加载第一页
				this.searchCondition.pageNo=1;
				var res=await demandBuyOrderList(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					var timestamp1 = new Date().getTime();
					this.dataList=res.content.list;
					this.pages=res.content.pages;
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
				return timestamp1;
			},
			//所有业务明细订单查询
			async queryCommonOrder(){  //加载第一页
				this.searchCondition.pageNo=1;
				var res=await queryCommonOrder(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					var timestamp1 = new Date().getTime();
					this.dataList=res.content.list;
					this.pages=res.content.pages;
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
				return timestamp1;
			},
			//活期金卖出订单查询
			async demandSellOrderList(){  //加载第一页
				this.searchCondition.pageNo=1;
				var res=await demandSellOrderList(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					var timestamp1 = new Date().getTime();
					this.dataList=res.content.list;
					this.pages=res.content.pages;
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
				return timestamp1;
			},
			//提金订单查询列表
			async queryPhysical(){  //加载第一页
				this.searchCondition.pageNo=1;
				var res=await queryPhysical(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					var timestamp1 = new Date().getTime();
					this.dataList=res.content.list;
					this.pages=res.content.pages;
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
				return timestamp1;
			},
			//定期金订单查询列表
			async queryFixedBuyOrder(){  //加载第一页
				this.searchCondition.pageNo=1;
				var res=await queryFixedBuyOrder(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					var timestamp1 = new Date().getTime();
					this.dataList=res.content.list;
					this.pages=res.content.pages;
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
				return timestamp1;
			},
			//存金订单查询列表
			async queryRecycleOrder(){
				this.searchCondition.pageNo=1;
				var res=await queryRecycleOrder(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					var timestamp1 = new Date().getTime();
					this.dataList=res.content.list;
					this.pages=res.content.pages;
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
				return timestamp1;
			},
			//赠金订单查询列表
			async queryPageAwardOrder(){
				this.searchCondition.pageNo=1;
				var res=await queryPageAwardOrder(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					var timestamp1 = new Date().getTime();
					this.dataList=res.content.list;
					this.pages=res.content.pages;
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
				return timestamp1;
			},
			//定投成交订单查询列表
			async queryRegularRecords(){
				this.searchCondition.pageNo=1;
				var res=await queryRegularRecords(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					var timestamp1 = new Date().getTime();
					this.dataList=res.content.list;
					this.pages=res.content.pages;
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
				return timestamp1;
			},
			//挂单成交订单查询列表
			async queryPagePendingRecord(type){
				this.searchCondition.pageNo=1;
				var res=await queryPagePendingRecord(this.searchCondition.pageNo,this.searchCondition.pageSize,type);
				if(res.code==100){
					var timestamp1 = new Date().getTime();
					this.dataList=res.content.list;
					this.pages=res.content.pages;
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
				return timestamp1;
			},
			//利息查询列表
			async queryInterest(){
				this.searchCondition.pageNo=1;
				var res=await queryInterest(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					var timestamp1 = new Date().getTime();
					this.dataList=res.content.list;
					this.pages=res.content.pages;
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
				return timestamp1;
			},
			loadTop(){
				var dv=document.querySelector('.hasBottom');
				if(dv){
					dv.parentNode.removeChild(dv)
				}

				this.allLoaded=false;

				const that=this;
                //下拉的当前时间
                const stamp1 = new Date().getTime();
                //数据返回后的当前时间
                switch(that.a){
                	case 0:
                	var stamp2 = that.queryCommonOrder();
                	break;
                	case 1:
                	var stamp2 = that.demandBuyOrderList();
                	break;
                	case 2:
                	var stamp2 = that.demandSellOrderList();
                	break;
                	case 3:
                	var stamp2 = that.queryRegularRecords();
                	break;
                	case 4:
                	var stamp2 = that.queryRecycleOrder();
                	break;
                	case 5:
                	var stamp2 = that.queryPhysical();
                	break;
                	case 6:
                	var stamp2 = that.queryFixedBuyOrder();
                	break;
                	case 7:
                	var stamp2 = that.queryInterest();
                	break;
                	case 8:
                	var stamp2 = that.queryPageAwardOrder();
                	break;
                	case 9:
                	var stamp2 = that.queryPagePendingRecord(0);
                	break;
                	case 10:
                	var stamp2 = that.queryPagePendingRecord(1);
                	break;
                }
                
                //new Promise 实例化，接受返回值 
                const promise = new Promise(function (resolve, reject) {
            	   return resolve(stamp2);
                })
                //实例.then拿到返回值，将两个时间作比较，小于1.5秒，延长到1.5秒，再暂停喷水动画，大于1.5秒，直接暂停动画
                promise.then(function(value){
                	if(Number(value)-Number(stamp1)<1.5*1000){
                		setTimeout(function(){
                			that.$refs.loadmore.onTopLoaded();
                		},(1.2*1000-(Number(value)-Number(stamp1))))
                	}else{
                		that.$refs.loadmore.onTopLoaded();
                	}
                })
			},
			//滚动加载更多(分几种情况)
			loadBottom(){
				var that=this;
				switch(this.a)
				{
				case 0: //所有的按时间排列交易明细
				setTimeout(function(){
					that.loadMoreQueryCommonOrder();
					that.$refs.loadmore.onBottomLoaded();
				},800)
				  break;
				case 1: //活期金买入
				setTimeout(function(){
					that.loadMoreDemandBuy();
					that.$refs.loadmore.onBottomLoaded();
				},800)
				  break;
				case 2: //活期金卖出
				setTimeout(function(){
					that.loadMoreDemandSell();
					that.$refs.loadmore.onBottomLoaded();
				},800)
				  break;
				case 3://定投加载更多
				setTimeout(function(){
					that.loadMoreRegularRecords();
					that.$refs.loadmore.onBottomLoaded();
				},800)
				  break;
				case 4://存金加载更多
				setTimeout(function(){
					that.loadMoreRecycleOrder();
					that.$refs.loadmore.onBottomLoaded();
				},800)
				  break;
				case 5: //查看更多提金列表
				setTimeout(function(){
					that.loadMorePhysicalOrder();
					that.$refs.loadmore.onBottomLoaded();
				},800)
				  break;
				case 6: //定期加载更多
				setTimeout(function(){
					that.loadMoreFixedBuyOrder();
					that.$refs.loadmore.onBottomLoaded();
				},800)
				  break;
				case 7://生息加载更多
				setTimeout(function(){
					that.loadMoreInterest();
					that.$refs.loadmore.onBottomLoaded();
				},800)
				  break;
				case 8://任务奖励加载更多
				setTimeout(function(){
					that.loadMorePageAwardOrder();
					that.$refs.loadmore.onBottomLoaded();
				},800)
				  break;
				case 9://挂单买入加载更多
				setTimeout(function(){
					that.loadMorePagePendingRecord(0);
					that.$refs.loadmore.onBottomLoaded();
				},800)
				  break;
				case 10://挂单卖出加载更多
				setTimeout(function(){
					that.loadMorePagePendingRecord(1);
					that.$refs.loadmore.onBottomLoaded();
				},800)
				  break;
				default:

				}
			},
			//所有业务明细订单查询
			async loadMoreQueryCommonOrder(){
				this.searchCondition.pageNo=this.searchCondition.pageNo+1;
				var res=await queryCommonOrder(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					this.dataList=this.dataList.concat(res.content.list);
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
			},
			//活期金买入更多订单查询
			async loadMoreDemandBuy(){
				this.searchCondition.pageNo=this.searchCondition.pageNo+1;
				var res=await demandBuyOrderList(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					this.dataList=this.dataList.concat(res.content.list);
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
				
			},
			//活期金卖出更多订单查询
			async loadMoreDemandSell(){
				this.searchCondition.pageNo=this.searchCondition.pageNo+1;
				var res=await demandSellOrderList(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					this.dataList=this.dataList.concat(res.content.list);
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
				
			},
			//提金更多订单查询
			async loadMorePhysicalOrder(){
				this.searchCondition.pageNo=this.searchCondition.pageNo+1;
				var res=await queryPhysical(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					this.dataList=this.dataList.concat(res.content.list);
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
				
			},
			//定期金更多订单查询
			async loadMoreFixedBuyOrder(){
				this.searchCondition.pageNo=this.searchCondition.pageNo+1;
				var res=await queryFixedBuyOrder(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					this.dataList=this.dataList.concat(res.content.list);
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
			},
			//存金更多订单查询
			async loadMoreRecycleOrder(){
				this.searchCondition.pageNo=this.searchCondition.pageNo+1;
				var res=await queryRecycleOrder(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					this.dataList=this.dataList.concat(res.content.list);
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
			},
			//赠金更多订单查询
			async loadMorePageAwardOrder(){
				this.searchCondition.pageNo=this.searchCondition.pageNo+1;
				var res=await queryPageAwardOrder(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					this.dataList=this.dataList.concat(res.content.list);
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
			},
			//定投记录更多订单查询
			async loadMoreRegularRecords(){
				this.searchCondition.pageNo=this.searchCondition.pageNo+1;
				var res=await queryRegularRecords(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					this.dataList=this.dataList.concat(res.content.list);
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
			},
			//挂单成交更多订单查询
			async loadMorePagePendingRecord(type){
				this.searchCondition.pageNo=this.searchCondition.pageNo+1;
				var res=await queryPagePendingRecord(this.searchCondition.pageNo,this.searchCondition.pageSize,type);
				if(res.code==100){
					this.dataList=this.dataList.concat(res.content.list);
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
			},
			//利息更多订单查询
			async loadMoreInterest(){
				this.searchCondition.pageNo=this.searchCondition.pageNo+1;
				var res=await queryInterest(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					this.dataList=this.dataList.concat(res.content.list);
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
			},
			checked(){
				document.querySelector('#pull').classList.remove('pullAnimate','foldAnimate')
				document.querySelector('#pull').classList.add('pullAnimate')
				var dv=document.querySelector('.hasBottom');
				if(dv){
					dv.parentNode.removeChild(dv)
				}
				this.allLoaded=false;
				this.is=true;
				this.listShow=false;
			}
		},
		updated(){
			if(this.allLoaded){
				this.setDom()  //页面加载完后,添加到底提示
			}
		},
		watch:{
			$route(to,from){
				this.from=from.path
			},
		},
		activated: function () {
			if(this.from=='/tranDetailInfo' || this.from=='/storOrderDet' || this.from=='/extractOrderDetail'){
			}else{
				var dv=document.querySelector('.hasBottom');
				if(dv){
					dv.parentNode.removeChild(dv)
				}
				this.queryOrderType();
			    this.tradeType(0); //页面进来加载所有
			    document.querySelector('#pull').classList.remove('foldAnimate')
			    var dom=document.querySelector('.emptyList');
			    var dom2=document.querySelector('.shade');
			    if(dom){
			    	dom.style.height=(document.documentElement.clientHeight-0.88*getRem())+'px'
			    }
			    if(dom2){
			    	dom2.style.height=this.clientHeight+'px'
			    }
		    }
		},
		deactivated: function () {

		},
		components: {
			whale
		}
	}
</script>
<style type="text/css" scoped>
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.tranDetail{
	width: 100%;
	min-height:100vh;
	background-color: #f5f5f5;
	position: relative;
	box-sizing: border-box;
}
.tranDetail .emptyList{
	background-color: #F5F5F5;
	text-align: center;
	padding-top:1.66rem;
}
.tranDetail .emptyList img{
	width:3.1rem;
	height:2.38rem;
}
.tranDetail .emptyList p{
	font-size:.28rem;
	color:#666666;
	padding-top:.82rem;
}
.tranDetail .emptyList .buyGold{
	width:2.2rem;
	height:.7rem;
	background-color:#F2B643;
	color:#fff;
	font-size:.28rem;
	text-align: center;
	line-height:.7rem;
	border-radius: 4px;
	-webkit-border-radius: 4px;
	-moz-border-radius: 4px;
	-o-border-radius: 4px;
	margin:0 auto;
	margin-top:.4rem;
}
.tranDetail>.header{
	width: 100%;
	height: .88rem;
	text-align: center;
	line-height: .88rem;
	border-bottom: 1px solid #e1e1e1;
	background-color: #fff;
	position: fixed;
	top: 0;
	padding-left: .25rem;
	z-index: 13;
}
.tranDetail>.header>img:first-child{
	width: .2rem;
	height: .38rem;
	margin-top: .24rem;
	float: left;
}
.tranDetail>.header>div{
	display: inline-block;
	width: 2.2rem;
	height: .88rem;
	padding-right: .2rem;
	position: relative;
	left: -2px;
}
.tranDetail>.header>div:nth-child(2)>span{
	font-size: .33rem;
}
.tranDetail>.header>div:nth-child(2)>img{
	width: .3rem;
	height: .17rem;
	margin-bottom: .05rem;
	position: absolute;
	right: .1rem;
	margin-top: .34rem;
}
.tranDetail>.pullDown{
	width: 100%;
	background-color: #7a7a7a;
	position: absolute;
	top: .88rem;
	z-index: 12;
}
.tranDetail>.shade{
	width: 100%;
	background-color: #eeeeee;
	position: absolute;
	top: 0;
}
.tranDetail>.pullDown>li{
	list-style: none;
	float: left;
	width: 100%;
	height: 1.1rem;
	line-height: 1.1rem;
	padding: 0 .3rem 0 .3rem;
	background-color: #fff;
	text-align: center;
	font-size: .3rem;
}
/*每类交易明细列表*/
.tranDetail .tradeLists{
	padding:0 .3rem;
	background-color: #ffffff;
}
.tranDetail .tradeLists .list{
	height:1.4rem;
	padding-top:.23rem;
	position: relative;
	display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    display: -o-flex;
}
.tradeLists .list .left-part{
	flex:1.8;
	-webkit-flex:1.8;
	-moz-flex:1.8;
	-o-flex:1.8;
	text-align: left;
}
.list .left-part .left-part-p1{
	color:#333333;
	font-size:.28rem;
}
.list .left-part .left-part-p2{
	color:#999999;
	font-size:.25rem;
	padding-top: .25rem;
}
.tradeLists .list .right-part{
	flex:1;
	-webkit-flex:1;
	-moz-flex:1;
	-o-flex:1;
	text-align: right;
}
.tradeLists .list .click-link{
	flex:.15;
	-webkit-flex:.15;
	-moz-flex:.15;
	-o-flex:.15;
	text-align: right;
	padding-top:.1rem;
}
.tradeLists .list .click-link img{
	width:.13rem;
	height:.24rem;
	margin-top: .25rem;
}
.tradeLists .list .right-part-p1{
	font-size:.28rem;
}
.tradeLists .list .right-part-p2{
	color:#999999;
	font-size:.25rem;
	padding-top: .25rem;
}
.textColorG{
	color:#69CC7D;
}
.textColorR{
	color:#FF6D39;
}
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.tranDetail>.pullDown>li:before{
		content: '';
		display: inline-block;
		width: 90%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		float: left;
	}
	.list:after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2)(-o-min-device-pixel-ratio:1.5){
	.tranDetail>.pullDown>li:before{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		float: left;
	}
	.list:after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform: scaleY(0.5);
		position: absolute;
		bottom: 0;
	}
}
.checked_color{
	color: #eda835;
}
.noChecked-color{
	color: #000;
}
.fade-enter-active, .fade-leave-active {
  	transition: all .5s;
  	-webkit-transition: all .5s;
  	-moz-transition: all .5s;
  	-o-transition: all .5s;
}
.fade-enter, .fade-leave-to{
	transform: translate3d(0, -4rem, 0);
	-webkit-transform: translate3d(0, -4rem, 0);
	-moz-transform: translate3d(0, -4rem, 0);
	-o-transform: translate3d(0, -4rem, 0);
  	opacity: 0;
}
.rotate-enter-active, .rotate-leave-active {
  	transition: all .5s;
  	-webkit-transition: all .5s;
  	-moz-transition: all .5s;
  	-o-transition: all .5s;
}
.rotate-enter, .rotate-leave-to{
	transform: rotate(-180deg);
	-webkit-transform: rotate(-180deg);
	-moz-transform: rotate(-180deg);
	-o-transform: rotate(-180deg);
  	opacity: 0
}
@keyframes pullDown{
	from{
		transform: rotate(0deg)
	}
	to{
		transform: rotate(180deg)
	}
}
@keyframes fold{
	from{
		transform:rotate(180deg)
	}
	to{
		transform:rotate(360deg)
	}
}
.pullAnimate{
	animation: pullDown 0.5s linear;
	animation-fill-mode:forwards;
}
.foldAnimate{
	animation: fold 0.5s linear;
	animation-fill-mode:forwards;
}
</style>
<style type="text/css">
  .mint-loadmore-top{
    height: .88rem;
    position:relative;
  }
  #jingyu{
    height: 0;
    position:absolute;
    bottom:0.1rem;
  }
  .whale{
  	height: 0;
  }
  .mint-loadmore-content{
  	position:relative;
  }
</style>