<template>
	 <!-- :style="{backgroundImage:'url('+ad.backdropPic+')'}" -->
	<view class="extension" :class="{'white-bg':curtab===2}">
		<view class="extension-tab" :class="{'white-bg':curtab===1}">
			<view class="extension-tab-item" @click="curtab=0">
				<view class="extension-tab-image orange" :class="{active:curtab===0}">
					<image v-if="curtab!==0" src="/static/images/card/template.png" mode="aspectFill">
					<image v-if="curtab===0" src="/static/images/card/template-active.png" mode="aspectFill">
				</view>
				<view class="extension-tab-text">使用模板编辑</view>
			</view>
			<view class="extension-tab-item" @click="curtab=1">
				<view class="extension-tab-image blue" :class="{active:curtab===1}">
					<image v-if="curtab!==1" src="/static/images/card/list.png" mode="aspectFill">
					<image v-if="curtab===1" src="/static/images/card/list-active.png" mode="aspectFill">
				</view>
				<view class="extension-tab-text">添加列表</view>
			</view>
			<view class="extension-tab-item" @click="curtab=2">
				<view class="extension-tab-image green" :class="{active:curtab===2}">
					<image v-if="curtab!==2" src="/static/images/card/link.png" mode="aspectFill">
					<image v-if="curtab===2" src="/static/images/card/link-active.png" mode="aspectFill">
				</view>
				<view class="extension-tab-text">添加访问链接</view>
			</view>
		</view>
		<view class="extension-content" :class="{'white-bg':curtab===1}">
			<cardEdit v-if="curtab===0" :title1.sync="extensionDetail.title" :content1.sync="contentList"></cardEdit>
			<view class="extension-list" v-if="curtab===1">
				<view class="extension-list-item" v-for="(item,index) in extensionDetail.articleList" :key="index" @click="goListDetail(item.seqId)">
					<view class="extension-list-item-body">
						<view class="extension-list-item-title">{{item.title}}</view>
						<view class="extension-list-item-content">{{item.content}}</view>
					</view>
				</view>
			</view>
			<view class="extension-detail">
				<view v-if="curtab===2">
					<view class="extension-title-form">
						<view>访问网址</view>
						<input v-model="extensionDetail.articleLink" placeholder-style="color:#999" placeholder="请输入访问网址"/>
					</view>
					<view class="extension-title-form">
						<view>栏目名称</view>
						<input v-model="extensionDetail.iconName" placeholder-style="color:#999" placeholder="请输入栏目名称"/>
					</view>
				</view>
				<view class="extension-title" v-if="curtab!==2">
					<view>栏目名称</view>
					<input v-model="extensionDetail.iconName" placeholder-style="color:#999" placeholder="请输入栏目名称"/>
				</view>
				<view class="extension-icon">				
					<view class="extension-image"><image :src="extensionDetail.iconUrl" mode="aspectFill"></view>
					<view class="extension-text"><view>图标库</view><view>上传之后会被裁剪成64*64</view></view>
					<view class="extension-button"><view @click="showImgs=true">编辑</view></view>
				</view>
			</view>
		</view>
		<!-- 底部保存发布按钮 -->
		<view class="bottom-button">
			<view @click="goSave()" v-if="curtab===0">确定保存</view>
			<view @click="insertList()" v-if="curtab===1">新增列表</view>
			<view v-if="curtab===2">确定提交</view>
		</view>
		<view class="image-box-wrap" v-show="showImgs">
			<view class="image-box-list">
				<view v-for="(item,index) in IconList" :key="index" @click="addIcon(item.iconUrl)">
					<image :src="item.iconUrl"></image>
				</view>
			</view>
			<view class="image-box-upload" @click="showUploadImg=true;showImgs=false;">本地上传</view>
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
	import cardEdit from './card_edit.vue'//图文
	export default {
		data() {
			return {
				api: this.$webconfig.api_url,
				customerSeqId: this.$common.getLocalSync('customerSeqId'),
				curtab: 0,		
				showUploadImg: false,
				showImgs: false,
				cardSeqId : '',
				seqId : '',
				isAdd: false,
				extensionDetail: {
					seqId: '',
					cardSeqId: '',
					iconName: '',
					iconUrl: '',
					title: '',
					content: '',
					articleLink: '',
					articleList: []
				},
				IconList: [],
				contentList: [
					'<div class="hs-text" style="color:#000;font-weight:normal;text-align:left;font-size:14px;">点击开始编辑文章内容</div>',
				],
			};
		},
		components:{
			cardEdit
		},
		onLoad(option) {
			if(option.isAdd){
				this.isAdd = true;
			}
			// 修改扩展
			if(option.cardSeqId){
				this.cardSeqId = option.cardSeqId;
				this.seqId = option.seqId;
				// 查询列表文章
				// this.findListData(option.cardSeqId);
				// 不是新增查询扩展详情
				!option.isAdd && this.findExtendContent(option.cardSeqId,option.seqId,option.type);
			}
			this.getIconList();
		},
		methods:{
			// findListData(cardSeqId){
			// 	this.$api.get('/o2oVisitingCard/findListData', {
			// 		params: {
			// 			cardSeqId: cardSeqId,
			// 		}
			// 	}).then(res => {
			// 		this.extensionList = res.list;
			// 	})
			// },
			getIconList() {
				this.$api.get('/o2oIconLibrary/findPage', {
					params: {
						customerSeqId: this.customerSeqId,
						// pageno: cardSeqId,
						pagesize: 100,
					}
				}).then(res => {
					this.IconList = res.list;
				})
			},
			findExtendContent(cardSeqId,seqId,type){
				this.$api.get('/o2oVisitingCard/findExtendContent', {
					params: {
						customerSeqId: this.customerSeqId,
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
					ac = ac ||
						'<div class="hs-text" style="color:#000;font-weight:normal;text-align:left;font-size:14px;">点击开始编辑文章内容</div>'
					content = ac.split(/<\/section><section>/);
					this.contentList.splice(0,1);
					content.forEach((item)=>{
						this.contentList.push(item);
					});
					
					// 调试用需要注释
					res.data.articleList = [{content:'111',title:'22222'},{content:'哈哈哈',title:'题目'}];
					
					this.extensionDetail = res.data;
				})
			},
			goListDetail(seqId) {
				uni.navigateTo({
					url: "/pages/visiting_card/cardListDetail?seqId="+seqId
				})
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
									this.extensionDetail.iconUrl = res.data.viewUrl;
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
			addIcon(icon) {
				this.extensionDetail.iconUrl = icon;
				this.showImgs = false;
			},
			goSave() {
				let msg = '';
				let content = this.contentList.map(res => {
					if (res !==
						'<div class="hs-text" style="color:#000;font-weight:normal;text-align:left;font-size:14px;">点击开始编辑文章内容</div>') {
						return `<section>${res.replace('onclick="return false;"','')}</section>`
					} else {
						return ''
					}
				}).join('');
				content === '' && (msg = '文章内容不能为空！');
				this.extensionDetail.title === '' && (msg = '文章标题不能为空！');
				if (msg) {
					uni.showToast({
						icon: 'none',
						title: msg,
						duration: 2000
					});
					return;
				}
				if(this.isAdd){
					this.$api.post('/o2oVisitingCard/insertExtendContent', {
						customerSeqId: this.customerSeqId,
						cardSeqId: this.cardSeqId,
						content: content,
						iconName: this.extensionDetail.iconName,
						iconUrl: this.extensionDetail.iconUrl,
						title: this.extensionDetail.title,
					}).then(res=>{
						if(res.code===200){
							uni.showToast({
								title: '扩展新增成功！',
								duration: 2000
							});
							uni.navigateBack({
								delta: 1
							});
						}
					})
				} else {
					this.$api.post('/o2oVisitingCard/saveExtendContent', {
						customerSeqId: this.customerSeqId,
						cardSeqId: this.cardSeqId,
						content: content,
						iconName: this.extensionDetail.iconName,
						iconUrl: this.extensionDetail.iconUrl,
						title: this.extensionDetail.title,
						iconSort: '',
						seqId: this.seqId,
						type: 'ARTICLE',
					}).then(res=>{
						if(res.code===200){
							uni.showToast({
								title: '扩展修改成功！',
								duration: 2000
							});
							uni.navigateBack({
								delta: 1
							});
						}
					})
				}
			},
			insertList() {
				this.$api.post('/o2oVisitingCardArticle/insertList', {
					customerSeqId: this.customerSeqId,
					cardExtendId: this.seqId
				}).then(res=>{
					if(res.code===200){
						uni.showToast({
							title: '新增列表成功！',
							duration: 2000
						});
						uni.navigateBack({
						    delta: 1
						});
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.extension {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	font-family: PingFang-SC-Medium;
	font-weight: normal;
	font-stretch: normal;
	.extension-tab {
		width: 100%;
		height: 193rpx;
		display: flex;
		.extension-tab-item {
			flex: 1;
			.extension-tab-image {
				width: 78rpx;
				height: 78rpx;
				line-height: 92rpx;
				box-sizing: border-box;
				border-radius: 12rpx;
				text-align: center;
				margin: 29rpx auto 16rpx;
				&.orange {
					border: solid 1rpx #fa695e;
					&.active {
						background: #fa695e;
					}
				}
				&.blue {
					border: solid 1rpx #4a94f7;
					&.active {
						background: #4a94f7;
					}
				}
				&.green {
					border: solid 1rpx #74d4af;
					&.active {
						background: #74d4af;
					}
				}
				image {
					width: 40rpx;
					height: 40rpx;
				}
			}
			.extension-tab-text {
				font-size: 22rpx;
				line-height: 21rpx;
				color: #333333;
				text-align: center;
			}
		}
	}
	.extension-content {
		width: 100%;
		max-height: calc(100% - 303rpx);
		overflow: auto;
		.extension-list {
			padding: 0 24rpx 38rpx;
			.extension-list-item {
				width: 100%;
				height: 208rpx;
				box-sizing: border-box;
				border-bottom: 2px solid #dedede;
				padding-top: 15rpx;
				display: flex;
				&:last-child {
					border-bottom: 0;
				}
				.extension-list-item-body {
					flex: 1;
					overflow: hidden;
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
	.extension-detail {
		padding: 0 34rpx 57rpx;
		.extension-title-form {	
			view {
				height: 29rpx;
				font-size: 30rpx;
				font-weight: bold;
				color: #333;
			}
			input {
				font-size: 26rpx;
				width: 100%;
				box-sizing: border-box;
				color: #333;
				height: 68rpx;
				border-radius: 4rpx;
				padding-left: 20rpx;
				border: 1rpx solid #4872e5;
				margin: 21rpx 0 29rpx;
			}
		}
		.extension-title {
			height: 29rpx;
			margin-bottom: 50rpx;
			display: flex;
			view {
				margin-right: 25rpx;
				font-size: 30rpx;
				font-weight: bold;
				color: #333;
			}
			input {
				font-size: 26rpx;
				color: #333;
			}
		}
		.extension-icon {
			display: flex;
			height: 98rpx;
			.extension-image {
				width: 98rpx;
				height: 98rpx;
				border-radius: 49rpx;
				line-height: 98rpx;
				text-align: center;
				margin-right: 50rpx;
				background: #dde1ed;
				image {
					width: 98rpx;
					height: 98rpx;
				}
			}
			.extension-text {
				padding-top: 6rpx;
				:first-child {
					line-height: 44rpx;
					font-size: 30rpx;
					color: #333333;
				}
				:last-child {
					line-height: 40rpx;
					font-size: 26rpx;
					color: #666666;
				}
			}
			.extension-button {
				flex: 1;
				height: 98rpx;
				text-align: right;
				line-height: 98rpx;
				view {
					display: inline-block;
					width: 100rpx;
					height: 48rpx;
					vertical-align: middle;
					border-radius: 24rpx;
					border: 1rpx solid #4872e5;
					font-size: 22rpx;
					line-height: 48rpx;
					color: #4872e5;
					text-align: center;
				}
			}
		}
	}
	
	
	.bottom-button {
		position: fixed;
		width: 100%;
		height: 110rpx;
		bottom: 0;
		display: flex;
		z-index: 5;
		background: #fff;
		view {
			margin: 15rpx auto;
			width: 678rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background-image: linear-gradient(90deg, 
				#fa6255 0%, 
				#fcb7b0 100%);
			border-radius: 40rpx;
			font-size: 28rpx;
			font-weight: bold;
			color: #ffffff;
		}
	}
}

.image-box-wrap {
	position: fixed;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	z-index: 10;
	background: rgba(57,58,63,1);
	.image-box-list {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding: 65rpx 40rpx 100rpx;
		view {
			float: left;
			width: 25%;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			image {
				width: 60rpx;
				height: 60rpx;
			}
		}
	}
	.image-box-upload {
		position: absolute;
		bottom: 50rpx;
		margin-left: 50%;
		transform: translateX(-50%);
		width:678rpx;
		height:80rpx;
		background:rgba(255,158,151,1);
		border-radius:40rpx;
		font-size:28rpx;
		font-family:PingFang SC;
		font-weight:bold;
		color:rgba(255,255,255,1);
		line-height:80rpx;
		text-align: center;
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
.white-bg {
	background: #fff;
}
</style>
