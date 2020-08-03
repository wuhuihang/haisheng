<template>
	<view class="article">
		<view class="write-title">{{articleTitle}}</view>
		<view class="write-detail">
			<image :src="avatarUrl"></image>
			<view>
				<view>{{userName}}</view>
				<view>{{issuedDate}}</view>
			</view>
		</view>
		<view class="content">
			<view
				v-for="(item,index) in content" 
				:key="index"
			>
				<view v-if="/^<video([\s\S]*)<\/video>$/.test(item)"> 
					<video :src='item.match(/src="([\s\S]*)"/)[1]'></video>		
				</view>
				<div v-else-if='/^<div class="hs-goods"/.test(item)' @click="goGood(item)" v-html="item"></div>
				<div v-else-if='/^<div class="hs-folow"/.test(item)' @click="goFollow(item)" v-html="item"></div>
				<div v-else-if='/^<div class="hs-phone"/.test(item)' @click="goPhone(item)" v-html="item"></div>
				<view v-else v-html="item"></view>
			</view>
		</view>
	<!-- 	<view class="bottom-button">
			<view @click="modify">修改</view>
		</view> -->
		<!-- 显示二维码 -->
		<view class="model-wrap" :class="{'model-wrap-show':showQrcode}">
			<view class="model">
				<view class="close" @click="showQrcode=false">✖</view>
				<view class="model-title" style="border: 0;">
					<text>长按下方二维码关注</text>
				</view>
				<view class="model-content">
					<img :src="qrcode" style="pointer-events: auto!important;"></img>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// showQrcode: true,
				// qrcode: 'http://bucketshop.oss-cn-hangzhou.aliyuncs.com/images/20200801/app_15962943425869rs8.png',
				showQrcode: false,
				qrcode: '',
				issuedDate: '',
				userName: '',
				avatarUrl: '',
				articleTitle: '',
				content: ''
			}
		},
		onLoad(option){
			// 获取用户信息
			this.$api.get('https://mall.yyooyi.com:8081/login/getUserInfo', {
				params: {
					userId: 'a215dfced68b46d08eeb9bf008d5ec4b'
				}
			}).then(res => {
				if(res.code === 200){
					this.userName = res.data.userName;
					this.avatarUrl = res.data.avatarUrl;
				}
			})
			// 获取文章详情
			this.$api.get('https://mall.yyooyi.com:8081/o2oMyArticle/getArticleInfo', {
				params: {
					seqId: option.seqId
				}
			}).then(res => {
				if(res.code===200){
				    let content = (res.data.articleContent||'').replace(/^<section>/g,'').replace(/<\/section>$/g,'').split(/<\/section><section>/)||[];
					// content = getApp().globalData.content.replace(/^<section>/g,'').replace(/<\/section>$/g,'').split(/<\/section><section>/)||[];
				    this.content = content;
				    this.articleTitle = res.data.articleTitle||'';
				    this.issuedDate = res.data.issuedDate||''; 
				}
			})
		},
		methods: {
			goGood(item) {
				let seqId = item.match(/seqId="([^"]*)"/)[1];
				let merchantSeqId = item.match(/merchantSeqId="([^"]*)"/)[1];
				uni.navigateTo({
					url: `/pages/goods/detail?seqId=${seqId}&merchantShopId=${merchantSeqId}`
					// url: `/pages/spread/advertise?seqId=${seqId}&merchantShopId=${merchantSeqId}`
				})
			},
			goFollow(item) {
				let qrCode = item.match(/qrCode="([^"]*)"/)[1];
				this.qrcode = qrCode;
				this.showQrcode = true;
			},
			goPhone(item) {
				let phone = item.match(/phone="([^"]*)"/)[1];
				uni.makePhoneCall({
					phoneNumber: phone, 
					success: (res) => {
						console.log('调用成功!')	
					},
					fail: (res) => {
						console.log('调用失败!')
					}
				});
			},
			// modify() {
			// 	uni.navigateTo({
			// 		url: "/pages/write/write?isModify=true&seqId=1"
			// 	})
			// }
		}
	}
</script>

