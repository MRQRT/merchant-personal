<template>
	<div class="buyInvestementDetail">
        <div class="detailContent">
            <span class="back" @click="$router.push('/buyInvestment')">
                <img src='../../images/whiteBack.png' class="head_goback" @click="$router.push('/buyInvestment')">
            </span>
            <img :src="regularProduct.largePath" class="detailPic">
            <a @click="goToSet" class="buyBtn" id="click_btn">我要定投</a>
        </div>
	</div>
</template>
<script>
import { mapState } from 'vuex'
	export default {
		data(){  
			return {
                    productId:'',//已选取定投产品的Id
                regularProduct:{}  //产品信息
			}
		},
        created(){
            this.productId = this.regularProductParams.productId;
            var products=this.regularProducts;
            if(products.length!==0){
                var t=this;
                products.forEach(function(v,i){
                    if(v.id==t.regularProductParams.productId){
                        t.regularProduct=v;
                        return;
                    }
                })
            }
        },
		mounted() {
		},
		computed:{
			...mapState([
                'regularProducts','regularProductParams'
            ])
		},
		methods:{
            goToSet(){
                this.$router.push({
                    path:'/investmentSetUp',
                    query:{productId:this.productId}
                })
            }
		},
		components:{
		}
	}
</script>

<style scoped>
  .buyInvestementDetail{
    width: 100%;
    height: 100vh;
  }
  .detailContent .detailPic{
    display: block;
    width:100%;
    height:100vh;
  }
  .detailContent{
    position: relative;
  }
  .back{
    display: inline-block;
    width: .3rem;
    height: .4rem;
    position: absolute;
    left:0.28rem;
    top:0.35rem;
  }
  .head_goback{
    width:.2rem;
    height:.37rem;
  }
  .buyBtn{
    position: absolute;
    width:7rem;
    height:.9rem;
    background-color: #F2B643;
    line-height:.9rem ;
    text-align: center;
    color:#fff;
    font-size:.34rem;
    border-radius: 4px;
    bottom:.3rem;
    left:50%;
    margin-left:-3.5rem;
  }
</style>
