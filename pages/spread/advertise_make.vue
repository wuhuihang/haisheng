<template>
	<view class="box">
		<view class="tab-box">
			<template v-for="(item,k) in title_list">
				<view class="tab-li" :class="{'active':k==cur_advert}" @tap="chooseAdv(k)" :key="k">
					{{item}}
				</view>
			</template>
		</view>
		<view class="content">
			<img-text v-if="cur_advert==0"></img-text>
			<img-advert v-if="cur_advert==1"></img-advert>
			<focus-advert v-if="cur_advert==2"></focus-advert>
			<phone-advert v-if="cur_advert==3"></phone-advert>
			<card-advert v-if="cur_advert==4"></card-advert>
		</view>
		
	</view>
</template>

<script>
	import imgText from './components/advert-imgtext.vue'//图文
	import imgAdvert from './components/advert-img.vue'//图片
	import focusAdvert from './components/advert-focus.vue'//关注
	import phoneAdvert from './components/advert-phone.vue'//电话
	import cardAdvert from './components/advert-card.vue'//名片
	export default {
		data() {
			return {
				cur_advert:0,
				title_list:['图文广告','图片广告','关注广告','电话广告','名片广告']
			}
		},
		onLoad() {

		},
		components:{
			imgText,imgAdvert,focusAdvert,phoneAdvert,cardAdvert
		},
		methods: {
			chooseAdv(k){
				this.cur_advert=k
			}
		}
	}
</script>

<style lang="scss">
	.content {
		width: 682rpx;
		padding: 0 34rpx;
	}
.tab-box {
	width: 100%;
	height: 84rpx;
	display: flex;
	justify-content: space-around;
	font-size:26rpx;
	line-height: 84rpx;
	background: white;
	color: #656565;
	.active {
		color: #FF9D97;
	}
}

</style>
