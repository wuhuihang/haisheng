<template>
	<view class="box">
		<view class="url-box">
			<textarea class="article-url" value="" placeholder="双击或者长按粘贴文章链接，请勿转发谣言／暴力／色情／欺诈等违规信息，如果发现直接封号处理" />
			<view class="article-url-tips">如何获取文章链接？</view>
		</view>
		<view class="platfrom">支持今日头条、天天快报、官网http开头的、微信公众平台</view>
		<view class="article-btn">
			<view class="btn-l btn">
				生成我的广告文章
			</view>
			<navigator url="/pages/make_money/article_edit" class="btn-r btn">
				我要原创
			</navigator>
		</view>
		<view class="art-box">
			<view class="type-list">
				<view class="left">
					<view class="cate-box">
						<view class="type-li active" contenteditable="true">
							推荐
						</view>
						<view class="type-li ">
							互联网
						</view>
						<view class="type-li ">
							生活艺术
						</view>
						<view class="type-li ">
							热门
						</view>
					</view>
				</view>
			</view>
			<view class="art-li">
				<image lazy-load class="img" src="../../static/images/goods.png" mode=""></image>
				<view class="art-li-r">
					<view class="title">生活就是这样的有味</view>
					<view class="time-box">
						<view>15分钟前</view>
						<view>阅读量 <text class="font-red">1224</text> </view>
					</view>
					<view class="insert">
						<view class="insert-l">
							<image lazy-load class="avatar" src="../../static/images/home-active.png" mode=""></image>
							深圳新东方教育集团
						</view>
						<view class="insert-r">
							植入广告
						</view>
					</view>
				</view>
			</view>
			<view class="art-li">
				<image lazy-load class="img" src="../../static/images/goods.png" mode=""></image>
				<view class="art-li-r">
					<view class="title">生活就是这样的有味</view>
					<view class="time-box">
						<view>15分钟前</view>
						<view>阅读量 <text class="font-red">1224</text> </view>
					</view>
					<view class="insert">
						<view class="insert-l">
							<image lazy-load class="avatar" src="../../static/images/home-active.png" mode=""></image>
							深圳新东方教育集团
						</view>
						<view class="insert-r">
							植入广告
						</view>
					</view>
				</view>
			</view>
			<view class="art-li">
				<image lazy-load class="img" src="../../static/images/goods.png" mode=""></image>
				<view class="art-li-r">
					<view class="title">生活就是这样的有味</view>
					<view class="time-box">
						<view>15分钟前</view>
						<view>阅读量 <text class="font-red">1224</text> </view>
					</view>
					<view class="insert">
						<view class="insert-l">
							<image lazy-load class="avatar" src="../../static/images/home-active.png" mode=""></image>
							深圳新东方教育集团
						</view>
						<view class="insert-r">
							植入广告
						</view>
					</view>
				</view>
			</view>
			<view class="art-li">
				<image lazy-load class="img" src="../../static/images/goods.png" mode=""></image>
				<view class="art-li-r">
					<view class="title">生活就是这样的有味</view>
					<view class="time-box">
						<view>15分钟前</view>
						<view>阅读量 <text class="font-red">1224</text> </view>
					</view>
					<view class="insert">
						<view class="insert-l">
							<image lazy-load class="avatar" src="../../static/images/home-active.png" mode=""></image>
							深圳新东方教育集团
						</view>
						<view class="insert-r">
							植入广告
						</view>
					</view>
				</view>
			</view>
			<view class="art-li">
				<image lazy-load class="img" src="../../static/images/goods.png" mode=""></image>
				<view class="art-li-r">
					<view class="title">生活就是这样的有味</view>
					<view class="time-box">
						<view>15分钟前</view>
						<view>阅读量 <text class="font-red">1224</text> </view>
					</view>
					<view class="insert">
						<view class="insert-l">
							<image lazy-load class="avatar" src="../../static/images/home-active.png" mode=""></image>
							深圳新东方教育集团
						</view>
						<view class="insert-r">
							植入广告
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<view class="blank" style="height: 154rpx;">
		</view>
		<view class="adert-btn-img">
			<image lazy-load class="img" src="../../static/images/adver-bottom.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
