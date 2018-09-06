<template>
    <div class="shopList">
        <!-- 头部标题部分 -->
        <head-top :headTitle=title class="head-top nomal-font" ref="topHead">
            <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack()">
        </head-top>
        <!-- 主体部分 -->
        <div class="main-cont">
            <!-- 顶部地址部分 -->
            <div class="current-address">
                <div class="left-text" @click="showCity">当前位置：{{localPosition | setShort}}</div>
                <div class="right-text" @click="myPosition">
                    <!-- <span class="icon" :class="{'icon-rotate':rotateStatus}"></span>重新定位 -->
                    <span class="icon"></span>重新定位
                </div>
            </div>
            <!-- 列表部分 -->
            <!-- :style="{height: wrapperHeight + 'px' }" -->
            <div class="list-wrap" v-show="showStatus" ref="wrapper">
                <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false"
                    bottomPullText="上拉加载更多" bottomDropText="松开立即加载" ref="loadmore" class="loadmore">
                    <ul class="shop-list">
                        <li class="shop-item" v-for="(item,index) in shopList" :key="index" @click="goDetail($event,item.id,item.name)">
                            <div class="left-img">
                                <img :src="item.url" alt="">
                            </div>
                            <div class="right-text">
                                <h3>{{item.name}}</h3>
                                <p class="detail-address">{{item.address}}</p>
                                <div class="star" :class="starJson[judgeStar(item.star)].className">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <div class="bottom">
                                    <div class="labels">
                                        <span v-for="labelItem in item.labels">{{labelItem}}</span>
                                    </div>
                                    <div class="distans">
                                        <span>{{item.distance}}km</span>
                                        <!-- <span>2.3km</span> -->
                                        <span class="left-line" v-if="index<=2"></span>
                                        <span class="instruction">{{instructionJson[index]}}</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </mt-loadmore>
            </div>
        </div>
        <!-- 城市选择弹框 -->
        <div class="city-mask" v-if="cityShow">
            <div class="top-address">
                <div class="location">
                    <div>当前位置：</div>
                    <div>{{this.localPosition | setShort}}</div>
                </div>
                <div class="positioning" @click="myPosition">
                    <span class="icon"></span>
                    <span>重新定位</span>
                </div>
            </div>
            <mt-index-list>
                <mt-index-section v-for="(letter,index) in citySortArr" :key="index" :index="letter">
                    <!-- <mt-cell  v-for="(cityName,index) in cityArr"  :key="index" v-if="cityName.key == letter" :title="cityName.value" @click.native="chooseCity(cityName.value)"></mt-cell> -->
                    <mt-cell  v-for="(item,index) in cityArr" :key="index" v-if="item.spell==letter" :title="item.cityName" @click.native="chooseCity(item)"></mt-cell>
                </mt-index-section>
            </mt-index-list>
        </div>
    </div>
</template>

