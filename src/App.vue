<template>
	<div class="app">
        <transition name="fade" mode="out-in">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
        </transition>
	    <transition name="fade" mode="out-in">
	       <router-view v-if="!$route.meta.keepAlive">
           </router-view>
        </transition>
        <foot v-if="show" :show="redCircle"></foot>
	</div>
</template>
<script>
import {queryGoldPrice,interestByUser,queryAwardOrder} from './service/getData.js'
import {setStore,getStore} from '@/config/mUtils.js'
import {mapState,mapMutations} from 'vuex';
import foot from '@/components/footer/footGuid'
  	export default {
        data(){
            return {
                show:true,
                redCircle:false,
                hasInterest:null,//有没有利息金可收取
                hasTasks:null,//有没有奖励金可收取
                className:'', //调起软键盘改变定位样式的按钮
            }
        },
        beforeCreate:function(){
            //无法寻找到服务器，自动跳转到错误页面
            if(this.$store.state.serverIp == 0){
                router.push({path:'/ErrorPage'})
            }
        },
  	    created() {
            this.token ? this.interestByUser() : '';
            this.token ? this.queryAwardOrder() : '';
  	    },
        computed:{
            ...mapState([
                'token'
            ])
        },
        mounted(){
			var tg = this.$route.query.source;
			var yw = this.$route.query.channel;
			(tg)?setStore('tg',tg,'session'):'';
			(yw)?setStore('yw',yw,'session'):'';

            this.token ? window.sendUserId(this.token.split('_')[0]) : window.sendUserId('') //判断当前环境是不是黄金管家app
            //初次进来页面时 判断是否需要底部导航
            if(this.$route.path=="/buyGold" || this.$route.path=="/benefit" || this.$route.path=="/storeGold" || this.$route.path=="/mine"){
                window.tellHome('yes');
                this.show=true
            }else{
                window.tellHome('no');
                this.show=false
            }
            //生金页面底部导航不展示小红点
            if(this.$route.path=="/benefit"){
                this.redCircle=false;
            }
            /*调用实时金价*/
            // this.getCurrent();
            // var that=this;
            /*五秒刷新一次*/
            // window.queryPrice = setInterval(function(){
            //     that.getCurrent();
            // },5000)
			this.isShowQueryPrice();

        },
        methods:{
            ...mapMutations([
                'RECORD_CURRENPRICE'
            ]),
            //messageBox删除
            messageBoxRemove(){
                var thisNode=document.getElementsByClassName("mint-msgbox-wrapper")[0]
                if(thisNode){
                    thisNode.parentNode.removeChild(thisNode)
                }
            },
            //查询利息收取状态
            async interestByUser(){
                var res=await interestByUser();
                if(res.code==100){
                    if(res.content && res.content.type==0){
                        if(!res.content.date){//已成熟未收取
                            this.hasInterest=true;
                        }
                    }
                }
            },
            //查询有没有任务金可收取
            async queryAwardOrder(){
                var res=await queryAwardOrder();
                if(res.code==100 && res.content){
                    if(res.content.length){
                        for(var i=0;i<res.content.length;i++){
                            if(res.content[i].status==0){
                                this.hasTasks=true;
                                break;
                            }
                        }
                    }
                }
            },
            //给window挂载onresize事件
            setResize(){
                var className=this.className
                var height=document.documentElement.clientHeight;
                window.onresize=function(){
                    var h=document.documentElement.clientHeight
                    if((height-h)>50){
                        document.querySelector('.'+className).style.position = 'relative'
                    }else{
                        document.querySelector('.'+className).style.position = 'fixed'
                    }
                }
            },
            /*请求实时金价*/
            async getCurrent(){
                var res=await queryGoldPrice();
                if(res.code==100){
                    var price=res.content.price
                    this.RECORD_CURRENPRICE(price)
                }
            },
			//根据路由判断是否发起金价请求
			isShowQueryPrice(){
				if(this.$route.path=='/storeGold' || this.$route.path=='/stor'){
					if(window.queryPrice){
						clearInterval(window.queryPrice);
					}
					this.getCurrent();
					var that=this;
					/*5秒刷新一次*/
					window.queryPrice = setInterval(function(){
						that.getCurrent();
					},5000)
				}else{
					if(window.queryPrice){
						clearInterval(window.queryPrice);
					}
				}
			}
        },
        watch:{
            hasInterest(val){
                if(val){
                    this.redCircle=true;
                }else{
                    this.redCircle=false;
                }
            },
            hasTasks(val){
                if(val){
                    this.redCircle=true;
                }else{
                    this.redCircle=false;
                }
            },
            $route(to,from){
                this.messageBoxRemove();
				//只在首页和卖金页请求实时金价
				this.isShowQueryPrice();

                if(this.$route.path=="/buy"){  //买金页软键盘弹起按钮顶起处理
                   this.className='buyBtn';
                   this.setResize()
                }else{
                    window.removeEventListener('onresize',this.setResize)
                }

                if(this.$route.path=="/sell"){  //卖金页软键盘弹起按钮顶起处理
                   this.className='sellBtn';
                   this.setResize()
                }else{
                    window.removeEventListener('onresize',this.setResize)
                }

                if(this.$route.path=="/benefit"){ //有金豆收取信息时底部导航生金处红点提示
                    this.redCircle=false;
                    this.hasInterest=false;
                    this.hasTasks=false;
                }else{
                    this.token ? this.interestByUser() : '';
                    this.token ? this.queryAwardOrder() : '';
                }

                //告诉app当前处在那一页 判断返回时是否可直接返回首页
                if(this.$route.path=="/buyGold" || this.$route.path=="/benefit" || this.$route.path=="/storeGold" || this.$route.path=="/mine"){
                    window.tellHome('yes');
                    this.show=true
                }else{
                    window.tellHome('no');
                    this.show=false
                }
            }
        },
        components:{
            foot: foot
        }
  	}
</script>
<style type="text/css">
.fade-enter-active, .fade-leave-active {
  /*transition: opacity .2s;*/
  transition: opacity 0s;
}
.fade-enter, .fade-leave-to{
  opacity: 0
}
</style>
