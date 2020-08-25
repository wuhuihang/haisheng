<template>
	 <!-- :style="{backgroundImage:'url('+ad.backdropPic+')'}" -->
	<view class="card">
		<div v-for="(item,index) in cardList" @click="goCard(item.seqId)">{{item.seqId}}</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customerSeqId: this.$common.getLocalSync('customerSeqId'),
				cardList: []
			};
		},
		onShow() {
			this.findPage();
		},
		methods:{
			findPage(){
				this.$api.get('/o2oVisitingCard/findPage', {
					params: {
						customerSeqId: this.customerSeqId,
					}
				}).then(res => {
					this.cardList = res.list;
				})
			},
			goCard(seqId){
				uni.redirectTo({
					// // 新增
					// url: "/pages/visiting_card/card"
					// 修改
					url: "/pages/visiting_card/card?isUpdateCard=true&seqId=" + seqId
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.card {
	width: 100%;
	height: 100%;
	padding: 20rpx;
	box-sizing: border-box;
	div {
		width: 100%;
		margin-bottom: 10rpx;
		background: #00BFFF;
	}
}
</style>
