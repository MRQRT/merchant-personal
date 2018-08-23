<template>
    <div class="infomationBox">
        <head-top headTitle='卖金结果' class="head-top">
            <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push('/myGold')">
        </head-top>
        <!--成功失败标志-->
        <div class="buySuccess">
            <div class="symbol">
                <div class="imageLogo"></div>
                <p class="desc">卖出{{results}}</p>
            </div>
            <div class="buiedInfomation">
                <p><span class="infoLeft">卖出价格</span><span class="infoRight">{{pageMsg.price}}元</span></p>
                <p><span class="infoLeft">卖出克重</span><span class="infoRight">{{pageMsg.weight}}克</span></p>
                <p><span class="infoLeft">卖出金额</span><span class="infoRight">{{pageMsg.amount}}元</span></p>
                <p><span class="infoLeft">手续费</span><span class="infoRight">{{pageMsg.fee}}元</span></p>
                <p><span class="infoLeft">卖出时间</span><span class="infoRight">{{pageMsg.createTime}}</span></p>
            </div>
            <a class="goldAssets" id="click_btn" @click="$router.replace('/myGold')">查看黄金资产</a>
            <!-- <div class="liking">
                <div class="likingTile">
                    <span class="likeLeft">猜你喜欢</span>
                    <span class="likeRight"><img src="../../images/right_jian.png"></span>
                </div>
                <div class="likingPicture">
                    <img src="../../images/liking.png">
                </div>
                <div class="likingName">
                    <p class="likingNameP1">结婚脱单基金</p>
                    <p class="likingNameP2">黄金定投 为最爱的人存最真的金</p>
                </div>
            </div> -->
        </div>
    </div>
</template>
<script>
    import headTop from '@/components/header/head.vue';
    export default {
        data(){
            return {
                pageMsg:{},
                results:'',
            }
        },
        created(){
            this.pageMsg=this.$route.query.result;
            this.results=this.$route.query.result2;
        },
        mounted(){
        },
        computed:{

        },
        methods:{
            
        },
        components:{
            headTop,
        }
    }
</script>

<style scoped>
    .infomationBox{
        padding-top:0.88rem;
        padding-left:0.3rem;
        padding-right:0.26rem;
        background-color:#fff;
    }
    .buySuccess .symbol,.buyError .symbol{
        height:3.3rem;
        padding-top:.76rem;
    }
    .buySuccess .symbol .imageLogo{
        width:1.06rem;
        height:1.08rem;
        background:url(../../images/buySuccess.png) no-repeat;
        margin:0 auto;
        background-size: 100%;
    }
    .buyError .symbol .imageLogo{
        width:1.06rem;
        height:1.08rem;
        background:url(../../images/buyError.png) no-repeat;
        margin:0 auto;
        background-size: 100%;
    }
    .errorExplain{
        height:1rem;
        line-height: 1rem;
        text-align: center;
        color:#BBBBBB;
        font-size:.32rem;
        margin-top:.42rem;
    }
    .buySuccess .symbol .desc,.buyError .symbol .desc{
        margin-top:0.4rem;
        text-align: center;
        font-size:0.36rem;
        margin-bottom: 0;
        font-weight: bold;
    }
    .buiedInfomation p{
        height:0.7rem;
        font-size:0.3rem;
        color:#6C6C6C;
    }
    .buiedInfomation .infoLeft{
        float:left;
    }
    .buiedInfomation .infoRight{
        float:right;
    }
    .goldAssets{
        height:0.92rem;
        background-color: #F2B643;
        line-height: 0.92rem;
        text-align: center;
        color:#fff;
        font-size: 0.4rem;
        border-radius: 4px;
        margin-top:.37rem;
    }
    .liking{
        height:5.22rem;
        padding-top:0.77rem;
    }
    .likingTile{
        height:0.74rem;
        font-size:0.33rem;
        color:#000;
    }
    .likingTile .likeLeft{
        float: left;
        font-weight: bold;
    }
    .likingTile .likeRight{
        float: right;
        color:#A1A1A1;
    }
    .likingTile .likeRight img{
        width:.13rem;
        height:.24rem;
    }
    .likingPicture img{
        width:6.88rem;
        height:2.3rem;
        display: block;
    }
    .likingName{
        margin:0;
        height:1.42rem;
        padding-top:0.32rem;
    }
    .likingNameP1{
        height:0.48rem;
        font-size:0.34rem;
        color:#333333;
    }
    .likingName p{
        margin:0;
    }
    .likingNameP2{
        height:0.63rem;
        font-size:0.24rem;
        color:#999999;
    }
</style>