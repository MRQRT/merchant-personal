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
                    <span v-for="(item,index) in detailInfo.label" :key="index">{{item}}</span>
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
            <div class="shop_address_content">
                <!-- 地图导航 -->
                <div class="open_map" @click="open_m_baidumap()"></div>
                <h3 style="margin-bottom:.5rem;">店铺地址</h3>
                <p class="shop_address" v-show="detailInfo.provinceName">
                    <span>{{detailInfo.provinceName}}</span>
                    <span v-show="detailInfo.cityName">| {{detailInfo.cityName}}</span>
                    <span v-show="detailInfo.areaName">| {{detailInfo.areaName}}</span>
                </p>
                <p class="shop_location">{{detailInfo.address}}</p>
                <p class="shop_nearby">{{detailInfo.nearby}}</p>
                <div class="position-img" id="container">
                    <img src="" alt="">
                </div>
            </div>
            <!-- 预约电话 -->
            <div class="appointment">
                <div class="tel">
                    <span class="icon"></span>
                    <span v-if="detailInfo.phone=='未知'">4008-196-199</span>
                    <span v-else>{{phone}}</span>
                </div>
                <div class="btn">
                    <a class="" href="tel:4008-196-199" v-if="detailInfo.phone=='未知'">立即预约</a>
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
import icons from "../../images/move.png"

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
                    mark:'',
                    star:90,
                    address:'',
                    phone:'',
                    lat:'',
                    lng:'',
                    label:['回购','存金'],
                },
                toGo:false,
                startPoint:'',
                endPoint:'',
                city:'',//城市
            }
        },
        components:{
            headTop,
        },
        computed: {
            phone(){ // 如果有2个电话号码只取第一个
                var mobile = this.detailInfo.phone;
                if(!mobile){
                    return
                }
                if(mobile.indexOf(',')!=-1){
                    return mobile.split(',')[0]
                }else{
                    return mobile;
                }
            }
        },
        watch:{

        },
        methods: {
            // 显示店铺地图
            getMap(){
                var map = new BMap.Map("container");        // 创建地图实例
                var point = new BMap.Point(this.lng,this.lat); // 创建点坐标
                map.centerAndZoom(point, 15);               // 初始化
                // var marker = new BMap.Marker(point);        // 创建标注
                // map.addOverlay(marker);                     // 将标注添加到地图中
                this.v_mark(map,point.lng,point.lat);
                this.get_location(map,point);
            },
            //地图标记(map，经度，纬度)
            v_mark(val,val1,val2){
                var point = new BMap.Point(val1, val2);
                val.centerAndZoom(point, 17);
                //自定义标注  1、map  2、经纬度对象
                this.v_zidingyi_marker(val,point)
            },
            //自定义标注
            v_zidingyi_marker(val,val1){
                var v_this=this
                // 创建图标对象
                var myIcon = new BMap.Icon(icons, new BMap.Size(23, 45), {
                    anchor: new BMap.Size(10, 25),
                    // imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移
                });
                // 创建标注对象并添加到地图
                var marker = new BMap.Marker(val1, {icon: myIcon});
                val.addOverlay(marker);
                val.panTo(val1);
            },
            //定位
            get_location(map,endPoint){
                var v_this=this;
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r){
                    if(this.getStatus() == BMAP_STATUS_SUCCESS){
                        var mk = new BMap.Marker(r.point);
                        if(r.point.lng=='116.40387397'&&r.point.lat=='39.91488908'){
                        }else{
                        }
                        // alert(r.point.lng)
                        v_this.toGo=true
                        v_this.startPoint=r.point;
                        v_this.endPoint=endPoint;
                    }
                    else {
                        alert('failed'+this.getStatus());//定位失败，不进行导航；
                    }
                });
            },
            //打开百度地图
            open_m_baidumap(){
                if(!this.toGo){
                    return false
                }
                var start_lat=this.startPoint.lat,
                start_lng=this.startPoint.lng,
                endPoint_lat=this.endPoint.lat,
                endPoint_lng=this.endPoint.lng;
                // var a = 'http://api.map.baidu.com/direction?origin=latlng:'+start_lat+','+start_lng+'|name:我的位置&destination=name:'+this.name+'|latlng:'+endPoint_lat+','+endPoint_lng+'&mode=driving&region=北京&output=html&src=webapp.baidu.openAPIdemo';
                var a = 'http://api.map.baidu.com/direction?origin=name:我的位置'+'|latlng:'+start_lat+','+start_lng+'&destination=name:'+this.name+'|latlng:'+endPoint_lat+','+endPoint_lng+'&mode=driving&region=北京&output=html&src=webapp.baidu.openAPIdemo';
                window.location.href=a;
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
                        const host = window.location.host;
                        const url = window.location.href;
                        if(host.search('test')>0){
                            window.location.href = 'https://cjtsh-test.au32.cn/openshopguide?shopId='+this.id+'&from='+url;
                        }else{
                            window.location.href = 'https://cjtsh.au32.cn/openshopguide?shopId='+this.id+'&from='+url;
                        }
                        // window.location.href = 'https://cjtsh-test.au32.cn/openshopguide?shopId='+this.id+'&from='+url+'&className='+this.className+'&name='+this.name;
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
                    this.city=res.data.cityName;//
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
.shop-instruction, .shop_address_content{
    width:100%;
    padding:0 .3rem;
    position: relative;
}
.shop-instruction h3, .shop_address_content h3{
    color: #000;
    font-size: .3rem;
    margin-bottom: .25rem;
}
.shop-instruction p, .shop_address_content p{
    color: #666;
    font-size: .26rem;
    line-height: .5rem;
}
.shop_address_content{
    margin-top:.6rem;
}
.shop_address_content .position-img{
    height: 3.5rem;
    margin-top:.1rem;
    border:1px solid #eee;
}
.shop_address_content .position-img img{
    width: auto;
    height: 100%;
}
.shop_address{
    background-image:url('../../images/address_icon.png');
    background-position: 0 .09rem;
    background-repeat: no-repeat;
    background-size: .28rem;
    padding-left: .5rem;
}
.shop_location{
    background-image:url('../../images/location_icon.png');
    background-position: 0 .09rem;
    background-repeat: no-repeat;
    background-size: .28rem;
    padding-left: .5rem;
}
.shop_nearby{
    background-image:url('../../images/nearby_icon.png');
    background-position: 0 .09rem;
    background-repeat: no-repeat;
    background-size: .28rem;
    padding-left: .5rem;
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
.open_map{
    width:2.2rem;
    height:.9rem;
    position:absolute;
    top:0;
    right:.25rem;
    background-image:url('../../images/daohang.png');
    background-size:100%;
}
</style>
