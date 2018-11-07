<template>
    <div class="shop-detail">
        <!-- 头部标题部分 -->
        <head-top headTitle='门店主页' class="head-top nomal-font" ref="topHead">
            <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
        </head-top>
        <!-- 主体部分 -->
        <div class="main-cont">
            <!-- 顶部banner -->
            <div class="banner">
                <swiper :options="swiperOption">
                    <swiper-slide class="banner-item" v-for="(item,index) in detailInfo.imageUrls" :key="index">
                        <!-- <img src="../../images/shopBanner.jpeg" alt=""> -->
                        <img :src="item" alt="">
                    </swiper-slide>
                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
            </div>
            <!-- 店铺名称 -->
            <div class="shop-basic-info">
                <div class="name">{{name}}</div>
                <div :class="className">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="labels">
                    <span v-for="item in detailInfo.label">{{item}}</span>
                </div>
                <!-- 认领按钮 -->
                <div class="apply-shop" v-if="detailInfo.statusId==1" @click="applyShop">我要认领</div>
                <div class="apply-shop applyed" v-else-if="detailInfo.statusId==3">已被认领</div>
            </div>
            <!-- 店铺介绍 -->
            <div class="shop-instruction">
                <h3>店铺介绍</h3>
                <p>{{detailInfo.mark}}</p>
            </div>
            <!-- 店铺地址 -->
            <div class="shop-address">
                <h3>店铺地址</h3>
                <p>{{detailInfo.address}}</p>
                <div class="position-img" id="container">
                    <img src="" alt="">
                </div>
            </div>
            <!-- 预约电话 -->
            <div class="appointment">
                <div class="tel">
                    <span class="icon"></span>
                    <span>{{detailInfo.phone}}</span>
                </div>
                <div class="btn">
                    <div class="" v-if="detailInfo.phone=='未知'">立即预约</div>
                    <a :href="'tel:'+ detailInfo.phone" v-else>立即预约</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import headTop from '@/components/header/head.vue'
import '@/style/swiper.min.css'
import {shopDetail} from '@/service/getData.js';
import { MessageBox,Toast } from 'mint-ui';



    export default {
        data(){
            return{
                id:'',
                className:'',
                name:'',
                lat:'',
                lng:'',
                swiperOption:{
                    notNextTick: true,
                    slidesPerView: 1,
                    loop:true,
                    effect:'slide',
                    pagination:'.swiper-pagination',
                    paginationType:'fraction',
                },
                detailInfo:{
                    imageUrls:[{},{},{},{}],
                    mark:'我卖黄金、收黄金、维修各种金银首饰等等等等等等，我卖黄金、收黄金、维修各种金银首饰等等等等等等，我卖黄金、收黄金、维修各种金银',
                    star:90,
                    address:'北京市北京市北京市北京市北京市',
                    phone:17600568656,
                    lat:'',
                    lng:'',
                    label:['回购','存金'],
                },
            }
        },
        components:{
            headTop,
        },
        computed: {

        },
        watch:{

        },
        methods: {
            // 显示店铺地图
            getMap(){
                var map = new BMap.Map("container");        // 创建地图实例
                var point = new BMap.Point(this.lng,this.lat); // 创建点坐标
                map.centerAndZoom(point, 15);               // 初始化
                var marker = new BMap.Marker(point);        // 创建标注
                map.addOverlay(marker);                     // 将标注添加到地图中
            },
            // 点击我要认领
            applyShop(){
                MessageBox({
                    title:'',
                    message: '即将前往“存金通商户版”',
                    confirmButtonText: '立即前往',
                    showCancelButton: true,
                    cancelButtonText:'取消',
                }).then((action)=>{
                    if(action=='confirm'){
                        var url = window.location.href;
                        window.location.href = 'https://cjtsh-test.au32.cn/openshopguide?shopId='+this.id+'&from='+url;
                    }
                })
            },
            // 请求详情数据
            async shopDetail(){
                var res = await shopDetail(this.id);
                if(res.code=='000000'){
                    this.detailInfo = res.data;
                    this.lat = res.data.lat; // 纬度
                    this.lng = res.data.lng; // 经度
                    this.getMap();           // 展示地图
                }
            }
        },
        created(){
            this.id = this.$route.query.id;
            this.className = this.$route.query.className;
            this.name = this.$route.query.name
        },
        mounted(){
            this.shopDetail();
        },
    }

</script>

