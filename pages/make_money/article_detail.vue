<template>
	<view class="box" id="box">
		<view :class="{'article-hidden':!article.articleContent}">
			<view class="top-title font-bold">
				{{article.articleTitle}}
			</view>
			<view class="author">
				<image lazy-load class="img" :src="article.headPortrait" mode="" lazy-load></image>
				<view class="name">
					{{article.customerName}}
				</view>
			</view>
			<view class="author author-time">
				<view class="img time-img" src="" mode=""></view>
				<view class="name">
					{{article.issuedDate}}
				</view>
			</view>
			<jyf-parser class="good-detail" :html="article.articleContent" @linkpress="linkpress" lazy-load ref="article" selectable
			 show-with-animation use-anchor>加载中...</jyf-parser>
			<!-- 底部浏览量 -->
			
			
			<view class="clear"></view>
			<view class="ad-content">
				<view class="ad-line"></view>
				<view class="ad-text">广告</view>
				<view class="ad-line"></view>
			</view>
			<view class="adver-box">
				<view class="adver-sign">广告</view>
				<!-- 默认官方广告 -->
				<navigator url="/pages/index/area_new_people" v-if="cur_advert==0">
					<image lazy-load class="plateform-ad" src="../../static/images/adver-default.png" mode="aspectFill"></image>
				</navigator>
				<!-- 图文广告 -->
				<view class="advertise_display" v-if="cur_advert==1" @tap="copy(advert.advertisementLink,true)">
					<image lazy-load class="img-box" :src="advert.advertisementPic" mode="aspectFill"></image>
					<view class="right">
						<view class="title text font-bold">
							{{advert.advertisementTitle}}
						</view>
						<view class="desc text">
							{{advert.advertisementSynopsis}}
						</view>
						<view class="tips">
							推广
						</view>
					</view>
				</view>
				<!-- 图片广告 -->
				<view class="advertise_display" v-if="cur_advert==2"  @tap="copy(advert.advertisementLink,true)">
					<image lazy-load class="adver-img" :src="advert.advertisementPic" mode="aspectFill"></image>
				</view>
				<!-- 关注广告 -->
				<view class="advertise_focus" v-if="cur_advert==3" @tap="adverPop">
					<image lazy-load class="img-box" :src="advert.advertisementPic" mode="aspectFill"></image>
					<view class="right">
						<view class="l">
							<view class="title text font-bold">
								{{advert.advertisementTitle}}
							</view>
							<view class="desc text">
								{{advert.advertisementExplain}}
							</view>
						</view>
						<view class="tips">
							+关注
						</view>
					</view>
				</view>
				<!-- 电话广告 -->
				<view class="advertise_phone" v-if="cur_advert==4" @tap="callPhone(advert.phone)">
					<image lazy-load class="img-box" :src="advert.advertisementPic" mode="aspectFill"></image>
					<view class="right">
						<view class="l">
							<view class="title text font-bold">
								{{advert.advertisementTitle}}
							</view>
							<view class="desc text">
								{{advert.advertisementExplain}}
							</view>
						</view>
						<view class="tips">
							<view class="iconfont icondianhua"></view>
							拨打
						</view>
					</view>
				</view>
				<!-- 名片广告 -->
				<view class="advertise_display_card" v-if="cur_advert==5" @tap="adverCard" :style="{backgroundImage:'url('+advert.backdropPic+')'}">
					<view class="name-box">
						<image lazy-load class="avatar" :src="advert.advertisementPic" mode="aspectFill"></image>
						<view class="name-text">
							<view class="name">{{advert.name}}</view>
						</view>
					</view>
					<view class="phone-box">
						<view class="left">
							<view class="phone-line">
								<text class="iconfont icondianhua"></text>
								{{advert.phone}}
							</view>
							<view class="phone-line">
								<text class="iconfont iconweixin1"></text>
								{{advert.weChatNum}}
							</view>
						</view>
						<view class="right">
							<view class="tips">
								扫描二维码加我咨询
							</view>
							<image lazy-load class="adqrcode-img"  :src="advert.qrCode" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 点击广告弹框 -->
		<uni-modal class="uni-modal-box" v-if="adpop_show">
			<div class="uni-mask" @tap="adpop_show=false"></div>
				<view class="qrcode-img">
					<image lazy-load @tap="saveImg" class="img" :src="ad_qrcode" />
					<view class="tips">
						说明：点击保存二维码
					</view>
				</view>
		</uni-modal>
		
	</view>
