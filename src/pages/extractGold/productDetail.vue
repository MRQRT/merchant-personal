<template>
	<div class="productDetail">
		<head-top headTitle='商品详情' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push('/extractGoldList')">
		</head-top>
		<!--产品详情-->
		<div class="product">
			<!--轮播图-->
      <section class="carousel">
        <!-- swiper -->
        <swiper :options="swiperOption">
           <swiper-slide v-for="item in (productObj.imageUrls)" :key="item"><img :src="item"></swiper-slide>
           <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </section>
			<!--产品名称和价格-->
			<section class="basic">
			 	<h3 class="proName">{{productObj.name}}</h3>
			 	<p class="price" style="display: none"><span class="sp1">¥</span><span class="sp2">{{formatPrice}}</span></p>
			</section>
			<!--产品相关信息-->
			<section class="mainProductMess">
			 	<!--产品属性-->
			 	<div class="proProperty">
			 		<div class="property-title">
			 			<p class="pro-title-p1">产品属性</p>
			 			<p class="pro-title-p2">PRODUCT ATTRIBUTES</p>
			 		</div>
			 		<div class="property-detail">
			 			<div class="left-text-info">
			 				<p class="left-p1"><span>品牌:</span>{{productObj.brand}}</p>
			 				<p class="left-p1"><span>材质:</span>Au{{productObj.fineness}}</p>
			 				<p class="left-p1">
                <span>尺寸(单位/mm):</span>
                <span v-for="item in (productObj.sizes)">{{item}}</span>
              </p>
			 				<p class="left-p4"><span>克重:</span>{{formatWeight}}g</p>
			 			</div>
			 		</div>
			 	</div>
			 	<!--产品包装-->
			 	<div class="proPacking">
			 		<div class="packing-title">
			 			<p class="pack-title-p1">产品详情</p>
			 			<!-- <p class="pack-title-p2">PRODUCT PACKING</p> -->
                        <p class="pack-title-p2">PRODUCT DETAILS</p>
			 		</div>
			 		<div class="pack-pic">
			 			<img :src="productObj.packImgUrl">
			 		</div>
			 	</div>
			 	<!--提金需知-->
			 	<div class="need-know">
			 		<div class="know-title">
			 			<p class="know-title-p1">提金须知</p>
			 			<p class="know-title-p2">GOLD INFORMATION</p>
			 		</div>
			 		<div class="know-mess">
			 			<p>1、实时提金操作后,黄金账户将扣除相应的克重;</p>
			 			<!-- <p>2、提金工费:{{productObj.labourFee}}元/克;</p> -->
			 			<p>2、金价实时变动,提金成功后不能退货,请谨慎操作.</p>
			 		</div>
			 	</div>
			 </section>
			 <!--提金按钮-->
			 <a class="extractBtn" @click="extract" id="click_btn">立即提金</a>
		</div>
    <!--选择规格的提金盒子-->
    <mt-popup
      v-model="popupVisibleExtract"
      position="bottom" id="popupVisibleExtract">
      <section class="extract-gold-box">
          <img src="../../images/blackClose.png" class="close-box" @click="closeExtract">
          <img :src="productObj.imageUrls?productObj.imageUrls[0]:''" class="small-picture">
          <h3>{{productObj.name}}</h3>
          <!--选择规格的部分-->
          <div class="coreBox">
             <!--规格-->
             <div class="standard">
               <p class="standard-title">规格</p>
               <div class="stans" ref="stans">
                 <span v-for="item in standards" @click="selectThis" :id="item.physicalId">{{item.weight | formatWeight}}g</span>
               </div>
             </div>
             <!--数量-->
             <div class="extractCount">
               <span class="countText">数量</span>
               <p class="iptCount">
                 <span style="flex:1;-webkit-flex:1;-moz-flex:1;-o-flex:1;text-align: center;line-height:.3rem;"  @touchstart="decreaseCount">
                   <img src="../../images/minus.png" class="minusNum" style="width:.24rem;height:.02rem;">
                 </span>
                 <input type="number" v-model="extractNum" style="flex:2;" pattern="[0-9]*">
                 <span style="flex:1;-webkit-flex:1;-moz-flex:1;-o-flex:1;text-align: center;line-height:.5rem;"  @touchstart="increaseCount">
                    <img src="../../images/plus.png" class="plusNum" style="width:.25rem;height:.25rem;">
                 </span>
               </p>
             </div>
             <!--确定-->
             <a class="extractConfirm" @click="extractGold" id="click_btn">确定</a>
          </div>
      </section>
    </mt-popup>
     <!--黄金不足弹窗-->
     <mt-popup
     v-model="popupVisibleExtractYE"
     position="middle" id="popupVisibleExtractYE">
     <div class="goldEnough">
         <h4>提示</h4>
         <p>您的活期黄金余额不足,请买入后再提取</p>
         <div class="btns">
             <span @click="cancelExtract" style="border-right:1px solid #EFEFEF;">取消</span>
             <span @click="$router.push('/buy')">买金</span>
         </div>
     </div>
    </mt-popup>
     <!--身份认证弹窗-->
     <mt-popup
     v-model="popupVisibleExtractSM"
     position="middle" id="popupVisibleExtractSM">
     <div class="identity">
         <h4>为保障您的账户安全,</h4>
         <h4>请先进行实名认证</h4>
         <!--点击进入实名认证-->
         <div class="btns">
             <span @click="cancelIdentity" style="border-right:1px solid #EFEFEF;">取消</span>
             <span @click="$router.push('/personHomepage/authentication')">确定</span>
         </div>
     </div>
     </mt-popup>
     <!--上传手持证件弹窗-->
     <mt-popup
     v-model="popupVisibleExtractIDCARD"
     position="middle" id="popupVisibleExtractIDCARD">
     <div class="identity">
         <h4>您还没有上传手持证件照,</h4>
         <h4>请先上传手持证件照</h4>
         <!--点击进入实名认证-->
         <div class="btns">
             <span @click="cancelUpload" style="border-right:1px solid #EFEFEF;">取消</span>
             <span @click="goToIdCard">确定</span>
         </div>
     </div>
    </mt-popup>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
  import store from '@/store'
  import {queryGoodsDetail,queryGoodsWeightList,queryMyProfil,bizCloseCheck} from '@/service/getData'
  import { setStore,clearNoNum } from '@/config/mUtils'
  import {Toast,MessageBox,Popup} from 'mint-ui'
	export default {
		data(){
			return {
                productObj:{},//产品详情
				        standards:[],//产品规格
				        extractNum:1,//提金数量默认为1
                specification:'',//所选规格
                physicalId:null,//所选产品的克重id
                demandGoldBalance:null,//请求接口所得到的活期黄金余额
                realnamed:0,//是否实名认证过
                isHandheldIDphoto:null,//是否上传过证件照
                innerHeight:null,//页面100%的高度
                swiperOption: {
                    pagination: '.swiper-pagination',
                    paginationClickable :true,
                    effect: 'coverflow',
                    grabCursor: true,
                    centeredSlides: true,
                    slidesPerView: 'auto',
                    coverflow: {
                       rotate:30,
                       stretch: 30,
                       depth: 100,
                       modifier: 2,
                       slideShadows : false
                    },
                    paginationElement : 'li',
                },
                popupVisibleExtract:false,//选择规格的盒子是否出现
                popupVisibleExtractYE:false,//活期黄金余额不足提示框出现
                popupVisibleExtractSM:false,//提示实名认证弹窗
                popupVisibleExtractIDCARD:false//是否上传证件照
			}
		},
		mounted() {
		    this.getProduceDetail();//进入页面即加载商品详情
            this.queryMyProfil();
            this.innerHeight=document.documentElement.clientHeight;
            this.queryGoodsWeightList();//请求商品克重规格
		},
    filters:{
      formatWeight(val){
        return (val*1).toFixed(4)
      },
    },
		computed:{
			formatPrice(){
          if(!this.productObj.minPrice) return;
              if(this.productObj.minPrice==this.productObj.maxPrice){
                    return (this.productObj.minPrice).toFixed(2);
              }else{
                    return (this.productObj.minPrice).toFixed(2)+'~'+(this.productObj.maxPrice).toFixed(2);
              }
      },
            formatWeight(){
                if(!this.productObj.minWeight) return;
                if(this.productObj.minWeight==this.productObj.maxWeight){
                    return (this.productObj.minWeight).toFixed(4);
                }else{
                    return (this.productObj.minWeight).toFixed(4)+'g~'+(this.productObj.maxWeight).toFixed(4);
                }
            }
		},
		methods:{
			decreaseCount(){  //提金数量减1
                if(this.extractNum==1){
                    return;
                }
                this.extractNum--;
            },
            increaseCount(){  //设置提金加1
                this.extractNum++;
            },
            //请求商品克重规格
            async queryGoodsWeightList(){
                var id=this.$route.query.id;
                var list=await queryGoodsWeightList(id);
                if(list.code==100){
                    this.standards=list.content;
                }
            },
            //点击立即提金
            async extract(){ 
                var result=await bizCloseCheck(5);//先判断是否在交易时间内
                if(result.code==100){
                    if(!result.content){
                        MessageBox({
                            title: '提示',
                            message: '亲，非交易时段，无法进行交易哦~',
                            confirmButtonText: '我知道了'
                        });
                        return;
                    }
                }
                if(!store.state.token){
                   this.$router.push({
                    path: '/loginIn',
                    query: {
                        'from': '/productDetail',
                        'id': this.$route.query.id
                    }
                  });
                  return;
                }
                //克重规格请求返回空数组的话，提示用户已售罄
                if(this.standards.length){
                    //默认选中第一个
                    this.popupVisibleExtract=true
                    document.querySelector('.stans').childNodes[0].click();
                }else{
                    Toast({
                          message: '已售罄!',
                          position: 'bottom',
                          duration: 3000
                    });
                }
            },
            closeExtract(){  //选择规格的盒子消失
                this.physicalId='';
                this.extractNum=1;
                var spans=document.querySelector('.stans').children;
                Array.from(spans).forEach( function(element, index) {
                    if(element.classList.contains('selectStyle')){
                        element.classList.remove('selectStyle');
                    }
                });
                this.popupVisibleExtract=false
            },
            selectThis($event){  //选择规格
                this.physicalId=$event.target.id;
                var childs=$event.target.parentNode.children;
                for(var i=0;i<childs.length;i++){
                    if(childs[i]==$event.target){
                        childs[i].classList.add('selectStyle');
                        this.specification=childs[i].innerHTML.split('g')[0];
                    }else if(childs[i]!==$event.target && childs[i].classList.contains('selectStyle')){
                        childs[i].classList.remove('selectStyle');
                    }
                }
            },
            extractGold(){ //选完规格确定提金
                if(!(this.extractNum*1)){
                   this.popupVisibleExtract=false
                   Toast({
                          message: '数量不能小于等于0!',
                          position: 'bottom',
                          duration: 3000
                    });
                    return;
                }
                if(!this.physicalId){
                    this.popupVisibleExtract=false
                    Toast({
                          message: '请选择规格!',
                          position: 'bottom',
                          duration: 3000
                      });
                    return;
                }
                //判断黄金余额是否充足
                var totalWeight=this.specification*this.extractNum;  //提金总克重
                if(this.demandGoldBalance<totalWeight || !this.demandGoldBalance) {
                    this.popupVisibleExtractYE=true
                    return;
                }

                //再判断有没有实名认证
                if(!this.realnamed){
                    this.popupVisibleExtractSM=true
                    return;
                }
                
                //再判断有没有上传证件照
                if(!this.isHandheldIDphoto){
                    this.popupVisibleExtractIDCARD=true
                    return;
                }
                
                this.$router.push(
                     {
                        path:'/fillInOrder', 
                        query:{
                            physicalId: this.physicalId,
                            count:this.extractNum,
                         }
                       }
                    );
            },
            async queryMyProfil(){  //查看黄金余额
                var res=await queryMyProfil();
                if(res.code==100) {
                    this.demandGoldBalance=res.content.demandGoldBalance;  //活期黄金持有
                    this.realnamed=res.content.realnamed;   //是否实名认证
                    this.isHandheldIDphoto=res.content.isHandheldIDphoto;  //是否有上传证件照
                }
            },
            cancelExtract(){  //关闭黄金余额不足弹窗
                this.popupVisibleExtractYE=false
            },
            cancelUpload(){ //关闭上传证件照弹窗
                this.popupVisibleExtractIDCARD=false
            },
            cancelIdentity(){ //关闭实名认证提醒弹窗
                this.popupVisibleExtractSM=false
            },
            goToIdCard(){  //跳转上传证件
                this.$router.push({
                    path:'/uploadIdCard',
                    query:{
                          from:'1',
                          physicalId: this.physicalId,
                          count:this.extractNum
                    }
                })
            },
            //获取产品详细信息
            async getProduceDetail(){
                var id=this.$route.query.id;
                setStore('goodsId',id,'local');
                var res=await queryGoodsDetail(id);
                if(res.code==100){
                    this.productObj=res.content;
                }
            }
		},
    watch:{
      popupVisibleExtract(val){
        if(val) return;
        this.physicalId='';
        this.extractNum=1;
      }
    },
		components:{
			headTop,
		}
	}
