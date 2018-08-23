<template>
    <div class="shop-list">
        <!-- 头部标题部分 -->
        <head-top :headTitle=title class="head-top nomal-font" ref="topHead">
            <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
        </head-top>
        <!-- 主体部分 -->
        <div class="main-cont">
            <!-- 顶部地址部分 -->
            <div class="current-address">
                <div class="left-text" @click="showCity">当前位置：{{localPosition}}</div>
                <div class="right-text" @click="myPosition">
                    <span class="icon" :class="{'icon-rotate':rotateStatus}"></span>重新定位
                </div>
            </div>
            <!-- 列表部分 -->
            <div class="list-wrap" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
    				:auto-fill="false" bottomPullText="上拉加载更多" bottomDropText="松开立即加载" ref="loadmore" class="loadmore">
                <ul>
                    <li class="shop-item" v-for="(item,index) in shopList" :key="index" @click="$router.push({path:'/shopDetail',query:{id:1}})">
                        <div class="left-img">
                            <img src="" alt="">
                        </div>
                        <div class="right-text">
                            <h3>{{item.name}}</h3>
                            <p class="detail-address">{{item.address}}</p>
                            <div class="star" :class="starJson[judgeStar(item.starNum)].className">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div class="bottom">
                                <div class="labels">
                                    <span v-for="labelItem in item.labels">{{labelItem.name}}</span>
                                </div>
                                <div class="distans">
                                    <span>{{item.distance}}km</span>
                                    <span class="left-line" v-if="item.instruction"></span>
                                    <span class="instruction" v-if="item.instruction">{{instructionJson[index]}}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                </mt-loadmore>
            </div>
        </div>
        <!-- 城市选择弹框 -->
        <div class="city-mask" v-show="cityShow">
            <div class="top-address">
                <div class="location">
                    <div>当前位置：</div>
                    <div>{{this.currentPosition}}</div>
                </div>
                <div class="positioning" @click="myPosition">
                    <span class="icon"></span>
                    <span>重新定位</span>
                </div>
            </div>
            <mt-index-list>
                <mt-index-section v-for="(letter,index) in citySortArr" :key="index" :index="letter">
                    <mt-cell  v-for="(cityName,index) in cityArr"  :key="index" v-if="cityName.key == letter" :title="cityName.value" @click.native="chooseCity(cityName.value)"></mt-cell>
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



    export default {
        data(){
            return{
                wrapperHeight:0,     // 加载内容动态高度
                title:'更多门店',
                starNum:'',            // 星级
                localPosition:'正在获取位置...',  // 当前位置
                rotateStatus:false,   // 定位图标旋转
                cityShow:false,
                allLoaded:false,
                searchCondition: {   // 分页属性
                    pageNo: 1,
                    pageSize: 10
                },
                pages:'',             // 总页数
                instructionJson:{
                    '0':'离我最近',
                    '1':'回收最多',
                    '2':'评价最高',
                },
                arr: [],//存放初始筛选的城市名称
                cityArr: [],//存放第二次筛选后所有城市名称
                citySort: [],//存放初始获取城市首字母大写的数组
                citySortArr: [],//存放第二次筛选重复，不存在的城市首字母数组
                starJson:{
                    '2.5':{className:'twoHalf'},
                    '3':{className:'threeStar'},
                    '3.5':{className:'threeHalf'},
                    '4':{className:'fourStar'},
                    '4.5':{className:'fourHalf'},
                    '5':{className:'fullStar'},
                },
                shopList:[
                    {
                        name:'周生生(当代广场店)',
                        address:'海淀区中关村大街40号当代商城F1',
                        starNum:20,
                        labels:[
                            {
                                name:'回购',
                            },
                            {
                                name:'提金'
                            },
                            {
                                name:'提金'
                            },
                            {
                                name:'回购',
                            },
                        ],
                        distance:'1.7',
                        instruction:'离我最近'

                    },
                    {
                        name:'周生生(当代广场店)',
                        address:'海淀区中关村大街40号当代商城F1',
                        starNum:55,
                        labels:[
                            {
                                name:'回购',
                            },
                            {
                                name:'提金'
                            },
                            {
                                name:'提金'
                            },
                            {
                                name:'回购',
                            },
                        ],
                        distance:'1.7',
                        instruction:'评分最高'

                    },
                    {
                        name:'周生生(当代广场店)',
                        address:'海淀区中关村大街40号当代商城F1',
                        starNum:66,
                        labels:[
                            {
                                name:'回购',
                            },
                            {
                                name:'提金'
                            },
                            {
                                name:'提金'
                            },
                            {
                                name:'回购',
                            },
                        ],
                        distance:'1.7',
                        instruction:'回收最多'

                    },
                    {
                        name:'周生生(当代广场店)',
                        address:'海淀区中关村大街40号当代商城F1',
                        starNum:77,
                        labels:[
                            {
                                name:'回购',
                            },
                            {
                                name:'提金'
                            },
                            {
                                name:'提金'
                            },
                            {
                                name:'回购',
                            },
                        ],
                        distance:'1.7',
                    },
                    {
                        name:'周生生(当代广场店)',
                        address:'海淀区中关村大街40号当代商城F1',
                        starNum:88,
                        labels:[
                            {
                                name:'回购',
                            },
                            {
                                name:'提金'
                            },
                            {
                                name:'提金'
                            },
                        ],
                        distance:'1.7',
                    },
                    {
                        name:'周生生(当代广场店)',
                        address:'海淀区中关村大街40号当代商城F1',
                        starNum:99,
                        labels:[
                            {
                                name:'回购',
                            },
                            {
                                name:'提金'
                            },
                            {
                                name:'提金'
                            },
                        ],
                        distance:'1.7',
                    },
                ]
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

        },
        watch:{

        },
        methods: {
            ...mapMutations([
                'RECORD_POSITION',
            ]),
            // 显示城市选择
            showCity(){
                this.cityShow = !this.cityShow;
                if(this.cityShow){
                    this.title = '选择城市'
                }else{
                    this.title = '更多门店'
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
                this.localPosition = val
            },

            // 首次进入请求数据
            async requestList(){
                var res=await query_list(this.searchCondition.pageNo,this.searchCondition.pageSize);
                if(res.code==200){
                    this.shopList = res.data.list;
                    this.pages=res.data.pages;
                    if(this.searchCondition.pageNo>=this.pages){
                       this.allLoaded=true;  //数据加载完，bottomMethod则不再执行
                    }
                }
                return timestamp1;
            },
            // 加载更多
            // loadMore(){
            //     this.searchCondition.pageNo=this.searchCondition.pageNo+1;
            //     var res=await query_list(this.searchCondition.pageNo,this.searchCondition.pageSize);
            //     if(res.code==200){
            //       this.shopList=this.shopList.concat(res.data.list);
            //       if(this.searchCondition.pageNo>=this.pages){
            //            this.allLoaded=true;  //数据加载完，bottomMethod则不再执行
            //       }
            //     }
            // },
            // 上拉加载
            loadBottom(){
                var that = this;
                setTimeout(function(){
                    // that.loadMore();
                    that.allLoaded = true;
                    that.$refs.loadmore.onBottomLoaded();
                },800)
            },
            myPosition(){
                var that = this;
                this.rotateStatus = true;

                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r){
        			if(this.getStatus() == BMAP_STATUS_SUCCESS){
        				//以指定的经度与纬度创建一个坐标点
        				var pt = new BMap.Point(r.point.lng,r.point.lat);
        				//创建一个地理位置解析器
        				var geoc = new BMap.Geocoder();
        				geoc.getLocation(pt, function(rs){//解析格式：城市，区县，街道
        					var addComp = rs.addressComponents;
                            that.rotateStatus = false;
        					that.localPosition = addComp.city + addComp.district + addComp.street;
                            that.RECORD_POSITION(that.localPosition)
        				});
        			}else {
                        switch( this.getStatus() )
                        {
                            case 2:
                                alert( '位置结果未知 获取位置失败.' );
                            break;
                            case 3:
                                alert( '导航结果未知 获取位置失败..' );
                            break;
                            case 4:
                                alert( '非法密钥 获取位置失败.' );
                            break;
                            case 5:
                                alert( '对不起,非法请求位置  获取位置失败.' );
                            break;
                            case 6:
                                alert( '对不起,当前 没有权限 获取位置失败.' );
                            break;
                            case 7:
                                alert( '对不起,服务不可用 获取位置失败.' );
                            break;
                            case 8:
                                alert( '对不起,请求超时 获取位置失败.' );
                            break;

                        }

        			}
        		},{enableHighAccuracy: true})//指示浏览器获取高精度的位置，默认false
            },
        },
        created () {
            /**
             * 将json数据中的无用数据剔除
             */
            for (let i in city) {
              if (city[i].name != "请选择") {//将第一层数据中为 “请选择” 的剔除掉
                this.arr.push(city[i].name);
                for (let j in city[i].sub) {//将第二层数据中为 “请选择 和 其他” 的剔除掉
                  if (
                    city[i].sub[j].name != "请选择" &&
                    city[i].sub[j].name != "其他"
                  ) {
                    this.arr.push(city[i].sub[j].name);//将处理后的数据存放在数组中，等待第二次筛选处理
                  }
                }
              }
            }

            /**
             * 配置相关数据
             */
            for (let k in this.arr) {
              let cityKey = makePy(this.arr[k])[0].substring(0, 1);//获取每一个市区的首字母
              let cityValue = this.arr[k];//获取所有市区
              this.citySort[cityKey] = cityKey;//利用对象特性，剔除重复的字母，并将剔除后的字母存进对象中

              //将所有市区信息 以（ 字母 - 市区名 ）的格式存在至数组中
              this.cityArr[k] = {
                key: cityKey,
                value: cityValue
              };
            }

            /**
             * 将处理后的首字母数据对象，存放至数组中
             */
            for (let p in this.citySort) {
                this.citySortArr.push(this.citySort[p]);
            }

            /**
             * 将真实存在的市区首字母按A-Z进行排序
             */
            this.citySortArr = this.citySortArr.sort();
        },
        mounted(){
            this.myPosition();
            // 计算滚动内容的高度
    		this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
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
            document.querySelector('.list-wrap').appendChild(p)
          }
        },
    }

</script>

<style media="screen">
    .mint-loadmore-bottom{
        color:#999;
        font-size: .24rem;
        background-color: #F8F8F8;
    }
    /* 城市选择容器 */
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
    .mint-indexlist-nav{
        border-left:none;
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
        padding-top:1rem;
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
.shop-list{
    width: 100%;
    position: relative;
    background-color: #F8F8F8;
    font-family:PingFangSC-Regular;
}
.main-cont{
    min-height: 100vh;
    padding-top:.88rem;
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
    padding-top:.6rem;
    overflow: scroll;
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
    width: 30%;
    height:1.8rem;
    margin-right:.3rem;
    background-color: #eee;
}
.shop-item .left-img img{
    width:100%;
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
    padding-top:.05rem;
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
