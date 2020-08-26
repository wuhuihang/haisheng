<template>
	<view class="card">
		<view class="card-top">
			<view v-if="!isDetail" class="card-tip">点击名片任何部位进行编辑</view>
			<view class="card-bg" @click="updatePicUrl">
				<image :src="cardDetail.picUrl" mode="aspectFill">
			</view>
			<view class="card-button-list">
				<view class="card-icon"><image src="/static/images/card/music.png" mode="aspectFill"></view>
				<view class="card-icon"><image src="/static/images/card/code.png" mode="aspectFill"></view>
				<view class="card-icon" @click="mackCall(cardDetail.mobile)"><image src="/static/images/card/phone.png" mode="aspectFill"></view>
				<view class="card-button" :class="{'isEdit': !isDetail}" @click="addCard">
					<image src="/static/images/card/save.png" mode="aspectFill">
					<view>{{isDetail?'制作':'保存'}}</view>
				</view>
			</view>
		</view>
		<view class="card-detail">
			<view class="card-detail-top"></view>
			<view class="card-detail-body">
				<view class="card-detail-name">
					<view class="card-detail-name-1">
						<span v-if="isDetail">{{cardDetail.name}}</span>
						<input v-else v-model="cardDetail.name" placeholder-style="color:#999" placeholder="姓名"/>
					</view>
					<view class="card-detail-name-2">
						<span v-if="isDetail">{{cardDetail.position}}</span>
						<input v-else v-model="cardDetail.position" placeholder-style="color:#999" placeholder="职称"/>
					</view>
				</view>
				<view class="card-detail-title">
					<span v-if="isDetail">{{cardDetail.company}}</span>
						<input v-else v-model="cardDetail.company" placeholder-style="color:#999" placeholder="公司"/>
				</view>
				<view class="card-detail-subtitle">
					<span v-if="isDetail">{{cardDetail.remarks}}</span>
						<input v-else v-model="cardDetail.remarks" placeholder-style="color:#999" placeholder="说明"/>
				</view>
				<view class="card-detail-item">
					<image src="/static/images/card/tele.png" @click="mackCall(cardDetail.mobile)" mode="aspectFill">
					<span v-if="isDetail">{{cardDetail.mobile}}</span>
					<input v-else v-model="cardDetail.mobile" placeholder-style="color:#999" placeholder="手机"/>
				</view>
				<view class="card-detail-item">
					<image src="/static/images/card/email.png" mode="aspectFill">
					<span v-if="isDetail">{{cardDetail.email}}</span>
					<input v-else v-model="cardDetail.email" placeholder-style="color:#999" placeholder="邮箱"/>
				</view>
				<view class="card-detail-item">
					<image src="/static/images/card/location.png" mode="aspectFill">
					<span v-if="isDetail">{{cardDetail.address}}</span>
					<input v-else v-model="cardDetail.address" placeholder-style="color:#999" placeholder="地址"/>
				</view>
			</view>
			<view class="card-extend">
				<view class="card-extend-item" v-for="(item,index) in extendList" :key="index" @click="goExtension(item)">
					<view class="card-extend-item-box">
						<image :src="item.iconUrl" mode="aspectFill">
						</image>
						<view class="card-extend-close" v-if="!isDetail" @click.stop="deleteExtend(item.seqId, index)">×</view>
						<text>{{item.iconName}}</text>
					</view>
				</view>
				<view class="card-extend-item" v-if="!isDetail&&extendList.length<8" @click="addExtension">
					<view class="card-extend-item-box">
						<image src="/static/images/card/more.png" mode="aspectFill">
					</view>
				</view>
			</view>
		</view>
		<view class="select-box-wrap" v-show="showUploadImg">
			<div class="select-box">
				<button @click="uploadImg(1)">拍照</button>
				<button @click="uploadImg(0)">从手机相册选择</button>
				<button class="select-box-cancle" @click="showUploadImg=false">取消</button>
			</div>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customerSeqId: this.$common.getLocalSync('customerSeqId'),
				showUploadImg: false,
				api: this.$webconfig.api_url,
				seqId: '',
				isDetail: true,
				isUpdateCard: false,
				cardDetail: {},
				extendList: []
			};
		},
		onLoad(option) {
			if(option.isUpdateCard){ //判断提交调的接口
				this.isUpdateCard = true;
			}
			if(option.seqId){
				this.seqId = option.seqId;
				this.getByPk(option.seqId);
			} else {
				this.getTemplate();
			}
		},
		onShow() {
			if(this.cardDetail.seqId){
				this.getExtendList(this.cardDetail.seqId);
			}
		},
		methods:{
			mackCall(phone) {
				this.isDetail && uni.makePhoneCall({
				    phoneNumber: phone
				});
			},
			// 上传图片
			updatePicUrl() {
				!this.isDetail && (this.showUploadImg=true);
			},
			uploadImg(type) {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [
						['album', 'camera'][type]
					], //从相册选择
					success: image => {
						if (image.tempFiles[0].size > 2 * 1024 * 1024) {
							uni.showToast({
								icon: 'none',
								title: '照片大小不能超过2M！',
								duration: 2000
							});
							return;
						}
						uni.showLoading({
							title: '加载中'
						});
						this.showUploadImg = false;
						uni.uploadFile({
							url: this.api + '/sys/appeal/imgUpload',
							filePath: image.tempFilePaths[0],
							name: 'file',
							success: (uploadFileRes) => {
								let res = JSON.parse(uploadFileRes.data);
								uni.hideLoading();
								if (res.code === 200) {
									uni.showToast({
										title: '上传成功！',
										duration: 2000
									});
									this.cardDetail.picUrl = res.data.viewUrl;
								} else {
									uni.showToast({
										icon: 'none',
										title: '图片上传失败',
										duration: 2000
									});
								}
							},
							fail: () => {
								uni.hideLoading();
								uni.showToast({
									icon: 'none',
									title: '上传失败！',
									duration: 2000
								});
							}
						});
					},
				});
			},
			
			getByPk(seqId) {
				this.$api.get('/o2oVisitingCard/getByPk', {
					params: {
						seqId: seqId,
					}
				}).then(res => {
					console.log('getByPk',res);
					this.cardDetail = res.data;
					this.getExtendList(this.cardDetail.seqId);
				})
			},
			getTemplate(){
				this.$api.get('/o2oVisitingCard/buildTemplate', {
					params: {
						customerSeqId: this.customerSeqId,
					}
				}).then(res => {
					console.log('buildTemplate',res);
					// res.data = {
					// 	address: '湖北省武汉市硚口区古田西路578号',
					// 	appQrCode: '',
					// 	company: '湖北百亿互动大数据科技有限公司',
					// 	customerSeqId: '',
					// 	email: '875471457@qq.com',
					// 	gzhQrCode: '',
					// 	isDelete: "0",
					// 	logo: '',
					// 	mobile: '198-3451-1541',
					// 	mpQrCode: '',
					// 	musicUrl: '',
					// 	name: '徐维佳',
					// 	picUrl: '',
					// 	position: '市场经理',
					// 	remarks: '',
					// 	seqId: '1cd2b26b2e7f441983826b3588e5edb9',
					// 	updateBy: '',
					// 	updateDate: '',
					// 	wxQrCode: ''
					// };
					this.cardDetail = res.data;
					this.getExtendList(this.cardDetail.seqId);
				})
			},
			getExtendList(seqId){
				this.$api.get('/o2oVisitingCard/findVisitingCardList', {
					params: {
						cardSeqId: seqId,
					}
				}).then(res => {
					console.log('getExtendList',res);
					this.extendList = res.data;
				})
			},
			deleteExtend(seqId, index) {
				if(this.extendList.length<2){
					return ;
				}
				this.$api.get('/o2oVisitingCard/deleteExtendMod', {
					params: {
						cardSeqId: this.cardDetail.seqId,
						extendSeqId: seqId
					}
				}).then(res => {
					if (res.code === 200) {
						this.extendList.splice(index, 1);
						uni.showToast({
							title: '删除成功！',
							duration: 2000
						});
					}
				})
			},
			goExtension(item) {
				if(this.isDetail){
					return;
				}
				uni.navigateTo({
					url: `/pages/visiting_card/extension?cardSeqId=${this.cardDetail.seqId}&seqId=${item.seqId}&type=${item.type||'ARTICLE'}`,
				})
			},
			addExtension () {
				uni.navigateTo({
					url: `/pages/visiting_card/extension?isAdd=true&cardSeqId=${this.cardDetail.seqId}`,
				});
			},
			addCard() {
				let url = '/o2oVisitingCard/insert';
				if(this.isDetail){
					this.isDetail = false;
					return;
				}
				if(this.isUpdateCard){
					url = '/o2oVisitingCard/update';
				}
				this.cardDetail.logo = this.cardDetail.picUrl;
				this.cardDetail.wxQrCode = 'this.cardDetail.wxQrCode';
				this.cardDetail.gzhQrCode = 'this.cardDetail.gzhQrCode';
				this.cardDetail.appQrCode = 'this.cardDetail.appQrCode';
				this.cardDetail.mpQrCode = 'this.cardDetail.mpQrCode';
				this.cardDetail.musicUrl = 'this.cardDetail.musicUrl';
				this.$api.post(url, this.cardDetail).then(res => {
					let data = res.data;
					if (res.code === 200) {
						uni.showToast({
							title: '名片新增成功！',
							duration: 2000
						});
						uni.redirectTo({
							url: "/pages/visiting_card/cardList",
						});
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.card {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	font-family: PingFang-SC-Medium;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 0rpx;
	.card-top {
		position: relative;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		.card-tip {
			height: 17rpx;
			font-size: 18rpx;
			color: #fd5549;
			position: relative;
			top: 30rpx;
			left: 34rpx;
			z-index: 1;
		}
		.card-bg {
			position: absolute;
			overflow: hidden;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.card-button-list {	
			position: absolute;
			top: 58rpx;
			right: 34rpx;
			width: 100rpx;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			.card-icon {
				width: 72rpx;
				height: 72rpx;
				background: #000000;
				color: #FFFFFF;
				border-radius: 36rpx;
				margin-bottom: 10rpx;
				line-height: 72rpx;
				text-align: center;
				image {
					width: 32rpx;
					height: 32rpx;
				}
			}
			.card-button {
				margin-top: 30rpx;
				width: 100rpx;
				height: 100rpx;
				box-sizing: border-box;
				background: #4872e5;
				color: #FFFFFF;
				border-radius: 50rpx;
				text-align: center;
				image {
					width: 34rpx;
					height:29rpx;
					margin: 19rpx auto 5rpx;
				}
				view {
					width: 100%;
					text-align: center;
					font-size: 20rpx;
					line-height: 19rpx;
					color: #ededed;
				}
				&.isEdit {
					background-color: #ffa098;
				}
			}	
		}
	}
	.card-detail {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 738rpx;
		background-color: rgba(0,0,0,0.65);
		box-sizing: border-box;
		padding: 48rpx 35rpx 23rpx;
		.card-detail-top {
			width: 100%;
			left: 0;
			height: 45rpx;
			position: absolute;
			top: -44rpx;
			background-color: rgba(0,0,0,0.65);
			border-radius: 50% / 100% 100% 0 0;
		}
		.card-detail-body {
			height: 292rpx;
			margin-bottom: 29rpx;
			.card-detail-name {
				height: 49rpx;
				display: flex;
				vertical-align: bottom;
				margin-bottom: 30rpx;
				.card-detail-name-1 {
					height: 49rpx;
					font-size: 49rpx;
					line-height: 49rpx;
					color: #5381ff;
					input {
						width: 240rpx;
					}
				}
				.card-detail-name-2 {
					height: 32rpx;
					font-size: 32rpx;
					line-height: 32rpx;
					color: #4872e5;
					opacity: 0.77;
					margin-left: 46rpx;
					margin-top: 17rpx;
					input {
						width: 200rpx;
					}
				}
			}
			.card-detail-title {
				font-size: 24rpx;
				line-height: 23rpx;
				height: 23rpx;
				color: #ffffff;
				margin-bottom: 22rpx;
				input {
					line-height: 23rpx;
				}
			}
			.card-detail-subtitle {
				font-size: 22rpx;
				line-height: 22rpx;
				height: 22rpx;
				color: #ffffff;
				margin-bottom: 29rpx;
				opacity: 0.65;
				input {
					line-height: 22rpx;
				}
			}
			.card-detail-item {
				font-size: 24rpx;
				line-height: 23rpx;
					height: 23rpx;
				margin-bottom: 26rpx;
				color: #ffffff;
				image {
					width: 20rpx;
					height: 20rpx;
					margin-right: 20rpx;
				}
				input {
					display: inline-block;
					line-height: 23rpx;
					width: 300rpx;
				}
			}
		}
		.card-extend {
			display: flex;
			flex-wrap: wrap;
			.card-extend-item {
				width: 25%;
				margin-bottom: 34rpx;
				text-align: center;
				.card-extend-item-box {
					position: relative;
					width: 100rpx;
					margin: 0 auto;
					color: #ffffff;
					font-size: 24rpx;
					image {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50rpx;
					}
					text {
						margin-top: 16rpx;
						line-height: 24rpx;
					}
					.card-extend-close {
						position: absolute;
						top: 0;
						right: 0;
						width: 30rpx;
						height: 30rpx;
						background: #fff;
						color: #666666;
						line-height: 30rpx;
						border-radius: 15rpx;
					}
				}
			}
		}
	}
	.select-box-wrap {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		z-index: 10;
		background: rgba(0, 0, 0, 0.2);

		.select-box {
			position: absolute;
			bottom: 20rpx;
			left: 20rpx;
			right: 20rpx;

			button {
				width: 100%;
				border-radius: 50rpx;
			}

			.select-box-cancle {
				margin-top: 20rpx;
			}
		}
	}
}
</style>
