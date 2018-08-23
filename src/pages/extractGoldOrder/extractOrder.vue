<template>
	<div class="my-extractGold-order">
		 <head-top headTitle='提金订单' class="head-top" id="head_top" ref="topHead">
			  <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push('/mine')">
		 </head-top>
		 <!--主要内容区域-->
		 <!--有订单时-->
		 <div v-if="hasExtract" class="extractList" style="padding-bottom:1rem;">
          <mt-loadmore  :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" :bottomPullText="bottomPullText" ref="loadmore" @top-status-change="handleTopChange">
            <div slot="top" class="mint-loadmore-top">
                <whale :top-status="topStatus">
                </whale>
            </div>
              <section class="order-area" ref="orderArea">
                  <div class="perOrder" @click="goToBrief(item.id)" v-for="item in orders">
                    <div class="perOrderLeft">
                      <img :src="item.imageUrl || default1">
                    </div>
                    <div class="perOrderRight">
                      <div class="perOrderRight-left">
                        <h4>{{item.name}}</h4>
                        <p class="format"><span class="left-spn">规格:</span><span>{{item.weight}}g</span></p>
                        <p class="number"><span class="left-spn">件数:</span><span>共{{item.quantity}}件</span></p>
                      </div>
                      <div class="perOrderRight-right">
                        <!--提金订单状态有六种 待审核、审核不通过、付款成功(待发货)、付款失败、已发货(待收货)、已签收(已完成)-->
                        <p class="right-right-p1">{{ item.status==0 ? '待审核' : (item.status==1 ? '待发货' : (item.status==2 ? '付款失败' : (item.status==3 ? '已发货' :'已签收'))) }}</p>
                        <p class="right-right-p2">{{item.createTime | formatTime}}</p>
                      </div>
                    </div>
                  </div>
              </section>
          </mt-loadmore>
           <!--提金按钮-->
          <a @click="$router.push('/extractGoldList')" id="click_btn" class="extractGoldBtn">
          我要提金
         </a>
    </div>
    <!--没有订单时-->
    <div class="noExtractOrder" v-if="!hasExtract">
      <img src="../../images/noExtract.png">
      <p>您还没有提过黄金,试试提金交易吧!</p>
      <span @click="$router.push('/extractGoldList')">立即提金</span>
    </div>
  </div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
  import whale from '../../components/whale/whale.vue';
  import {queryPhysical} from '@/service/getData'
  import { getRem } from '@/config/mUtils'
  import default1 from '@/images/defaltExtract.png'
	export default {
		data(){
			return {
              searchCondition:{  //分页属性 
                  pageNo:1,  
                  pageSize:6 
              },
				      hasExtract:true,  //是否有提金记录
              orders:[],//存储提金列表
              allLoaded:false,  //提金列表是否加载完
              false:false,//避免页面进来时一直执行上拉加载
              bottomPullText:'上拉加载',
              pages:null, //总页数
              default1:default1, //默认图片
              topStatus: null,
              from:null //上一级路由是哪儿
			}
		},
		created(){
			 this.queryPhysical();//进入页面加载第一页数据
		},
		mounted() {
        
		},
    filters: {
        formatTime : function(value){   //过滤后台给的时间格式
              if(!value) return;
              var arr=value.split(':');
              arr.pop()
              var newTime=arr.join(':');
              return newTime;
          }
    },
		methods:{
            handleTopChange(status) {
              this.topStatus = status;
            },
            //查看提金列表
            async queryPhysical(){
              var dv=document.querySelector('.hasBottom');
              if(dv){
                dv.parentNode.removeChild(dv)
              }
                this.hasExtract=true;
                this.allLoaded=false;
                this.searchCondition.pageNo=1;
                var res=await queryPhysical(this.searchCondition.pageNo,this.searchCondition.pageSize)
                if(res.code==100){
                  var timestamp1 = new Date().getTime();
                    if(res.content.total==0){
                        this.hasExtract=false;
                    }else{
                        this.orders=res.content.list;
                        this.pages=res.content.pages;  //后台数据的总页数
                        if(this.searchCondition.pageNo>=this.pages){
                           this.allLoaded=true;  //数据加载完，bottomMethod则不再执行
                        }
                    }
                }
                return timestamp1;
            },
			      goToBrief(orderNo){  //进入提金详情
				      this.$router.push({
					          path:'/extractOrderDetail',
                    query:{
                        orderNo:orderNo
                    }
				      })
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
              const stamp2 = that.queryPhysical();
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
            loadBottom(){ //上拉加载
                var that = this;
                setTimeout(function(){
                  that.pullmore();
                  that.$refs.loadmore.onBottomLoaded();
                },800)
            },
            async pullmore(){ //上拉加载
                this.searchCondition.pageNo=this.searchCondition.pageNo+1;
                var res=await queryPhysical(this.searchCondition.pageNo,this.searchCondition.pageSize)
                if(res.code==100){
                  this.orders=this.orders.concat(res.content.list);
                  if(this.searchCondition.pageNo>=this.pages){
                    this.allLoaded=true;  //数据加载完，bottomMethod则不再执行
                  }
                }
            }
		},
    updated(){
      if(this.allLoaded){
        //创建标签 提示内容已到底部 加载完毕
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
        document.querySelector('.extractList').appendChild(p)
      }
    },
		components:{
			headTop,
      whale
		},
    watch:{
      $route(to,from){
        this.from=from.path
      },
    },
    activated: function () {
      if(this.from=='/extractOrderDetail'){

      }else{
        this.queryPhysical();//进入页面加载第一页数据
      }
    },
    deactivated: function () {

    },
	}
</script>

<style scoped>
    .my-extractGold-order{
      background-color: #F5F5F5;
      min-height:100vh;
    }
    .my-extractGold-order .order-area{
      background-color: #fff;
      padding-left:.3rem;
      padding-right:.3rem;
    }
    .my-extractGold-order .order-area .perOrder{
      height:2.1rem;
      padding-top:.4rem;
      border-bottom:1px solid #F3F3F3;
      display: flex;
      display: -webkit-flex;
      display: -moz-flex;
      display: -o-flex;
    }
    .order-area .perOrder .perOrderLeft{
      flex:1;
      -webkit-flex:1;
      -moz-flex:1;
      -o-flex:1;
    }
    .order-area .perOrder .perOrderLeft img{
      border:1px solid #EEEEEE;
    }
    .order-area .perOrder .perOrderRight{
    	margin-left:.3rem;
    	flex:4;
      -webkit-flex:4;
      -moz-flex:4;
      -o-flex:4;
    }
    .perOrderRight .perOrderRight-left{
    	float:left;
    }
    .perOrderRight .perOrderRight-left h4{
    	font-size:.28rem;
    	height:.5rem;
    }
    .perOrderRight .perOrderRight-left p{
    	font-size:.25rem;
    	color:#6F6F6F;
      padding-top: .1rem;
    }
    .perOrderRight-left p .left-spn{
    	margin-right:.2rem;
    }
    .order-area .perOrder img{
      width:1.3rem;
      height:1.3rem;
    }
    .perOrderRight .perOrderRight-right{
    	float:right;
    	text-align: right;
    }
    .perOrderRight .perOrderRight-right .right-right-p1{
    	font-size:.28rem;
    	color:#F0B762;
    	height:1rem;
    }
    .perOrderRight .perOrderRight-right .right-right-p2{
    	font-size:.25rem;
    	color:#6F6F6F;
    }
    .my-extractGold-order .extractGoldBtn{
    	height:.98rem;
    	line-height: .98rem;
    	width:100%;
    	position: fixed;
    	bottom:0;
    	text-align: center;
    	font-size:.35rem;
    	color:#fff;
    	background-color: #F2B643;
    }
    .my-extractGold-order .noExtractOrder{
     	text-align: center;
     	padding-top:2.24rem;
     	background-color: #F5F5F5;
    }
    .my-extractGold-order .noExtractOrder img{
     	width:3.11rem;
     	height:2.39rem;
    }
    .my-extractGold-order .noExtractOrder p{
     	padding-top:.5rem;
     	font-size:.32rem;
     	color:#666666;
    }
    .my-extractGold-order .noExtractOrder span{
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
</style>
<style type="text/css">
  .mint-loadmore-top{
    height: .88rem;
    position:relative;
    margin-top:0;
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
