<script>
	import Vue from 'vue'
	export default {
        globalData: {  
            content: ''  
        },
		onLaunch: function() {
			console.log('onLaunch');
			// 下一次进入前先清除分享邀请码
			try {
				uni.removeStorageSync('good_shareCode'); //商品分享码
			} catch (e) {
				// error
			}
			uni.getSystemInfo({
				success: function(e) {
					let model = e.model;
					if (model.indexOf('iPhone X') >= 0 || model.indexOf('iPhone XR') >= 0 || model.indexOf('iPhone XS') >= 0 ||
						model.indexOf('iPhone 12') >= 0 || model.indexOf('iPhone 11') >= 0 || model.indexOf('iPhone11') >= 0 || model
						.indexOf('iPhone12') >= 0 || model.indexOf('iPhoneXR') >= 0 || model.indexOf('iPhoneX') >= 0) {
						Vue.prototype.shapedScreen = true;
					} else {
						Vue.prototype.shapedScreen = false;
					}
				}
			})
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import url("common/common.css");
	@import url("common/fonts/iconfont.css");

	page {
		color: #333;
		font-weight: 500;
		background: rgb(240, 240, 240);
	}

	/* 等比图片 1:1 此css可废弃*/
	.scale11>div,
	.scale11>img {
		height: 0;
		padding-bottom: 100%;
		overflow: hidden;
		background-position: center center !important;
		background-repeat: no-repeat !important;
		background-size: cover !important;
	}

	.scale45>div,
	.scale45>img {
		height: 0;
		padding-bottom: 125%;
		overflow: hidden;
		background-position: center center !important;
		background-repeat: no-repeat !important;
		background-size: cover !important;
	}

	.scale-cardbanner>div,
	.scale-cardbanner>img {
		height: 0;
		padding-bottom: 45%;
		overflow: hidden;
		background-position: center center !important;
		background-repeat: no-repeat !important;
		background-size: cover !important;
	}

	.scale-card>div,
	.scale-card>img {
		height: 0;
		padding-bottom: 63%;
		overflow: hidden;
		background-position: center center !important;
		background-repeat: no-repeat !important;
		background-size: cover !important;
	}

	/* 改swiper自带样式 */
	uni-swiper.goods-box .uni-swiper-dot,
	wx-swiper.goods-box .wx-swiper-dot {
		background: rgba(205, 205, 205, 1);
		width: 34rpx;
		height: 6rpx;
		border-radius: 3rpx;
	}

	uni-swiper.goods-box .uni-swiper-dot-active,
	wx-swiper.goods-box .wx-swiper-dot-active {
		background: #F0756D !important;
	}

	/* 图片载入替代方案 */
	/* #ifndef APP-PLUS-NVUE */
	.image-wrapper {
		background: #f3f3f3;
		transition: .6s;
		opacity: 0;

		&.loaded {
			opacity: 1;
		}
	}


	/* #endif */
</style>