</template>

<script>
	import jyfParser from '@/components/jyf-parser/jyf-parser';
	import {
		mapState
	} from 'vuex';
	let seqId = ""; //文章id
	let offerRewardSeqId = ""; //悬赏id
	let popularizeSeqId=""//推广id
	let sharebtn = "";
	let articleCode = ""; //分享人code
	let customerSeqId = "";
	let provider = "";
	let code = "";
	export default {
		data() {
			return {
				article: {},
				cur_advert: "-1",
				advert_map:{
					"IMAGE_TEXT_ADVERTISEMENT":1,
					"PICTURE_ADVERTISEMENT":2,
					"FOLLOW_ADVERTISEMENT":3,
					"TELEPHONE_ADVERTISEMENT":4,
					"BUSINESS_CARD_ADVERTISEMENT":5
				},
				isPraise: false,
				itemtitle: '',
				itemprice: '',
				itempic: '',
				articlePic: "",
				pop_show: false,
				qrcodeSrc: "",
				canvasSrc:"",
				share_params: "",
				nickName:"",
				deliveryFlag: false,
				canvasFlag: true,
				posterData:{},
				adpop_show:false,//广告弹框
				ad_qrcode:"",//广告弹框二维码
				advert:{
					advertisementExplain: "",
					advertisementLink: null,
					advertisementPic: "",
					advertisementSynopsis: null,
					advertisementTitle: "",
					advertisementType: "",
					backdropPic: null,
					createBy: null,
					customerName: "",
					customerSeqId: "",
					intactAdvertisement: null,
					name: null,
					phone: null,
					qrCode: "",
					remarks: null,
					seqId: "",
					updateBy: null,
					weChatNum: null
				}
			}
		},
		computed: {
			...mapState({
				user_state: state => state.user,
			})
		},
		onLoad(option) {
			if(option.url){
			}else {
				seqId = option.seqId; //文章id
				offerRewardSeqId=option.offerRewardSeqId
				this.loadDetail()
			}
			
		},

		components: {
			jyfParser,
		},

		methods: {
			loadDetail() {
				let self = this;
				this.$api.get('/o2oMyArticle/getArticleInfo', {
					params: {
						seqId: seqId,
						offerRewardSeqId: offerRewardSeqId,
					}
				}).then(res => {
					if (res.code == 200) {
						let data = res.data;
						this.article = data;
						data.praiseNum = data.praiseNum == null ? 0 : data.praiseNum;
						this.articlePic = this.article.articlePic;
						this.getAdver(data.advertisementSeqId)
					}
				})
			},
			linkpress(e) {
				this.copy(e.href,true)
			},
			// 复制
			copy(data,isUrl=false){
				let self=this;
				// #ifndef H5
				uni.setClipboardData({
				    data: data,
				    success: function () {
						uni.hideToast()//隐藏提示
						let msg=isUrl?"链接复制成功，请将链接复制到浏览器查看":"微信号码复制成功，请打开微信添加"
						self.$box.confirm(msg,false)
				    }
				});
				// #endif
			},
			// 打电话
			callPhone(phone) {
				let self=this;
				uni.showModal({
					content: "是否拨打电话 " + phone + "?",
					success(res) {
						if (res.confirm) {
							uni.makePhoneCall({
								phoneNumber: phone,
								success: (res) => {},
								fail: (res) => {
									uni.showToast({
										title: "拨号失败，请稍后重试"
									});
									console.log(res);
								}
							});
						}
					}
				})
			},
			// 广告弹出二维码
			adverPop(img){
				this.adpop_show=true;
				this.ad_qrcode=this.advert.qrCode
			},
			adverCard(){
				let self=this;
				uni.showActionSheet({
					title: '',
					itemList: ['打电话','添加微信','保存二维码'],
					success: (e) => {
						console.log(e);
						if(e.tapIndex==0){
							self.callPhone(self.advert.phone)
						}else if(e.tapIndex==1){
							self.copy(self.advert.weChatNum)
						}else if(e.tapIndex==2){
							self.ad_qrcode=self.advert.qrCode
							self.adverPop()
						}
					}
				})
			},
			
			getAdver(seqId){
				if(seqId){
					this.$api.get('/o2oAdvertisementSnapshot/getByPk',{
						params:{
							seqId:seqId
						}
					}).then(res=>{
						if(res.code==200&&res.data!=null){
							this.advert=res.data;
							let advertisementType=res.data.advertisementType
							this.cur_advert=this.advert_map[advertisementType]
						}else {
							this.cur_advert=0
						}
					})
				}else{
					this.cur_advert=0
				}
				
			},
			// 保存图片
			saveImg() {
				let self = this;
				uni.showActionSheet({
					title: '标题',
					itemList: ['保存图片到本地'],
					success: (e) => {
						uni.saveImageToPhotosAlbum({
							filePath: self.ad_qrcode,
							success: function() {
								self.$box.confirm('已保存到本地相册，请打开相册查看',false);
								this.adpop_show=false
							},
							fail: function(err) {
								self.saveImgFail(err)
							}
						});
					}
				})
			},
			// 保存图片失败
			saveImgFail(err) {
				if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg ===
					"saveImageToPhotosAlbum:fail authorize no response" || err.errMsg ===
					"saveImageToPhotosAlbum:fail auth denied") { // 没有授权，重新授权，兼容iso和Android
					uni.showModal({
						title: '授权提示',
						content: "是否允许获取保存相册权限",
						success: (res) => {
							if (res.confirm) { // 点击确定，则调用相册授权
								uni.openSetting({
									success(settingdata) {
										if (settingdata.authSetting["scope.writePhotosAlbum"]) {
											uni.showToast({
												title: '获取权限成功，再次点击图片保存到相册'
											});
										} else {
											console.log("获取权限失败")
											uni.showToast({
												title: '请确定已打开保存权限',
												icon: "none"
											});
										}
									}
								})
							}
						}
					})
				} else if (err.errMsg === "saveImageToPhotosAlbum:fail file not found" || err.errMsg ===
					"saveImageToPhotosAlbum:fail file not exists" || err.errMsg ===
					"saveImageToPhotosAlbum:fail get file data fail"
				) { // 无图片，则提示
					uni.showToast({
						title: '暂无图片',
						icon: "none"
					});
				}
			}
		}
	}

	function getQueryString(url, name) {
		var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
		var r = url.substr(1).match(reg)
		if (r != null) {
			return r[2]
		}
		return null;
	}
