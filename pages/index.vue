<template>
	<view class="mainVieW">
		<!-- 主站 -->
		<HOMES ref='home' v-if='active==0'></HOMES>
		<MAKEMONEY ref='make_money' v-if='active==1'></MAKEMONEY>
		<MEMBER ref='member' v-if='active==4'></MEMBER>
		<BUSINESSCARD ref='card' v-if='active==3'></BUSINESSCARD>
		<view class="blank-tabbar" :class="[flagTypeInfo? 'tabbarMainIphone':'']">
		</view>
		<tab-bar class="fixs" ref='commentTabbat' ></tab-bar>
	</view>
</template>
<script>
	import MEMBER from '@/pages/tabbar/member.vue'
	import HOMES from '@/pages/tabbar/home.vue'
	import MAKEMONEY from '@/pages/tabbar/make_money.vue'
	import BUSINESSCARD from '@/pages/tabbar/business_card.vue'
	import tabBar from '@/pages/tabbar/tabbar.vue'

	export default {
		name: 'mains',
		data() {
			return {
				active: Number || 0,
				flagTypeInfo: false, // 检测当前是否是IPHONE 异形屏幕
			}
		},
		components: {
			HOMES,
			MEMBER,
			MAKEMONEY,
			BUSINESSCARD,
			tabBar
		},
		onLoad() {
			
		},
		// #ifdef MP
		onShareAppMessage(res) {
			return {
				title: '邀您一起体验',
				path:'/pages/index'
			}
		},
		// #endif
		onShow() {
			
		},
		onReachBottom() {
			

		},

		provide() {
			return {
				_mainFuncInit: this._mainFuncInit
			}
		},
		methods: {
			/**
			 * @name 公共点击函数
			 * */
			_mainFuncInit() {
				
			},
			/**
			 * @name 首页数据初始化 
			 * */
			_initData() {
				this._mainFuncInit();
			},
			checkPlatFromFunc() {
				let modelmes = uni.getSystemInfoSync().model;
				let tempMoble = Boolean;
				if (modelmes.indexOf('iPhone X') >= 0 || modelmes.indexOf('iPhone XR') >= 0 || modelmes.indexOf('iPhone XS') >= 0 ||
					modelmes.indexOf('iPhone 12') >= 0 || modelmes.indexOf('iPhone 11') >= 0 || modelmes.indexOf('iPhone11') >= 0 ||
					modelmes.indexOf('iPhone12') >= 0 || modelmes.indexOf('iPhoneXR') >= 0 || modelmes.indexOf('iPhoneX') >= 0) {
					tempMoble = true
				} else {
					tempMoble = false
				}

				return tempMoble
			}
		}
	}
</script>
<style scoped>
	.tabbarMainIphone {
		padding-bottom: 64rpx;
	}

	.fixs {
		position: fixed;
		z-index: 100;
	}
</style>
