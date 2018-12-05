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
	</div>
</template>
<script>
import {queryGoldPrice} from './service/getData.js'
import {setStore,getStore} from '@/config/mUtils.js'
import {mapState,mapMutations} from 'vuex';
  	export default {
        data(){
            return {
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
			this.isShowQueryPrice();//调用实时金价

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
            }
        },
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