</script>

<style scoped>
    .productDetail{
      position: relative;
      padding-top:.88rem;
      background-color: #fff;
    }
    .product .carousel{
    	height:5.7rem;
    }
    .swiper-pagination{
    	top:5.1rem;
    }
    .swiper-container{
      padding-top:.06rem;
    }
    .swiper-slide {
    	background-position: center;
    	background-size: cover;
    	width: 300px;
    	height: 300px;
    }
    .carousel{
    	padding-top:.46rem;
    	text-align: center;
    	position: relative;
    }
    .carousel img{
    	width:5rem;
    	height:5rem;
    	box-shadow:0 0px 20px 6px #f5f5f5;
      -moz-box-shadow: 0 2px 15px 6px #f5f5f5;
      -webkit-box-shadow: 0 2px 15px 6px #f5f5f5;
      -o-box-shadow: 0 2px 15px 6px #f5f5f5;
    }
    .product .basic{
    	margin-top:.44rem;
    	padding-left:.3rem;
    }
    .basic .proName{
    	font-size:.32rem;
      color:#000000;
      font-weight: bold;
    	height:.66rem;
    }
    .basic .price{
    	color:#EDA835;
    	height:.72rem;
    }
    .basic .price .sp1{
    	font-size:.22rem;
    }
    .basic .price .sp2{
    	font-size:.36rem;
    }
    .product .mainProductMess{
    	border-top:1px solid #F2F2F2;
    	padding-left:.5rem;
    	padding-right:.46rem;
    }
    .mainProductMess .proProperty{
    	padding-top:.8rem;
    }
    .property-title p,.packing-title p,.know-title p{
    	text-align: center;
    }
    .pro-title-p1,.pack-title-p1,.know-title-p1{
    	font-size:.28rem;
    	color:#333333;
    	font-weight: bold;
    }
    .pro-title-p2,.pack-title-p2,.know-title-p2{
    	font-size:.18rem;
    	color:#666666;
    	position: relative;
    }
    .pro-title-p2:before,.pack-title-p2:before,.know-title-p2:before{
    	content:'';
    	width:.81rem;
    	height:.03rem;
    	background:url(../../images/gradientLeft.png);
    	background-size: 100%;
    	position: absolute;
    	top:0.14rem;
    	left:1.1rem;
    }
    .pro-title-p2:after,.pack-title-p2:after,.know-title-p2:after{
    	content:'';
    	width:.81rem;
    	height:.03rem;
    	background:url(../../images/gradientRight.png);
    	background-size: 100%;
    	position: absolute;
    	top:0.14rem;
    	right:1.1rem;
    }
    .property-detail{
    	padding-top:.76rem;
    }
    .left-text-info{
    	padding-top:.38rem;
    }
    .left-text-info p{
    	font-size:.26rem;
    	color:#666666;
      word-wrap: break-word;
    }
    .left-text-info p span{
    	margin-right:.16rem;
    }
    .proPacking{
    	padding-top:.76rem;
    }
    .proPacking .pack-pic{
      text-align: center;
    }
    .know-mess{
    	padding-top:.76rem;
    	padding-bottom: .8rem;
      margin-bottom:1rem;
    }
    .know-mess p{
    	font-size:.26rem;
    	color:#666666;
    	height:.48rem;
    }
    .extractBtn{
    	height:.98rem;
    	line-height:.98rem;
    	text-align: center;
    	background-color: #F2B643;
    	color:#fff;
    	font-size:.38rem;
      position:fixed;
      bottom:0;
      width:100%;
    }
    .extract-gold-box{
    	height:7.7rem;
    	width:100%;
    	background-color: #fff;
    }
    .coreBox{
      padding-left:.28rem;
      padding-right:.28rem;
    }
    .extract-gold-box h3{
    	height:1.72rem;
    	line-height:1.72rem;
    	font-size:.3rem;
    	text-align: center;
        font-weight: bold;
        color:#010101;
    	border-bottom: .01rem solid #EEEEEE;
    }
    .extract-gold-box .standard{
    	height:2.96rem;
    	padding-top:.4rem;
    }
    .extract-gold-box .standard .standard-title{
    	height:.56rem;
    	font-size:.28rem;
    	color:#333333;
    }
    .stans span{
    	  display: inline-block;
    	  width:1.52rem;
    	  height:.55rem;
    	  line-height: .52rem;
    	  text-align: center;
    	  font-size:.25rem;
    	  background-color: #F5F5F5;
    	  color:#666666;
    	  margin-right:.32rem;
    	  margin-bottom:.32rem;
    	  border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        -o-border-radius: 3px;
    }
    .stans span:nth-child(4n){
		margin-right:0;
    }
    .extractCount{
    	height:1.86rem;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .extractCount .iptCount{
        background-color: #F5F5F5;
        width:2.22rem;
        height:.5rem;
        border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        -o-border-radius: 3px;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .extractCount .countText{
    	font-size:.28rem;
    	height:.5rem;
    	line-height: .5rem;
        color:#333333;
        flex:9;
        -webkit-flex:9;
        -moz-flex:9;
        -o-flex:9;
    }
    .extractCount input{
    	height:.5rem;
    	line-height: .5rem;
    	border:none;
    	outline-style: none;
    	background-color: #F5F5F5;
    	text-align: center;
    	font-size:.2rem; 
    	font-weight: bold;
        width:.92rem;
    }
    .extractCount .minusNum{
        width:.24rem;
        height:.02rem;
    }
    .extractCount .plusNum{
        width:.25rem;
        height:.25rem;
    }
    .small-picture{
        width:1.82rem;
        height:1.82rem;
        position: absolute;
        top:-.42rem;
        left:0.28rem;
        border: 1px solid #eee;
    }
    .close-box{
        width:.36rem;
        height:.36rem;
        position: absolute;
        right:0.28rem;
        top:.46rem;
    }
    .extractConfirm{
        height:.9rem;
        width:6.92rem;
        background-color:#F2B643;
        font-size: .32rem;
        color:#fff;
        line-height: .9rem;
        text-align: center;
        border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        -o-border-radius: 3px;
        margin:0 auto;
    }
    .stans .selectStyle{
        background-color: #F2B643;
        color:#fff;
    }
    .goldEnough{
        width:4.96rem;
        background-color: #fff;
        border-radius: 10px;
        padding-top:.4rem;
    }
    .goldEnough h4{
        font-size:.3rem;
        text-align: center;
        color:#000;
    }
    .goldEnough p{
        font-size:.24rem;
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
    .identity{
        width:4.96rem;
        background-color: #fff;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        -o-border-radius: 10px;
        padding-top:.4rem;
    }
    .identity h4{
        text-align: center;
        font-size:.3rem;
    }
    #popupVisibleExtract.mint-popup{
        width:100vw;
    }
    #popupVisibleExtractYE.mint-popup,#popupVisibleExtractSM.mint-popup,#popupVisibleExtractIDCARD.mint-popup{
      width:4.96rem;
    }
</style>
<style>
  li.swiper-pagination-bullet{
    width:.12rem;
    height:.04rem;
    background-color: #E1E1E1;
  }
  li.swiper-pagination-bullet-active{
    background-color: #F2B643;
    opacity: 1;
  }
</style>