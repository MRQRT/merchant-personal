import App from '../App'

const shopList = r => require.ensure([], () => r(require('../pages/shop/shopList.vue')), 'shopList')
const shopDetail = r => require.ensure([], () => r(require('../pages/shop/shopDetail.vue')), 'shopDetail')

const arg = r => require.ensure([], () => r(require('../pages/arguments/arg.vue')), 'arg')

const storeGold = r => require.ensure([], () => r(require('../pages/storeGold/storeGold')), 'storeGold')
const stor = r => require.ensure([], () => r(require('../pages/stor/stor.vue')), 'stor')
const storResult = r => require.ensure([], () => r(require('../pages/stor/storResult.vue')), 'storResult')
const storOrder = r => require.ensure([], () => r(require('../pages/storOrder/storOrder.vue')), 'storOrder')
const storArg = r => require.ensure([], () => r(require('../pages/arguments/storArg.vue')), 'storArg')
const storOrderDet = r => require.ensure([], () => r(require('../pages/storOrder/storOrderDet.vue')), 'storOrderDet')
const report = r => require.ensure([], () => r(require('../pages/storOrder/report.vue')), 'report')
const storAddress = r => require.ensure([], () => r(require('../pages/stor/storAddress.vue')), 'storAddress')
const modifiRecycleOrder = r => require.ensure([], () => r(require('../pages/stor/modifiRecycleOrder.vue')), 'modifiRecycleOrder')

const loginIn = r => require.ensure([], () => r(require('../pages/login/loginIn.vue')), 'loginIn')
const makePwd = r => require.ensure([], () => r(require('../pages/login/makePassWord.vue')), 'makePassWord')
const getBackPwd = r => require.ensure([], () => r(require('../pages/login/getBackPsw.vue')), 'getBackPsw')

const personHomepage = r => require.ensure([], () => r(require('../pages/mine/personHomepage.vue')), 'personHomepage')
const authentication = r => require.ensure([], () => r(require('../pages/mine/children/authentication.vue')), 'authentication')
const bindBank = r => require.ensure([], () => r(require('../pages/mine/children/bindBank.vue')), 'bindBank')
const address = r => require.ensure([], () => r(require('../pages/mine/children/address.vue')), 'address')
const addAddress = r => require.ensure([], () => r(require('../pages/mine/children/addAddress.vue')), 'addAddress')

const myBank = r => require.ensure([], () => r(require('../pages/myBank/myBank.vue')), 'myBank')

const findDelivery = r => require.ensure([], () => r(require('../pages/extractGoldOrder/findDelivery.vue')), 'findDelivery')

const tranDetail = r => require.ensure([], () => r(require('../pages/tranDetail/tranDetail.vue')), 'tranDetail')
const tranDetailInfo = r => require.ensure([], () => r(require('../pages/tranDetail/tranDetailInfo.vue')), 'tranDetailInfo')

const commonProblem = r => require.ensure([], () => r(require('../pages/commonProblem/commonProblem.vue')), 'commonProblem')

const messCenter = r => require.ensure([], () => r(require('../pages/messageCenter/messCenter.vue')), 'messCenter')
const newsDetail = r => require.ensure([], () => r(require('../pages/messageCenter/newsDetail.vue')), 'newsDetail')
const setNews = r => require.ensure([], () => r(require('../pages/messageCenter/setNews.vue')), 'setNews')
const newsList = r => require.ensure([], () => r(require('../pages/messageCenter/newsList.vue')), 'newsList')

const withdraw = r => require.ensure([], () => r(require('../pages/withdraw/withdraw.vue')), 'withdraw')
const withdrawResult = r => require.ensure([], () => r(require('../pages/withdraw/withdrawResult.vue')), 'withdrawResult')
const recharge = r => require.ensure([], () => r(require('../pages/recharge/recharge.vue')), 'recharge')
const rechargeResult = r => require.ensure([], () => r(require('../pages/recharge/rechargeResult.vue')), 'rechargeResult')

const myCoupon = r => require.ensure([], () => r(require('../pages/ximalaya/myCoupon')), 'myCoupon')
const get = r => require.ensure([], () => r(require('../pages/ximalaya/get')), 'get')

