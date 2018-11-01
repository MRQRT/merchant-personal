import "babel-polyfill"
import Vue from 'vue'
import vueRouter from 'vue-router'
import routes from './router/router'
import './config/rem'
import store from './store/'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App.vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import { checkAgent,check,setStore } from '@/config/mUtils'
import { bizCloseCheck } from '@/service/getData'
import vueScrollBehavior from '@/config/vue-scroll-behevior.js'
import './style/common.css'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
// import './config/vconsole.min.js'

var options={
    fullscreenEl:true, //关闭全屏按钮
    showHideOpacity:true,
    escKey:true,
    timeToIdle:5000,
}
Vue.use(preview,options)
Vue.use(MintUI)
Vue.use(vueRouter)
Vue.use(VueAwesomeSwiper)
import { MessageBox,Indicator } from 'mint-ui'
const router = new vueRouter({
    routes,
    'linkActiveClass': 'active',
    // mode:'history',
    strict: process.env.NODE_RNV !== 'production',
    // scrollBehavior (to, from, savedPosition) {
    //     console.log(savedPosition)
    //     if (savedPosition) {
    //         return savedPosition
    //     } else {
    //         if (from.meta.keepAlive) {
    //             from.meta.savedPosition = document.body.scrollTop;
    //         }
    //         return { x: 0, y: to.meta.savedPosition || 0}
    //     }
    // }
});
Vue.use(vueScrollBehavior, {
  router: router,
  // maxLength: 3,
  // ignore: [/\/b/, /\/m/],
  // delay: 0
})
export let a = new Vue({
    store,
    router,
    components: {App}
}).$mount('#app');

//交易时间判断
// function tradeTimeCheck(bizCode) {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open("post", 'http://120.133.0.87:8099/v3/query/bizCloseCheck?bizCode='+bizCode);
//     xhr.onload = () => resolve(xhr.responseText);
//     xhr.onerror = () => reject(xhr.statusText);
//     xhr.send();
//   });
// };
//

var promise;
function tradeTimeCheck(bizCode) {//交易时间判断
  var res=bizCloseCheck(bizCode);
  promise = new Promise(function (resolve, reject) {
        return resolve(res);
    })
}

router.beforeEach((to, from, next) => {
    if (to.matched.some(r => r.meta.requireAuth)) {
        if (store.state.token) {
            if(to.matched.some(r => r.meta.deal)) {
                tradeTimeCheck(to.meta.deal);
                promise.then(function(res){
                    var res=res;
                    if(res.code==100){
                        if(res.content){ //0没有再交易时间内 1在交易时间内
                           next(true)
                        }else{
                           MessageBox({
                             title: '提示',
                             message: '亲，非交易时段，无法进行交易哦~',
                             confirmButtonText: '我知道了'
                          }).then(function(){  //从登入页跳转到业务页时  该业务不在交易时间则跳到首页
                            if(from.path=='/loginIn'){
                                next({
                                    path:'buyGold'
                                })
                            }
                          });
                        }
                    }
               })
            }else{
                next(true)
            }
        } else {
            next({
                path: '/loginIn',
                query: {redirect: to.fullPath}
            })
        }
    }else{
        if(to.matched.some(r => r.meta.deal)) {
                 tradeTimeCheck(to.meta.deal);
                 promise.then(function(res){
                    var res=res;
                    if(res.code==100){
                        if(res.content){ //0没有再交易时间内 1在交易时间内
                           next(true)
                        }else{
                           MessageBox({
                             title: '提示',
                             message: '亲，非交易时段，无法进行交易哦~',
                             confirmButtonText: '我知道了'
                          });
                        }
                    }

               })

        }else{
            next(true)
        }
    }
})

var agent=checkAgent();

//消息推送
window.goToWhere=function(val){
    setTimeout(function(){
        a.$router.push('/newsDetail?id='+val)
    },5000)
}
//关闭上传图片的模态框
window.Indicat=function(){
    Indicator.close()
}
// var browser = check();
// setStore('browser',browser,'local')

var browser = check();
setStore('browser',browser,'local')


/*
 与原生交互API
 */
if(agent=='And'){
    //传送userid到app
    window.sendUserId=function(userid){
      if(!window.stub) return;
      window.stub.getUserId(userid);
      localStorage.setItem('isWebview','andriod')
    }
    //退出登入
    window.logOut=function(p){
        if(!window.stub) return;
        window.stub.clearUserId(p);
    }
    //新闻资讯分享
    window.sharePage=function(title,content,path){
        if(!window.stub) return
        window.stub.share(title,content,path);
    }
    //打开智能客服
    window.openRobot=function(p){
        if(!window.stub) return;
        window.stub.sobotTo(p);
    }
    //当前处于首页(app双击可返回)
    window.tellHome=function(p){
        if(!window.stub) return;
        window.stub.atHome(p);
    }
    //打开拍照功能判断权限
    window.openPhoto=function(){
        if(!window.stub) return;
        window.stub.openPhotoPermession();
    }
    //打开拍照功能判断权限
    window.backPerInfo=function(){
        if(!window.stub) return;
        var res=window.stub.backPerInfo();
        return res;
    }
    //打开拨打电话功能
    window.getPhonePer=function(number){
        if(!window.stub) return;
        window.stub.getPhonePer(number);
    }
    //关闭上传照片的模态框
    window.close=function(value){
        if(!window.stub) return;
        window.stub.cancleDialog(value)
    }
}else{
    //传送userid到app
    window.sendUserId=function(userid){
      if(!window.getUserId) return;
      window.getUserId(userid);
      localStorage.setItem('isWebview','ios')
    }
    //退出登入
    window.logOut=function(p){
        if(!window.clearUserId) return;
        window.clearUserId(p);
    }
    //新闻资讯分享
    window.sharePage=function(title,content,path){
        if(!window.share) return;
        window.share(title,content,path);
    }
    //打开智能客服
    window.openRobot=function(p){
        if(!window.sobotTo) return;
        window.sobotTo(p);
    }
    //当前处于首页(app双击可返回)
    window.tellHome=function(p){
        if(!window.atHome) return;
        window.atHome(p);
    }
    //IOS呼叫客服
    window.phone=function(value){
        if(!window.phoneUp) return;
        window.phoneUp(value)
    }
    // //接收消息(测试中)
    // window.receive=function(val){
    //     // confirm(a.$route.fullPath)
    //     a.$router.push('/newsDetail?id='+val)
    // }
}


export default router