<script>
import headTop from '@/components/header/head.vue'
import city from "@/json/city"             //导入所有城市的JSON
import { makePy } from "@/config/pinying"  //导入插件获取所有城市中文的大写首字母
import {mapState,mapMutations} from 'vuex';
import { shopList, cityList } from '@/service/getData.js';
import { MessageBox,Toast,Popup,Indicator } from 'mint-ui';

    export default {
        data(){
            return{
                showStatus:false,    // 是否显示内容
                wrapperHeight:0,     // 加载内容动态高度
                title:'更多门店',
                starNum:'',            // 星级
                localPosition:'正在获取位置...',  // 当前位置
                rotateStatus:false,   // 定位图标旋转
                cityShow:false,
                allLoaded:false,
                lat:'', //经度
                lng:'', //纬度
                searchCondition: {   // 分页属性
                    pageNo: 0,
                    pageSize: 10
                },
                pages:'',             // 总页数
                instructionJson:{
                    '0':'离我最近',
                    '1':'回收最多',
                    '2':'评分最高',
                },
                spell:'', //选择城市的首字母
                arr: [],//存放初始筛选的城市名称
                cityArr: [],//存放第二次筛选后所有城市名称
                citySort: [],//存放初始获取城市首字母大写的数组
                citySortArr: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],//存放第二次筛选重复，不存在的城市首字母数组
                starJson:{
                    '2.5':{className:'twoHalf'},
                    '3':{className:'threeStar'},
                    '3.5':{className:'threeHalf'},
                    '4':{className:'fourStar'},
                    '4.5':{className:'fourHalf'},
                    '5':{className:'fullStar'},
                },
                shopList:'',
            }
        },
        components:{
            headTop,
        },
        computed: {
            ...mapState([
                'currentPosition'
            ])
        },
        filters:{
            // 截取当前位置长度
            setShort(val){
              if(val.length>16){
                return val.substring(0,16)+'...'
              }else{
                return val;
              }
            }
        },
        watch:{
            cityShow(val){
                this.title = val ? '选择城市' : '更多门店'
            }
        },
        methods: {
            ...mapMutations([
                'RECORD_POSITION',
            ]),
            // 显示城市选择
            showCity(){
                this.cityShow = !this.cityShow;
            },
            // 顶部返回按钮
            goBack(){
                if(this.title=='选择城市'){
                    this.cityShow = false;
                }else if(this.title=='更多门店'){
                    this.$router.push('/')
                }
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
            // 点击对应城市
            chooseCity(val){
                this.cityShow = false;
                this.localPosition = val.cityName;
                this.lat = val.latitude;
                this.lng = val.longitude;
                this.searchCondition.pageNo = 0;
                this.initTop();
                this.requestList();
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
            initTop(){
                console.log(document.body.scrollTop,document.documentElement.scrollTop)
            	document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0
            },
            // 首次进入请求数据
            async requestList(){
                var res=await shopList(this.lat,this.lng,this.searchCondition.pageNo,this.searchCondition.pageSize);
                if(res.code=='000000'){
                    this.showStatus = true;
                    Indicator.close();
                    this.shopList = res.data.content;
                    this.pages=res.data.totalPages;
                    if(this.searchCondition.pageNo>=this.pages){
                       this.allLoaded=true;  //数据加载完，bottomMethod则不再执行
                    }
                }else{
                    Toast(res.message)
                }
            },
            // 加载更多
            async loadMore(){
                this.searchCondition.pageNo=this.searchCondition.pageNo+1;
                var res=await shopList(this.lat,this.lng,this.searchCondition.pageNo,this.searchCondition.pageSize);
                if(res.code=='000000'){
                  this.shopList=this.shopList.concat(res.data.content);
                  if(this.searchCondition.pageNo>=this.totalPages){
                       this.allLoaded=true;  //数据加载完，bottomMethod则不再执行
                  }
                }
            },
            // 上拉加载
            loadBottom(){
                var that = this;
                setTimeout(function(){
                    that.loadMore();
                    that.$refs.loadmore.onBottomLoaded();
                },800)
            },
            // 获取城市列表
            async cityList(){
                var that = this;
                var res = await cityList(this.spell);
                if(res.code=='000000'){
                    this.cityArr = res.data;
                }
            },
            // 获取当前位置
            myPosition(){
                var that = this;
                this.rotateStatus = true;
                this.localPosition = '正在获取位置...';

                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r){
        			if(this.getStatus() == BMAP_STATUS_SUCCESS){
        				//以指定的经度与纬度创建一个坐标点
        				var pt = new BMap.Point(r.point.lng,r.point.lat);
                        that.lat = r.point.lat;
                        that.lng = r.point.lng;
                        that.requestList(); // 调用请求数据函数

        				//创建一个地理位置解析器
        				var geoc = new BMap.Geocoder();
        				geoc.getLocation(pt, function(rs){//解析格式：城市，区县，街道
        					var addComp = rs.addressComponents;
                            that.rotateStatus = false;
        					that.localPosition = addComp.city + addComp.district + addComp.street;
                            that.RECORD_POSITION(that.localPosition)
        				});
        			}else {
                        this.localPosition = '获取位置失败...'
                        this.requestList();  // 请求默认店铺列表
                        switch( this.getStatus() )
                        {
                            case 2:
                                Toast( '位置结果未知 获取位置失败.' );
                            break;
                            case 3:
                                Toast( '导航结果未知 获取位置失败..' );
                            break;
                            case 4:
                                Toast( '非法密钥 获取位置失败.' );
                            break;
                            case 5:
                                Toast( '对不起,非法请求位置获取位置失败.' );
                            break;
                            case 6:
                                Toast( '对不起,当前没有权限 获取位置失败.' );
                            break;
                            case 7:
                                Toast( '对不起,服务不可用获取位置失败.' );
                            break;
                            case 8:
                                Toast( '对不起,请求超时获取位置失败.' );
                            break;

                        }

        			}
        		},{enableHighAccuracy: true})//指示浏览器获取高精度的位置，默认false
            },
        },
        // created () {
        //     /**
        //      * 将json数据中的无用数据剔除
        //      */
        //     for (let i in city) {
        //       if (city[i].name != "请选择") {//将第一层数据中为 “请选择” 的剔除掉
        //         this.arr.push(city[i].name);
        //         for (let j in city[i].sub) {//将第二层数据中为 “请选择 和 其他” 的剔除掉
        //           if (
        //             city[i].sub[j].name != "请选择" &&
        //             city[i].sub[j].name != "其他"
        //           ) {
        //             this.arr.push(city[i].sub[j].name);//将处理后的数据存放在数组中，等待第二次筛选处理
        //           }
        //         }
        //       }
        //     }
        //
        //     /**
        //      * 配置相关数据
        //      */
        //     for (let k in this.arr) {
        //       let cityKey = makePy(this.arr[k])[0].substring(0, 1);//获取每一个市区的首字母
        //       let cityValue = this.arr[k];//获取所有市区
        //       this.citySort[cityKey] = cityKey;//利用对象特性，剔除重复的字母，并将剔除后的字母存进对象中
        //
        //       //将所有市区信息 以（ 字母 - 市区名 ）的格式存在至数组中
        //       this.cityArr[k] = {
        //         key: cityKey,
        //         value: cityValue
        //       };
        //     }
        //
        //     /**
        //      * 将处理后的首字母数据对象，存放至数组中
        //      */
        //     for (let p in this.citySort) {
        //         this.citySortArr.push(this.citySort[p]);
        //     }
        //
        //     /**
        //      * 将真实存在的市区首字母按A-Z进行排序
        //      */
        //     this.citySortArr = this.citySortArr.sort();
        //     console.log(this.citySortArr)
        // },
        mounted(){
            Indicator.open({
              // text: '加载中...',
              spinnerType: 'fading-circle'
            });
            this.myPosition();
            this.cityList();
            // 计算滚动内容的高度
    		this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;;
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
            p.style.fontSize='0.28rem';
            p.style.color = '#999999';
            p.style.width='100%';
            p.style.height='1rem';
            p.style.lineHeight ='1rem';
            p.style.textAlign = 'center';
            document.querySelector('.shop-list').appendChild(p)
          }
        },
    }

