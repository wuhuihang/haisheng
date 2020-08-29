<template>
	<view class="write">
		<view class="write-tip">点击文章任意部分进行编辑</view>
		<view class="write-top">
			<textarea class='write-title-textarea' auto-height='true' :value="title" @input='inputChange($event)'
			 :placeholder="hasModel?'':'请输入标题'"></textarea>
		</view>
		<view class="content">
			<view v-for="(item,index) in content" :ref="'content'+index" :class="{'active':active===index}" :key="index" @click="selectEdit(index)">
				<view v-if="/^<video([\s\S]*)<\/video>$/.test(item)">			
					<image :src="cloudUrl+'/videodefault.png'" style="width: 100%;height:277rpx;" mode="aspectFill"></image>
				</view>
				<view v-html="item" v-else></view>
			</view>
			<view class="hs-form" v-if="hasForm">
				<view class="close" @click="hasForm=false">✖</view>
				<view class="hs-form-name"><input class="hs-form-name-input" v-model="formTitle" :placeholder="hasModel?'':'请输入表单名称'"/></view>
				<view class="hs-form-item"><span class="hs-form-item-span">姓名</span><input disabled="disabled" class="hs-form-item-input" :placeholder="hasModel?'':'请输入您的姓名'"/></view>
				<view class="hs-form-item"><span class="hs-form-item-span">手机号</span><input disabled="disabled" class="hs-form-item-input" :placeholder="hasModel?'':'请输入您的联系方式'"/></view>
				<view class="hs-form-item"><span class="hs-form-item-span">内容</span><input disabled="disabled" class="hs-form-item-input" :placeholder="hasModel?'':'请输入内容'"/></view>
				<view><button class="hs-form-button">提交</button></view>
			</view>
		</view>
		<!-- 内容编辑工具 -->
		<view class="edit-box-wrap" :class="{'edit-box-show':showEdit}">
			<view class="close" @click="active=-1">✖</view>
			<view class="edit-box">
				<view class="edit-item" @click="deleteContent">
					<image src="/static/images/write/delete.png" mode="heightFix"></image>
					<view>删除内容</view>
				</view>
				<view class="edit-item" @click="showUploadImg=true;">
					<image src="/static/images/write/img.png" mode="heightFix"></image>
					<view>插入图片</view>
				</view>
				<view class="edit-item" @click="addForm()">
					<image src="/static/images/card/form.png" mode="heightFix"></image>
					<view>插入表单</view>
				</view>
				<view class="edit-item" @click="showUploadVideo=true">
					<image src="/static/images/write/video.png" mode="heightFix"></image>
					<view>插入视频</view>
				</view>
				<view class="edit-item" @click="showModel('insertSection')">
					<image src="/static/images/write/section.png" mode="heightFix"></image>
					<view>插入段落</view>
				</view>
				<view class="edit-item" @click="showModel('modifySection')">
					<image src="/static/images/write/modify.png" mode="heightFix"></image>
					<view>修改文字</view>
				</view>
				<view class="edit-item" @click="showModel('insertHref')">
					<image src="/static/images/write/link.png" mode="heightFix"></image>
					<view>插入链接</view>
				</view>
				<view class="edit-item" @click="showGoodListModel()">
					<image src="/static/images/write/good.png" mode="heightFix"></image>
					<view>插入商品</view>
				</view>
			</view>
		</view>
		<!-- 插入商品-->
		<view class="model-wrap" :class="{'model-wrap-show':showGoodList}">
			<view class="model">
				<view class="close" @click="showGoodList=false">✖</view>
				<view class="model-title" style="border: 0;">
					<text>请选择商品</text>
					<view class="model-subtitle">单击完成插入</view>
				</view>
				<scroll-view class="model-content" scroll-y="true" @scrolltolower="scrollGoodtolower">
					<view class="item-view" v-for="(item,index) in goodList" :key="index" @click="selectGoodList(item)">
						<view class="good-view">
							<image :src="item.mainPicUrl" mode="aspectFill"></image>
							<view class="good-detail">
								<view class="good-title">{{item.title||''}}</view>
								<view>{{item.price||0}}</view>
							</view>
						</view>
					</view>
					<view class="model-loading"><text v-if="isLoading">正在加载中...</text></view>
				</scroll-view>
			</view>
		</view>
		<!-- 插入图片 -->
		<view class="select-box-wrap" v-show="showUploadImg">
			<div class="select-box">
				<button @click="uploadImg(0)">从手机相册选择</button>
				<button @click="uploadImg(1)">拍照上传</button>
				<button class="select-box-cancle" @click="showUploadImg=false">取消</button>
			</div>
		</view>
		<!-- 插入视频 -->
		<view class="select-box-wrap" v-show="showUploadVideo">
			<div class="select-box">
				<button @click="uploadVideo">视频</button>
				<button @click="showModel('insertVideoLink')">录入视频链接</button>
				<button class="select-box-cancle" @click="showUploadVideo=false">取消</button>
			</div>
		</view>
		<!-- 弹窗 -->
		<view class="model-wrap" :class="{'model-wrap-show':showModal}" v-if="showModal">
			<view class="model">
				<view class="model-cancle" @click="showModal=false">取消</view>
				<view class="model-confirm" @click="confirmModel">确定</view>
				<view class="model-title">{{modalType}}</view>
				<view class="model-content">
					<textarea v-model="modalValue" :style="{
							'font-weight':fontWeight,
							'color':fontColor,
							'font-size':fontSize,
							'text-align':textAlign
						}"
					 :maxlength="-1" :disabled="showModelStyle" :placeholder="modalPlaceHolder" placeholder-class="model-placeholder"></textarea>
				</view>
				<view class="model-style-wrap" v-show="showModelStyle">
					<view class="close" @click="showModelStyle=false">✖</view>
					<view class="model-color" v-if="showModelStyleType==='color'">
						<view v-for="(color,index) in fontColorList" :key="index" :style="{'background':color}" :class="{'active':fontColor===color}"
						 @click="changeColor(color)"></view>
					</view>
					<view class="model-size" v-if="showModelStyleType==='size'">
						<view v-for="(size,index) in fontSizeList" :key="index" :style="{'font-size':size.val}" :class="{'active':fontSize===size.val}"
						 @click="changeSize(size.val)">{{size.text}}</view>
					</view>
					<view class="model-align" v-if="showModelStyleType==='align'">
						<view v-for="(align,index) in textAlignList" :key="index" :class="{'active':textAlign===align.val}" @click="changeAlign(align.val)">{{align.text}}</view>
					</view>
				</view>
				<view class="model-bottom" v-if="modalType==='插入段落'||modalType==='修改文字'">
					<view class="model-bottom-item" @click="bold">
						<image src="/static/images/write/bold.png" mode="heightFix"></image>
						<view>加粗</view>
					</view>
					<view class="model-bottom-item" @click="modelStyle('color')">
						<image src="/static/images/write/color.png" mode="heightFix"></image>
						<view>颜色</view>
					</view>
					<view class="model-bottom-item" @click="modelStyle('size')">
						<image src="/static/images/write/size.png" mode="heightFix"></image>
						<view>大小</view>
					</view>
					<view class="model-bottom-item" @click="modelStyle('align')">
						<image src="/static/images/write/align.png" mode="heightFix"></image>
						<view>对齐</view>
					</view>
					<view class="model-bottom-item" @click="modalValue=''">
						<image src="/static/images/write/remove.png" mode="heightFix"></image>
						<view>清空</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部保存发布按钮 -->
		<view class="bottom-button">
			<view @click="cancle()">取消</view>
			<view @click="goSave()">保存</view>
		</view>
	</view>
