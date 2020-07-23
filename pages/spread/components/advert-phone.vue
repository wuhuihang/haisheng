<template>
	<view class="box">
		<title-line :title-list="title_list1" @titleChoose="myAdver" :curTitle='cur_title'></title-line>
		<template v-if="cur_title==0">
			<view class="advertise_display">
				<image lazy-load class="img-box" v-if="advertisementPic" :src="advertisementPic" mode="aspectFill"></image>
				<image lazy-load class="img-box" v-else src="/static/images/adver-pic-avatar.png" mode="aspectFill"></image>
				<view class="right">
					<view class="l">
						<view class="title text font-bold">
							{{advertisementTitle?advertisementTitle:"广告标题"}}
						</view>
						<view class="desc text">
							{{advertisementExplain?advertisementExplain:"广告说明"}}
						</view>
					</view>
					<view class="tips">
						<view class="iconfont icondianhua"></view>
						拨打
					</view>
				</view>
			</view>
			<title-line :titleList="title_list2"></title-line>
			<view class="make-box">
				<view class="photo_default">
					<view class="default_text" v-if="!advertisementPic" @tap="chooseImage('advertisementPic')">
						点击上传头像
					</view>
					<image v-else class="default_text" :src="advertisementPic" mode="aspectFill"></image>
					<view @tap="advertisementPic=''" v-if="advertisementPic" class="iconfont iconcuowu"></view>
				</view>
				<view class="input-box">
					<view class="input-line">
						<view class="title font-bold">
							标题
						</view>
						<input class="input" v-model="advertisementTitle" maxlength="12" type="text" placeholder="请输入广告标题">
					</view>
					<view class="input-line">
						<view class="title font-bold">
							说明
						</view>
						<input class="input" v-model="advertisementExplain" maxlength="12" type="text" placeholder="请输入广告说明">
					</view>
					<view class="input-line">
						<view class="title font-bold">
							电话
						</view>
						<input class="input" v-model="phone" maxlength="11" type="text" placeholder="请输入电话号码">
					</view>
				</view>
				<view class="btn" @tap="insert">保存</view>
			</view>
		</template>
		<template v-else>
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="advertise-box" v-for="(item,k) in adver_list" :key="k">
					<view class="advertise_display">
						<view class="img-box">
							<u-lazy-load threshold="0" height="160" border-radius="100" :image="item.advertisementPic" :index="k"></u-lazy-load>
						</view>
						<!-- <image lazy-load class="img-box" :src="item.advertisementPic" mode="aspectFill"></image> -->
						<view class="right">
							<view class="l">
								<view class="title text font-bold">
									{{item.advertisementTitle}}
								</view>
								<view class="desc text">
									{{item.advertisementExplain}}
								</view>
							</view>
							<view class="tips">
								<view class="iconfont icondianhua"></view>
								拨打
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
				"advertisementPic": "", //图片
				"advertisementTitle": "", //标题 
				"advertisementExplain": "", //说明
				"phone": "", //说明
				"advertisementType": "TELEPHONE_ADVERTISEMENT", //广告类型
				"customerSeqId": this.$common.getLocalSync('customerSeqId'), //会员id
				seqId: "",
				adver_list: [],
				loading: false
			}
		},
		components: {
			titleLine,
			MescrollBody
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
					"advertisementPic": this.advertisementPic, //图片
					"advertisementExplain": this.advertisementExplain, //说明
					"advertisementTitle": this.advertisementTitle, //标题 
					"advertisementType": this.advertisementType, //广告类型
					"customerSeqId": this.customerSeqId, //会员id
					"phone": this.phone, //电话
					"seqId": this.seqId
				}).then(res => {
					this.loading = false;
					if (res.code == 200) {
						let msg = this.seqId ? "广告编辑成功" : "广告制作成功"
						this.$box.toast(msg);
						this.seqId = "";
						this.advertisementExplain = ""
						this.advertisementPic = ""
						this.phone = ""
						this.advertisementTitle = ""
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
				this.phone = the_adver.phone; //电话
				this.advertisementPic = the_adver.advertisementPic; //图片
				this.advertisementExplain = the_adver.advertisementExplain; //说明
				this.advertisementTitle = the_adver.advertisementTitle; //标题 
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

	.advertise_display {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		background: #fff;
		padding: 20rpx 16rpx;
		border-radius: 10rpx;
		margin-bottom: 30rpx;

		.img-box {
			width: 160rpx;
			height: 160rpx;
			flex-shrink: 0;
			margin-right: 24rpx;
			border-radius: 100%;
		}

		.right {
			flex-grow: 1;
			height: 124rpx;
			height: 160rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.l {
				height: 120rpx;
				display: flex;
				align-content: space-between;
				flex-wrap: wrap;
			}

			.text {
				width: 100%;
				font-size: 26rpx;
			}

			.title {
				height: 50rpx;
				line-height: 50rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-top: -10rpx;
			}

			.desc {
				color: #666666;
				overflow: hidden;
			}

			.tips {
				width: 98rpx;
				height: 46rpx;
				line-height: 46rpx;
				border: 2rpx solid rgba(245, 90, 77, 1);
				border-radius: 22rpx;
				color: #F55A4D;
				text-align: center;
				font-size: 26rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-shrink: 0;

				.iconfont {
					font-size: 20rpx;
					margin-right: 2rpx;
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
		height: 600rpx;

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
					height: 80rpx;
					line-height: 80rpx;
					flex-shrink: 0;
				}

				.input {
					height: 80rpx;
					line-height: 80rpx;
					flex-grow: 1;
					font-size: 26rpx;
				}
			}
		}

		.photo_default {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			justify-content: center;
			cursor: pointer;
			width: 470rpx;
			margin: 0 auto;
			position: relative;

			.default_icon {
				width: 53rpx;
				height: 46rpx;
				text-align: center;
				margin: 0 auto;
			}

			.default_img {
				width: 220rpx;
				height: 200rpx;
			}

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
				width: 220rpx;
				height: 220rpx;
				line-height: 220rpx;
				text-align: center;
				color: #666;
				font-size: 20rpx;
				background: rgba(240, 240, 240, 1);
			}

			.img {
				width: 100%;
				height: 100%;
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

		.btn {
			position: absolute;
			bottom: 20rpx;
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
