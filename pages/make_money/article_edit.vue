<template>
	<view class="write">
		<view class="write-tip">点击文章任意部分进行编辑</view>
		<view class="write-top">
			<view class="write-pic" @click="showUploadImg=true;isArticlePicOrUploadImg='artPic';">
				<image :src="articlePic" mode="aspectFill"></image>
			</view>
			<textarea class='write-title-textarea' auto-height='true' :value="articleTitle" @input='inputChange($event)'
			 placeholder="请输入标题"></textarea>
		</view>
		<view class="write-detail">
			<image :src="avatarUrl" mode="aspectFill"></image>
			<view>
				<view>{{nickname}}</view>
				<view>{{changeTime}}</view>
			</view>
		</view>
		<view class="content">
			<view v-for="(item,index) in content" :ref="'content'+index" :class="{'active':active===index}" :key="index" @click="selectEdit(index)">
				<view v-if="/^<video([\s\S]*)<\/video>$/.test(item)">			
					<image :src="cloudUrl+'/videodefault.png'" style="width: 100%;height:277rpx;" mode="aspectFill"></image>
					<!-- <video :src='item.match(/src="([\s\S]*?)"/)[1]' style="border-radius:20rpx;width:100%;height:277rpx;object-fit:fill;" poster="http://bucketshop.oss-cn-hangzhou.aliyuncs.com/images/20200809/app_1596953889150c6yy.png"></video> -->
				</view>
				<view v-html="item" v-else></view>
			</view>
			<view class="ad-content">
				<view class="ad-line"></view>
				<view class="ad-text">广告</view>
				<view class="ad-line"></view>
			</view>
			<view class="ad-bottom" @click="showAdListModel()">
				
				<view class="advertise_display" v-if="adContent['advertisementType']==='IMAGE_TEXT_ADVERTISEMENT'">
					<image lazy-load class="img-box" :src="adContent.advertisementPic" mode="aspectFill"></image>
					<view class="right">
						<view class="title text font-bold">
							{{adContent.advertisementTitle}}
						</view>
						<view class="desc text">
							{{adContent.advertisementSynopsis}}
						</view>
						<view class="tips">
							推广
						</view>
					</view>
				</view>
				
				<view class="advertise_focus" v-if="adContent['advertisementType']==='FOLLOW_ADVERTISEMENT'">
					<image lazy-load class="img-box" :src="adContent.advertisementPic" mode="aspectFill"></image>
					<view class="right">
						<view class="l">
							<view class="title text font-bold">
								{{adContent.advertisementTitle}}
							</view>
							<view class="desc text">
								{{adContent.advertisementExplain}}
							</view>
						</view>
						<view class="tips">
							+关注
						</view>
					</view>
				</view>
				
				<view class="advertise_phone" v-if="adContent['advertisementType']==='TELEPHONE_ADVERTISEMENT'">
					<image lazy-load class="img-box" :src="adContent.advertisementPic" mode="aspectFill"></image>
					<view class="right">
						<view class="l">
							<view class="title text font-bold">
								{{adContent.advertisementTitle}}
							</view>
							<view class="desc text">
								{{adContent.advertisementExplain}}
							</view>
						</view>
						<view class="tips">
							<view class="iconfont icondianhua"></view>
							拨打
						</view>
					</view>
				</view>
				
				<view class="advertise_display" v-else-if="adContent['advertisementType']==='PICTURE_ADVERTISEMENT'">
					<image lazy-load class="adver-img" :src="adContent.advertisementPic" mode="aspectFill"></image>
				</view>
				
				<view class="advertise_display_card" v-else-if="adContent['advertisementType']==='BUSINESS_CARD_ADVERTISEMENT'" :style="{backgroundImage:'url('+adContent.backdropPic+')'}">
					<view class="name-box">
						<image lazy-load class="avatar" :src="adContent.advertisementPic" mode="aspectFill"></image>
						<view class="name-text">
							<view class="name">{{adContent.name}}</view>
						</view>
					</view>
					<view class="phone-box">
						<view class="left">
							<view class="phone-line">
								<text class="iconfont icondianhua"></text>
								{{adContent.phone}}
							</view>
							<view class="phone-line">
								<text class="iconfont iconweixin1"></text>
								{{adContent.weChatNum}}
							</view>
						</view>
						<view class="right">
							<view class="tips">
								扫描二维码加我咨询
							</view>
							<image lazy-load class="adqrcode-img"  :src="adContent.qrCode" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
			<!-- <view v-html="adContent" @click="showAdListModel()"></view> -->
		</view>
		<!-- 内容编辑工具 -->
		<view class="edit-box-wrap" :class="{'edit-box-show':showEdit}">
			<view class="close" @click="active=-1">✖</view>
			<view class="edit-box">
				<view class="edit-item" @click="deleteContent">
					<image src="/static/images/write/delete.png" mode="heightFix"></image>
					<view>删除内容</view>
				</view>
				<view class="edit-item" @click="showUploadImg=true;isArticlePicOrUploadImg='upload';">
					<image src="/static/images/write/img.png" mode="heightFix"></image>
					<view>插入图片</view>
				</view>
				<view class="edit-item" @click="showAdListModel()">
					<image src="/static/images/write/ad.png" mode="heightFix"></image>
					<view>插入广告</view>
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
		<!-- 插入广告 -->
		<view class="model-wrap" :class="{'model-wrap-show':showAdList}" v-if="showAdList">
			<view class="model">
				<view class="close" @click="showAdList=false">✖</view>
				<view class="model-title" style="border: 0;">
					<text>请选择你的广告</text>
					<view class="model-subtitle">单击广告完成插入</view>
				</view>
				<view class="model-type-list">
					<view class="type-view" v-for="(val,key) in adObj" :key="key" :class="{'active':advertisementType === key}" @click="showAdListModel(key)">
						{{val}}
					</view>
				</view>
				<scroll-view class="model-content" scroll-y="true" @scrolltolower="scrollAdtolower">
					<view v-if="adList.length===0" class="empty-ad">
						<view>您还没有任何{{adObj[advertisementType]}}广告哦，</view>
						<view>制作一次广告，可随时使用</view>
						<navigator url="/pages/spread/advertise_make">前往制作</navigator>
					</view>
					<view v-else-if="adObj[advertisementType]==='图文'">
						<view class="advertise_display" v-for="(ad,index) in adList" :key="index" @click="selectAdList(ad)">
							<image lazy-load class="img-box" :src="ad.advertisementPic" mode="aspectFill"></image>
							<view class="right">
								<view class="title text font-bold">
									{{ad.advertisementTitle}}
								</view>
								<view class="desc text">
									{{ad.advertisementSynopsis}}
								</view>
								<view class="tips">
									推广
								</view>
							</view>
						</view>
					</view>
					<view v-else-if="adObj[advertisementType]==='图片'">
						<view class="advertise_display" v-for="(ad,index) in adList" :key="index" @click="selectAdList(ad)">
							<image lazy-load class="adver-img" :src="ad.advertisementPic" mode="aspectFill"></image>
						</view>
					</view>
					<view v-else-if="adObj[advertisementType]==='关注'">
						<view class="advertise_focus" v-for="(ad,index) in adList" :key="index" @click="selectAdList(ad)">
							<image lazy-load class="img-box" :src="ad.advertisementPic" mode="aspectFill"></image>
							<view class="right">
								<view class="l">
									<view class="title text font-bold">
										{{ad.advertisementTitle}}
									</view>
									<view class="desc text">
										{{ad.advertisementExplain}}
									</view>
								</view>
								<view class="tips">
									+关注
								</view>
							</view>
						</view>
					</view>
					<view v-else-if="adObj[advertisementType]==='电话'">
						<view class="advertise_phone" v-for="(ad,index) in adList" :key="index" @click="selectAdList(ad)">
							<image lazy-load class="img-box" :src="ad.advertisementPic" mode="aspectFill"></image>
							<view class="right">
								<view class="l">
									<view class="title text font-bold">
										{{ad.advertisementTitle}}
									</view>
									<view class="desc text">
										{{ad.advertisementExplain}}
									</view>
								</view>
								<view class="tips">
									<view class="iconfont icondianhua"></view>
									拨打
								</view>
							</view>
						</view>
					</view>
					<view v-else-if="adObj[advertisementType]==='名片'">
						<view class="advertise_display_card" v-for="(ad,index) in adList" :key="index" @click="selectAdList(ad)" :style="{backgroundImage:'url('+ad.backdropPic+')'}">
							<view class="name-box">
								<image lazy-load class="avatar" :src="ad.advertisementPic" mode="aspectFill"></image>
								<view class="name-text">
									<view class="name">{{ad.name}}</view>
								</view>
							</view>
							<view class="phone-box">
								<view class="left">
									<view class="phone-line">
										<text class="iconfont icondianhua"></text>
										{{ad.phone}}
									</view>
									<view class="phone-line">
										<text class="iconfont iconweixin1"></text>
										{{ad.weChatNum}}
									</view>
								</view>
								<view class="right">
									<view class="tips">
										扫描二维码加我咨询
									</view>
									<image lazy-load class="adqrcode-img"  :src="ad.qrCode" mode="aspectFill"></image>
								</view>
							</view>
						</view>
					</view>
					<view class="model-loading"><text v-if="adList.length!==0 && isLoading">正在加载中...</text></view>
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
			<!-- 文章审核失败没有保存 直接发布 -->
			<view @click="goSave()" v-if="fromType!=4">保存</view>
			<view @click="goPublish">去发布</view>
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
				isArticlePicOrUploadImg: 'artPic',
				showEdit: false,
				showGoodList: false,
				showAdList: false,
				goodList: [],
				adObj: {
					IMAGE_TEXT_ADVERTISEMENT: '图文',
					PICTURE_ADVERTISEMENT: '图片',
					FOLLOW_ADVERTISEMENT: '关注',
					TELEPHONE_ADVERTISEMENT: '电话',
					BUSINESS_CARD_ADVERTISEMENT: '名片',
				},
				nickname: '',
				changeTime: '',
				avatarUrl: '',
				articlePic: '',
				advertisementSeqId: '',
				articleTitle: '',
				adList: [],
				advertisementType: 'IMAGE_TEXT_ADVERTISEMENT',
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
				showModelStyle: false,
				showModelStyleType: '',
				active: -1,
				contentType: '', // 当前选中内容的类型
				content: [
					'<div class="hs-text" style="color:#000;font-weight:normal;text-align:left;font-size:14px;">点击开始编辑文章内容</div>',
				],
				adContent: {
					advertisementType: "PICTURE_ADVERTISEMENT",
					advertisementPic: this.$webconfig.cloud_url+"/mall/img/defaultad.png"
				},
				customerSeqId: this.$common.getLocalSync('customerSeqId'),
				fromType: 1, //1原创 2别人文章制作 3我的文章再编辑 4审核失败再编辑 5url进入
				offerRewardSeqId: "" ,//悬赏id
				cloudUrl:this.$webconfig.cloud_url+'/mall/img'
			}
		},
		watch: {
			// 没有选中项则不展示编辑工具框
			active(val) {
				this.showEdit = val !== -1
			}
		},
		onLoad(option) {
			this.fromType = option.fromType;
			this.offerRewardSeqId = option.offerRewardSeqId;
			const curTime = new Date();
			this.changeTime =
				`${curTime.getFullYear()}-${('0'+(curTime.getMonth()+1)).slice(-2)}-${('0'+(curTime.getDate())).slice(-2)}`;
			
			let url="https://kan.china.com/qd/firefox/article/861638.html";
			// 判断是否是修改页面
			if (this.fromType == 3 || this.fromType == 4 || this.fromType == 5) {
				// 获取文章详情
				this.reEdit(option.seqId)
			} else if (this.fromType == 2) {
				this.reEdit(option.seqId, option.offerRewardSeqId)
			}

		},
		onShow() {
			if(this.showAdList){
				this.pageno = 1;
				this.adList = [];
				this.getAds();
			}
		},
		methods: {
			// 我的文章再编辑 审核失败再编辑
			reEdit(seqId, offerRewardSeqId) {
				this.$api.get('/o2oMyArticle/getArticleInfo', {
					params: {
						seqId: seqId,
						offerRewardSeqId: offerRewardSeqId ? offerRewardSeqId : ""
					}
				}).then(res => {
					if (res.code === 200) {
						let articleContent = res.data.articleContent || '';
						let content = [];
						if (articleContent.startsWith('<section>')) { // 内部文章
							let ac = articleContent.replace(/^<section>/g, '').replace(/<\/section>$/g, '').replace(/<a href="([^"]*?)" /g, ($0,$1)=>{
								return $0 + ' onclick="return false;"';
							});
							ac = ac ||
								'<div class="hs-text" style="color:#000;font-weight:normal;text-align:left;font-size:14px;">点击开始编辑文章内容</div>'
							content = ac.split(/<\/section><section>/);
						} else { // 外部文章
							let virdom = new Parser(articleContent, this).parse();
							content = this.articleToList(virdom, content);
						}
						if(res.data.advertisementSeqId){
							this.$api.get('/o2oAdvertisementSnapshot/getByPk',{
								params: {
									seqId: res.data.advertisementSeqId,
								}
							}).then(res => {
								this.adContent = res.data || {
									advertisementType: "PICTURE_ADVERTISEMENT",
									advertisementPic: this.cloudUrl+"/defaultad.png"
								}
							})
						}
						let data = res.data;
						this.content = content;
						this.articleTitle = data.articleTitle || '';
						this.changeTime = data.issuedDate || '';
						this.articlePic = data.articlePic
					}
				});
			},
			articleToList(virdom, content) {
				for(let i=0;i<virdom.length;i++){
					let curDom = virdom[i];
					if (curDom.name === 'img') {
						content.push(`<img style="width:100%" src="${curDom.attrs.src}" referrerPolicy="no-referrer"></img>`);
					} else if (curDom.name === 'video') {
						content.push(`<video src="${curDom.attrs.src}" style="border-radius:20rpx;width:100%;height:277rpx;object-fit:fill;" poster="${this.cloudUrl}/videodefault.png" controls></video>`);
					} else if (curDom.type === 'text') {
						content.push(`<div class="hs-text">${curDom.text}</div>`);
					}
					if(curDom.children && curDom.children.length>0){
						if(curDom.children.length===1&&curDom.children[0].type==="text"){
							let style = '';
							if(curDom.attrs&&curDom.attrs.style) {
								style=` style="${curDom.attrs.style}"`
							}
							content.push(`<div class="hs-text"${style}>${curDom.children[0].text}</div>`);
						} else {
							if(curDom.children.every((dom)=>{
								return (dom.name === 'span' || dom.name === 'strong' || dom.name === 'br' || dom.type === 'text');
							})){
								let style = '';
								if(curDom.attrs&&curDom.attrs.style) {
									style=` style="${curDom.attrs.style}"`
								}
								content.push(`<div class="out-text">${this.virdom2domstr(curDom,'')}</div>`);
							} else {
								content = this.articleToList(curDom.children,content);
							}
						}
					}
				}
				return content;
			},
			
			virdom2domstr(curDom, str) {
				let name =  curDom.name;
				let style = '';
				let src = '';
				if(curDom.attrs) {
					curDom.attrs.style && (style=` style="${curDom.attrs.style}"`)
					curDom.attrs.src && (src=` src="${curDom.attrs.src}"`)
				}
				if(curDom.type === 'text'){
					str += curDom.text;
				} else if (curDom.children&&curDom.children.length>0) {
					let childrenStr = ''
					curDom.children.forEach((item)=>{
						childrenStr += this.virdom2domstr(item, '')
					})			
					str += `<${name}${style}${src}>${childrenStr}</${name}>`;
				} else{
					if(name==='br'){
						str+='<br/>'
					}else{
						str += `<${name}${style}${src}></${name}>`;
					}
				}
				return str
			},
			dom2span(virdom, span) {
				for(let i=0;i<virdom.length;i++){
					let curDom = virdom[i];
					if (curDom.type === 'text') {
						span+=curDom.text;
					}else if(curDom.children&&curDom.children.length>0) {		
						span = this.dom2span(curDom.children, span);
					}
				}
				return span;
			},

			inputChange(event) {
				this.isHidePlaceholder = event.detail.cursor > 0
				this.articleTitle = event.detail.value;
			},
			// 选中内容编辑
			selectEdit(index) {
				// 获取当前选中内容的类别	
				const curContent = this.content[index];
				const contentTypeMap = new Map([
					[/^(<a href=".*">)?<img/, 'img'],
					[/^<video/, 'video'],
					[/^(<a href=".*">)?<div class="hs-text"/, 'text'],
					[/^<div class="out-text"/, 'text'], // 外部文章
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
						if(/^<div class="out-text"/.test(curContent)) { //外部文章
							this.fontWeight = 'normal';
							this.fontColor = '#000';
							this.fontSize = '14px';
							this.textAlign = 'left';
							let virdom = new Parser(curContent, this).parse();
							this.modalValue = this.dom2span(virdom, '');
						} else {
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
						}
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
			// 展示广告列表弹框
			showAdListModel(advertisementType) {
				this.showAdList = true;
				this.pageno = 1;
				this.adList = [];
				this.advertisementType = advertisementType || 'IMAGE_TEXT_ADVERTISEMENT';
				this.getAds();
			},
			scrollAdtolower() {
				this.pageno++;
				this.getAds();
			},
			selectAdList(ad) {
				this.adContent = ad;
				this.advertisementSeqId = ad.seqId;
				this.active = -1;
				this.showAdList = false;
			},
			getAds() {
				let _this = this;
				this.isLoading = true;
				this.$api.get('/o2oMyAdvertisement/findPageListByStatus', {
					params: {
						customerSeqId: this.customerSeqId,
						advertisementType: this.advertisementType,
						pageno: this.pageno
					}
				}).then(res => {
					let list = res.list
					_this.adList = _this.adList.concat(list);
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
									if(this.isArticlePicOrUploadImg==='artPic'){
										this.articlePic = res.data.viewUrl;
									}else{
										this.content.splice(this.active + 1, 0, `<img style="width:100%" src="${res.data.viewUrl}"></img>`);
										this.active = -1;
									}
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
			// release 保存成功是否直接发布
			goSave(release = false) {
				let msg = '';
				let content = this.content.map(res => {
					if (res !==
						'<div class="hs-text" style="color:#000;font-weight:normal;text-align:left;font-size:14px;">点击开始编辑文章内容</div>') {
						return `<section>${res.replace('onclick="return false;"','')}</section>`
					} else {
						return ''
					}
				}).join('');
				content === '' && (msg = '文章内容不能为空！');
				this.articlePic === '' && (msg = '文章封面图不能为空！');
				this.articleTitle === '' && (msg = '文章标题不能为空！');
				if (msg) {
					uni.showToast({
						icon: 'none',
						title: msg,
						duration: 2000
					});
					return;
				}
				// getApp().globalData.content = content;
				this.$api.post('/o2oMyArticle/insert1', {
					customerSeqId: this.customerSeqId,
					articleTitle: this.articleTitle,
					articlePic: this.articlePic,
					advertisementSeqId: this.advertisementSeqId,
					articleContent: content
				}).then(res => {
					let data = res.data;
					if (res.code === 200) {
						uni.showToast({
							title: '文章保存成功！',
							duration: 2000
						});
						if (release) {
							// 发布
							this.$store.commit('saveIssueArticle', {
								articleTitle: data.articleTitle,
								articleSeqId: data.seqId,
							});
							uni.redirectTo({
								url: '/pages/make_money/issue_reward'
							})
						} else {
							uni.redirectTo({
								url: "/pages/member/article_detail?seqId=" + data.seqId
							})
						}

					}
				})
			},
			// 审核失败再发布
			rePublish() {
				let msg = '';
				let content = this.content.map(res => {
					if (res !==
						'<div class="hs-text" style="color:#000;font-weight:normal;text-align:left;font-size:14px;">点击开始编辑文章内容</div>') {
						return `<section>${res.replace('onclick="return false;"','')}</section>`
					} else {
						return ''
					}
				}).join('');
				content === '' && (msg = '文章内容不能为空！');
				this.articlePic === '' && (msg = '文章封面图不能为空！');
				this.articleTitle === '' && (msg = '文章标题不能为空！');
				if (msg) {
					uni.showToast({
						icon: 'none',
						title: msg,
						duration: 2000
					});
					return;
				}
				this.$api.post('/o2oOfferReward/updateAfterSave', {
					userSeqId: this.customerSeqId,
					articleContent: content,
					articleTitle: this.articleTitle,
					articlePic: this.articlePic,
					advertisementSeqId: this.advertisementSeqId,
					offerRewardSeqId: this.offerRewardSeqId
				}).then(res => {
					let data = res.data;
					if (res.code === 200) {
						this.$box.confirm('文章审核中，请在我的-我的文章查看详情', false)
					}
				})

			},
			// 去发布
			goPublish() {
				if (this.fromType == 4) {
					// 审核失败再编辑直接发布，不用跳转
					this.rePublish()
				} else {
					this.goSave(true);
				}

			},
			// 获取用户信息
			getUserInfo() {
				this.$api.get('/login/getUserInfo', {
					params: {
						userId: this.customerSeqId
					}
				}).then(res => {
					if (res.code === 200) {
						this.nickname = res.data.nickname;
						this.avatarUrl = res.data.avatarUrl;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
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
			display: flex;
			padding: 0 30rpx 20rpx;
			height: 120rpx;

			.write-pic {
				width: 120rpx;
				height: 120rpx;
				border: 1px solid #ccc;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.write-title-textarea {
				flex: 1;
				margin: 5rpx 30rpx;
				width: 100%;
				font-size: 36rpx;
				max-height: 120rpx;
			}
		}

		.write-detail {
			padding: 10rpx 30rpx 0;
			display: flex;

			image {
				width: 60rpx;
				height: 60rpx;
				border-radius: 30rpx;
				background-color: #999;
			}

			view {
				margin-left: 10rpx;

				view {
					font-size: 24rpx;
					color: #b2b2b2;
					line-height: 40rpx;
				}
			}
		}

		.content {
			padding: 20rpx 30rpx 120rpx;
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

			/deep/ a {
				text-decoration: none;

				div {
					text-decoration: underline;
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
			
			.ad-content {
				display: flex;
				margin-top: 80rpx;
				.ad-line {
					flex: 1;
					height: 14rpx;
					border-bottom: 1px solid #ccc;
				}

				.ad-text {
					width: 50rpx;
					font-size: 20rpx;
					text-align: center;
					height: 30rpx;
					line-height: 30rpx;
				}
			}
		}

		.advertise_display {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				background: #fff;
				padding: 20rpx 0;
				border-radius: 10rpx;	
				border-bottom: 1px solid #ccc;
				
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
				padding: 20rpx 0;
				border-radius: 10rpx;
				border-bottom: 1px solid #ccc;
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
				padding: 20rpx 0;
				border-radius: 10rpx;
				border-bottom: 1px solid #ccc;
		
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
			width:100%;
			// height: 360rpx;
			padding: 20rpx 20rpx;
			background: url('@/static/images/adver-card-bg.png');
			background-repeat: no-repeat;
			background-size:cover;
			background-position: center center; 
			box-sizing: border-box;
			border-bottom: 1px solid #ccc;
			margin-top: 20rpx;
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
		
		.ad-bottom {
			.advertise_display {
				padding: 20rpx 30rpx;
			}
			.advertise_focus {
				padding: 20rpx 30rpx;
			}
			.advertise_phone {
				padding: 20rpx 30rpx;
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
			bottom: -300rpx;
			padding: 20rpx;
			box-shadow: 0px 0px 10px #999;
			background-color: #FFFFFF;
			transition: bottom 0.5s;
			border-radius: 10rpx;
			z-index: 1;

			&.edit-box-show {
				bottom: 115rpx;
			}

			.edit-box {
				height: 260rpx;
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
						margin-bottom: 10rpx;
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
