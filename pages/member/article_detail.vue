<template>
	<view class="box" id="box">
		<view :class="{'article-hidden':!article.articleContent}" v-if="is_login">
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
			<jyf-parser class="good-detail" :html="article.articleContent" lazy-load ref="article" selectable
			 show-with-animation use-anchor>加载中...</jyf-parser>
			<!-- 底部浏览量 -->
		</view>
		
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
				is_login: true,
				article: {},
				cur_advert: 10,
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
				posterData:{}
			}
		},
		computed: {
			...mapState({
				user_state: state => state.user,
			})
		},
		onLoad(option) {
			console.log(option);
				if(option.url){
					let url=option.url
					// let url="https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651238538&idx=2&sn=eb68221b315ec6d7d7afd0c544144572&chksm=bd49690e8a3ee018f78b01b4084d6edaeacfb3b15a0bb718a265141270d924365623fa145a66&scene=126&sessionid=1596513409&key=909afa0d496e3a5dc48257c8ef8bbcb0957dfec0347f0eb39e8580fbba73d244a17032a640bf8a54c9f2ef5d67012c77b8769f45562af3824ed3755a2b164e8629b4838a2ca207d56d7042889ef61867&ascene=1&uin=NzgyOTAxOTYy&devicetype=Windows+10+x64&version=62090529&lang=zh_CN&exportkey=ARKI3oWfoJ8SafdByaMXrVY%3D&pass_ticket=RGDfrsKpIbDgw6qUsvJfSe1pP%2Bq3hMtIGYuY9tOejEb0%2Fr8Lreku0iCAplznfeVI"
					this.getUrlArticle(url)
				}else {
					seqId = option.seqId; //文章id
					this.loadDetail()
				}
			
		},

		components: {
			jyfParser,
			hchPoster
		},
		methods: {
			getUrlArticle(url){
				this.$api.get('/o2oMyArticle/getHtmlByUrl',{
					params:{
						url:url
					}
				}).then(res=>{
					if(res.code==200){
						let data = res.data;
						this.article = data;
						console.log(this.article);
					}
				})
			},
			// 文章详情
			loadDetail() {
				let self = this;
				this.$api.get('/o2oMyArticle/getArticleInfo', {
					params: {
						seqId: seqId,
					}
				}).then(res => {
					if (res.code == 200) {
						let data = res.data;
						this.article = data;
						this.articlePic = this.article.articlePic;
					}
				})
			},
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
			width: 600rpx;
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
		align-items: center;
		background: #fff;
		border-radius: 10rpx;
		margin-bottom: 30rpx;
		width: 642rpx;
		height: 360rpx;
		padding: 20rpx 30rpx;
		background: url('@/static/images/adver-card-bg.png') no-repeat;
		background-size: 100% auto;

		.left {
			width: 400rpx;
			flex-shrink: 0;

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
					height: 90rpx;
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
				margin-top: 70rpx;

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
						margin-right: 24rpx;
					}

					font-size:26rpx;
					font-weight: bold;
					margin-bottom: 38rpx;
				}
			}
		}

		.right {
			flex-grow: 1;
			font-size: 20rpx;

			.qrcode-img {
				width: 186rpx;
				height: 186rpx;
				margin-top: 15rpx;
			}
		}
	}

	.blank {
		height: 300rpx;
	}

	.adver-box {
		width: calc(100% - 70rpx);
		position: fixed;
		bottom: 0;
		left: 50%;
		z-index: 10;
		bottom: 30rpx;
		transform: translateX(-50%);

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
