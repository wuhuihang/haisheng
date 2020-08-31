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
		<view class="card-detail" :class="{down:isDown}">
			<view class="card-detail-top">
				<image src="/static/images/card/arrow.png" @click="isDown=!isDown" mode="aspectFill">
			</view>
			<view class="card-detail-body">
				<view class="card-detail-name">
					<view class="card-detail-name-1">
						<span v-if="isDetail">{{cardDetail.name||''}}</span>
						<input v-else v-model="cardDetail.name" placeholder-style="color:#999" placeholder="姓名"/>
					</view>
					<view class="card-detail-name-2">
						<span v-if="isDetail">{{cardDetail.position||''}}</span>
						<input v-else v-model="cardDetail.position" placeholder-style="color:#999" placeholder="职称"/>
					</view>
				</view>
				<view class="card-detail-title">
					<span v-if="isDetail">{{cardDetail.company||''}}</span>
						<input v-else v-model="cardDetail.company" placeholder-style="color:#999" placeholder="公司"/>
				</view>
				<view class="card-detail-subtitle">
					<span v-if="isDetail">{{cardDetail.remarks||''}}</span>
						<input v-else v-model="cardDetail.remarks" placeholder-style="color:#999" placeholder="说明"/>
				</view>
				<view class="card-detail-item">
					<image src="/static/images/card/tele.png" @click="mackCall(cardDetail.mobile)" mode="aspectFill">
					<span v-if="isDetail">{{cardDetail.mobile||''}}</span>
					<input v-else v-model="cardDetail.mobile" placeholder-style="color:#999" placeholder="手机"/>
				</view>
				<view class="card-detail-item">
					<image src="/static/images/card/email.png" class="icon-email" mode="aspectFill">
					<span v-if="isDetail">{{cardDetail.email||''}}</span>
					<input v-else v-model="cardDetail.email" placeholder-style="color:#999" placeholder="邮箱"/>
				</view>
				<view class="card-detail-item" @click="chooseLocation(cardDetail.lat,cardDetail.lon)">
					<image src="/static/images/card/location.png" class="icon-location" mode="aspectFill">
					<span v-if="isDetail">{{cardDetail.address||''}}</span>
					<input v-else v-model="cardDetail.address" placeholder-style="color:#999" placeholder="地址"/>
				</view>
			</view>
			<view class="card-extend">
				<view class="card-extend-item" v-for="(item,index) in extendBgList" :key="index" @click="goExtension(extendList[index])">
					<view class="card-extend-item-box" v-if="index < extendList.length || (index === extendList.length&&!isDetail)">
						<view class="card-extend-item-box-bg" :style="item">
							<image v-if="extendList[index]" :src="extendList[index].iconUrl" mode="aspectFill">
							</image>
							<view v-else class="card-extend-add"></view>
							<view class="card-extend-close" v-if="extendList[index]&&!isDetail" @click.stop="deleteExtend(extendList[index].seqId, index)">
								<view>×</view>
							</view>
						</view>
						<text>{{extendList[index]?(extendList[index].iconName||''):'栏目名称'}}</text>					
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
				isDown: false, // 底部名片详情是否下滑
				customerSeqId: this.$common.getLocalSync('customerSeqId'),
				showUploadImg: false, //是否显示上传图片弹窗
				api: this.$webconfig.api_url,
				seqId: '',
				isDetail: true, //是否时名片详情
				cardDetail: {}, //名片详情
				extendBgList: [ //扩展背景色
					'background: linear-gradient(0deg, #439DFD 0%, #80CCFE 100%);',
					'background: linear-gradient(0deg, #FA7E87 0%, #FAA694 100%);',
					'background: linear-gradient(0deg, #0FB984 0%, #5EECBE 100%);',
					'background: linear-gradient(0deg, #EB8838 7%, #FADE9C 100%);',
					'background: linear-gradient(0deg, #673CF2 0%, #8098FE 100%);',
					'background: linear-gradient(0deg, #F7CA51 0%, #FFEFB8 100%);',
					'background: linear-gradient(0deg, #56EEAE 0%, #D0FFEB 100%);',
					'background: linear-gradient(0deg, #519CEE 7%, #9CC8FA 100%);',
				],
				extendList: [] //扩展列表
			};
		},
		onLoad(option) {
			if(option.seqId){
				this.seqId = option.seqId;
				this.getByPk(option.seqId); //如果有seqId则为查看名片详情
			} else {
				this.getTemplate(); //如果没有seqId则代表为新增名片
			}
		},
		onShow() {
			if(this.cardDetail.seqId){
				this.getExtendList(this.cardDetail.seqId);
			}
		},
		onShareAppMessage(res) {
			return {
				title: `${this.cardDetail.name} ${this.cardDetail.company}`,
				path: '/pages/visiting_card/card?seqId='+this.seqId
			}
		},
		methods:{
			// 打电话
			mackCall(phone) {
				this.isDetail && uni.makePhoneCall({
				    phoneNumber: phone
				});
			},
			chooseLocation(lat, lon) {
				this.isDetail && uni.chooseLocation({
				    latitude: lat,
				    longitude: lon,
					success: function (res) {
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
					}
				});
			},
			// 更新图片
			updatePicUrl() {
				!this.isDetail && (this.showUploadImg=true);
			},
			// 上传图片
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
			// 查询名片详情
			getByPk(seqId) {
				this.$api.get('/o2oVisitingCard/getByPk', {
					params: {
						seqId: seqId,
					}
				}).then(res => {
					this.cardDetail = res.data;
					this.getExtendList(this.cardDetail.seqId);
				})
			},
			// 新增、查询名片初始模板
			getTemplate(){
				this.$api.get('/o2oVisitingCard/buildTemplate', {
					params: {
						customerSeqId: this.customerSeqId,
					}
				}).then(res => {
					this.cardDetail = res.data;
					this.getExtendList(this.cardDetail.seqId);
				})
			},
			// 查询扩展
			getExtendList(seqId){
				this.$api.get('/o2oVisitingCard/findVisitingCardList', {
					params: {
						cardSeqId: seqId,
					}
				}).then(res => {
					this.extendList = res.data;
				})
			},
			// 删除扩展
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
			// 跳转扩展
			goExtension(item) {
				// 统计扩展点击
				item && this.$api.post('/o2oVisitingCardExtendSr/clickStatistics',{
					cardExtendId: item.seqId,
					cardSeqId: this.cardDetail.seqId,
					customerSeqId: this.customerSeqId,
					operateType: 'CLICK'
				}).then(res => {})
				
				if(this.isDetail){
					// 跳转详情
					if(item.type==='ARTICLE' || item.type==='ALL') {
						uni.navigateTo({
							url: `/pages/visiting_card/extensionTemplate?cardSeqId=${this.cardDetail.seqId}&seqId=${item.seqId}&customerSeqId=${this.customerSeqId}`,
						});
					} else if(item.type==='LIST') {
						uni.navigateTo({
							url: `/pages/visiting_card/extensionList?cardSeqId=${this.cardDetail.seqId}&seqId=${item.seqId}`,
						});
					} else if(item.type==='LINK') {
						if(!window){	
							uni.showToast({
								icon: 'none',
								title: '小程序不支持访问链接跳转！',
								duration: 2000
							});
						} else {
							location.href = item.articleLink;
						}
					}
				} else {
					// 跳转编辑页面
					if(!item){ // 如果扩展不存在就跳转新增
						uni.navigateTo({
							url: `/pages/visiting_card/extension?isAdd=true&cardSeqId=${this.cardDetail.seqId}`,
						});
					} else { // 扩展存在就跳转修改
						uni.navigateTo({
							url: `/pages/visiting_card/extension?cardSeqId=${this.cardDetail.seqId}&seqId=${item.seqId}&type=${item.type||'ARTICLE'}`,
						})
					}
				}
			},
			// 新增名片
			addCard() {
				if(this.isDetail){ // 名片为详情时，不能新增
					this.isDetail = false;
					return;
				}
				// 下面这些数据还获取不到，写死提交
				this.cardDetail.logo = this.cardDetail.picUrl;
				this.cardDetail.wxQrCode = 'this.cardDetail.wxQrCode';
				this.cardDetail.gzhQrCode = 'this.cardDetail.gzhQrCode';
				this.cardDetail.appQrCode = 'this.cardDetail.appQrCode';
				this.cardDetail.mpQrCode = 'this.cardDetail.mpQrCode';
				this.cardDetail.musicUrl = 'this.cardDetail.musicUrl';
				this.$api.post('/o2oVisitingCard/update', this.cardDetail).then(res => {
					let data = res.data;
					if (res.code === 200) {
						uni.showToast({
							title: '名片保存成功！',
							duration: 2000
						});
						this.getByPk(res.data.seqId);
						this.isDetail = true;
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
	overflow: hidden;
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
		transition: bottom 0.5s;
		.card-detail-top {
			width: 100%;
			left: 0;
			height: 45rpx;
			position: absolute;
			top: -44rpx;
			text-align: center;
			vertical-align: bottom;
			background-color: rgba(0,0,0,0.65);
			border-radius: 50% / 100% 100% 0 0;
			image {
				margin-top: 28rpx;
				width: 54rpx;
				height: 37rpx;
				transition: transform 0.5s;
			}
		}
		&.down {
			bottom: -350rpx;
			.card-detail-top {
				image {
					transform: rotate(180deg);
				}
			}
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
						font-size: 47rpx;
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
						font-size: 30rpx;
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
					width: 19rpx;
					height: 19rpx;
					margin-right: 20rpx;
					&.icon-email{
						width: 18rpx;
						height:15rpx;
					}
					&.icon-location{
						width: 17rpx;
						height:24rpx;
					}
				}
				input {
					display: inline-block;
					line-height: 23rpx;
					width: 360rpx;
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
					color: #ffffff;
					font-size: 24rpx;
					.card-extend-item-box-bg {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50rpx;
						position: relative;
						margin: 0 auto;
						image {
							display: inline-block;
							margin: 25rpx auto;
							width: 50rpx;
							height: 50rpx;
						}
						.card-extend-add {
							width: 100rpx;
							height: 100rpx;
							position: relative;
							&:before{
								content: '';
								position: absolute;
								height: 10rpx;
								width: 50rpx;
								left: 25rpx;
								top: 45rpx;
								border-radius: 5rpx;
								background-color: #fff;
							}
							&:after {
								content: '';
								position: absolute;
								left: 45rpx;
								top: 25rpx;
								height: 50rpx;
								width: 10rpx;
								border-radius: 5rpx;
								background-color: #fff;
							}
						}
						.card-extend-close {
							position: absolute;
							top: 0rpx;
							right: 0rpx;
							width: 30rpx;
							height: 30rpx;
							padding: 10rpx;
							view {
								width: 30rpx;
								height: 30rpx;
								background: #fff;
								color: #666666;
								line-height: 30rpx;
								border-radius: 15rpx;
							}
						}
					}
					text {
						display: block;
						margin-top: 16rpx;
						line-height: 24rpx;
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
