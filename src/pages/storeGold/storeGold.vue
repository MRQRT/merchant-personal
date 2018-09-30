<template>
	<div class="store">
		<div v-show="!pc">
		<head-top id="head-top"  style="background-color: rgba(255,255,255,0);color:rgba(0,0,0,0);z-index:0;" ref="myHeadTop">
			<div slot="head_goback" class="head_goback"  ref="headTop" style="width:100%;position:relative;">
				<img slot='message' :src='message' class="message" ref="message" @click="$router.push({path:'/messCenter'})" style="display:none;">
				<p slot="custom" class="my_store_order" @click="goToMyOrder" ref="dingdan" style="display:none;">我的订单</p>
			</div>
		</head-top>
		<!--存金banner-->
		<!-- <div class="storBanner">
			<span @click="goToMyOrder" class="my_store_order my_store_order_2">我的订单</span>
			<img src="../../images/storeGoldaBanner.jpg">
			<div class="price_container">
				<div>
					<p class="price_in">
						<span>回收金价(元/克)</span>
						<img src="../../images/goldGo.png">
					</p>
					<p class="price_amount">{{currentPrice | formatNum}}</p>
					<button class="goStore" @click="$router.push('/stor')">我要卖金
						<a class="click_bg"></a>
					</button>
				</div>
			</div>
		</div> -->
		<!-- 轮播图 -->
		<div class="storBanner swiper-container swiper-container-1">
			<span @click="goToMyOrder" class="my_store_order my_store_order_2">我的订单</span>

			<div class="swiper-wrapper">
				<div class="swiper-slide swiper-slide-1">
					<img src="../../images/storeGoldaBanner.jpg" alt="">
				</div>
				<div class="swiper-slide swiper-slide-2">
					<a href="http://activity.au32.cn?from=cjt">
						<img src="../../images/banner-new.png" alt="">
					</a>
				</div>
			</div>
			<div class="price_container">
				<div>
					<p class="price_in">
						<span>回收金价(元/克)</span>
						<img src="../../images/goldGo.png">
					</p>
					<p class="price_amount">{{currentPrice | formatNum}}</p>
					<button class="goStore" @click="$router.push('/stor')">我要卖金
						<a class="click_bg"></a>
					</button>
				</div>
			</div>
		</div>
		<!-- 特点 -->
		<section class="character">
			<div class="character_el character_el1">
				<p>高效安全</p>
				<p>出具检测中心报告</p>
			</div>
			<div class="character_el character_el2">
				<p>实力央企背景</p>
				<p>央企雄厚资本助力</p>
			</div>
			<div class="character_el character_el3">
				<p>顺丰速运</p>
				<p>全程无条件赔付</p>
			</div>
		</section>
		<!-- 店铺 -->
		<section class="shoplist">
			<div class="top-title" @click="$router.push('/shopList')">
				<h3>门店回购</h3>
				<span></span>
			</div>
			<ul>
				<li v-for="(item,index) in shopList" :key="index" @click="goDetail($event,item.id,item.name)">
					<div class="top-img">
						<img :src="item.url" alt="">
					</div>
					<p>{{item.name}}</p>
					<div class="star" :class="starJson[judgeStar(item.star)].className">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>
					<div class="intro">{{instructionJson[item.status]}}</div>
				</li>
			</ul>
		</section>
		<div class="distance" style="height:.2rem;background:#f8f8f8"></div>
		<!--存金流程-->
		<div class="store_flow">
			<section class="subtitle">黄金回收流程</section>
			<p class="resume">我们承诺，随时接受退换</p>
			<!-- <h4>存金流程</h4> -->
			<section class="flow_container">
				<div class="each_flow_container">
					<img src="../../images/flow1.png">
					<p>在线预约</p>
				</div>
				<p class="store_join_line"></p>
				<div class="each_flow_container">
					<img src="../../images/flow2.png">
					<p>顺丰上门</p>
				</div>
				<p class="store_join_line"></p>
				<div class="each_flow_container">
					<img src="../../images/flow3.png">
					<p>检测变现</p>
				</div>
			</section>
		</div>
		<!--选择黄金管家的原因-->
		<section class="reason">
			<section class="subtitle">为什么选择存金通</section>
			<p class="resume">黄金管家旗下品牌，央企背景，回收黄金我们是专业的</p>
			<div class="reason_top">
				<div>
					<img src="../../images/pr.png" alt="">
					<p>实时金价卖出</p>
					<p>透明安全有保障</p>
				</div>
				<div>
					<img src="../../images/jl.png" alt="">
					<p>直达精炼厂</p>
					<p>没有中间商赚取差价</p>
				</div>
			</div>
			<div class="reason_bottom">
				<div>
					<img src="../../images/bao2.png" alt="">
					<p>免费上门取货</p>
					<p>5000万高额保费</p>
				</div>
				<div>
					<img src="../../images/bao4.png" alt="">
					<p>先称重估价</p>
					<p>客户满意再成交</p>
				</div>
			</div>
		</section>
		<!-- 副标题 -->
		<section class="subtitle">股东背景</section>
		<div class="gudong">
			<div style="overflow: scroll;width: 10rem;">
				<div class="pe">
				<img src="../../images/zhongx.png" alt="">
				</div>
				<div class="pe">
					<img src="../../images/lan.png" alt="">
				</div>
				<div class="pe">
					<img src="../../images/yi.png" alt="">
				</div>
				<div class="pe">
					<img src="../../images/zhong2.png" alt="">
				</div>
				<div class="pe">
					<img src="../../images/bai.png" alt="">
				</div>
			</div>
		</div>
		<!-- 副标题 -->
		<section class="jieshao">
			<section class="subtitle">公司介绍</section>
			<div style="background-color: #fff;text-align:center;">
				<div v-show="hjgj" style="text-align: left;">"存金通"隶属于北京黄金管家科技发展有限公司，总部位于北京，是拥有央企背景的黄金回购平台。上海黄金交易所综合类会员“众恒隆”作为股东为“存金通”保驾护航。经由“存金通”回收来的所有黄金将直达精炼厂，为上海黄金交易所指定的黄金回收机构。</div>
				<div v-show="yjt" style="text-align: left;">“存金通”隶属于北京盈吉通电子商务有限公司，总部位于北京，是拥有央企背景的黄金回购平台。上海黄金交易所综合类会员“众恒隆”作为股东为“存金通”保驾护航。经由“存金通”回收来的所有黄金将直达精炼厂，为上海黄金交易所指定的黄金回收机构。</div>
				<p style="margin-top:.1rem;">微信公众号：hjgjdyh</p>
				<p>黄金管家官方群2018：673646474</p>
				<p>黄金管家分析群2018：556533099</p>
				<p>客服电话：4008-196-199</p>
				<p>公司地址：北京市海淀区中关村SOHO B座 1209室</p>
			</div>
		</section>
		<div class="fixed_btn" ref="btn">
			<div @click="$router.push('/stor')">卖金</div>
		</div>
		<div class="zixun">
			<div class="zixun_left">
				<span class="zhiCustomBtn">在线咨询</span>
				<section class="call"><a href="tel:4008196199" style="color:#000;">免费电话</a></section>
			</div>
			<div class="download" @click="download">
				下载APP
			</div>
		</div>
		</div>
		<!-- pc页面 -->
		<div v-show="pc" style="width:100%;over-flow:hidden;">
			<!-- 第一部分 -->
			<section class="pc_first">
				<img src="../../images/pcbg.png" alt="">
				<div class="pc_banner_content">
					<div class="pc_logo">
						<img src="../../images/cjtlogo.png" alt="" class="cjtlogo">
						<span></span>
						<div class="pc_logo_text">央企背景</div>
					</div>
					<div class="pc_title">专业回收黄金20年</div>
					<div class="pc_des">上海黄金交易所会员单位</div>
					<div class="pc_goldprice_conter">
						<p class="pc_goldprice_title">回收金价(元/克):</p>
						<p class="pc_goldprice">{{currentPrice}}</p>
					</div>
					<div class="pc_button" @mouseover="fade_in" @mouseout="fade_out">我要估价</div>
					<div class="visiable_box" v-show="visible_qc">
						<p>终于等到你～</p>
						<p>扫描下方二维码立即体验</p>
						<img src="../../images/cjt-link.png" alt="">
					</div>
				</div>
			</section>
			<!-- 第二部分 -->
			<section class="pc_second">
				<img src="../../images/lou.png" alt="">
				<div class="pc_report_content">
					<div class="pc_report_img">
						<img :src="report_png" alt="">
					</div>
					<div class="pc_report_right">
						<div class="pc_report_title">
							<img :src="safe_png" alt="" @click="checked('safe')">
							<div class="pc_per_des">
								<p>高效安全</p>
								<p>出具检测中心报告</p>
							</div>
						</div>
						<div class="pc_report_title" style="margin-top:60px;">
							<img :src="y_png" alt="" @click="checked('y')">
							<div class="pc_per_des">
								<p>实力央企背景</p>
								<p>央企雄厚资本助力</p>
							</div>
						</div>
						<div class="pc_report_title" style="margin-top:60px;">
							<img :src="sf_png" alt="" @click="checked('sf')">
							<div class="pc_per_des">
								<p>顺丰速运</p>
								<p>全程无条件赔付</p>
							</div>
						</div>
					</div>
				</div>
			</section>
			<!-- 第三部分 -->
			<section class="pc_third">
				<p class="pc_third_title">黄金回收流程</p>
				<p class="pc_third_title2">我们承诺，随时接受退换</p>
				<img src="../../images/flow.png" alt="">
			</section>
			<!-- 第四部分 -->
			<section class="pc_fourth">
				<img src="../../images/fbg.png" alt="" style="width:100%;height:600px;">
				<div class="pc_fourth_content">
					<p class="pc_fourth_title">为什么选择存金通</p>
					<p class="pc_fourth_art">黄金管家旗下品牌&nbsp;&nbsp;&nbsp;&nbsp;央企背景&nbsp;&nbsp;&nbsp;&nbsp;回收黄金我们是专业的</p>
					<div class="pc_module">
						<div class="pc_per_module">
							<section class="pc_per_module_bg">
							</section>
							<section class="pc_per_module_box">
								<img src="../../images/gj.png" alt="">
								<p>实时金价卖出</p>
								<p>透明安全有保障</p>
							</section>
						</div>
						<div class="pc_per_module">
							<section class="pc_per_module_bg">
							</section>
							<section class="pc_per_module_box">
								<img src="../../images/jlc.png" alt="">
								<p>直达精炼厂</p>
								<p>没有中间商赚取差价</p>
							</section>
						</div>
						<div class="pc_per_module">
							<section class="pc_per_module_bg">
							</section>
							<section class="pc_per_module_box">
								<img src="../../images/lc.png" alt="">
								<p>免费上门取货</p>
								<p>5000万高额保费</p>
							</section>
						</div>
						<div class="pc_per_module">
							<section class="pc_per_module_bg">
							</section>
							<section class="pc_per_module_box">
								<img src="../../images/cz.png" alt="">
								<p>先称重估价</p>
								<p>客户满意再成交</p>
							</section>
						</div>
					</div>
				</div>
			</section>
			<!-- 第五部分 -->
			<section class="pc_fifth">
				<p class="pc_fifth_title">股东背景</p>
				<div class="pc_fifth_imgs_box">
					<img src="../../images/zxxt.png" alt="" class="pc_fifth_img">
					<img src="../../images/lan.png" alt="" class="pc_fifth_img pc_fifth_img2">
					<img src="../../images/yi.png" alt="" class="pc_fifth_img pc_fifth_img2">
					<img src="../../images/zhong.png" alt="" class="pc_fifth_img" style="border:none;">
					<img src="../../images/bai.png" alt="" class="pc_fifth_img pc_fifth_img2">
				</div>
			</section>
			<!-- 第六部分 -->
			<section class="pc_sixth">
				<img src="../../images/cjtlogo.png" alt="" style="width:160px;height:44px;">
				<div class="pc_sixth_desc" v-show="yjt">“存金通”隶属于北京盈吉通电子商务有限公司，总部位于北京，是拥有央企背景的黄金回购平台。上海黄金交易所综合类会员“众恒隆”作为股东为“存金通”保架护航。经由“存金通”回收来的所有黄金将直达精炼厂，为上海黄金交易所指定的黄金回收机构。</div>
				<div class="pc_sixth_desc" v-show="hjgj">“存金通”隶属于北京盈吉通电子商务有限公司，总部位于北京，是拥有央企背景的黄金回购平台。上海黄金交易所综合类会员“众恒隆”作为股东为“存金通”保架护航。经由“存金通”回收来的所有黄金将直达精炼厂，为上海黄金交易所指定的黄金回收机构。</div>
			</section>
		</div>
		<!-- 底部 -->
		<section class="pc_footer">
			<div class="pc_footer_content">
				<div class="pc_footer_content_left">
					<div class="pc_footer_content_left_qc"> 
						<section>
							<img src="../../images/cjt-link.png" alt="">
							<p>扫码开启黄金回收之旅</p>
						</section>
						<section>
							<img src="../../images/dl.png" alt="">
							<p>扫码下载黄金管家APP</p>
						</section>
						<section>
							<img src="../../images/gjg.png" alt="">
							<p>扫码关注黄金管家公众号</p>
						</section>
					</div>
					<p class="loca">公司地址：北京市海淀区中关村SOHO B座 1209室</p>
				</div>
				<div class="pc_footer_content_right">
					<p>4008-196-199</p>
					<p style="margin-top:0;">微信公众号：hjgjdyh</p>
					<p>黄金管家官方群2018：673646474</p>
					<p>黄金管家分析群2018：556533099</p>
				</div>
			</div>
		</section>





	</div>
