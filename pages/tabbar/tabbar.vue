<style scoped lang="scss">
	.tabbarMain {
		height: 88rpx;
		position: fixed;
		z-index: 50;
		width: 750rpx;
		flex: 1;
		bottom: 0;
		
	}

	.tabbarMainIphone {
		height: 88rpx;
		padding-bottom: 64rpx;
	}

	.tabBtnMina {
		width: 750rpx;
		height: 88rpx;
		position: absolute;
		z-index: 2;
		bottom: 0;
		flex-direction: row;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-top);
		padding-bottom: env(safe-area-inset-top);
		display: flex;
		justify-content: space-around;
		background: #fff;
	}

	.tabBtnMinaIphone {
		height: 88rpx;
		padding-bottom: 64rpx;
	}

	.imgse {
		width: 48rpx;
		height: 48rpx;
	}

	.txtBtn {
		font-size: 24rpx;
		color: #666666;
	}

	.txtBtnSel {
		font-size: 24rpx;
		color: #333333;
	}

	.itmMain {
		/* width: 250rpx; */
		width: 150rpx;
		justify-content: center;
		align-items: center;
		display: flex;
		flex-direction: column;
	}

	.imgseTs {
		width: 150rpx;
		height: 140rpx;
		margin-bottom: 90rpx;
		position: relative;
		z-index: 1;
		bottom: 0rpx;
	}

	.btnfixMin {
		width: 750rpx;
		height: 178rpx;
		position: absolute;
		z-index: 1;
		bottom: 0;
	}

	.btnfixMinIphone {
		bottom: 64rpx;
	}

	.fixTpm {
		width: 150rpx;
		height: 140rpx;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: relative;
		z-index: 0;
	}

	.imgseTsAnds {
		width: 150rpx;
		height: 150rpx;
		position: fixed;
		z-index: 1;
		bottom: 10rpx;
		left: 50%;
		border-radius: 150rpx;
		transform: translateX(-50%);
	}

	.bulge_img {
		position: fixed;
		bottom: 52rpx;
		width: 78rpx;
		height: 78rpx;
		z-index: 100;
		left: 50%;
		margin-left: -39rpx;
	}
	.tabbarMainIphone .bulge_img{
		padding-bottom: 64rpx;
	}
	.mask {
		position: fixed;
		z-index: 1024;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);

	}

	.tabbarMainIphone .center-active .iconcuowu {
		margin-bottom: 64rpx !important;
	}
	.tabbarMainIphone .top,.tabbarMainIphone .bottom {
		padding-bottom: 64rpx !important;
	}
	.center-active {
		position: fixed;
		width: 100%;
		z-index: 1025;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;

		.iconcuowu {
			position: fixed;
			z-index: 10;
			left: 50%;
			bottom: 50rpx;
			margin-left: -58rpx;
			font-size: 50rpx;
			width: 100rpx;
			height: 100rpx;
			background: #ff9e97;
			border: 8rpx solid white;
			border-radius: 100%;
			text-align: center;
			line-height: 100rpx;
			color: white;
			animation:cancelAnimate 400ms ease;
		}

		.top {
			position: fixed;
			bottom: 248rpx;
			display: flex;
			width: 340rpx;
			justify-content: space-between;
		}

		.bottom {
			position: fixed;
			bottom: 110rpx;
			display: flex;
			width: 610rpx;
			justify-content: space-between;
		}

		.weirao {
			display: flex;
			font-size: 44rpx;
			width: 130rpx;
			height: 130rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			font-size: 26rpx;
			position: relative;
			animation:mymove 400ms ease;
			.iconfont {
				background: white;
				width: 80rpx;
				height: 80rpx;
				border-radius: 100%;
				text-align: center;
				line-height: 80rpx;
				font-size: 46rpx;
			}

			.iconwodewenzhang {
				color: #a18eff;

			}

			.iconcharubiaodan {
				color: #ed6a67;
			}

			.iconbianji {
				color: #00e193;
			}

			.icontuiguang-guanggaobianji {
				color: #fd82d8;
			}

			.text {
				color: white;
			}

		}
	}

	@keyframes mymove {
		from {
			bottom: -200px;
			transform: scale(0.1);
			opacity: 0;
		}

		to {
			bottom: 0;
			transform: scale(1);
			opacity: 1;
		}
	}
	@keyframes cancelAnimate{
		from {
			transform: scale(0.1) rotate(0);
			opacity: 0;
		}
		
		to {
			transform: scale(1) rotate(360deg);
			opacity: 1;
		}
	}
</style>


<!-- 
    此版本需要注意
		1、如果此项目有地图模块功能的话   整个底部建议使用<cover-view><cover-image>进行标签改版      或者判断如果当前点击等于地图模块功能时候，却换成<cover-view><cover-image>进行原生渲染
 -->

