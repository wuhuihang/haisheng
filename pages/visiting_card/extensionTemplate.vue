<template>
	<view class="extension-template">
		<view class="title">{{extensionDetail.title}}</view>
		<view class="content">
			<view v-for="(item,index) in contentList" :key="index">
				<!-- 如果是video在编辑操作时无需播放只显示默认图片 -->
				<view v-if="/^<video([\s\S]*)<\/video>$/.test(item)">
				  <video :src='item.match(/src="([\s\S]*?)"/)[1]' style="border-radius:20rpx;width:100%;height:277rpx;object-fit:fill;" poster="http://bucketshop.oss-cn-hangzhou.aliyuncs.com/images/20200809/app_1596953889150c6yy.png"></video>
				</view>
				<view v-else-if='/^<div class="hs-goods"/.test(item)' @click="goGood(item)" v-html="item"></view>
				<view v-else-if='/^<a href=".*"/.test(item)' @click="goHref(item)" v-html="item"></view>
				<view v-else v-html="item"></view>
			</view>
			<view class="hs-form" v-if="extensionDetail.formTitle">
				<!-- <view class="close" @click="hasForm=false">✖</view> -->
				<view class="hs-form-name">{{extensionDetail.formTitle}}</view>
				<view class="hs-form-item">
					<span class="hs-form-item-span">姓名</span>
					<input class="hs-form-item-input" v-model="apply.name" :placeholder="hasModel?'':'请输入您的姓名'"/>
				</view>
				<view class="hs-form-item">
					<span class="hs-form-item-span">手机号</span>
					<input class="hs-form-item-input" v-model="apply.mobile" :placeholder="hasModel?'':'请输入您的联系方式'" maxlength="11"/>
				</view>
				<view class="hs-form-item">
					<span class="hs-form-item-span">内容</span>
					<input class="hs-form-item-input" v-model="apply.content" :placeholder="hasModel?'':'请输入内容'"/>
				</view>
				<view><button class="hs-form-button" @click="applyForm">提交</button></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				api: this.$webconfig.api_url,
				customerSeqId: this.$common.getLocalSync('customerSeqId'),
				cardUserId: '',
				apply:{
					name: '',
					mobile: '',
					content: '',
				},
				extensionDetail: {
					seqId: '',
					cardSeqId: '',
					iconName: '',
					iconUrl: '',
					iconSort: '',
					formTitle: '',
					title: '',
					content: '',
					articleLink: '',
					articleList: []
				},
				contentList: [],
				cloudUrl:this.$webconfig.cloud_url+'/mall/img',
			};
		},
		onLoad(option) {
			this.cardUserId = option.customerSeqId;
			if(option.from === 'list'){
				this.findListArticleInfo(option.seqId);
			} else {
				this.findExtendContent(option.cardSeqId,option.seqId, 'ARTICLE');
			}
		},
		methods:{
			goGood(item) {
				let seqId = item.match(/seqId=([^&]*)&/)[1];
				let merchantShopId = item.match(/merchantShopId=([^"]*)"/)[1];
				uni.navigateTo({
					url: `/pages/goods/detail?seqId=${seqId}&merchantShopId=${merchantShopId}`
				})
			},
			goHref(item) {
				let href = item.match(/^<a href="(.*?)"/)[1];	
				if(!window){	
					uni.setClipboardData({
						data: href||'',
						success: ()=>{
							uni.showToast({
								icon: 'none',
								title: '复制链接成功，请到浏览器查看！',
								duration: 2000
							});
						}
					})
				} else {
					location.href = href;
				}
			},
			findListArticleInfo(seqId){
				this.$api.get('/o2oVisitingCard/findListArticleInfo', {
					params: {
						articleSeqId: seqId,
					}
				}).then(res => {
					// 转化文章字符串为htnl代码块
					
					let articleContent = res.data.content || '';
					let content = [];
					
					let ac = articleContent.replace(/^<section>/g, '').replace(/<\/section>$/g, '').replace(/<a href="([^"]*?)" /g, ($0,$1)=>{
						return $0 + ' onclick="return false;"';
					});
					content = ac.split(/<\/section><section>/);
					this.contentList.splice(0,1);
					content.forEach((item)=>{
						this.contentList.push(item);
					});
					this.extensionDetail = res.data;
				})
			},
			findExtendContent(cardSeqId,seqId,type){
				this.$api.get('/o2oVisitingCard/findExtendContent', {
					params: {
						customerSeqId: this.cardUserId,
						cardSeqId: cardSeqId,
						seqId: seqId,
						type: type,
					}
				}).then(res => {
					// 转化文章字符串为htnl代码块
					
					let articleContent = res.data.content || '';
					let content = [];
					
					let ac = articleContent.replace(/^<section>/g, '').replace(/<\/section>$/g, '').replace(/<a href="([^"]*?)" /g, ($0,$1)=>{
						return $0 + ' onclick="return false;"';
					});
					content = ac.split(/<\/section><section>/);
					this.contentList.splice(0,1);
					content.forEach((item)=>{
						this.contentList.push(item);
					});
					this.extensionDetail = res.data;
				})
			},
			applyForm() {
				this.$api.post('/o2oVisitingCardApply/insert', {
					cardExtendId: this.extensionDetail.seqId,
					cardSeqId: this.extensionDetail.cardSeqId,
					cardUserId: this.cardUserId,
					customerSeqId: this.customerSeqId,
					formTitle: this.extensionDetail.formTitle,
					name: this.apply.name,
					mobile: this.apply.mobile,
					content: this.apply.content,
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '申请成功！',
							duration: 2000
						});
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.extension-template {
	padding: 29rpx 33rpx;

	.title {
		font-size: 36rpx;
		color: #3d3d3d;
	}
	.content {
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

		/deep/ .hs-goods {
			display: flex;
			border: 1px solid #ccc;
			border-radius: 15rpx;
			padding: 15rpx;
			background-color: #fff;
			
			.hs-image {
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
		
		/deep/ .hs-form {
			width: 100%;
			position: relative;
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
			.hs-form-name {
				width: 100%;
				height:68rpx;
				line-height:68rpx;
				text-align: center;
				margin-bottom: 23rpx;
			}
			.hs-form-item {
				position: relative;
				width: 100%;
				height:68rpx;
				margin-bottom: 26rpx;
				.hs-form-item-span {
					font-size:26rpx;
					display: block;
					position: absolute;
					top: 18rpx;
					left: 0rpx;
					width: 133rpx;
					box-sizing: border-box;
					text-align: right;
					height: 32rpx;
					line-height:32rpx;
					padding-right: 24rpx;
					border-right: 1px solid rgba(153,153,153,1);
					&:before {
						content: '*';
						color: red;
					}
				}
				.hs-form-item-input {
					position: absolute;
					top: 0rpx;
					left: 0rpx;
					height:68rpx;
					width:682rpx;
					box-sizing: border-box;
					line-height:68rpx;
					border:1rpx solid rgba(72,114,229,0.4);
					border-radius:4px;
					padding-left: 166rpx;
				}
			}
			.hs-form-button {
				width:438rpx;
				height:80rpx;
				display: block;
				margin: 0 auto;
				line-height:80rpx;
				background:rgba(255,158,151,1);
				border-radius:10rpx;
				text-align: center;
				color: #fff;
			}
		}
	}

}		
</style>