const jiFen = r => require.ensure([], () => r(require('../pages/myJiFen/jiFen')), 'jiFen')
const inviteFriend = r => require.ensure([], () => r(require('../pages/myJiFen/inviteFriend')), 'jiFen')

export default [{
    path: '/',
    component: App,
        children: [
        {
            path: '',
            redirect: '/storeGold',
            meta:{
                // keepAlive:true
            }
        },
        {
            path: '/storeGold',
            component: storeGold,//导航存金页
            meta:{
                keepAlive:true
            }
        },
        {
            path: '/jiFen',
            component: jiFen,//我的积分页面
            meta: {
                requireAuth: true,
            }
        },
        {
            path: '/inviteFriend',
            component: inviteFriend,//邀请好友页面
        },
        {
            path: '/myCoupon',
            component: myCoupon,//我的页面之优惠券
            // meta:{
            //     keepAlive:true
            // }
        },
        {
            path:'/shopList',
            component:shopList,   // 门店列表页
        },
        {
            path:'/shopDetail',
            component:shopDetail,   // 门店详情页
        },
        {
            path: '/personHomepage',//个人主页
            component: personHomepage,
            children:[
                {
                    path: 'authentication',//实名认证
                    component: authentication,
                    meta: {
                        requireAuth: true,
                    }
                },
                {
                    path: 'bindBank',//绑定银行卡
                    component: bindBank,
                    meta: {
                        requireAuth: true,
                    }
                },
                {
                    path: 'address',//地址
                    component: address,
                    meta: {
                        requireAuth: true,
                    },
                },
                {
                    path: 'addAddress',//添加地址
                    component: addAddress,
                    meta: {
                        requireAuth: true,
                    },
                }
            ]
        },
        {
            path: '/arguments', //黄金管家服务协议
            component: arg
        },
        {
            path: '/stor', //存金
            component: stor,
            meta:{
                deal:4,
                // keepAlive:true
            },
        },
        {
            path: '/storAddress',//存金地址
            component: storAddress,
        },
        {
            path: '/storArg', //黄金管家存金服务协议
            component: storArg
        },
        {
            path: '/storResult', //存金
            component: storResult,
        },
        {
            path: '/modifiRecycleOrder',//修改回购订单
            component: modifiRecycleOrder,
        },
        {
            path: '/loginIn', //登入页
            component: loginIn
        },
        {
            path: '/makePwd', //密码设置页
            component: makePwd
        },
        {
            path: '/getBackPwd', //找回密码页
            component: getBackPwd
        },
        {
            path: '/myBank', //我的银行卡页
            component: myBank,
             meta: {
                    requireAuth: true,
                },
        },
        {
            path: '/findDelivery', //查看物流页
            component: findDelivery
        },
        {
            path: '/tranDetail',//交易明细
            component: tranDetail,
            meta:{
                keepAlive:true,
                savedPosition:null
            }
        },
        {
            path: '/tranDetailInfo',//交易明细详情
            component: tranDetailInfo
        },
        {
            path: '/storOrder',//存金订单
            component: storOrder,
            meta: {
                    requireAuth: true,
                    // keepAlive:true
            },
        },
        {
            path: '/storOrderDet',//存金详情
            component: storOrderDet
        },
        {
            path: '/commonProblem', //常见问题页
            component: commonProblem
        },
        {
            path: '/messCenter', //消息中心页
            component: messCenter,
            meta: {
                    requireAuth: true,
                },
        },
        {
            path: '/newsList', //消息列表页newsList
            component: newsList,
            // meta:{
            //     keepAlive:true
            // }
        },
        {
            path: '/setNews', //消息设置页
            component: setNews
        },
        {
            path: '/newsDetail', //消息中心详情页
            component: newsDetail
        },
        {
            path: '/withdraw',//提现
            component: withdraw,
            meta:{
                deal:12
            }
        },
        {
            path: '/withdrawResult',//提现结果
            component: withdrawResult
        },
        {
            path: '/recharge',//充值
            component: recharge,
            meta:{
                deal:11
            }
        },
        {
            path: '/rechargeResult',//充值结果
            component: rechargeResult
        },
        {
            path: '/report',//检测报告
            component: report,
        },
        {
            path:'get',//喜马拉雅获取优惠券页面
            component: get
        }
    ]
}];