.url-box {
	width: 682rpx;
	height: auto;
	margin: 20rpx auto;
	margin-bottom: 10rpx;
	color: #999;
	padding: 20rpx 30rpx;
	width:622rpx;
	height:80rpx;
	background:rgba(255,255,255,1);
	box-shadow:0px 0px 5rpx 2rpx rgba(72,114,229,0.31);
	border-radius:6rpx;
	position: relative;
	.article-url {
		width: 100%;
		font-size:20rpx;
		height: 60rpx;
	}
	.article-url-tips {
		position: absolute;
		bottom: 5rpx;
		right: 30rpx;
		font-size:16rpx;
		color: #4872E5;
	}
}
.platfrom {
	font-size:16rpx;
	color: #666666;
	width: 682rpx;
	margin: 0 auto;
	margin-bottom: 24rpx;
}
	.article-btn {
		width: 682rpx;
		height: auto;
		margin: 0 auto;
		margin-bottom: 40rpx;
		display: flex;
		justify-content: space-between;
		.btn {
			background:rgba(72,114,229,1);
			border-radius:34rpx;
			height:68rpx;
			line-height: 68rpx;
			font-size:30rpx;
			color: white;
			text-align: center;
			cursor: pointer;
		}
		.btn-l {
			width:440rpx;
		}
		.btn-r {
			width:188rpx;
			opacity:0.7;
		}
		
	}
	.art-box {
		width: 682rpx;
		margin: 40rpx auto;
		.type-list {
			display: flex;
			align-items: center;
				
				flex-shrink: 0;
				font-size: 26rpx;
				position: relative;
				z-index: 2;
		
				.cate-box {
					width: 100%;
					display: flex;
					overflow: auto hidden;
				}
		
				.type-li {
					height: 40rpx;
					line-height: 40rpx;
					flex-shrink: 0;
					position: relative;
					overflow-y: hidden;
					display: inline-block;
					text-align: center;
					margin-right: 50rpx;
				}
		
				.active {
					font-size: 30rpx;
					font-weight: bold;
		
					&::after {
						content: "";
						position: absolute;
						bottom: 0;
						left: 10%;
						width: 80%;
						height: 12rpx;
						background: $color-primary;
						border-radius: 6rpx;
						z-index: -1;
					}
				}
		
		
		}
		.art-li {
			width: 622rpx;
			background:rgba(255,255,255,1);
			border-radius:6px;
			padding: 36rpx 30rpx;
			display: flex;
			justify-content: space-between;
			overflow: hidden;
			margin: 30rpx 0;
			.img {
				width:200rpx;
				height:148rpx;
				background:rgba(255,255,255,1);
				border-radius:4rpx;
				flex-shrink: 0;
				margin-right: 20rpx;
				box-shadow:0px 0px 5px 2px #d4d4d4;
			}
			.art-li-r {
				width: calc(100% - 220rpx);
				font-size:26rpx;
				height:148rpx;
				display: flex;
				flex-wrap: wrap;
				.title {
					margin-top: -6rpx;
					width: 100%;
				}
				.time-box {
					margin: 10rpx 0;
					margin-top: 0;
					display: flex;
					justify-content: space-between;
					width: 100%;
					color: #666;
				}
				.insert {
					display: flex;
					justify-content: space-between;
					font-size:16rpx;
					align-self: flex-end;
					width: 100%;
					
					.insert-l {
						display: flex;
						align-items: center;
						color: #666666;
						.avatar{
							
							width:54rpx;
							height:54rpx;
							border-radius: 100%;
							background: #DCDCDC;
							margin-right: 8rpx;
						}
						
					}
					.insert-r {
						width:156rpx;
						height:48rpx;
						border:1px solid rgba(255,81,72,1);
						border-radius:23rpx;
						font-size:24rpx;
						color: #FF857D;
						line-height:48rpx ;
						text-align: center;
					}
					 
				}
			}
		}
	}
	.adert-btn-img {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 154rpx;
		.img {
			width: 100%;
			height: 100%;
		}
	}
</style>
