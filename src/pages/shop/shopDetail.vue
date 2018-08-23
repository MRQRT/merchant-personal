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
                    <swiper-slide class="banner-item" v-for="(item,index) in bannerList" :key="index">
                        <img src="../../images/shopBanner.jpeg" alt="">
                    </swiper-slide>
                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
            </div>
            <!-- 店铺名称 -->
            <div class="shop-basic-info">
                <div class="name">{{'周大福(当代广场店)'}}</div>
                <div class="star">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="labels">
                    <span>回购</span>
                    <span>提金</span>
                    <span>回购</span>
                    <span>提金</span>
                </div>
            </div>
            <!-- 店铺介绍 -->
            <div class="shop-instruction">
                <h3>店铺介绍</h3>
                <p>我卖黄金、收黄金、维修各种金银首饰等等等等等等，我卖黄金、收黄金、维修各种金银首饰等等等等等等，我卖黄金、收黄金、维修各种金银</p>
            </div>
            <!-- 店铺地址 -->
            <div class="shop-address">
                <h3>店铺地址</h3>
                <p>海淀区巴沟路2号北京华联万柳购物中心F1</p>
                <div class="position-img" id="container">
                    <img src="" alt="">
                </div>
            </div>
            <!-- 预约电话 -->
            <div class="appointment">
                <div class="tel">
                    <span class="icon"></span>
                    <span>400-166-9999</span>
                </div>
                <div class="btn">
                    <a href="tel:4001669999">立即预约</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import headTop from '@/components/header/head.vue'
import '@/style/swiper.min.css'

    export default {
        data(){
            return{
                bannerList:[{},{},{},{},{}],
                swiperOption:{
                    notNextTick: true,
                    slidesPerView: 1,
                    loop:true,
                    effect:'slide',
                    pagination:'.swiper-pagination',
                    paginationType:'fraction',
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
            getMap(){
                var map = new BMap.Map("container");        // 创建地图实例
                var point = new BMap.Point(116.404, 39.91); // 创建点坐标
                map.centerAndZoom(point, 15);               // 初始化
                var marker = new BMap.Marker(point);        // 创建标注
                map.addOverlay(marker);                     // 将标注添加到地图中
            }
        },
        created(){

        },
        mounted(){
            this.getMap();
        },
    }

</script>

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
</style>

<style scoped>
.shop-detail{
    width: 100%;
    padding-top:.88rem;
    padding-bottom: 1.5rem;
    min-height: 100vh;
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
}
.shop-basic-info .name{
    color: #333333;
    font-size: .4rem;
}
.shop-basic-info .star{
    flex-grow: 2;
    padding:.1rem;
}
.shop-basic-info .star span{
    display: inline-block;
    width: .24rem;
    height: .24rem;
    background: url('../../images/one-star.png') no-repeat;
    background-size: 100%;
}
.shop-basic-info .star span:nth-of-type(4){
    background: url('../../images/four-star.png') no-repeat;
    background-size: 100%;
}
.shop-basic-info .star span:nth-of-type(5){
    background: url('../../images/five-star.png') no-repeat;
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
.shop-instruction, .shop-address{
    width:100%;
    padding:0 .3rem;
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
.appointment .btn a{
    display: inline-block;
    width: 100%;
    height: 100%;
    color: #fff;
    font-size: .3rem;
}
</style>