</template>
<script>
import foot from '@/components/footer/footGuid.vue'
import headTop from '@/components/header/head.vue'
import { queryMessagUnreadCount,shopIndex } from '@/service/getData'
import message from '@/images/message.png'//消息图标白色
import message2 from '@/images/message2.png'//消息图标黑色
import {mapState} from 'vuex'
import {setStore,getStore} from '@/config/mUtils.js'
import report1 from '@/images/report1.png'
import report2 from '@/images/report2.png'
import report3 from '@/images/report3.png'
import y from '@/images/y.png'
import nocheck_y from '@/images/nocheck_y.png'
import safe from '@/images/safe.png'
import  nocheck_safe from '@/images/nocheck_safe.png'
import sf from '@/images/sf.png'
import nocheck_sf from '@/images/nocheck_sf.png'

import '@/style/swiper.min.css'
export default {
	data() {
		return {
			message: message,
			hasUnread:false,//是否有未读的消息
			hjgj:false,//黄金管家域名下的文案显示开关
			yjt:false,//盈吉通域名下的文案显示开关
			pc:false,//是否是pc页面
			clientWidth:document.documentElement.clientWidth,//页面宽度
			lat:'39.915',  //纬度
			lng:'116.404', //经度
			instructionJson:{
				'0':'离我最近',
				'1':'回收最多',
				'2':'评分最高',
			},
			starJson:{
				'2.5':{className:'twoHalf'},
				'3':{className:'threeStar'},
				'3.5':{className:'threeHalf'},
				'4':{className:'fourStar'},
				'4.5':{className:'fourHalf'},
				'5':{className:'fullStar'},
			},
			shopList:'',
			// pc页数据
			report_png:report1,
			safe_png:safe,
			y_png:nocheck_y,
			sf_png:nocheck_sf,
			visible_qc:false,//隐藏二维码
		}
	},
	mounted() {
		this.banner_swiper();
		this.myPosition();
		var invitedBy = this.$route.query.invitedBy;
		(invitedBy)?sessionStorage.setItem('invitedBy',invitedBy):'';
		var tg = this.$route.query.source;
		var yw = this.$route.query.channel;
		(tg)?setStore('tg',tg,'local'):'';
		(yw)?setStore('yw',yw,'local'):'';
		const url = window.location.href;
		const ag = /hjgjdd/.test(url);
		if(ag){
			this.hjgj=true;
		}else{
			this.yjt=true;
		}
		if(this.clientWidth>1000){
			this.pc=true
		}else{
			this.pc=false
		}
		let tha = this;
		window.onresize = function(){
			let windowsize = document.documentElement.clientWidth;
			if(windowsize>768 || windowsize==768){
				tha.pc=true
			}else{
				tha.pc=false
			}
		}
	},
	computed:{
       ...mapState([
       	  'token','currentPrice','userInfo'
       	])
    },
	watch:{
		currentPrice(val){
			return val
		}
	},
	filters:{
		formatNum(val){
			if(!val) return;
			if(val=='0') return '0.00'
			return val.toFixed(2)
		}
	},
	methods: {
		banner_swiper(){
    		var swiper = new Swiper('.swiper-container-1', {
            	pagination: '.swiper-pagination',
            	speed: 400,
				loop:true,
				autoplay: 2000,
            	paginationElement : 'li',
        	});
    	},
		//跳转实时金价
		toCurrent(){
			window.localStorage.setItem('page','storeGold'); //记录上一页是存金首页
            this.$router.push('/currentAndHistory')
		},
		// 判断星级
		judgeStar(val){
			if(val>=91 && val<=100){
				return 5
			}else if(val>=81 && val<=90){
				return 4.5
			}else if(val>=71 && val<=80){
				return 4
			}else if(val>=61 && val<=70){
				return 3.5
			}else if(val>=51 && val<=60){
				return 3
			}else{
				return 2.5
			}
		},
		// 获取当前位置
		myPosition(){
			var that = this;

			var geolocation = new BMap.Geolocation();
			geolocation.getCurrentPosition(function(r){
				if(this.getStatus() == BMAP_STATUS_SUCCESS){
					//以指定的经度与纬度创建一个坐标点
					var pt = new BMap.Point(r.point.lng,r.point.lat);
					that.lat = r.point.lat;
					that.lng = r.point.lng;
					that.requestList(); // 调用请求数据函数
				}else {
					that.requestList(); // 调用请求数据函数
					Toast('无法获取您的位置')
				}
			},{enableHighAccuracy: true})//指示浏览器获取高精度的位置，默认false
		},
		// 点击跳转详情
		goDetail(event,id,name){
			var className = event.currentTarget.querySelector('.star').className;
			this.$router.push({
				path:'/shopDetail',
				query:{
					id:id,
					className:className,
					name:name
				}
			})
		},
		// 请求店铺数据
		async requestList(){
			var res=await shopIndex(this.lat,this.lng);
			if(res.code=='000000'){
				this.shopList = res.data;
			}else{
				Toast(res.message)
			}
		},
		//查询用户未读消息数量
		async queryMessagUnreadCount(){
    		var res=await queryMessagUnreadCount();
    		if(res.code==100){
    			if(res.content.count){
    				this.hasUnread=true;
    			}else{
    				this.hasUnread=false;
    			}
    		}
    	},
    	//滚动改变存金按钮样式
    	changeHead(){
    		var scrollTop=document.documentElement.scrollTop || document.body.scrollTop;
			if(scrollTop>=0 && scrollTop<200){
				this.$refs.dingdan.style.color = '#fff';
			}else{
				this.$refs.dingdan.style.color = '#333'
			}
    		if(480<scrollTop){
    			this.$refs.btn.style.opacity = scrollTop/1600*2.5;
				this.$refs.btn.style.display = 'block';
    		}else{
				this.$refs.btn.style.opacity = 0;
				this.$refs.btn.style.display = 'none';
			}
    	},
		//跳转我的存金订单
		goToMyOrder(){
			if(!this.token){
				this.$router.push('/loginIn')
				return
			}
			this.$router.push('/storOrder')
		},
		//下载app
		download(){
			var ua = navigator.userAgent.toLowerCase();
			//在普通浏览器里
			if (/iphone|ipad|ipod/.test(ua)) {
				window.location.href='http://itunes.apple.com/cn/app/jie-zou-da-shi/id1028299545?mt=8'
			} else if (/android/.test(ua)) {
				window.location.href='http://android.myapp.com/myapp/detail.htm?apkName=com.mz.chamberlain'
			}
		},
		//pc页面点击
		checked(val){
			if(val=='safe'){
				this.report_png=report1;
				this.y_png=nocheck_y;
				this.sf_png=nocheck_sf;
				this.safe_png=safe;
			}else if(val=='y'){
				this.report_png=report2;
				this.safe_png=nocheck_safe;
				this.sf_png=nocheck_sf;
				this.y_png=y;
			}else if(val=='sf'){
				this.report_png=report3;
				this.y_png=nocheck_y;
				this.safe_png=nocheck_safe;
				this.sf_png=sf;
			}
		},
		fade_in(){
			this.visible_qc=true
		},
		fade_out(){
			this.visible_qc=false
		}
	},
	components:{
		foot,
		headTop,
	},
	activated: function () {
		this.token ? this.queryMessagUnreadCount() :this.hasUnread=false;
	    document.onscroll=this.changeHead;
	    document.ontouchmove=this.changeHead;

		//初始化智齿咨询组件实例
		var zhiManager = (getzhiSDKInstance());
		//再调用load方法
		zhiManager.on("load", function() {
			zhiManager.initBtnDOM();
		});
		zhiManager.set('color','09aeb0')//API示例，格式为 0-9 a-f 之间的六位有效字符 不用加#
		//隐藏聊天窗体底部的智齿科技冠名
		zhiManager.set('powered',true);
		//true 自定义咨询按钮 废弃系统默认按钮
		zhiManager.set('customBtn', 'true');
		//获取未读消息数
		zhiManager.on("receivemessage", function(ret) {
			// console.log(ret)
		});
		//获取离线客服发的消息数
		zhiManager.on("unread.count",function(data){
			// console.log(data);
		});
		//设置语言
		zhiManager.set('lan', 'cn');
		//设置用户信息
		if(this.token){
			//设置用户信息
			var userInfor = this.userInfo;
			zhiManager.set('userinfo', {
			tel: userInfor.telephone,   //电话或手机
			uname: userInfor.telephone,  //昵称
			visitTitle: '',   //对话页标题，若不传入系统将获取用户打开咨询组件时所在页面的标题
			visitUrl: '',   //对话页URL，若不传入系统将获取用户打开咨询组件时所在页面的URL
			face: userInfor.avatar?userInfor.avatar:'',   //头像URL
			realname: userInfor.realnamed?userInfor.name:'',   //真实姓名
			weibo: '',   //微博账号
			weixin: '',   //微信账号
			qq: '',   //QQ号
			sex: '', //0 男 1 女
			birthday: '',   //生日，如“1990-01-01”
			remark: '',   //用户的备注信息
			// params: '{"等级":"VIP用户","客户状态":"意向客户"}'   //自定义用户信息字段
			});
		}
    },
    deactivated: function () {
    	document.onscroll=null;
    	document.ontouchmove=null;
    }
}
</script>
<style type="text/css" scoped>

