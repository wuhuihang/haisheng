<template>
	<view class="box">
		<title-line :title-list="title_list1" @titleChoose="myAdver" :curTitle='cur_title'></title-line>
		<template v-if="cur_title==0">
			<view class="advertise_display_card" :style="{backgroundImage:bgStyle}">
				<view class="name-box">
					<image lazy-load class="avatar" v-if="advertisementPic" :src="advertisementPic" mode="aspectFill"></image>
					<image lazy-load class="avatar" v-else src="/static/images/adver-pic-avatar.png" mode="aspectFill"></image>
					<view class="name-text">
						<view class="name"> {{name?name:"姓名"}}</view>
					</view>
				</view>
				<view class="phone-box">
					<view class="left">
						<view class="phone-line">
							<text class="iconfont icondianhua"></text>
							{{phone?phone:"电话号码"}}
						</view>
						<view class="phone-line">
							<text class="iconfont iconweixin1"></text>
							{{weChatNum?weChatNum:"微信号"}}
						</view>
					</view>
					<view class="right">
						<view class="tips">
							长按二维码加我咨询
						</view>
						<image lazy-load class="qrcode-img" v-if="qrCode" :src="qrCode" mode="aspectFill"></image>
						<image lazy-load class="qrcode-img" v-else src="/static/images/adver-pic-avatar.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<title-line :titleList="title_list2"></title-line>
			<view class="make-box">
				<view class="photo_default">
					<view class="photo-li">
						<view class="default_text" v-if="!advertisementPic" @tap="chooseImage('advertisementPic')">
							点击上传头像
						</view>
						<image class="default_text" v-if="advertisementPic" :src="advertisementPic" mode="aspectFill"></image>
						<view v-if="advertisementPic" @tap="advertisementPic=''" class="iconfont iconcuowu"></view>
					</view>
					<view class="photo-li">
						<view class="default_text" v-if="!qrCode" @tap="chooseImage('qrCode')">
							上传二维码
						</view>
						<image class="default_text" v-if="qrCode" :src="qrCode" mode="aspectFill"></image>
						<view v-if="qrCode" @tap="qrCode=''" class="iconfont iconcuowu"></view>
					</view>
					<view class="photo-li">
						<view class="default_text" v-if="!backdropPic" @tap="chooseImage('backdropPic')">
							上传背景图
						</view>
						<image class="default_text" v-if="backdropPic" :src="backdropPic" mode="aspectFill"></image>
						<view v-if="backdropPic" @tap="backdropPic=''" class="iconfont iconcuowu"></view>
					</view>
				</view>
				<view class="input-box">
					<view class="input-line">
						<view class="title font-bold">
							姓名
						</view>
						<input class="input" v-model="name" maxlength="13" type="text" placeholder="请输入姓名">
					</view>
					<view class="input-line">
						<view class="title font-bold">
							手机
						</view>
						<input class="input" v-model="phone" maxlength="11" type="text" placeholder="请输入手机号">
					</view>
					<view class="input-line">
						<view class="title font-bold">
							微信
						</view>
						<input class="input" v-model="weChatNum" maxlength="22" type="text" placeholder="请输入微信号">
					</view>
				</view>
				<view class="btn" @tap="insert">保存</view>
			</view>
		</template>
		<template v-else>
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view v-for="(item,k) in adver_list" :key="k" class="advertise-box">
				<view class="advertise_display_card" :style="{backgroundImage:`url(${item.backdropPic})`}">
					<view class="name-box">
						<image lazy-load class="avatar" :src="item.advertisementPic" mode="aspectFill"></image>
						<view class="name-text">
							<view class="name"> {{item.name}}</view>
						</view>
					</view>
					<view class="phone-box">
						<view class="left">
							<view class="phone-line">
								<text class="iconfont icondianhua"></text>
								{{item.phone}}
							</view>
							<view class="phone-line">
								<text class="iconfont iconweixin1"></text>
								{{item.weChatNum}}
							</view>
						</view>
						<view class="right">
							<view class="tips">
								长按二维码加我咨询
							</view>
							<image lazy-load class="qrcode-img" :src="item.qrCode" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<view class="edit-area">
					<view class="edit-li text-pink" @tap="editAdver(k)">
						<view class="iconfont iconbianji1">
						</view>
						编辑
					</view>
					<view class="edit-li text-blue" @tap="deleteAdver(k)">
						<view class="iconfont iconshanchu">
						</view>
						删除
					</view>
				</view>
				</view>
			</mescroll-body>
		</template>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
	import titleLine from '@/components/title-line.vue'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				title_list1: [{
					'title': '广告效果',
					'id': '0'
				}, {
					'title': '我的广告',
					'id': '1'
				}],
				title_list2: [{
					'title': '制作广告',
					'id': '0'
				}],
				cur_title: 0,
				api_url: this.$webconfig.api_url,
				"advertisementType": "BUSINESS_CARD_ADVERTISEMENT", //广告类型
				"customerSeqId": this.$common.getLocalSync('customerSeqId'), //会员id
				"advertisementPic": "", //头像
				"backdropPic": "", //背景图
				"qrCode": "",
				"name": "",
				"phone": "",
				"weChatNum": "",
				seqId: "",
				adver_list: [],
				loading: false
			}
		},
		components: {
			titleLine,
			MescrollBody
		},
		computed: {
			bgStyle() {
				let url = 'url(' + require("@/static/images/adver-card-bg.png") + ')'
				if (this.backdropPic) {
					url = 'url(' + this.backdropPic + ')'
				}
				return url
			}
		},
		onLoad() {

		},
		methods: {
			// 上传图片
			chooseImage(item) {
				let self = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: (res) => {
						var imageSrc = res.tempFilePaths[0]
						uni.uploadFile({
							url: self.api_url + '/sys/appeal/imgUpload',
							filePath: imageSrc,
							header: {
								Authorization: self.$common.getLocalSync('token')
							},
							name: 'file',
							success: (res) => {
								if (res.statusCode == 200) {
									let data = JSON.parse(res.data)
									if (data.code == 200) {
										self[item] = data.data.viewUrl;
									} else {
										self.$box.toast('上传失败', 'none')
									}
								} else {
									self.$box.toast('上传失败', 'none')
								}

							},
							fail: (err) => {
								console.log('uploadImage fail', err);
								uni.showModal({
									content: err.errMsg,
									showCancel: false
								});
							}
						});
					},
					fail: (err) => {
						console.log('chooseImage fail', err)
					}
				})
			},
			// 保存广告
			insert() {
				if (this.loading) return;
				let url = '/o2oMyAdvertisement/insert1';
				if (this.seqId) {
					url = '/o2oMyAdvertisement/update1';
				}
				this.loading = true;
				this.$api.post(url, {
					"backdropPic": this.backdropPic, //链接
					"advertisementPic": this.advertisementPic, //图片
					"qrCode": this.qrCode, //简介
					"name": this.name, //标题 
					"phone": this.phone, //标题 
					"weChatNum": this.weChatNum, //标题 
					"advertisementType": this.advertisementType, //广告类型
					"customerSeqId": this.customerSeqId, //会员id
					"seqId": this.seqId
				}).then(res => {
					this.loading = false;
					if (res.code == 200) {
						let msg = this.seqId ? "广告编辑成功" : "广告制作成功"
						this.$box.toast(msg);
						this.seqId = "";
						this.advertisementPic = ""
						this.backdropPic = ""
						this.qrCode = ""
						this.name = ""
						this.phone = ""
						this.weChatNum = ""
					}
				}).catch(err => {
					this.loading = false;
				})
			},
			// 我的广告
			myAdver(e) {
				let self = this;
				this.cur_title = e.id;
				this.$nextTick(function() {
					self.mescroll.resetUpScroll(true);
				})
			},
			// 我的广告列表
			upCallback(page) {
				if (this.cur_title != 1) return;
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				this.$api.get('/o2oMyAdvertisement/findPageListByStatus', {
					params: {
						customerSeqId: this.customerSeqId,
						advertisementType: this.advertisementType,
						pageno: pageNum,
						pagesize: pageSize
					}
				}).then((res) => {
					if (res.code && res.code != 200) {
						this.mescroll.endErr();
						return
					}
					this.$store.commit('saveAddress', {});
					let data = res;
					// 接口返回的当前页数据列表 (数组)
					let curPageData = data.list;
					// 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
					let curPageLen = curPageData.length;
					// 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
					let totalPage = data.pages;

					//设置列表数据
					if (page.num == 1) this.adver_list = []; //如果是第一页需手动置空列表
					this.adver_list = this.adver_list.concat(curPageData)
					// 请求成功,隐藏加载状态
					//方法一(推荐): 后台接口有返回列表的总页数 totalPage
					this.mescroll.endByPage(curPageLen, totalPage);
				})
			},
			editAdver(k) {
				let the_adver = this.adver_list[k]
				this.cur_title = 0;
				this.advertisementPic = the_adver.advertisementPic
				this.backdropPic = the_adver.backdropPic
				this.qrCode = the_adver.qrCode
				this.name = the_adver.name
				this.phone = the_adver.phone
				this.weChatNum = the_adver.weChatNum
				this.seqId = the_adver.seqId
			},
			// 删除广告
			deleteAdver(k) {
				this.$api.get('/o2oMyAdvertisement/delete1', {
					params: {
						seqId: this.adver_list[k].seqId
					}
				}).then(res => {
					if (res.code == 200) {
						this.adver_list.splice(k, 1)
						this.$box.confirm('删除成功', false)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.edit-area {
		display: flex;
		background: white;
		border-top: 1px solid #eee;
		height: 80rpx;

		.edit-li {
			width: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;

			.iconfont {
				margin-right: 20rpx;
			}
		}
	}

	.advertise-box {
		margin-bottom: 30rpx;
		background: #fff;
		border-radius: 10rpx;
	}
	.advertise-box {
		margin-bottom: 30rpx;
		background: white;
	}
	.advertise_display_card {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		align-items: center;
		background: #fff;
		border-radius: 10rpx;
		width: 642rpx;
		height: 360rpx;
		padding: 20rpx 20rpx;
		background: url('@/static/images/adver-card-bg.png') no-repeat;
		background-size:cover;
		background-position: center center; 


		.name-box {
			width: 100%;
			display: flex;
			align-items: center;
			font-size: 26rpx;

			.avatar {
				width: 124rpx;
				height: 124rpx;
				background: rgba(255, 255, 255, 1);
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.name-text {
				display: flex;
				align-content: space-between;
				flex-wrap: wrap;

				.name {
					width: 100%;
					font-size: 36rpx;
					font-weight: bold;
				}
			}
		}

		.phone-box {
			width: 100%;
			margin-top: 10rpx;
			display: flex;
			justify-content: space-between;

			.left {
				margin-top: 50rpx;

				.phone-line {
					.iconfont {
						display: inline-block;
						width: 48rpx;
						height: 48rpx;
						text-align: center;
						line-height: 48rpx;
						border-radius: 100%;
						background: rgba(51, 51, 51, 1);
						font-size: 30rpx;
						color: white;
						margin-right: 20rpx;
						font-weight: normal;
					}

					font-size:26rpx;
					font-weight: bold;
					margin-bottom: 38rpx;
				}
			}

			.right {
				width: 200rpx;
				flex-shrink: 0;
				font-size: 20rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;

				.qrcode-img {
					width: 186rpx;
					height: 186rpx;
					margin-top: 15rpx;
				}
			}
		}
	}

	.make-box {
		padding: 30rpx 40rpx;
		background: white;
		width: 602rpx;
		margin-top: 30rpx;
		border-radius: 10rpx;
		position: relative;
		height: 528rpx;

		.input-box {
			margin-top: 30rpx;

			.input-line {
				display: flex;
				justify-content: space-between;
				height: 80rpx;
				align-items: center;
				font-size: 26rpx;

				.title {
					width: 100rpx;
					flex-shrink: 0;
					height: 80rpx;
					line-height: 80rpx;
				}

				.input {
					flex-grow: 1;
					font-size: 26rpx;
					height: 80rpx;
					line-height: 80rpx;
				}
			}
		}

		.photo_default {
			display: flex;
			align-items: center;
			justify-content: space-between;
			cursor: pointer;
			width: 600rpx;
			margin: 0 auto;

			.photo-li {
				width: 180rpx;
				height: 120rpx;
				text-align: center;
				margin-top: 16rpx;
				color: #666;
				font-size: 20rpx;
				background: rgba(240, 240, 240, 1);
				position: relative;

				.iconcuowu {
					position: absolute;
					top: -16rpx;
					right: -10rpx;
					background: rgba(0, 0, 0, 0.8);
					border-radius: 100%;
					width: 36rpx;
					height: 36rpx;
					z-index: 1;
					color: white;
					font-size: 24rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.default_text {
					width: 100%;
					height: 100%;
					line-height: 120rpx;
					text-align: center;
					color: #666;
					font-size: 20rpx;
					background: rgba(240, 240, 240, 1);
				}

				.close_icon {
					width: 32rpx;
					height: 32rpx;
					position: absolute;
					top: -10rpx;
					right: -10rpx;
					z-index: 2;
					cursor: pointer;
				}
			}
		}

		.btn {
			position: absolute;
			bottom: 86rpx;
			left: 50%;
			margin-left: -94rpx;
			width: 188rpx;
			height: 52rpx;
			background: rgba(6, 6, 6, 1);
			border-radius: 26rpx;
			font-size: 30rpx;
			text-align: center;
			line-height: 52rpx;
			color: white;
		}
	}
</style>