<template>

	<view class="tabbarMain" :class="[flagTypeInfo? 'tabbarMainIphone':'']">
		<view class="tabBtnMina" :class="[flagTypeInfo? 'tabBtnMinaIphone':'']" mode="">
			
		
			<view class="itmMain " v-if="type_check" @click.stop="switchTabFunc(2, '')">
				<image lazy-load class="imgse" :fade-show='false' v-if="active!=2" src="/static/images/extension.png" style="visibility: hidden;"></image>
				<image lazy-load class="imgse" :fade-show='false' v-if="active===2" src="/static/images/extension.png"></image>
				<text class="txtBtn" :class="{'txtBtnSel' :active==2}">推广</text>
			</view>
			
		</view>
		<!-- 中间按钮 -->
		<image lazy-load class="bulge_img" v-show="type_check" @click.stop="switchTabFunc(2, '')" src="/static/images/extension.png"
		 mode=""></image>
		<!-- 弹出遮罩层跟按钮 -->
		<view class="mask" v-if="mask_show" @tap="mask_show=false"></view>
		<view class="center-active" v-if="mask_show">
			<view class="iconfont iconcuowu active" @tap="iconTap()"></view>
			<view class="top">
				<view class="weirao article" @tap="iconTap('/pages/spread/advertise')">
					<view class="iconfont iconcharubiaodan"></view>
					<view class="text">生成广告</view>
				</view>
				<view class="weirao article" @tap="iconTap('/pages/spread/spread')">
					<view class="iconfont iconbianji"></view>
					<view class="text">上榜推广</view>
				</view>
			</view>
			<view class="bottom">
				<view class="weirao" @tap="iconTap('/pages/member/article')">
					<view class="iconfont iconwodewenzhang "></view>
					<view class="text">我的文章</view>
				</view>
				<view class="weirao article" @tap="iconTap('/pages/spread/advertise_make')">
					<view class="iconfont icontuiguang-guanggaobianji"></view>
					<view class="text">广告编辑</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				active: Number, // 当亲选择那个按钮
				platforms: '', // 终端调整兼容
				leftWidth: 0, // 安卓 端使用
				flagTypeInfo: false, // 检测当前是否是IPHONE 异形屏幕
				title: ['嗨省商城', '悬赏大厅', '', '名片', '我的'],
				mask_show: false,
			}
		},
		mounted() {
			this.getCheck()
			this.flagTypeInfo = this.checkPlatFromFunc();
			let tempSystem = uni.getSystemInfoSync()
			this.platforms = tempSystem.platform
			
			this.$nextTick(() => {
				// #ifdef APP-NVUE || APP-PLUS || APP-PLUS-NVUE ||APP-VUE
				if (this.platforms == 'android') {
					let temp = this.$refs.leftWidth
					this.leftWidth = tempSystem.screenWidth / 2
				}
				// #endif
				this.active = this.actives
			})
			
		},
		computed: {
			...mapState({
				type_check: state => state.type_check,
			})
		},

		props: {
			actives: {
				type: Number,
				default: 0
			}
		},
		inject: ['_mainFuncInit'], // 父级传递过来的函数
		methods: {
			/**
			 * @name 初始化当前点击索引
			 * 解决初始化闪烁图标问题
			 * */
			getSetting(numbers) {
				this.active = numbers || 0
			},
			/**
			 * @name tab点击事件
			 * @param {number} index 当前点击的索引
			 * @param {string} Urls 当前点击带进来的链接
			 * */
			switchTabFunc(index, Urls) {
				if (index != 2) {
					uni.setNavigationBarTitle({
						title: this.title[index]
					})
					uni.setStorageSync('setStatusIndexFunc', index)
					this._mainFuncInit() // 回调父级函数
					this.active = index
				}
				if (index == 2) {
					this.mask_show = true
				}
			},
			iconTap(url) {
				if (url) {
					uni.navigateTo({
						url: url
					})
				}
				this.mask_show = false
			},
			checkPlatFromFunc(){
				let modelmes = uni.getSystemInfoSync().model;
				let tempMoble = Boolean;
				if(modelmes.indexOf('iPhone X')>=0||modelmes.indexOf('iPhone XR')>=0||modelmes.indexOf('iPhone XS')>=0||modelmes.indexOf('iPhone 12')>=0||modelmes.indexOf('iPhone 11')>=0||modelmes.indexOf('iPhone11')>=0||modelmes.indexOf('iPhone12')>=0||modelmes.indexOf('iPhoneXR')>=0||modelmes.indexOf('iPhoneX')>=0){
					tempMoble = true
				}else{
					tempMoble = false
				}
				
				return tempMoble
			},
			getCheck() {
				this.$api.get('/O2oMenuConfig/selectO2oMenu').then(res => {
					if (res.code == 200) {
						let type_check = res.data.menu == 1 ? true : false;
						this.$store.commit('saveTypecheck', type_check)
					}
				})
			}

		}
	}

</script>
