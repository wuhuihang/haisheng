<template>
	<view class="extension">
		<view class="extension-content white-bg">
			<view class="extension-list">
				<view class="extension-list-item" 
					v-for="(item,index) in extensionDetail.articleList" 
					:key="item.seqId" 
					@click="goListDetail(item.seqId)">
					<view class="extension-list-item-body">
						<view class="extension-list-item-title">{{item.title}}</view>
						<view class="extension-list-item-content">{{item.content.replace(/<[^<>]+>/g,'')}}</view>
					</view>
				</view>
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
				cardSeqId: '',
				cardUserId: '',
				extensionDetail: {
					articleList: []
				},
			};
		},
		onLoad(option) {
			if(option.cardSeqId){
				this.cardSeqId = option.cardSeqId;
				this.cardUserId = option.customerSeqId;
				this.findExtendContent(option.cardSeqId,option.seqId, 'LIST');
			}
		},
		methods:{
			findExtendContent(cardSeqId,seqId,type){
				this.$api.get('/o2oVisitingCard/findExtendContent', {
					params: {
						customerSeqId: this.customerSeqId,
						cardSeqId: cardSeqId,
						seqId: seqId,
						type: type,
					}
				}).then(res => {
					this.extensionDetail = res.data;
				})
			},
			goListDetail(seqId) {
				uni.navigateTo({
					url: `/pages/visiting_card/extensionTemplate?from=list&cardSeqId=${this.cardSeqId}&seqId=${seqId}&customerSeqId=${this.cardUserId}`,
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.extension {
	.extension-content {
		.extension-list {
			padding: 0 24rpx 38rpx;
			overflow-x: hidden;
			.extension-list-item {
				width: 100%;
				height: 208rpx;
				box-sizing: border-box;
				border-bottom: 2px solid #dedede;
				padding-top: 15rpx;
				position: relative; 
				&:last-child {
					border-bottom: 0;
				}
				.extension-list-item-body {
					position: absolute;
					top: 0;
					left: 0;
					overflow: hidden;
					width: 100%;
					.extension-list-item-title {
						// width: 100%;
						margin-top: 30rpx;
						font-size: 30rpx;
						color: #333333;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.extension-list-item-content {
						// width: 100%;
						margin-top: 30rpx;
						font-size: 22rpx;
						color: #666666;
						// word-break: break-all;
						// word-wrap: break-word;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}			
			}
		}
	}
}
.white-bg {
	background: #fff;
}
</style>