</script>

<style lang="scss">
	.share-pro{
	    display: flex;
	    align-items: center;
	    justify-content: flex-end;
	    flex-direction: column;
	    z-index: 5;
	    line-height: 1;
	    box-sizing: border-box;
	    .share-pro-mask{
	        width: 100%;
	        height: 100%;
	        position: fixed;
	        top: 0;
	        right: 0;
	        bottom: 0;
	        left: 0;
	        background: rgba(0, 0, 0, 0.5);
	    }
	    .share-pro-dialog {
	        width: 750rpx;
	        height: 310rpx;
	        overflow: hidden;
	        background-color: #fff;
	        border-radius: 24rpx 24rpx 0px 0px;
	        position: relative;
	        box-sizing: border-box;
	        position: fixed;
	        bottom: 0;
	        .close-btn {
	            padding: 20rpx 15rpx;
	            position: absolute;
	            top: 0rpx;
	            right: 29rpx;
	        }
	        .share-pro-title {
	            font-size: 28rpx;
	            color: #1c1c1c;
	            padding: 28rpx 41rpx;
	            background-color: #f7f7f7;
	        }
	
	        .share-pro-body{
	            display: flex;
	            flex-direction: row;
	            justify-content:space-around;
	            font-size: 28rpx;
	            color: #1c1c1c;
	            .share-item{
	                display: flex;
	                flex-direction:column;
	                justify-content: center;
	                justify-content:space-around;
	                .share-icon{
	                    text-align:center;
	                    font-size: 70rpx;
	                    margin-top: 39rpx;
	                    margin-bottom: 16rpx;
	                    color: #42ae3c;
	                }
	                &:nth-child(2){
	                    .share-icon{
	                        color: #ff5f33;
	                    }
	                }
	            }
	        }
	    }
	
	    /* 显示或关闭内容时动画 */
	
	    .open {
	        transition: all 0.3s ease-out;
			transform: translateY(0);
	    }
	
	    .close {
	        transition: all 0.3s ease-out;
			transform: translateY(310rpx);
	    }
	
	}
	 .canvas{
	    position: fixed !important;
	    top: 0 !important;
	    left: 0 !important;
	    display: block !important;
	    width: 100% !important;
	    height: 100% !important;
	    z-index: 10;
	}
	
	
	
	
	.canvas-hidden {
		position: fixed;
		z-index: -10;
		left: -9999px;
	}
	.uni-modal-box {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 999;
		display: block;
		box-sizing: border-box;
	}

	.uni-mask {
		position: fixed;
		z-index: 999;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .6);
	}

	.uni-modal-box .uni-modal {
		position: fixed;
		z-index: 999;
		width: 80%;
		max-width: 600rpx;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		background-color: #fff;
		text-align: center;
		border-radius: 6rpx;
		overflow: hidden;
	}

	.uni-modal-box .uni-modal__hd {
		padding: 1em 1.6em .3em;
	}

	.uni-modal-box .uni-modal__bd {
		padding: 1.3em 1.6em 1.3em;
		min-height: 80rpx;
		font-size: 30rpx;
		line-height: 1.4;
		color: #999;
		max-height: 800rpx;
		overflow-y: auto;
	}

	.uni-modal-box .uni-modal__ft {
		position: relative;
		line-height: 96rpx;
		font-size: 36rpx;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
	}

	.uni-modal-box .uni-modal__btn {
		display: block;
		flex: 1;
		text-decoration: none;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		position: relative;
	}

	.uni-modal__btn_primary {
		color: $color-primary;
	}

	.qrcode-img {
		position: fixed;
		z-index: 1000;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		justify-content: center;
		flex-wrap: wrap;

		.img {
			width: 500rpx;
			height: 500rpx;
		}

		.tips {
			width: 100%;
			text-align: center;
			color: white;
			font-size: 22rpx;
			margin-top: 10rpx;
		}
	}


	.edit-btn {
		width: 200rpx;
		margin: 30rpx 0;
		float: right;
		clear: both;
	}

	.clear {
		width: 100%;
		height: 1rpx;
		clear: both;
	}

	.login-box {
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		margin: 100rpx auto;

		.no-login {
			width: 200rpx;
			height: 160rpx;
		}
	}

	.confirm-btn {
		width: 100%;
		background: #ffa098;
		margin: 20px auto;
		height: 30px;
		line-height: 30px;
		border-radius: 50px;
		font-size: 28rpx;
		padding: 0;
		font-weight: bold;
		color: white;
		text-align: center;
		cursor: pointer;
	}

	.article-hidden {
		visibility: hidden !important;
	}

	.advertise_display {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		background: #fff;
		padding: 20rpx 30rpx;
		border-radius: 10rpx;

		.img-box {
			width: 160rpx;
			height: 160rpx;
			flex-shrink: 0;
			margin-right: 40rpx;
		}

		.right {
			flex-grow: 1;
			height: 124rpx;
			display: flex;
			flex-wrap: wrap;
			align-content: flex-start;
			position: relative;

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
				height: 64rpx;
				color: #666666;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.tips {
				position: absolute;
				right: 0;
				bottom: -36rpx;
				width: 80rpx;
				height: 36rpx;
				border: 2px solid rgba(245, 90, 77, 1);
				border-radius: 4rpx;
				color: #F55A4D;
				font-size: 26rpx;
				text-align: center;
				line-height: 36rpx;
			}
		}

		.adver-img {
			width: 100%;
			height: 200rpx;
		}
	}

	// 关注广告
	.advertise_focus {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		background: #fff;
		padding: 20rpx 30rpx;
		border-radius: 10rpx;

		.img-box {
			width: 160rpx;
			height: 160rpx;
			flex-shrink: 0;
			margin-right: 40rpx;
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
			}
		}
	}

	// 电话广告
	.advertise_phone {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		background: #fff;
		padding: 20rpx 30rpx;
		border-radius: 10rpx;

		.img-box {
			width: 160rpx;
			height: 160rpx;
			flex-shrink: 0;
			margin-right: 40rpx;
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

				.iconfont {
					font-size: 20rpx;
					margin-right: 2rpx;
				}
			}
		}
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
		background: url('@/static/images/adver-card-bg.png');
		background-repeat: no-repeat;
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
	
				.adqrcode-img {
					width: 186rpx;
					height: 186rpx;
					margin-top: 15rpx;
				}
			}
		}
	}