<style media="screen">
    .mint-msgbox-wrapper .mint-msgbox{
        width: 4.9rem;
        border-radius: 4px;
    }
    .mint-msgbox-wrapper .mint-msgbox-content{
        height: 1.11rem;
        border-bottom: 1px solid #eee;
    }
    .mint-msgbox-wrapper .mint-msgbox-message{
        color: #333;
        font-size: .28rem;
        line-height: .85rem;
    }
    .mint-msgbox-wrapper .mint-msgbox-btns{
        height: .88rem;
        line-height: .88rem;
        font-size: .32rem;
    }
    .mint-msgbox-wrapper .mint-msgbox-cancel{
        color: #999 !important;
        border-right:1px solid #eee;
    }

</style>


<style media="screen">
    .swiper-pagination{
        width:.8rem;
        height: .42rem;
        color:#fff;
        text-align: center;
        line-height: .42rem;
        font-size: .24rem;
        background:rgba(0,0,0,1);
        opacity:0.3;
        border-radius:21px;
        position: absolute;
        left:86% !important;
        bottom:.3rem;
    }
    .swiper-container{
        height:100% !important;
    }
</style>

<style scoped>
.shop-detail{
    width: 100%;
    padding-top:.88rem;
    padding-bottom: 1.5rem;
    min-height: 100vh;
    overflow-x: hidden;
}
.main-cont{

}
.main-cont .banner{
    height:5rem;
    background-color: #eee;
}
.main-cont .banner img{
    width: 100%;
    height: 5rem;
}
.shop-basic-info{
    width: 100%;
    padding:0 .3rem;
    margin:.4rem 0 .6rem;
    position: relative;
}
.shop-basic-info .name{
    color: #333333;
    font-size: .4rem;
}
.shop-basic-info .star{
    flex-grow: 2;
    padding:.1rem;
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
.shop-basic-info  .labels span{
    display: inline-block;
    padding:0 .04rem;
    height: .35rem;
    text-align: center;
    line-height: .35rem;
    color: #EDA835;
    font-size: .18rem;
    margin-right:.1rem;
    border:1px solid #F2B643;
    border-radius: 3px;
}
.apply-shop{
    width: 2rem;
    height: .7rem;
    text-align: center;
    line-height: .7rem;
    color: #EDA835;
    font-size: .3rem;
    border:1px solid #F2B643;
    border-radius: 35px;
    position: absolute;
    right:.3rem;
    bottom: .02rem;
}
.applyed{
    color:#F4CB86;
    border:1px solid #F7D38E;
}
.shop-instruction, .shop-address{
    width:100%;
    padding:0 .3rem;
    position: relative;
}
.shop-instruction h3, .shop-address h3{
    color: #000;
    font-size: .3rem;
    margin-bottom: .25rem;
}
.shop-instruction p, .shop-address p{
    color: #666;
    font-size: .26rem;
    line-height: .4rem;
}
.shop-address{
    margin-top:.6rem;
}
.shop-address .position-img{
    height: 3.5rem;
    margin-top:.1rem;
    border:1px solid #eee;
}
.shop-address .position-img img{
    width: auto;
    height: 100%;
}
.appointment{
    width:100%;
    height: 1.1rem;
    line-height: 1.1rem;
    background-color: #fff;
    padding:0 .3rem;
    font-family:PingFangSC-Medium;
    position: fixed;
    bottom: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flex;
    display: flex;
    align-items: center;
    justify-content: space-between;
    -webkit-box-shadow:1px 0px 46px rgba(0,0,0,0.06);
    -moz-box-shadow:1px 0px 46px rgba(0,0,0,0.06);
    -o-box-shadow:1px 0px 46px rgba(0,0,0,0.06);
    box-shadow:1px 0px 46px rgba(0,0,0,0.06);
}
.appointment .tel{
    color: #333;
    font-size: .4rem;
}
.appointment .tel .icon{
    display: inline-block;
    width: .44rem;
    height: .44rem;
    margin-right:.1rem;
    vertical-align: -.03rem;
    background: url('../../images/tel.png') no-repeat;
    background-size: 100%;
}
.appointment .btn{
    width: 2rem;
    height: .7rem;
    text-align: center;
    line-height: .7rem;
    background-color: #000;
    -webkit-border-radius:3px;
    -moz-border-radius:3px;
    -o-border-radius:3px;
    border-radius:3px;
}
.appointment .btn{
    color: #fff;
}
.appointment .btn a{
    display: inline-block;
    width: 100%;
    height: 100%;
    color: #fff;
    font-size: .3rem;
}
</style>