<style lang="scss">
	.article {
		font-size: 30rpx;
		width: 100%;
		height: 100%;
		.write-title {
			padding: 0 30rpx;
			font-size: 36rpx;
			height: 50rpx;
		}
		.write-detail {
			padding: 10rpx 30rpx 0;
			display: flex;
			image {
				width: 60rpx;
				height: 60rpx;
				border-radius: 30rpx;
				background-color: #999;
			}
			view {
				margin-left: 10rpx;
				view {
					font-size: 24rpx;
					color: #b2b2b2;
					line-height: 40rpx;
				}
			}
		}
		.content {
			padding: 20rpx 30rpx 120rpx;
			> view {
				width: 100%;
				margin-top: 20rpx;
				border: 1px dashed transparent;
				line-height: 50rpx;
				&.active {
					background: #f1dedd;
					border: 1px dashed #f45e54;
				}
				video {
					width: 100%;
					z-index: 0;
				}
			}
			/deep/ a {
				text-decoration: none;
				div {
					text-decoration: underline;
				}
				// img {
				// 	border-bottom: 1px solid #000;
				// }
			}
			/deep/ .hs-goods {
				display: flex;
				border: 1px solid #ccc;
				border-radius: 15rpx;
				padding: 15rpx;
				img {
					width: 240rpx;
					height: 160rpx;
					border-radius: 10rpx;
				}
				.hs-goods-detail {
					flex: 1;
					padding: 15rpx;
					:first-child {
						height: 90rpx;
						line-height: 1.3;
						font-size: 26rpx;
					}
					:last-child {
						color: #E04B28;
						font-size: 30rpx;
					}
				}
			}
			/deep/ .hs-image-text {
				display: flex;
				padding: 30rpx 10rpx;
				border: 1px solid #ccc;
				.hs-image-text-detail {
					flex: 1;
					padding-left: 20rpx;
					:first-child {
						display: block;
						color: #000;
						height: 50rpx;
						font-size: 30rpx;
					}
					:last-child {
						display: block;
						color: #999;
						font-size: 26rpx;
					}
				}
			}
			/deep/ .hs-folow {
				display: flex;
				padding: 30rpx 10rpx;
				border: 1px solid #ccc;
			}
			
			/deep/ .hs-phone {
				display: flex;
				padding: 30rpx 10rpx;
				border: 1px solid #ccc;
			}
			
			/deep/ .hs-folow-phone-detail {
				flex: 1;
				padding-left: 20rpx;
				:first-child {
					display: block;
					color: #000;
					height: 50rpx;
					font-size: 30rpx;
				}
				:last-child {
					display: block;
					color: #999;
					font-size: 26rpx;
				}
			}
			/deep/ .hs-folow-phone-button {
				margin-top: 30rpx;
				width: 120rpx;
				height: 40rpx;
				font-size: 26rpx;
				border-radius: 40rpx;
				border: 1px solid #FF0000;
				color: #FF0000;
				text-align: center;
				line-height: 40rpx;
			}
			
			/deep/ .hs-card {
				padding: 30rpx 10rpx;
				height: 300rpx;
				border: 1px solid #ccc;
				position: relative;
				.hs-card-body {
					position: absolute;
					top: 30rpx;
					left: 10rpx;
					width: 97%;
					height: 300rpx;
					box-sizing: border-box;
					padding: 40rpx;
					display: flex;
					overflow: hidden;
					.hs-card-left {
						flex: 1;
						.hs-card-name {
							height: 80rpx;
							margin-bottom: 30rpx;
							display: flex;
							.hs-card-phone-text {
								flex: 1;
								margin-left: 20rpx;
								font-size: 20rpx;
								:first-child {
									font-size: 26rpx;
									height: 40rpx;
								}
								:last-child {
									height: 40rpx;
								}
							}
						}
						.hs-card-phone {
							height: 40rpx;
							margin-bottom: 20rpx;
							display: flex;
							.hs-card-phone-text {
								flex: 1;
								margin-left: 5rpx;
								font-size: 12rpx;
								:first-child {
									font-size: 14rpx;
									height: 20rpx;
								}
								:last-child {
									height: 20rpx;
								}
							}
						}
					}
					.hs-card-right {
						width: 180rpx;
						font-size: 20rpx;
						line-height: 30rpx;
					}
				}
			}
		}
		.model-wrap {
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			box-shadow: 0px 0px 10px #aaa;
			background: rgba(0,0,0,0.2);
			z-index: 99;
			visibility: hidden;
			transition: visibility 0.3s;
			&.model-wrap-show {
				visibility: visible;
					.model {
					transform: scale(1);
				}
			}
			.close {
				width: 50rpx;
				height: 50rpx;
				line-height: 50rpx;
				position: absolute;
				top: -25rpx;
				right: -20rpx;
				color: red;
				box-shadow: 0px 0px 10px #ccc;
				border-radius: 25rpx;
				text-align: center;
				background-color: #FFFFFF;
				font-size: 30rpx;
			}
			.model {
				transition: transform 0.3s;
				transform: scale(0.8);
				position: fixed;
				top: 150rpx;
				right: 30rpx;
				left: 30rpx;
				border-radius: 20rpx;
				background-color: #fff;
				.model-title {
					padding: 20rpx 30rpx;
					border-bottom: 1px solid #E8E8E8;
					text-align: center;
				}
				.model-cancle {
					position: absolute;
					top: 20rpx;
					left: 40rpx;
					color: #FFA098;
					font-size: 24rpx;
				}
				.model-content {
					width: 100%;
					box-sizing: border-box;
					overflow: auto;
					text-align: center;
					padding: 0 30rpx 30rpx;
				}
			}
		}
		.bottom-button {
			position: fixed;
			width: 100%;
			height: 100rpx;
			bottom: 0;
			display: flex;
			z-index: 5;
			view {
				flex: 1;
				line-height: 100rpx;
				text-align: center;
				color: #d0372b;
				background-color: #ffceca;
			}
		}
	}
</style>