.ad-content {
			display: flex;
			margin-top: 30rpx;
			.ad-line {
				flex: 1;
				height: 14rpx;
				border-bottom: 1px solid #ccc;
			}
		
			.ad-text {
				width: 100rpx;
				font-size: 20rpx;
				text-align: center;
				height: 30rpx;
				line-height: 30rpx;
			}
		}
	.adver-box {
		width: 100%;
		margin-top: 40rpx;
		position: relative;
		.adver-sign {
			position: absolute;
			right: 30rpx;
			top: 20rpx;
			border: 1px solid $color-primary;
			border-radius: 10rpx;
			font-size: 16rpx;
			padding: 0rpx 4rpx;
			color: $color-primary;
			z-index: 10;
			
		}
		.plateform-ad {
			width: 100%;
			height: 140rpx;
			border-radius: 14rpx;
		}
	}

	.box {
		padding: 20rpx 30rpx;
	}

	.top-title {
		font-size: 44rpx;
		color: #3D3D3D;
	}

	.author {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		color: #B3B3B3;
		margin-top: 45rpx;

		.img {
			width: 68rpx;
			height: 68rpx;
			background: rgba(153, 153, 153, 0.8);
			border-radius: 50%;
			margin-right: 16rpx;
		}

	}

	.author-time {
		margin-top: 0;
		margin-bottom: 30rpx;

		.time-img {
			height: 20rpx;
			visibility: hidden;
		}
	}

	.article-content {
		font-size: 30rpx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 50rpx;
		margin: 30rpx 0;
		text-indent: 60rpx;
	}

	.copy-tips {
		font-size: 24rpx;
		color: #B3B3B3;
		margin-top: 30rpx;
	}

	.operate-area {
		display: flex;
		justify-content: space-between;
		font-size: 22rpx;
		color: #666666;

		.operate-li {
			display: flex;
			align-items: center;

			.iconfont {
				margin-right: 10rpx;
				font-size: 30rpx;
				color: #666666;
			}
			.icondianzan1 {
				font-size: 34rpx;
			}
			.active {
				color: $color-primary;
			}
		}

		.primary-border {
			border: 1px solid rgba(153, 153, 153, 1);
			padding: 4rpx 10rpx;
			color: #666666;

			.iconfont {
				color: #FA6A23;
			}
		}
	}

	.make-btn {
		text-align: center;
		width: 124rpx;
		height: 124rpx;
		background: rgba(255, 158, 151, 1);
		border-radius: 50%;
		font-size: 24rpx;
		color: white;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		align-content: center;
		justify-content: center;
		position: fixed;
		top: 50%;
		right: 0;
		margin-top: -62rpx;
		.text {
			width: 100%;
		}
		.iconfont {
			font-size: 50rpx;
			width: 100%;
			text-align: center;
		}

	}
</style>