</template>

<script>
	var Parser = require('@/components/jyf-parser/libs/MpHtmlParser.js');
	export default {
		data() {
			return {
				api: this.$webconfig.api_url,
				isHidePlaceholder: false,
				showEdit: false,
				showGoodList: false,
				goodList: [],
				isLoading: false,
				pageno: 1,
				showUploadImg: false,
				showUploadVideo: false,
				showModal: false,
				modalType: '',
				modalValue: '',
				modalPlaceHolder: '',
				hasHref: '',
				fontWeight: 'normal',
				fontColor: '#000',
				fontSize: '14px',
				textAlign: 'left',
				textAlignList: [{
					val: 'left',
					text: '左对齐'
				}, {
					val: 'center',
					text: '居中对齐'
				}, {
					val: 'right',
					text: '右对齐'
				}],
				fontSizeList: [{
					val: '2.4vw',
					text: '12px'
				}, {
					val: '2.8vw',
					text: '14px'
				}, {
					val: '3.6vw',
					text: '18px'
				}, {
					val: '4vw',
					text: '20px'
				}, {
					val: '5vw',
					text: '24px'
				}, {
					val: '6vw',
					text: '28px'
				}],
				fontColorList: ['#ea3323', '#5c8ef1', '#3d752e', '#ee712f', '#f09d37', '#000', '#88328d', '#1c19c2', '#fefb62',
					'#a27c4f'
				],
				hasForm: false,
				formTitle: '',
				showModelStyle: false,
				showModelStyleType: '',
				active: -1,
				contentType: '', // 当前选中内容的类型
				title: '',
				content: [],
				customerSeqId: this.$common.getLocalSync('customerSeqId'),
				cloudUrl:this.$webconfig.cloud_url+'/mall/img'
			}
		},
		props: {
			seqId: {
				type: String,
				default: ''
			}, 
			formTitle1: {
				type: String,
				default: ''
			},
			cardExtendId: {
				type: String,
				default: ''
			}, 
			title1: {
				type: String,
				default: ''
			}, 
			content1: {
				type: Array,
				default: [
					'<div class="hs-text" style="color:#000;font-weight:normal;text-align:left;font-size:14px;">点击开始编辑文章内容</div>',
				]
			}, 
		},
		watch: {
			// 没有选中项则不展示编辑工具框
			active(val) {
				this.showEdit = val !== -1
			},
			content(val) {
                this.$emit('update:content1', val);
			},
			title1(val) {
				this.title = val;
			},
			formTitle1(val) {
				if(val!==''){
					this.hasForm = true;
					this.formTitle = val;
				}
			},
		},
		computed: {	
			hasModel() {
				return this.showGoodList || this.showModal;
			}
		},
		mounted () {
			this.content = this.content1;
			this.title = this.title1;
		},
		methods: {
			inputChange(event) {
				this.isHidePlaceholder = event.detail.cursor > 0;
				this.title = event.detail.value;
                this.$emit('update:title1', event.detail.value);
			},
			// 选中内容编辑
			selectEdit(index) {
				// 获取当前选中内容的类别	
				const curContent = this.content[index];
				const contentTypeMap = new Map([
					[/^(<a href=".*">)?<img/, 'img'],
					[/^<video/, 'video'],
					[/^(<a href=".*">)?<div class="hs-text"/, 'text'],
					[/^<div class="hs-good"/, 'good'],
				]);
				const contentTypeArr = [...contentTypeMap].filter(([key, value]) => (key.test(curContent)));
				this.contentType = (contentTypeArr[0] && contentTypeArr[0][1]) || '';
				this.active = index;
			},
			// 删除内容
			deleteContent() {
				if (this.active < 0)
					return;
				if (this.content.length <= 1) {
					return;
				}
				this.content.splice(this.active, 1);
				this.active = -1;
			},
			// 显示模态弹框
			showModel(modalType) {
				// 获取当前选中内容的类别
				const curContent = this.content[this.active];
				const modalTypeMap = new Map([
					['insertVideoLink', ['视频链接', '请输入要上传的视频链接']],
					['insertHref', ['插入链接', '请输入要插入的链接']],
					['insertSection', ['插入段落', '请输入文案']],
					['modifySection', ['修改文字', '请输入文案']]
				]);

				this.modalType = modalTypeMap.get(modalType)[0];
				this.modalPlaceHolder = modalTypeMap.get(modalType)[1];

				if (
					(modalType === 'modifySection' && this.contentType !== 'text') // 文本类型才能修改文案
					||
					(modalType === 'insertHref' && this.contentType !== 'text' && this.contentType !== 'img') // 文本和图片才能插入超链接
				)
					return;

				const actions = new Map([
					[/insertHref/, () => { // 设置链接初始文本
						const arrs = curContent.match(/^<a href="(.*?)"/) || [];
						this.modalValue = arrs[1] ? arrs[1] : '';
					}],
					[/(insertVideoLink|insertSection)/, () => { // 清空文本
						this.modalValue = '';
					}],
					[/(insertVideoLink|insertHref|insertSection)/, () => { // 清空样式
						this.fontWeight = 'normal';
						this.fontColor = '#000';
						this.fontSize = '14px';
						this.textAlign = 'left';
					}],
					[/modifySection/, () => { // 修改文本需要设置样式及文本
						const arrs = curContent.match(/^(<a href="(.*?)"([^>]*)?>)?<div class="hs-text".+?>/);
						const color = curContent.match(/[^-]color:([^;]+);/);
						const weight = curContent.match(/font-weight:([^;]+);/);
						const size = curContent.match(/font-size:([^;]+);/);
						const align = curContent.match(/text-align:([^;]+);/);
						this.hasHref = arrs[2] ? arrs[2] : '';
						let text = curContent.replace(/^(<a href=".*">)?<div class="hs-text".+?>/g, "").replace(
							/<\/div>(<\/a>)?$/g, "").replace(/<br\/>/g, '\n'); // 去掉首尾div标签
						this.fontColor = color ? color[1] : '#000';
						this.fontWeight = weight ? weight[1] : 'normal';
						this.fontSize = size ? size[1] : '14px';
						this.textAlign = align ? align[1] : 'left';
						this.modalValue = text==='点击开始编辑文章内容'?'':text;
					}],
					[/.*/, () => { // 展示弹框
						this.showModal = true;
						this.showModelStyle = false;
					}]
				]);
				const action = [...actions].filter(([key, value]) => (key.test(modalType)))
				action.forEach(([key, value]) => value.call(this))
			},
			// 模态弹框确认
			confirmModel() {
				let position = this.active;
				const actions = new Map([
					[/视频链接/, () => {
						this.content.splice(this.active + 1, 0, `<video src="${this.modalValue}"  style="border-radius:20rpx;width:100%;height:277rpx;object-fit:fill;" poster="${this.cloudUrl}/videodefault.png"></video>`);
						this.showUploadVideo = false;
					}],
					[/插入链接/, () => {
						// 清掉所有的a标签
						let content = this.content[this.active].replace(/^<a href="[^>]*?>/, "").replace(/<\/a>$/, "");
						this.modalValue.trim() !== '' && (content =
							`<a href="${this.modalValue}" onclick="return false;">${content}</a>`);
						this.content.splice(this.active, 1, content);
					}],
					[/插入段落|修改文字/, () => { // 0为插入段落，1为修改文字
						const type = this.modalType === '插入段落' ? 0 : 1;
						if (this.modalValue==='') {
							uni.showToast({
								icon: 'none',
								title: '内容不能为空！',
								duration: 2000
							});
							return;
						}
						let content =
							`<div class="hs-text" style="color:${this.fontColor};font-weight:${this.fontWeight};text-align:${this.textAlign};font-size:${this.fontSize};">${this.modalValue.replace(/\n/g,'<br/>')}</div>`;
						if (this.hasHref) {
							content = `<a href="${this.hasHref}" onclick="return false;">${content}</a>`;
						}
						position = this.active + (1 - type)
						this.content.splice(position, type, content);
					}],
					[/.*/, () => { // 关闭弹框
						this.showModal = false;
						this.active = -1;
					}]
				])
				const action = [...actions].filter(([key, value]) => (key.test(this.modalType)));
				action.forEach(([key, value]) => value.call(this));
				this.$nextTick(() => {
					this.$refs[`content${position}`] && this.$refs[`content${position}`][0].$el.scrollIntoView();
					// this.active = position
				})
			},
			// 加粗
			bold() {
				this.fontWeight = this.fontWeight === 'bold' ? 'normal' : 'bold';
			},
			// 点击样式修改
			modelStyle(type) {
				this.showModelStyle = !this.showModelStyle || this.showModelStyleType !== type;
				this.showModelStyleType = type;
			},
			// 修改字体大小
			changeSize(size) {
				this.fontSize = size;
			},
			// 修改字体大小
			changeAlign(align) {
				this.textAlign = align;
			},
			// 修改字体颜色
			changeColor(color) {
				this.fontColor = color;
			},
			addForm() {
				if(this.hasForm){ //只能插入一个表单
					return;
				}
				this.hasForm = true;
				this.active = -1;
			},
			// 展示商品列表弹框
			showGoodListModel() {
				this.showGoodList = true;
				this.pageno = 1;
				this.goodList = [];
				this.getGoods();
			},
			scrollGoodtolower() {
				this.pageno++;
				this.getGoods();
			},
			selectGoodList(item) {
				let content = ''
				content =
					`<div class="hs-goods" url="/pages/goods/detail?seqId=${item.spuSeqId}&merchantShopId=${item.merchantShopId}">
								<div class="hs-image" style="background:url('${item.mainPicUrl}') no-repeat center center;background-size:cover;"></div>
								<div class="hs-goods-detail" url="/pages/goods/detail?seqId=${item.spuSeqId}&merchantShopId=${item.merchantShopId}">
									<div>${item.title}</div>
									<div>${item.price}</div>
								</div>
							</div>`;
				this.content.splice(this.active + 1, 0, content);
				this.active = -1;
				this.showGoodList = false;
			},
			getGoods() {
				let _this = this;
				this.isLoading = true;
				this.$api.get('/o2oMyArticle/findGoodsList', {
					params: {
						// customerSeqId: this.customerSeqId,
						customerSeqId: '9a666e88ecb04e99998242ac839cfa68',
						pageno: this.pageno
					}
				}).then(res => {
					if (res.list != null) {
						let list = res.list
						_this.goodList = _this.goodList.concat(list);
					}
				
				}).finally(() => {
					this.isLoading = false;
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
									this.content.splice(this.active + 1, 0, `<img style="width:100%" src="${res.data.viewUrl}"></img>`);
									this.active = -1;
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
			// 上传视频
			uploadVideo() {
				let self = this;
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: video => {
						if (video.size > 10 * 1024 * 1024) {
							uni.showToast({
								icon: 'none',
								title: '视频大小不能超过10M！',
								duration: 2000
							});
							return;
						}
						uni.showLoading({
							title: '加载中'
						});
						self.showUploadVideo = false;
						uni.uploadFile({
							url: this.api + '/sys/appeal/imgUpload',
							filePath: video.tempFilePath,
							name: 'file',
							success: (uploadFileRes) => {
								let res = JSON.parse(uploadFileRes.data);
								uni.hideLoading();
								if (res.code === 200) {
									uni.showToast({
										title: '上传成功！',
										duration: 2000
									});
									self.content.splice(self.active + 1, 0, `<video src="${res.data.viewUrl}" controls style="border-radius:20rpx;width:100%;height:277rpx;object-fit:fill;"></video>`);
									self.active = -1;
								} else {
									uni.showToast({
										icon: 'none',
										title: '视频上传失败',
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
			cancle() {
				uni.navigateBack({
					delta: 1
				});
			},
			// release 保存成功是否直接发布
			goSave() {
				let msg = '';
				let formTitle = '';
				let content = this.content.map(res => {
					if (res !==
						'<div class="hs-text" style="color:#000;font-weight:normal;text-align:left;font-size:14px;">点击开始编辑文章内容</div>') {
						return `<section>${res.replace('onclick="return false;"','')}</section>`
					} else {
						return ''
					}
				}).join('');
				content === '' && (msg = '文章内容不能为空！');
				this.title === '' && (msg = '文章标题不能为空！');
				if(this.hasForm){
					formTitle = this.formTitle;
					formTitle === '' && (msg = '表单名称不能为空！');
				}
				if (msg) {
					uni.showToast({
						icon: 'none',
						title: msg,
						duration: 2000
					});
					return;
				}
				this.$api.post('/o2oVisitingCardArticle/update', {
					seqId: this.seqId,
					cardExtendId: this.cardExtendId,
					customerSeqId: this.customerSeqId,
					title: this.title,
					formTitle: formTitle,
					content: content
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '文章保存成功！',
							duration: 2000
						});
						uni.navigateBack({
							delta: 1
						});
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.write {
		font-size: 30rpx;
		width: 100%;
		height: 100%;

		.write-tip {
			padding: 10rpx;
			text-align: center;
			color: #fd5549;
			font-size: 20rpx;
		}

		.write-top {
			padding: 0 33rpx 29rpx;
			min-height: 42rpx;
			.write-title-textarea {
				width: 100%;
				font-size: 36rpx;
				color: #3d3d3d;
			}
		}

		.content {
			padding: 0 30rpx 63rpx;
			white-space: normal;
			word-break: break-all;

			>view {
				width: 100%;
				margin-top: 20rpx;
				border: 1px dashed transparent;
				line-height: 50rpx;

				&.active {
					background: #f1dedd;
					border: 1px dashed #f45e54;
				}

				video {
					width: 100%;
					z-index: 0;
				}
			}

			/deep/ .hs-goods {
				display: flex;
				border: 1px solid #ccc;
				border-radius: 15rpx;
				padding: 15rpx;
				background-color: #fff;
				
				.hs-image {
					width: 240rpx;
					height: 160rpx;
					border-radius: 10rpx;
				}

				.hs-goods-detail {
					flex: 1;
					padding: 15rpx;

					:first-child {
						height: 90rpx;
						line-height: 1.3;
						font-size: 26rpx;
					}

					:last-child {
						color: #E04B28;
						font-size: 30rpx;
					}
				}
			}
			
			/deep/ .hs-form {
				width: 100%;
				position: relative;
				.close {
					width: 50rpx;
					height: 50rpx;
					line-height: 50rpx;
					position: absolute;
					top: -25rpx;
					right: -20rpx;
					color: red;
					box-shadow: 0px 0px 10px #ccc;
					border-radius: 25rpx;
					text-align: center;
					background-color: #FFFFFF;
					font-size: 30rpx;
				}
				.hs-form-name {
					width: 100%;
					height:68rpx;
					margin-bottom: 23rpx;
					.hs-form-name-input {
						width:682rpx;
						box-sizing: border-box;
						height:68rpx;
						padding-right: 25rpx;
						line-height:68rpx;
						border:1rpx solid rgba(72,114,229,0.4);
						border-radius:4rpx;
						text-align: center;
					}
				}
				.hs-form-item {
					position: relative;
					width: 100%;
					height:68rpx;
					margin-bottom: 26rpx;
					.hs-form-item-span {
						font-size:26rpx;
						display: block;
						position: absolute;
						top: 18rpx;
						left: 0rpx;
						width: 133rpx;
						box-sizing: border-box;
						text-align: right;
						height: 32rpx;
						line-height:32rpx;
						padding-right: 24rpx;
						border-right: 1px solid rgba(153,153,153,1);
						&:before {
							content: '*';
							color: red;
						}
					}
					.hs-form-item-input {
						position: absolute;
						top: 0rpx;
						left: 0rpx;
						height:68rpx;
						width:682rpx;
						box-sizing: border-box;
						line-height:68rpx;
						border:1rpx solid rgba(72,114,229,0.4);
						border-radius:4px;
						padding-left: 166rpx;
					}
				}
				.hs-form-button {
					width:438rpx;
					height:80rpx;
					display: block;
					margin: 0 auto;
					line-height:80rpx;
					background:rgba(255,158,151,1);
					border-radius:10rpx;
					text-align: center;
					color: #fff;
				}
			}
		}
		
		.close {
			width: 50rpx;
			height: 50rpx;
			line-height: 50rpx;
			position: absolute;
			top: -25rpx;
			right: -20rpx;
			color: red;
			box-shadow: 0px 0px 10px #ccc;
			border-radius: 25rpx;
			text-align: center;
			background-color: #FFFFFF;
			font-size: 30rpx;
		}

		.edit-box-wrap {
			position: fixed;
			left: 30rpx;
			right: 30rpx;
			bottom: -400rpx;
			padding: 20rpx;
			box-shadow: 0px 0px 10px #999;
			background-color: #FFFFFF;
			transition: bottom 0.5s;
			border-radius: 10rpx;
			z-index: 10;

			&.edit-box-show {
				bottom: 140rpx;
			}

			.edit-box {
				height: 340rpx;
				display: flex;
				flex-wrap: wrap;

				.edit-item {
					width: 25%;
					height: 130rpx;
					box-sizing: border-box;
					color: #787878;
					padding-top: 30rpx;
					font-size: 22rpx;
					text-align: center;
					display: flex;
					flex-wrap: wrap;
					align-content: center;
					image {
						width: 60rpx;
						height: 60rpx;
						margin: 0 auto;
						margin-bottom: 20rpx;
					}
					view {
						width: 100%;
						text-align: center;
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

		.model-wrap {
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			box-shadow: 0px 0px 10px #aaa;
			background: rgba(0, 0, 0, 0.2);
			z-index: 99;
			visibility: hidden;
			overflow: hidden;
			transition: visibility 0.3s;

			&.model-wrap-show {
				overflow: block;
				visibility: visible;

				.model {
					transform: scale(1);
				}
			}

			.model {
				transition: transform 0.3s;
				transform: scale(0.8);
				position: fixed;
				top: 150rpx;
				right: 30rpx;
				left: 30rpx;
				border-radius: 20rpx;
				background-color: #fff;

				.model-title {
					padding: 40rpx 30rpx 20rpx;
					border-bottom: 1px solid #E8E8E8;
					text-align: center;
					font-weight: bold;
					// height: 30rpx;
					.model-subtitle {
						font-size: 26rpx;
						line-height: 50rpx;
						color: #ccc;
					}
				}

				.model-type-list {
					height: 80rpx;
					background-color: rgb(236,236,236);
					display: flex;

					.type-view {
						flex: 1;
						margin-top: 15rpx;
						height: 50rpx;
						text-align: center;
						line-height: 50rpx;

						&.active {
							background-color: rgb(254,155,148);
							color: #fff;
							font-size: 28rpx;
							border-radius: 30rpx;
						}
					}
				}

				.model-cancle {
					position: absolute;
					top: 20rpx;
					left: 40rpx;
					color: #FFA098;
					font-size: 24rpx;
				}

				.model-confirm {
					position: absolute;
					top: 20rpx;
					right: 40rpx;
					color: #FFA098;
					font-size: 24rpx;
				}

				.model-content {
					max-height: 600rpx;
					width: 100%;
					box-sizing: border-box;
					overflow: auto;
					padding: 0 30rpx 0;

					.item-view {
						padding-bottom: 10rpx;
						border-bottom: 1px solid #ccc;
						margin-bottom: 18rpx;

						.good-view {
							display: -webkit-box;

							image {
								width: 240rpx;
								height: 160rpx;
								border-radius: 10rpx;
							}

							.good-detail {
								flex: 1;
								padding: 15rpx;

								:first-child {
									height: 90rpx;
									font-size: 26rpx;
								}

								:last-child {
									color: #E04B28;
									font-size: 30rpx;
								}

								.good-title {
									overflow: hidden; //超出一行文字自动隐藏
									text-overflow: ellipsis; //文字隐藏后添加省略号
									white-space: nowrap; //强制不换行
								}
							}
						}
					}

					.model-loading {
						text-align: center;
						height: 40rpx;
					}

					.empty-ad {
						margin-top: 200rpx;
						font-size: 24rpx;
						text-align: center;
						color: rgb(197,197,197);

						& :last-child {
							margin-top: 60rpx;
							margin-bottom: 20rpx;
							width: 180rpx;
							line-height: 50rpx;
							border-radius: 30rpx;
							font-size: 26rpx;
							display: inline-block;
							color: #fff;
							background: rgb(5,5,5);
						}
					}
				}

				textarea {
					width: 100%;
					box-sizing: border-box;
					padding: 20rpx 10rpx;
					height: 300rpx;
					font-size: 14px;
					line-height: 50rpx;
				}

				.model-placeholder {
					font-weight: 100;
					font-size: 14px;
					line-height: 50rpx;
				}

				.model-style-wrap {
					position: absolute;
					bottom: 100rpx;
					background: #fff;
					height: 180rpx;
					width: 90%;
					margin-left: 5%;
					border: 2rpx solid #808080;
					border-radius: 10rpx;
					z-index: 10;

					.model-color {
						display: flex;
						flex-wrap: wrap;

						view {
							width: 16%;
							border-radius: 10rpx;
							margin: 20rpx 0 0 20rpx;
							height: 58rpx;
							line-height: 58rpx;

							&.active {
								&:after {
									content: '✔';
									display: block;
									color: #fff;
									width: 100%;
									height: 100%;
									text-align: center;
								}
							}
						}
					}

					.model-size {
						display: flex;
						flex-wrap: wrap;

						view {
							width: 27%;
							border-radius: 10rpx;
							margin: 20rpx 0 0 20rpx;
							border: 1px solid #ccc;
							height: 58rpx;
							line-height: 58rpx;
							text-align: center;

							&.active {
								border: 1px solid #FFA098;
							}
						}
					}

					.model-align {
						display: flex;
						flex-wrap: wrap;

						view {
							width: 27%;
							border-radius: 10rpx;
							margin: 58rpx 0 0 20rpx;
							border: 1px solid #ccc;
							height: 58rpx;
							line-height: 58rpx;
							text-align: center;

							&.active {
								border: 1px solid #FFA098;
							}
						}
					}
				}

				.model-bottom {
					height: 80rpx;
					background: #efefef;
					display: flex;
					justify-content: space-around;
					font-size: 24rpx;
					border-radius: 0 0 20rpx 20rpx;

					.model-bottom-item {
						width: 100rpx;
						height: 80rpx;
						text-align: center;
						color: #999;

						image {
							margin-top: 8rpx;
							width: 32rpx;
							height: 32rpx;
						}
					}
				}
			}
		}

		.bottom-button {
			position: fixed;
			width: 100%;
			height: 100rpx;
			bottom: 0;
			display: flex;
			z-index: 5;
			view {
				flex: 1;
				line-height: 100rpx;
				text-align: center;
				&:first-child {
					color: #d0372b;
					background-color: #ffceca;
				}

				&:last-child {
					color: #fff;
					background-color: #ff9e97;
				}
			}
		}
	}
</style>