#head-top>.head_goback>.mes_num{
	display: inline-block;
    color: #fff;
    font-size: .2rem;
    width: 11px;
    height: 11px;
    line-height: .3rem;
    text-align: center;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -o-border-radius: 50%;
    background-color: #ff6d39;
    position: absolute;
    top: 0;
    left: .4rem;
}
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family:PingFang-SC-Regular;
}
img{
	width: 100%;
}
.store{
	width: 100%;
	position: relative;
	top: 0;
	padding-bottom:1.22rem;
	background-color: #fff;
	text-align: center;
}
.storBanner{
	width:100%;
	height: 7.2rem;
	position: relative;
}
.storBanner img{
	width:100%;
}
.storBanner .gradient{
	width:100%;
	position: absolute;
	bottom:0;
	left:0;
}
#head-top{
	height: .88rem;
	width: 100%;
	z-index: 100;
	padding: .18rem .3rem 0 0;
	text-align: center;
	position:fixed;
	top:0;
}
.store .message{
	width: .6rem;
	height: .6rem;
	position: absolute;
	left:0;
}
.price_container{
	width:100%;
	bottom:-1rem;
	position: absolute;
	display: flex;
	justify-content: center;
	z-index:9999;
}
.price_container>div{
	height: 3.8rem;
	display: inline-block;
	width: 6.7rem;
	padding-top:.38rem;
	background-color: #fff;
	text-align: center;
	box-shadow: 0px 10px 12px -1px #ebebeb;
}
.price_in{
	text-align: center;
}
.price_in span{
	color:#666666;
	font-size:.28rem;
}
.price_in img{
	width:.44rem;
	height:.44rem;
	vertical-align: middle;
}
.price_amount{
	color:#333333;
	font-size:.88rem;
	text-align: center;
	font-weight:800;
	margin-top:.1rem;
}
.goStore{
	width:3.5rem;
	height:.7rem;
	 background: -webkit-linear-gradient(left, #C09C60, #DDC899);
	border-radius: 18px;
	color:#fff;
	font-size:.34rem;
	text-align: center;
	display: block;
	margin:0 auto;
	line-height:.7rem;
	margin-top:.3rem;
	position: relative;
}
.goStore .click_bg{
	width:3.5rem;
	height:.7rem;
	background-color:transparent;
	border-radius: 18px;
	position: absolute;
	left:0;
}
.goStore .click_bg:active{
	background-color:rgba(0,0,0,.2);
}
/*特点*/
.character{
	display: flex;
	flex-direction: row;
	justify-content: center;
	height: 1.3rem;
	margin-top: 1.72rem;
}
.character_el{
	width: 2.16rem;
	height: 1.5rem;
}
.character_el1{
	background: linear-gradient(90deg,#D0B06F,#E5CE9C);
}
.character_el2{
	background: linear-gradient(90deg,#9DA9C2,#DEE2EB);
}
.character_el3{
	background: linear-gradient(90deg,#856359,#DAC8C6);
}

.character_el p:nth-child(1){
	font-size: .3rem;
	color: #fff;
	text-align: center;
	line-height: .5rem;
	font-weight: bold;
	padding-top: .3rem;
}
.character_el p:nth-child(2){
	font-size: .2rem;
	color: #fff;
	text-align: center;
}
.character>div:nth-child(2){
	margin: 0 .25rem 0 .25rem;
}
/*店铺列表*/
.shoplist{
	width: 100%;
	min-height: 3rem;
	padding:0 .4rem .6rem;
	margin-top:1rem;
}
.shoplist .top-title{
	width:100%;
	height:1rem;
	line-height: 1rem;
	/* margin-bottom: .3rem; */
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.shoplist .top-title h3{
	color: #333;
	font-size: .34rem;
	font-weight: bold;
}
.shoplist .top-title span{
	display: inline-block;
	width: .36rem;
	height: .36rem;
	background:url('../../images/rightArr.png') no-repeat;
	background-size: 100%;
}
.shoplist ul {
	display:flex;
	justify-content: space-between;
}
.shoplist ul li{
	width:2.1rem;
	text-align: left;
}
.shoplist ul li .top-img{
	width:2.1rem;
	height: 2.1rem;
	background-color: #eee;
}
.shoplist ul li .top-img img{
	width: 100%;
	height:100%;
}
.shoplist ul li p{
	width:100%;
	color: #333;
	font-size: .3rem;
	margin-top:.2rem;
	overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.shoplist ul li .intro{
	color: #999;
	font-size: .22rem;
}
.star span{
    display: inline-block;
    width: .24rem;
    height: .24rem;
    background: url('../../images/empty-star.png') no-repeat;
    background-size: 100%;
}
.star span:nth-of-type(1){
    background: url('../../images/one-star.png') no-repeat;
    background-size: 100%;
}
.star span:nth-of-type(2){
    background: url('../../images/one-star.png') no-repeat;
    background-size: 100%;
}
.star span:nth-of-type(3){
    background: url('../../images/one-star.png') no-repeat;
    background-size: 100%;
}
.star span:nth-of-type(4){
    background: url('../../images/four-star.png') no-repeat;
    background-size: 100%;
}
.star span:nth-of-type(5){
    background: url('../../images/five-star.png') no-repeat;
    background-size: 100%;
}
/* 2.5星 */
.twoHalf span:nth-of-type(3){
    background: url('../../images/one-pice-star.png') no-repeat;
    background-size: 100%;
}
/* 2.5/3星 */
.twoHalf span:nth-of-type(4), .threeStar span:nth-of-type(4){
    background: url('../../images/empty-star.png') no-repeat;
    background-size: 100%;
}
/* 3.5/4星 */
.twoHalf span:nth-of-type(5), .threeStar span:nth-of-type(5),.threeHalf span:nth-of-type(5),.fourStar span:nth-of-type(5){
    background: url('../../images/empty-star.png') no-repeat;
    background-size: 100%;
}
/* 3.5星 */
.threeHalf span:nth-of-type(4){
    background: url('../../images/four-pice-star.png') no-repeat;
    background-size: 100%;
}
/* 4.5星 */
.fourHalf span:nth-of-type(5){
    background: url('../../images/five-pice-star.png') no-repeat;
    background-size: 100%;
}
/*存金流程*/
.store_flow{
	background-color: #fff;
	width: 6.9rem;
	height: 4rem;
	/* margin-top: .6rem; */
	display: inline-block;
}
.resume{
	font-size: .24rem;
	color: #C09C60;
	text-align: center;
}
.store_flow h4{
	font-size: .34rem;
	padding-left: .32rem;
    color: #333333;
    font-weight: 600;
}
.flow_container{
	-webkit-display: flex;
	-o-display: flex;
	-moz-display: flex;
	display: flex;
	-webkit-justify-content: center;
	-o-justify-content: center;
	-moz-justify-content: center;
	justify-content: center;
	margin-top:.7rem;
}
.flow_container img{
	width:.6rem;
}
.flow_container .each_flow_container{
	text-align: center;
	position: relative;
}
.flow_container .each_flow_container p{
	font-size:.24rem;
	color:#666666;
	padding-top:.14rem;
}
.flow_container  .store_join_line{
	width: 1.2rem;
	height: .02rem;
	background-color: #E1E1E1;
	margin-left: .1rem;
	margin-right: .1rem;
	margin-top: .3rem;
}
.store .my_store_order{
	font-size:.24rem;
	color:#fff;
	position:absolute;
	right:.3rem;
	top:.18rem;
	z-index: 9999;
}
.my_store_order_2{
	display: inline-block;
	width: 1.3rem;
	height: .6rem;
	text-align: right;
	padding-top: .1rem;
}
/*reason*/
.reason{
	width: 6.9rem;
	height: 8.18rem;
	background-color: #fff;
	display: inline-block;
}
.reason_top,.reason_bottom{
	display: flex;
	justify-content: center;
	flex-direction: row;
	margin-top: .7rem;
}
.reason_top>div,.reason_bottom>div{
	width: 3.35rem;
}
.reason_top>div>p:nth-child(2),.reason_bottom>div>p:nth-child(2){
	font-size: .28rem;
	line-height: .65rem;
}
.reason_top>div>p:nth-child(3),.reason_bottom>div>p:nth-child(3){
	font-size: .25rem;
	color: #999999;
	line-height: .4rem;
}
.reason_top img, .reason_bottom img{
	width: 1.2rem;
	height: 1.2rem;
}
.subtitle{
	height: .8rem;
	font-size: .34rem;
	color: #333333;
	line-height: .8rem;
	text-align: center;
	font-weight: bold;
	margin-top: .5rem;
}
.subtitle:before{
	display: inline-block;
	content:'';
	width: 1rem;
	height: .25rem;
	background-image: url(../../images/r.png);
	background-repeat: no-repeat;
	background-size: 90%;
	background-position: center;
	margin-right: .2rem;

}
.subtitle:after{
	display: inline-block;
	content:'';
	width: 1rem;
	height: .25rem;
	background-image: url(../../images/l.png);
	background-repeat: no-repeat;
	background-size: 90%;
	background-position: center;
	margin-left: .2rem;
}
.ti{
	width: 100%;
	height: 2.5rem;
	font-size: .28rem;
	color: #666666;
	text-align: center;
}
.ti img{
	width: 2rem;
	height: 2rem;
}
/**/
.gudong{
	width: 100%;
	height: 4.33rem;
	margin-top: .2rem;
	background-image: url(../../images/hgdBg.jpg);
	background-repeat: no-repeat;
	background-size: 100%;
	background-color: #fff;
	display: inline-block;
	padding: 1.26rem .15rem 0rem .41rem;
	overflow: hidden;
	overflow-x: scroll;
	white-space: nowrap;
}
.pe{
	width: 1.8rem;
	height: 1.8rem;
	background-color: rgba(239,239,239,	.8);
	float: left;
	margin-right: .2rem;
}
.pe img{
	width: 1.5rem;
    height: .63rem;
    float: left;
    margin-top: .55rem;
	margin-left: .18rem;
}
.jieshao{
	width: 6.9rem;
	padding: 0 .3rem 0 .3rem;
	margin-bottom: .3rem;
	display: inline-block;
	background-color: #fff;
	margin-top: .2rem;
}
.jieshao>div{
	background-color: rgba(248, 248, 248, 1);
	font-size: .24rem;
	color: #999;
	padding: .38rem;
	line-height: .45rem;
}
.jieshao>div>div{
	font-size: .28rem;
	color: #666;
}
.jieshao p{
	text-align: left;
}
.fixed_btn{
	width: 100%;
	text-align: right;
	position: fixed;
	bottom: 50%;
	opacity: 0;
	display: none;
}
.fixed_btn>div{
	display: inline-block;
	font-size: .35rem;
	text-align: center;
	width: 1.3rem;
    height: 1.3rem;
	line-height:1.3rem;
	background:-webkit-linear-gradient(left, #C09C60, #DDC899);
    border-radius: 50%;
    left: 0;
	color: #fff;
	margin-right: .4rem;
	box-shadow: 0px 0px 12px 2px #DDC899;
}
/*
电话咨询
*/
.zixun{
	width: 100%;
	display: flex;
	flex-direction: row;
	height: .98rem;
	background-color: #fff;
	align-items: center;
	position: fixed;
	bottom: 0;
	border-top: 1px solid #eeeeee;
}
.zixun_left{
	flex-grow: 3;
	height: .98rem;
	color: #333;
	line-height: 1.5rem;
	display: flex;
	flex-direction: row;
	font-size: .22rem;
}
.zhiCustomBtn{
	flex-grow: 1;
	background: url(../../images/ser.png);
	background-repeat: no-repeat;
	background-size: .36rem .36rem;
    background-position: center 8px;
}
.call{
	flex-grow: 1;
	background: url(../../images/tel.png);
	background-repeat: no-repeat;
	background-size: .36rem .36rem;
    background-position: center 8px;
}
.download{
	flex-grow: 2.5;
	height: 100%;
	line-height: .98rem;
	background-color: #DDC899;
	color: #fff;
}
/*pc页面部分*/ 
.pc_first{
	width:100%;
	position:relative;
}
.pc_banner_content{
	width:100%;
	overflow: hidden;
	position: absolute;
	top:27%;
	padding-left:23%;
}
.pc_logo{
	height:37px;
	width: 100%;
	overflow: hidden;
}
.pc_logo span{
	float: left;
	height: 37px;
	border-left: 1px solid #DDC899;
	margin-left:15px;
	margin-right:15px;
}
.cjtlogo{
	width:134px;
	height:37px;
	float:left;
}
.pc_logo_text{
	font-size:27px;
	color:#DDC899;
	float:left;
}
.pc_title{
	width: 100%;
    height: 70px;
    color: #fff;
    font-size: 40px;
    text-align: left;
    letter-spacing: 4px;
	padding-top:10px;
}
.pc_des{
	width:100%;
	font-size:20px;
	color:#fff;
	text-align:left;
}
.pc_goldprice_conter{
	width: 244px;
	height: 164px;
	background: #C09C60;
	margin-top: 12px;
	padding-top:40px;
}
.pc_goldprice_title{
	font-size:16px;
	color:#fff;
	text-align:center;
}
.pc_goldprice{
	font-size:30px;
	color:#fff;
	font-size: 55px;
	text-align: center;
}
.pc_button{
	width:244px;
	height: 60px;
	font-size:20px;
	line-height: 60px;
	text-align: center;
	background:linear-gradient(90deg,rgba(221,200,153,1) 0%,rgba(192,156,96,1) 100%);
	color:#fff;
	margin-top:16px;
}
.pc_second{
	width:100%;
	padding-top:220px;
	position: relative;
}
.pc_report_content{
	width: 100%;
	position: absolute;
	padding-left: 12%;
	top:16%;
}
.pc_report_img{
	width: 500px;
	float: left;
	margin-right: 110px;
}
.pc_report_right{
	float:left;
}
.pc_report_title{
	overflow: hidden;
}
.pc_report_title img{
	width:80px;
	float:left;
	margin-right:20px;
}
.pc_per_des{
	float: left;
	color:#333;
}
.pc_per_des p{
	text-align: left;
	line-height: 30px;
}
.pc_per_des p:nth-child(1){
	margin-top:12px;
	font-size:20px;
	font-weight:bold;
}
.pc_per_des p:nth-child(2){
	color:#666;
	font-size:12px;
}
.pc_third_title{
	font-size:32px;
	color:#333;
	font-weight: bold;
	line-height: 160px;
}
.pc_third_title2{
	font-size:15px;
	color:#333;
	margin-bottom:35px;
}
.pc_fourth{
	margin-top:80px;
	position: relative;
}
.pc_fourth_content{
	width: 100%;
	position: absolute;
	top:30px;
}
.pc_fourth_title{
	font-size:32px;
	color:#fff;
	line-height: 130px;
}
.pc_fourth_art{
	font-size:15px;
	color:#fff;
}
.pc_module{
	width: 100%;
	margin-top:50px;
	display: flex;
	justify-content: center;
}
.pc_per_module{
	width: 255px;
	height: 280px;
	position: relative;
	margin-left:15px;
	margin-right:15px;
}
.pc_per_module_bg{
	width: 255px;
	height: 280px;
	float: left;
	background:#fff;
	opacity:0.15;
}
.pc_per_module_box{
	width:255px;
	height: 280px;
	position: absolute;
	top:0;
	left:0;
}
.pc_per_module img{
	width: 170px;
	margin-top:36px;
}
.pc_per_module p:nth-child(2){
	font-size:18px;
	color:#fff;
	margin-top:25px;
	line-height: 28px;
}
.pc_per_module p:nth-child(3){
	font-size:14px;
	line-height: 25px;
	color:#fff;
	margin-top:5px;
}
.pc_fifth{
	width: 100%;
	height: 300px;
}
.pc_fifth_title{
	font-size:32px;
	line-height: 150px;
}
.pc_fifth_imgs_box{
	display: flex;
	justify-content: center;
}
.pc_fifth_img{
	margin-left: 15px;
	margin-right:15px;
	width:160px;
	height:68px;
	border:1px solid #E1E1E1;
}
.pc_fifth_img2{
	padding:10px;
}
.pc_sixth{
	width:100%;
	height:400px;
	background:rgba(249,249,249,1);
	padding-top:90px;
}
.pc_sixth_desc{
	margin-top:40px;
	width: 100%;
	text-align:left;
	text-indent: 2%;
	font-size:18px;
	line-height: 35px;
	color:#666;
	padding:0 20% 0 20%;
}
.pc_footer{
	width: 100%;
	height: 255px;
	background-color: rgb(51, 51, 51);
	text-align: center;
	font-size: 8px;
	color: #fff;
}
.pc_footer_content{
	display: inline-block;
	width: 1002px;
	height: 180px;
	position: relative;
}
.pc_footer_content_left{
	position: absolute;
	width: 580px;
	height: 270px;
	background-image: url(../../images/footer_left_bg.png);
	background-repeat: no-repeat;
	background-size: 100%;
	text-align: left;
	top:-50px;
	padding:0 28px 0 28px;
}
.pc_footer_content_left_qc{
	display: flex;
	justify-content: center;
	font-size:14px;
	color: #fff;
	padding-top:40px;
}
.pc_footer_content_left_qc section{
	width: 135px;
	margin: 0 20px 0 20px;
}
.pc_footer_content_left_qc p{
	line-height: 30px;
	font-size:12px;
}
.pc_footer_content_right{
	width: 500px;
    height: 180px;
    float: right;
    text-align: left;
    line-height: 25px;
    padding-left: 310px;
}
.pc_footer_content_right p:nth-child(1){
	font-size: 20px;
	line-height: 80px;
	font-weight: bold;
}
.loca{
	width:88%;
	color: #fff;
	line-height: 43px;
	text-align: left;
	border-top:1px solid #fff;
	position: absolute;
	bottom:0;
}
.visiable_box{
	width: 230px;
	height: 290px;
	background-color:#fff;
	position:absolute;
	bottom:70px;
	left:30%;
	padding-top:20px;
}
.visiable_box:after{
	content:'';
	width: 10px;
	height: 10px;
	background-color:#fff;
	position: absolute;
	left:48%;
	bottom:-5px;
	transform:rotate(135deg);
}
.visiable_box p{
	font-size: 14px;
	color:#666;
}
.visiable_box img{
	width: 94%;
}
</style>
<style media="screen">
	.swiper-container{
		overflow: visible;
	}
</style>