</script>

<style media="screen">
    #head_top{
        z-index: 10002 !important;
    }
    .mint-loadmore-bottom{
        color:#999;
        font-size: .24rem;
        background-color: #F8F8F8;
    }
    /* 城市选择容器 */
    .mint-indexlist-content{
        overflow: scroll;
        padding-bottom: .2rem;
    }
    .mint-indexlist{
        margin-top:2.08rem;
    }
    .mint-cell-title {
        flex: 0 0 auto;
        padding-left:.3rem;
    }
    .mint-indexsection-index {
        color:#666;
        font-size: .26rem;
        padding:.3rem;
        background-color: #F8F8F8;
        text-align: left;
    }
    .mint-cell{
        color: #666;
    }
    .mint-cell-wrapper{
        font-size: .26rem;
        padding:0;
        background-position:bottom left;
    }
    .mint-indexlist-navitem{
        flex-grow: 1;
        color: #666;
        font-size: .22rem;
    }
    .mint-indexsection ul .mint-cell:last-child .mint-cell-wrapper{
        background-image: none;
    }
    .mint-indexlist-nav{
        /* padding-top:1rem; */
        border-left:none;
        justify-content: flex-start;
    }
</style>

<style scoped>
.city-mask{
    width:100%;
    height: 100vh;
    position: fixed;
    top:0;
    bottom:0;
    left:0;
    right: 0;
    z-index:1000;
}
.location div:first-child{
    margin-bottom: .05rem;
}
.city-mask .top-address{
    width: 100%;
    height: 1.2rem;
    color: #333;
    font-size:.26rem;
    padding:0 .3rem;
    border-bottom: 1px solid #f8f8f8;
    background-color: #fff;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flex;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top:.88rem;
    z-index: 1000;
}
.positioning{
    color: #EDA835;
}
.positioning .icon{
    display: inline-block;
    width: .26rem;
    height: .26rem;
    margin-right: .1rem;
    vertical-align: -.05rem;
    background: url('../../images/position.png') no-repeat;
    background-size: 100%;
}
.shopList{
    width: 100%;
    position: relative;
    background-color: #F8F8F8;
    font-family:PingFangSC-Regular;
}
.main-cont{
    width: 100%;
    min-height: 100vh;
    /* padding-top:.88rem; */
    background-color: #F8F8F8;
}
.main-cont .current-address{
    width: 100%;
    height: .6rem;
    line-height: .6rem;
    background-color: #F7EBD4;
    padding:0 .3rem;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flex;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top:.88rem;
    z-index:1000;

}
/* .current-address .left-text{
    width:80%;
}
.current-address .right-text{
    width:20%;
} */
.current-address div{
    color:rgba(237,168,53,1);
    font-size: .24rem;
}
.current-address div .icon{
    display: inline-block;
    width: .26rem;
    height: .26rem;
    margin-right: .1rem;
    vertical-align: -.03rem;
    background: url('../../images/position.png') no-repeat;
    background-size: 100%;
}
@keyframes roundLoop2{
    0%{ transform: rotate(0deg); }
    100%{ transform: rotate(360deg); }
}
.icon-rotate{
    animation: roundLoop2 1s linear infinite;
}
.list-wrap{
    width:100%;
    /* min-height: 100vh; */
    padding-top:1.48rem;
    /* overflow: scroll; */
}
.list-wrap .shop-item{
    width:100%;
    padding:.4rem .2rem;
    background-color: #fff;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flex;
    display: flex;
}
.list-wrap .shop-item .left-img{
    width: 1.8rem;
    height:1.8rem;
    margin-right:.3rem;
    background-color: #eee;
}
.shop-item .left-img img{
    width:100%;
    height:100%;
}
.shop-item .right-text{
    width:70%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flex;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.shop-item .right-text h3{
    width:100%;
    color:#333;
    font-size:.32rem;
    font-family:PingFangSC-Regular;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.shop-item .right-text .detail-address{
    width:100%;
    color:#999;
    font-size: .22rem;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.shop-item .right-text .star{
    flex-grow: 2;
    padding-top:.08rem;
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
.shop-item .right-text .bottom{
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flex;
    display: flex;
    align-items:flex-end;
    justify-content: space-between;
}
.bottom .labels{
    flex-grow: 1;
}
.shop-item .right-text .bottom .labels span{
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
.shop-item .right-text .bottom .distans{
    color: #666;
    font-size: .24rem;
}
.left-line{
    display: inline-block;
    width:1px;
    height:.25rem;
    vertical-align: -.04rem;
    background-color: #666;
}
</style>
