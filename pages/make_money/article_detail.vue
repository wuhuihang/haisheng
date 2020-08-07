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
			<view class="copy-tips" v-if="article.articleSource!='OFFICIAL'">
				本文由网友编辑推荐，如有侵权请联系我们删掉
			</view>
			<view class="edit-btn bg-btn" @tap="edit" v-if="article.articleSource!='OFFICIAL'">
				我也要制作
			</view>
			<view class="clear"></view>
			<view class="operate-area">
				<view class="operate-li">
					<view class="iconfont iconliulanliang"></view>
					<view class="num">
						{{article.readNum}}
					</view>
				</view>
				<view class="operate-li" @tap="getPraise">
					<view class="iconfont " :class="{'active icondianzan1':isPraise,'icondianzan':!isPraise}"></view>
					<view class="num" :class="{'active':isPraise}">
						{{article.praiseNum}}
					</view>
				</view>
				<view class="no-btn operate-li" >
					<button open-type="share" class="no-btn operate-li primary-border">
						<view class="iconfont iconfenxiang2"></view>
						<view class="num">
							分享
						</view>
					</button>
				</view>
				<navigator v-if="article.articleSource!='OFFICIAL'" hover-class="none" :url="'/pages/make_money/complaint?articleSeqId'+article.seqId+'&articleTitle='+article.articleTitle"
				 class="operate-li primary-border">
					<view class="iconfont icontousujianyi3x" style="color: #4872E5;"></view>
					<view class="num">
						投诉
					</view>
				</navigator>
			</view>
			<view class="adver-box">
				<view class="adver-sign">广告</view>
				<!-- 默认官方广告 -->
				<navigator url="/pages/index/area_new_people" v-if="cur_advert==6">
					<image lazy-load class="plateform-ad" src="../../static/images/activity_banner.png" mode="aspectFill"></image>
				</navigator>
				<!-- 图文广告 -->
				<view class="advertise_display" v-if="cur_advert==1" @tap="copy(url)">
					<image lazy-load class="img-box" src="/static/images/adver-pic-avatar.png" mode="aspectFill"></image>
					<view class="right">
						<view class="title text font-bold">
							广告标题
						</view>
						<view class="desc text">
							广告简介广告简介广告简介这还少积分地方和吉
						</view>
						<view class="tips">
							推广
						</view>
					</view>
				</view>
				<!-- 图片广告 -->
				<view class="advertise_display" v-if="cur_advert==2"  @tap="copy(url)">
					<image lazy-load class="adver-img" src="/static/images/adver-pic-bg.png" mode=""></image>
				</view>
				<!-- 关注广告 -->
				<view class="advertise_focus" v-if="cur_advert==3" @tap="adverPop(url)">
					<image lazy-load class="img-box" src="/static/images/adver-pic-avatar.png" mode="aspectFill"></image>
					<view class="right">
						<view class="l">
							<view class="title text font-bold">
								广告标题
							</view>
							<view class="desc text">
								广告简介
							</view>
						</view>
						<view class="tips">
							+关注
						</view>
					</view>
				</view>
				<!-- 电话广告 -->
				<view class="advertise_phone" v-if="cur_advert==4" @tap="callPhone(187)">
					<image lazy-load class="img-box" src="/static/images/adver-pic-avatar.png" mode="aspectFill"></image>
					<view class="right">
						<view class="l">
							<view class="title text font-bold">
								广告标题
							</view>
							<view class="desc text">
								有任何疑问请来电咨询
							</view>
						</view>
						<view class="tips">
							<view class="iconfont icondianhua"></view>
							拨打
						</view>
					</view>
				</view>
				<!-- 名片广告 -->
				<view class="advertise_display_card" v-if="cur_advert==5" @tap="adverCard">
					<view class="name-box">
						<image lazy-load class="avatar" src="/static/images/adver-pic-avatar.png" mode="aspectFill"></image>
						<view class="name-text">
							<view class="name"> 姓名</view>
						</view>
					</view>
					<view class="phone-box">
						<view class="left">
							<view class="phone-line">
								<text class="iconfont icondianhua"></text>
								电话号码
							</view>
							<view class="phone-line">
								<text class="iconfont iconweixin1"></text>
								微信号
							</view>
						</view>
						<view class="right">
							<view class="tips">
								扫描二维码加我咨询
							</view>
							<image lazy-load class="adqrcode-img"  src="/static/images/adver-pic-avatar.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="make-btn"  @tap="createCanvasImageEvn"> 
				<view class="text">分享</view>
				<view class="text">朋友圈</view>
			 </view>
		</view>
		<view class="login-box" v-if="!is_login">
			<image lazy-load class="no-login" src="/static/images/message-box-icon.png" mode="aspectFill"></image>
			<button class="no-btn confirm-btn" open-type="getUserInfo" @getuserinfo="wxLogin">请先登录</button>
		</view>
		<!-- 我的分享二维码 -->
		<canvas class="qrcode-canvas canvas-hidden" canvas-id="qrcode" />
		<!-- 分享弹窗-->
		<hchPoster ref="hchPoster" :canvasFlag.sync="canvasFlag" @cancel="canvasCancel" :posterObj.sync="posterData"/>
		<view :hidden="canvasFlag"><!-- 海报 要放外面放组件里面 会找不到 canvas-->
			<canvas class="canvas"  canvas-id="myCanvas" ></canvas><!-- 海报 -->
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
	import hchPoster from '@/components/hch-poster/hch-poster2.vue'
	import jyfParser from '@/components/jyf-parser/jyf-parser';
	import jwt_decode from "jwt-decode";
	import uQRCode from '@/common/js/uqrcode.js'
	import {
		getProvider,
		getCode
	} from '@/common/js/login/newlogin.js'
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
				cur_advert: 5,
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
				ad_qrcode:""//广告弹框二维码
			}
		},
		computed: {
			...mapState({
				user_state: state => state.user,
			})
		},
		onLoad(option) {
			// 是否登录
			if (option.q !== undefined) {
				// 通过朋友圈分享的二维码进入
				let q = decodeURIComponent(option.q);
				//截取参数 
				let share_url = getQueryString(q);
				seqId = getQueryString(q, "seqId"); //文章id
				offerRewardSeqId = getQueryString(q, "offerRewardSeqId")||""; //悬赏id
				popularizeSeqId=getQueryString(q, "popularizeSeqId")||""; //推广id
				articleCode = getQueryString(q, "articleCode"); //分享人code
			} else {
				// 自己进入或者好友分享进入
				seqId = option.seqId; //文章id
				offerRewardSeqId = option.offerRewardSeqId; //悬赏id
				popularizeSeqId = option.popularizeSeqId; //推广id
				articleCode = option.articleCode? option.articleCode : ""; //分享人code
				sharebtn = option.sharebtn ? option.sharebtn : ""; //文章列表点击分享跳过来
			}
			this.loadInfo()
		},
		onShow() {
			// #ifdef MP
			(async () => {
				//获取服务商信息
				provider = await getProvider();
				//获取code
				code = await getCode(provider[0])
			})()
			// #endif
		},
		components: {
			jyfParser,
			hchPoster
		},
		// #ifdef MP
		onShareAppMessage(res) {
			this.giveReward('SHARE');
			let path1='/pages/make_money/article_detail?seqId=' + seqId + '&offerRewardSeqId=' + offerRewardSeqId+'&articleCode='+this.user_state.shareCode;
			if(!offerRewardSeqId&&popularizeSeqId){
				path1='/pages/make_money/article_detail?seqId=' + seqId + '&popularizeSeqId=' + popularizeSeqId
			}
			return {
				title: this.article.articleTitle,
				path: path1,
				imageUrl: this.article.articlePic
			}
		},
		// #endif
		methods: {
			// 复制
			copy(data,isUrl=false){
				let self=this;
				// #ifndef H5
				uni.setClipboardData({
				    data: data,
				    success: function () {
						uni.hideToast()//隐藏提示
						let msg=isUrl?"链接复制成功，请打开浏览器查看":"微信号码复制成功，请打开微信添加"
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
				console.log('点击');
				
			},
			adverCard(){
				let self=this;
				uni.showActionSheet({
					title: '',
					itemList: ['打电话','添加微信','保存二维码'],
					success: (e) => {
						console.log(e);
						if(e.tapIndex==0){
							self.callPhone()
						}else if(e.tapIndex==1){
							self.copy()
						}else if(e.tapIndex==2){
							self.adverPop()
						}
					}
				})
			},
			createCanvasImageEvn(){
				// 这个是固定写死的小程序码
				Object.assign(this.posterData,
				{
					url:this.articlePic,//商品主图
					icon:this.articlePic,//醉品价图标
					title:this.article.articleTitle,//标题
					referrer:this.referrer,
					discountPrice:"",//折后价格
					orignPrice:"",//原价
					code:this.qrcodeSrc,//小程序码
				})
				this.$forceUpdate();//强制渲染数据
				setTimeout(()=>{
					this.canvasFlag=false;//显示canvas海报
					this.deliveryFlag = false;//关闭分享弹窗
					this.$refs.hchPoster.createCanvasImage();//调用子组件的方法
				},500)
			},
			// 取消海报
			canvasCancel(val){
				this.canvasFlag=val;
			},
			
			
			getData(){
				customerSeqId =  this.$common.getLocalSync('customerSeqId') ;
				// 手机登录用username
				this.nickName=this.user_state.nickname?this.user_state.nickname:this.user_state.userName;
				this.referrer=this.nickName+"邀请您"
				this.giveReward('READ')
				this.loadDetail();
				this.getIsPraise();
				this.getQrcode();
			},

			// 制作小程序二维码
			getQrcode() {
				let url=this.$webconfig.web_url+"/articleShare?seqId="+seqId+"&offerRewardSeqId="+offerRewardSeqId+'&articleCode='+this.user_state.shareCode;
				if(!offerRewardSeqId&&popularizeSeqId){
					url=this.$webconfig.web_url+"/articleShare?seqId="+seqId+"&popularizeSeqId="+popularizeSeqId
				}
				console.log(url);
				let width=uni.upx2px(240);
				uQRCode.make({
					canvasId: 'qrcode',
					text: url,
					size: width,
					margin: 5,
					success: res => {
						this.qrcodeSrc=res;
					},
					complete: () => {}
				})
			},
			
			// 是否点赞
			getIsPraise() {
				let id=offerRewardSeqId;
				if(popularizeSeqId){
					id=popularizeSeqId
				}
				this.$api.get('/o2oArticlePraise/isPraise', {
					params: {
						spreadSeqId: id,
						customerSeqId: customerSeqId
					}
				}).then(res => {
					if (res.code == 200) {
						this.isPraise = res.data;
					}
				})
			},
			// 点赞
			getPraise() {
				let id=offerRewardSeqId;
				let url='/o2oArticlePraise/praise'
				if(popularizeSeqId){
					id=popularizeSeqId;
					url='/o2oArticlePraise/praise1'
				}
				this.$api.post(url, {
					spreadSeqId: id,
					customerSeqId: customerSeqId
				}).then(res => {
					if (res.code == 200) {
						if (res.data) {
							this.loadDetail();
							this.isPraise = !this.isPraise
						}
					}
				})
			},
			// 我要制作
			edit() {
				uni.navigateTo({
					url: '/pages/make_money/article_edit?seqId=' + seqId + '&offerRewardSeqId=' + offerRewardSeqId
				})
			},
			// 分享 阅读
			giveReward(type) {
				// 阅读
				let url='/o2oOfferReward/shareOrReadGiveRewards';
				let obj={
					rewardType: type,
					seqId: offerRewardSeqId,
					customerSeqId: customerSeqId,
					shareCode:articleCode
				}
				// 推广
				if(popularizeSeqId){
					url="/o2oNoticePopularize/readStatistic"
					obj={
						seqId: popularizeSeqId,
						customerSeqId: customerSeqId,
					}
					
				}
				if(popularizeSeqId&&type=='SHARE')return;//推广没有分享赚钱
				this.$api.post(url, obj).then(res => {})
			},
			
			// 文章详情
			loadDetail() {
				let self = this;
				this.$api.get('/o2oMyArticle/getArticleInfo', {
					params: {
						seqId: seqId,
						offerRewardSeqId: offerRewardSeqId,
						popularizeSeqId: popularizeSeqId
					}
				}).then(res => {
					if (res.code == 200) {
						let data = res.data;
						this.article = data;
						data.praiseNum = data.praiseNum == null ? 0 : data.praiseNum;
						this.articlePic = this.article.articlePic;

						if (sharebtn) {
							this.$nextTick(function() {
								self.pageScrollToBottom()
							})
						}
					}
				})
			},
			// 滑动到最底部 方便分享
			pageScrollToBottom: function() {
				uni.createSelectorQuery().select('#box').boundingClientRect(function(rect) {
					// 使页面滚动到底部
					uni.pageScrollTo({
						scrollTop: rect.bottom,
						duration: 300
					});

				}).exec()
			},
			// 微信登录
			wxLogin(e) {
				// #ifndef H5
				let that = this;
				if (!code) {
					uni.showToast({
						icon: 'none',
						title: '正在加载中，稍等一下',
						duration: 1000
					});
				}
				if (e.detail && e.detail.errMsg == 'getUserInfo:ok') {
					uni.getUserInfo({
						lang:"zh_CN",
						success(info_res) {
							that.info_res = info_res;
							that.sendLogin()
						}
					})
				}
				// #endif
			},
			sendLogin() {
				this.$api.post('/login/save', {
					code: code,
					rawData: this.info_res.rawData,
					iv: this.info_res.iv,
					signature: this.info_res.signature,
					encryptedData: this.info_res.encryptedData
				}).then(res => {
					if (res.code == 200) {
						let token = res.data;
						let user_json = jwt_decode(token);
						this.$common.setLocal('token', res.data);
						this.$common.setLocal('customerSeqId', user_json.userId);
						this.$common.setLocal('customerName', user_json.userName || "");
						this.$store.commit('saveUser', user_json)
						this.is_login = true;
						// 登录之后再请求之前接口
						this.getData()
					}
				})
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
			},
			// 获取登录状态
			loadInfo() {
				this.$api.get('/login/getUserInfo', {
					params: {
						userId: this.$common.getLocalSync('customerSeqId')
					}
				}).then(res => {
					if(res.code==401){
						this.is_login =false
					}else {
						this.is_login =true;
						this.getData()
					}
					
				})
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
	
				.adqrcode-img {
					width: 186rpx;
					height: 186rpx;
					margin-top: 15rpx;
				}
			}
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
