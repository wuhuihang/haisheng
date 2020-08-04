<template>
	<view class="write">
		<view class="write-tip">点击文章任意部分进行编辑</view>			
		<input class="write-title" placeholder="请输入标题" :value="articleTitle" @input="inputChange($event)"/>
		<view class="write-detail">
			<image :src="avatarUrl"></image>
			<view>
				<view>{{userName}}</view>
				<view>{{changeTime}}</view>
			</view>
		</view>
		<view class="content">
			<view
				v-for="(item,index) in content"
				:class="{'active':active===index}" 
				:key="index"
				@click="selectEdit(index)"
			>
				<!-- 处理richtext 无法解析video问题 -->
				<view v-if="/^<video([\s\S]*)<\/video>$/.test(item)">				
					<!-- 处理app video层级兼容问题 -->
					<image src="/static/images/write/video.jpg" style="width: 100%;"></image>
					<!-- <video :src='item.match(/src="([\s\S]*)"/)[1]'></video>	 -->
				</view>
				<view v-html="item" v-else></view>
			</view>
		</view>
		<!-- 内容编辑工具 -->
		<view class="edit-box-wrap" :class="{'edit-box-show':showEdit}">
			<view class="close" @click="active=-1">✖</view>
			<view class="edit-box">
				<view class="edit-item" @click="deleteContent">
					<image src="/static/images/write/delete.png" mode="heightFix"></image><view>删除内容</view>
				</view>
				<view class="edit-item" @click="showUploadImg=true">
					<image src="/static/images/write/img.png" mode="heightFix"></image><view>插入图片</view>
				</view>
				<view class="edit-item" @click="showAdListModel()">
					<image src="/static/images/write/ad.png" mode="heightFix"></image><view>插入广告</view>
				</view>
				<view class="edit-item" @click="showUploadVideo=true">
					<image src="/static/images/write/video.png" mode="heightFix"></image><view>插入视频</view>
				</view>
				<view class="edit-item" @click="showModel('insertSection')">
					<image src="/static/images/write/section.png" mode="heightFix"></image><view>插入段落</view>
				</view>
				<view class="edit-item" @click="showModel('modifySection')">
					<image src="/static/images/write/modify.png" mode="heightFix"></image><view>修改文字</view>
				</view>
				<view class="edit-item" @click="showModel('insertHref')">
					<image src="/static/images/write/link.png" mode="heightFix"></image><view>插入链接</view>
				</view>
				<view class="edit-item" @click="showGoodListModel()">
					<image src="/static/images/write/good.png" mode="heightFix"></image><view>插入商品</view>
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
					<view
						class="item-view"
						v-for="(item,index) in goodList"
						:key="index"
						@click="selectGoodList(item)"	
					>
						<view class="good-view">
							<image :src="item.mainPicUrl"></image>
							<view class="good-detail">
								<view>{{item.spuTitle2||''}}</view>
								<view>{{item.logisticFee||0}}</view>
							</view>
						</view>
					</view>
					<view class="model-loading"><text v-if="isLoading">正在加载中...</text></view>
				</scroll-view>
			</view>
		</view>
		<!-- 插入图片 -->
		<!-- 插入广告 -->
		<view class="model-wrap" :class="{'model-wrap-show':showAdList}">
			<view class="model">
				<view class="close" @click="showAdList=false">✖</view>
				<view class="model-title" style="border: 0;">
					<text>请选择广告</text>
					<view class="model-subtitle">单击完成插入</view>
				</view>
				<view class="model-type-list">
					<view
						class="type-view"
						v-for="(val,key) in adObj"
						:key="key"
						:class="{'active':advertisementType === key}"
						@click="showAdListModel(key)"	
					>
						{{val}}
					</view>
				</view>
				<scroll-view class="model-content" scroll-y="true" @scrolltolower="scrollAdtolower">
					<view v-if="adList.length===0" class="empty-ad">
						<view>您还没有任何{{adObj[advertisementType]}}广告哦，</view>
						<view>制作一次广告，可随时使用</view>
						<view>前往制作</view>
					</view>
					<view v-else-if="['图文','关注','电话'].includes(adObj[advertisementType])">
						<view class="ad-view" v-for="(ad,index) in adList" :key="index" @click="selectAdList(ad)">
							<img style="width: 120rpx;height: 120rpx;border-radius: 60rpx;" :src="ad.advertisementPic"></img>
							<view class="ad-detail">
								<view>{{ad.advertisementTitle}}</view>
								<view>{{ad.advertisementSynopsis||ad.advertisementExplain}}</view>
							</view>
							<view class="ad-button" v-if="adObj[advertisementType]==='关注'">
								+关注
							</view>
							<view class="ad-button" v-if="adObj[advertisementType]==='电话'">
								拨打
							</view>
						</view>
					</view>
					<view v-else-if="adObj[advertisementType]==='图片'">
						<view class="ad-view" v-for="(ad,index) in adList" :key="index" @click="selectAdList(ad)">
							<img style="width:100%;height:200rpx;border-radius:0;" :src="ad.advertisementPic"></img>
						</view>
					</view>
					<view v-else-if="adObj[advertisementType]==='名片'">
						<view class="card-view" v-for="(ad,index) in adList" :key="index" @click="selectAdList(ad)">
							<img style="width:100%;height:300rpx;" :src="ad.backdropPic"></img>
							<view class="card-view-body">
								<view class="card-view-left">
									<view class="card-view-name">
										<img style="width:80rpx;height:80rpx;border-radius: 40rpx;" :src="ad.advertisementPic"></img>
										<view><view>{{ad.name}}</view><view>Name</view></view>
									</view>
									<view class="card-view-phone">
										<img style="width:40rpx;height:40rpx;" src="/static/images/wechat.png"></img>
										<view><view>{{ad.phone}}</view><view>Tellphone Number</view></view>
									</view>
									<view class="card-view-phone">
										<img style="width:40rpx;height:40rpx;" src="/static/images/wechat.png"></img>
										<view><view>{{ad.weChatNum}}</view><view>Wei Xin</view></view>
									</view>
								</view>
								<view class="card-view-right">
									<img style="width:100%;height:100rpx;" :src="ad.qrCode"></img>
									<view>长按二维码加我咨询</view>
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
		<view class="model-wrap" :class="{'model-wrap-show':showModal}">
			<view class="model">
				<view class="model-cancle" @click="showModal=false">取消</view>
				<view class="model-confirm" @click="confirmModel">确定</view>
				<view class="model-title">{{modalType}}</view>
				<view class="model-content">
					<textarea 
						v-model="modalValue" 
						:style="{
							'font-weight':fontWeight,
							'color':fontColor,
							'font-size':fontSize,
							'text-align':textAlign
						}" 
						:placeholder="modalPlaceHolder" 
						placeholder-class="model-placeholder"
					></textarea>
				</view>
				<view class="model-style-wrap" v-show="showModelStyle">
					<view class="close" @click="showModelStyle=false">✖</view>
					<view class="model-color" v-if="showModelStyleType==='color'">
						<view
							v-for="(color,index) in fontColorList"
							:key="index"
							:style="{'background':color}"
							:class="{'active':fontColor===color}"
							@click="changeColor(color)"
						></view>
					</view>
					<view class="model-size" v-if="showModelStyleType==='size'">
						<view
							v-for="(size,index) in fontSizeList"
							:key="index"
							:style="{'font-size':size}"
							:class="{'active':fontSize===size}"
							@click="changeSize(size)"
						>{{size}}</view>
					</view>
					<view class="model-size" v-if="showModelStyleType==='align'">
						<view
							v-for="(align,index) in textAlignList"
							:key="index"
							:class="{'active':textAlign===align}"
							@click="changeAlign(align)"
						>{{align}}</view>
					</view>
				</view>
				<view class="model-bottom" v-if="modalType==='插入段落'||modalType==='修改文字'">
					<view class="model-bottom-item" @click="bold">
						<image src="/static/images/write/bold.png" mode="heightFix"></image><view>加粗</view>
					</view>
					<view class="model-bottom-item" @click="modelStyle('color')">
						<image src="/static/images/write/color.png" mode="heightFix"></image><view>颜色</view>
					</view>
					<view class="model-bottom-item" @click="modelStyle('size')">
						<image src="/static/images/write/size.png" mode="heightFix"></image><view>大小</view>
					</view>
					<view class="model-bottom-item" @click="modelStyle('align')">
						<image src="/static/images/write/size.png" mode="heightFix"></image><view>对齐</view>
					</view>
					<view class="model-bottom-item" @click="modalValue=''">
						<image src="/static/images/write/remove.png" mode="heightFix"></image><view>清空</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部保存发布按钮 -->
		<view class="bottom-button">
			<view @click="goSave">保存</view>
			<view @click="goPublish">去发布</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				api:this.$webconfig.api_url,
				showEdit: false,
				showGoodList: false,
				showAdList: false,
				goodList: [],
				adObj: {
					IMAGE_TEXT_ADVERTISEMENT:'图文',
					PICTURE_ADVERTISEMENT:'图片',
					FOLLOW_ADVERTISEMENT:'关注',
					TELEPHONE_ADVERTISEMENT:'电话',
					BUSINESS_CARD_ADVERTISEMENT:'名片',
				},
				userName: '',
				changeTime: '',
				avatarUrl: '',
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
				textAlignList: ['left','center','right'],
				fontSizeList: ['12px','14px','18px','20px','24px','28px'],
				fontColorList: ['#ea3323','#5c8ef1','#3d752e','#ee712f','#f09d37','#000','#88328d','#1c19c2','#fefb62','#a27c4f'],
				showModelStyle: false,
				showModelStyleType: '',
				active: -1,
				contentType: '', // 当前选中内容的类型
				content: [
					'<div class="hs-text" style="color:#000;font-weight:normal;text-align:left;font-size:14px;">点击开始编辑文章内容</div>',
				],
				customerSeqId:this.$common.getLocalSync('customerSeqId')
			}
		},
		watch: {
			// 没有选中项则不展示编辑工具框
			active(val) {
				this.showEdit = val !== -1
			}
		},
		onLoad(option){
			const curTime = new Date();	
			this.changeTime = `${curTime.getFullYear()}-${('0'+(curTime.getMonth()+1)).slice(-2)}-${('0'+(curTime.getDate())).slice(-2)}`;
			
			// 判断是否是修改页面
			if(option.isModify){	   
				// 获取文章详情
				this.$api.get('/o2oMyArticle/getArticleInfo', {
					params: {
						seqId: option.seqId
					}
			    }).then(res => {
					if(res.code===200){
						let articleContent = res.data.articleContent||'';
						let content = [];
						if(articleContent.startsWith('<section>')){ // 内部文章
							let content = articleContent.replace(/^<section>/g,'').replace(/<\/section>$/g,'') ||
								'<div class="hs-text" style="color:#000;font-weight:normal;text-align:left;font-size:14px;">点击开始编辑文章内容</div>';
							content = content.split(/<\/section><section>/);
						} else { // 外部文章
							const reg = /<([a-z]+?)(\s[\s\S]*?(style="[^"]*?")?(src="[^"]*?")?[\s\S]*?)?>(([\s\S]*?)<\/\1>)?/g; 
							// content = articleContent.match(reg)
							articleContent.replace(reg,($0,tag,style,$3,src,$5,text,index)=>{
								let tagList = text.match(reg);
								if(tagList){
									text.replace(reg,($0,tag,style,$3,src,$5,text,index)=>{
										if(tag==='img'||tag==='video'){
											content.push($0);
										} else {
											content.push(`<div class="hs-text" ${style}>${text}</div>`);
										}
										return '';
									})
								} else {
									if(tag==='img'||tag==='video'){
										content.push($0);
									} else {
										content.push(`<div class="hs-text" ${style}>${text}</div>`);
									}
								}
								return ''
							})
						}
						// content = getApp().globalData.content.replace(/^<section>/g,'').replace(/<\/section>$/g,'').split(/<\/section><section>/);
						this.content = content;
						this.articleTitle = res.data.articleTitle||'';
						this.changeTime = res.data.issuedDate||''; 
					}
			    });
			}
			this.$api.get('/login/getUserInfo', {
				params: {
					userId: this.customerSeqId
				}
			}).then(res => {
				if(res.code === 200){
					this.userName = res.data.userName;
					this.avatarUrl = res.data.avatarUrl;
				}
			})
		},
		methods: {
			inputChange(event) {
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
					[/^<div class="hs-good"/, 'good'],
				]);
				const contentTypeArr = [...contentTypeMap].filter(([key,value])=>(key.test(curContent)));
				this.contentType = (contentTypeArr[0] && contentTypeArr[0][1]) || '';
				this.active = index;
			},
			// 删除内容
			deleteContent(){
				if(this.active<0)
					return;
				this.content.splice(this.active, 1);
				this.active = -1;
			},
			// 显示模态弹框
			showModel(modalType) {
				// 获取当前选中内容的类别
				const curContent = this.content[this.active];
				const modalTypeMap = new Map([
					['insertVideoLink', ['视频链接','请输入要上传的视频链接']],
					['insertHref', ['插入链接','请输入要插入的链接']],
					['insertSection', ['插入段落','请输入文案']],
					['modifySection', ['修改文字','请输入文案']]
				]);
				
				this.modalType = modalTypeMap.get(modalType)[0];
				this.modalPlaceHolder = modalTypeMap.get(modalType)[1];
				
				if( 
					(modalType === 'modifySection' && this.contentType !== 'text') // 文本类型才能修改文案
					|| (modalType === 'insertHref' && this.contentType !== 'text' && this.contentType !== 'img') // 文本和图片才能插入超链接
				)
				return;
				
				const actions = new Map([
					[/insertHref/, ()=>{ // 设置链接初始文本
						const arrs = curContent.match(/^<a href="(.*?)"/) || [];
						this.modalValue = arrs[1]? arrs[1] : '';
					}],
					[/(insertVideoLink|insertSection)/, ()=>{ // 清空文本
						this.modalValue = '';
					}],
					[/(insertVideoLink|insertHref|insertSection)/, ()=>{ // 清空样式
						this.fontWeight = 'normal';
						this.fontColor = '#000';
						this.fontSize = '14px';
					}],
					[/modifySection/, ()=>{ // 修改文本需要设置样式及文本
						const arrs = curContent.match(/^(<a href="(.*?)"([^>]*)?>)?<div class="hs-text".+?>/);
						const color = curContent.match(/[^-]color:([^;]+);/);
						const weight = curContent.match(/font-weight:([^;]+);/);
						const size = curContent.match(/font-size:([^;]+);/);
						const align = curContent.match(/text-align:([^;]+);/);
						this.hasHref = arrs[2]?arrs[2]:'';
						this.modalValue = curContent.replace(/^(<a href=".*">)?<div class="hs-text".+?>/g,"").replace(/<\/div>(<\/a>)?$/g,"").replace(/<br\/>/g,'\n'); // 去掉首尾div标签
						this.fontColor = color?color[1]:'#000';
						this.fontWeight = weight?weight[1]:'normal';
						this.fontSize = size?size[1]:'14px';
						this.textAlign = align?align[1]:'left';
					}],
					[/.*/, ()=>{ // 展示弹框
						this.showModal = true;
						this.showModelStyle = false;
					}]
				]);	
				const action = [...actions].filter(([key,value])=>(key.test(modalType)))
				action.forEach(([key,value])=>value.call(this))
			},
			// 模态弹框确认
			confirmModel() {
				const actions = new Map([
					[/视频链接/, ()=>{
						this.content.splice(this.active+1, 0, `<video src="${this.modalValue}"></video>`);
						this.showUploadVideo = false;
					}],
					[/插入链接/, ()=>{
						// 清掉所有的a标签
						let content = this.content[this.active].replace(/^<a href="[^>]*?>/,"").replace(/<\/a>$/,"");
						this.modalValue.trim()!=='' && (content = `<a href="${this.modalValue}" onclick="return false;">${content}</a>`);
						this.content.splice(this.active, 1, content);
					}],
					[/插入段落|修改文字/, ()=>{ // 0为插入段落，1为修改文字
						const type = this.modalType === '插入段落' ? 0 : 1;
						let content = `<div class="hs-text" style="color:${this.fontColor};font-weight:${this.fontWeight};text-align:${this.textAlign};font-size:${this.fontSize};">${this.modalValue.replace(/\n/g,'<br/>')}</div>`;
						if(this.hasHref){
							content = `<a href="${this.hasHref}" onclick="return false;">${content}</a>`;
						}
						this.content.splice(this.active + (1 - type), type, content);
					}],
					[/.*/, ()=>{ // 关闭弹框
						this.showModal = false;
						this.active = -1;	
					}]
				])
				const action = [...actions].filter(([key,value])=>(key.test(this.modalType)));
				action.forEach(([key,value])=>value.call(this));
			},
			// 加粗
			bold() {
				this.fontWeight = this.fontWeight==='bold'?'normal':'bold';
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
				content = `<div class="hs-goods" seqId="${item.seqId}" merchantSeqId="${item.merchantSeqId}">
								<img src="${item.mainPicUrl}" style="width: 40%;height: 100px;border-radius: 10px;"></img>
								<div class="hs-goods-detail"><div>${item.spuTitle2}</div><div>${item.logisticFee}</div></div>
							</div>`;
				this.content.splice(this.active+1, 0, content);
				this.active = -1;
				this.showGoodList = false;
			},
			getGoods() {
				let _this = this;
				this.isLoading = true;
				this.$api.get('/o2oSpu/findPageCusForPc', {
					params: {
						user_seq_id: this.customerSeqId,
						onSale: 'SALE',
						pageno: this.pageno
					}
				}).then(res => {
					let list = res.list
					_this.goodList = _this.goodList.concat(list);
				}).finally(()=>{
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
				let content = {
					'IMAGE_TEXT_ADVERTISEMENT': 
						`<a href="${ad.advertisementLink}" onclick="return false;">
							<div class="hs-image-text">
								<img src="${ad.advertisementPic}" style="width: 60px;height: 60px;border-radius: 50%;"></img>
								<div class="hs-image-text-detail"><div>${ad.advertisementTitle}</div><div>${ad.advertisementSynopsis}</div></div>
							</div>
						</a>`,
					'PICTURE_ADVERTISEMENT': 
						`<a href="${ad.advertisementLink}" onclick="return false;"><img style="width:100%" src="${ad.advertisementPic}"></img></a>`,
					'FOLLOW_ADVERTISEMENT': 
						`<div class="hs-folow" qrCode="${ad.qrCode}">
							<img src="${ad.advertisementPic}" style="width: 60px;height: 60px;border-radius: 50%;"></img>
							<div class="hs-folow-phone-detail"><div>${ad.advertisementTitle}</div><div>${ad.advertisementExplain}</div></div>
							<div class="hs-folow-phone-button">+关注</div>
						</div>`,
					'TELEPHONE_ADVERTISEMENT': 
						`<div class="hs-phone" phone="${ad.phone}">
							<img src="${ad.advertisementPic}" style="width: 60px;height: 60px;border-radius: 50%;"></img>
							<div class="hs-folow-phone-detail"><div>${ad.advertisementTitle}</div><div>${ad.advertisementExplain}</div></div>
							<div class="hs-folow-phone-button">拨打</div>
						</div>`,
					'BUSINESS_CARD_ADVERTISEMENT': 
						`<div class="hs-card" backdropPic="${ad.backdropPic}" advertisementPic="${ad.advertisementPic}" name="${ad.name}" phone="${ad.phone}" weChatNum="${ad.weChatNum}" qrCode="${ad.qrCode}">
							<img src="${ad.backdropPic}" style="width:100%;height:100%;"></img>
							<div class="hs-card-body">
								<div class="hs-card-left">
									<div class="hs-card-name">
										<img style="height:100%;border-radius: 50%;" src="${ad.advertisementPic}"></img>
										<div class="hs-card-phone-text"><div>${ad.name}</div><div>Name</div></div>
									</div>
									<div class="hs-card-phone">
										<img style="height:100%;" src="/static/images/wechat.png"></img><div class="hs-card-phone-text"><div>${ad.phone}</div><div>Tellphone Number</div></div>
									</div>
									<div class="hs-card-phone">
										<img style="height:100%;" src="/static/images/wechat.png"></img><div class="hs-card-phone-text"><div>${ad.weChatNum}</div><div>Wei Xin</div></div>
									</div>
								</div>
								<div class="hs-card-right">
									<img style="width:100%;height:50%;pointer-events: auto!important;" src="${ad.qrCode}"></img><div>长按二维码加我咨询</div>
								</div>
							</div>
						</div>`,
				}[this.advertisementType];
				this.content.splice(this.active+1, 0, content);
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
				}).finally(()=>{
					this.isLoading = false;
				})
			},
			// 上传图片
			uploadImg(type) {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [['album','camera'][type]], //从相册选择
				    success: image => {
						if(image.tempFiles[0].size > 2*1024*1024){
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
				            url: this.api+'/sys/appeal/imgUpload',
				            filePath: image.tempFilePaths[0],
				            name: 'file',
				            success: (uploadFileRes) => {
				                let res = JSON.parse(uploadFileRes.data);
								if(res.code===200){
									uni.showToast({
									    title: '上传成功！',
									    duration: 2000
									});
									this.content.splice(this.active+1, 0, `<img style="width:100%" src="${res.data.viewUrl}"></img>`);	
									this.active = -1;
								}
				            },
				            fail: () => {
								uni.showToast({
									icon: 'none',
									title: '上传失败！',
									duration: 2000
								});
				            },
							complete: () => {
								uni.hideLoading();  
							}
				        });
				    }
				});
			},	
			// 上传视频
			uploadVideo() {
				let self = this;
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: video => {
						if(video.size > 10*1024*1024){
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
				            url: this.api+'/sys/appeal/imgUpload',
				            filePath: video.tempFilePath,
				            name: 'file',
				            success: (uploadFileRes) => {
				                let res = JSON.parse(uploadFileRes.data);
								if(res.code===200){
									uni.showToast({
									    title: '上传成功！',
									    duration: 2000
									});
									self.content.splice(self.active+1, 0, `<video src="${res.data.viewUrl}"></video>`);			
									self.active = -1;
								}
				            },
				            fail: () => {
								uni.showToast({
									icon: 'none',
									title: '上传失败！',
									duration: 2000
								});
				            },
							complete: () => {
								uni.hideLoading();  
							}
				        });
					}
				});
			},
			goSave() {
				let content = this.content.map(res=>{
					return `<section>${res.replace('onclick="return false;"','')}</section>`
				}).join('')
				// getApp().globalData.content = content;
				this.$api.post('/o2oMyArticle/insert1', {
					customerSeqId: this.customerSeqId,
					articleTitle: this.articleTitle,
					articleContent: content
				}).then(res => {
					if(res.code===200){
						uni.showToast({
							title: '上传成功！',
							duration: 2000
						});
						uni.navigateTo({
							url: "./article?seqId=" + res.data.seqId
						})
					}
				})
			},
			// 去发布
			goPublish() {
				
			}
		}
	}
</script>

<style lang="scss">
	.write{
		font-size: 30rpx;
		width: 100%;
		height: 100%;
		.write-tip {
			padding: 10rpx;
			text-align: center;
			color: #fd5549;
			font-size: 20rpx;
		}
		input.write-title {
			padding: 0 30rpx;
			font-size: 36rpx;
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
			> view {
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
				// img {
				// 	border-bottom: 1px solid #000;
				// }
			}
			/deep/ .hs-goods {
				display: flex;
				border: 1px solid #ccc;
				border-radius: 15rpx;
				padding: 15rpx;
				img, image {
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
			/deep/ .hs-image-text {
				display: flex;
				padding: 30rpx 10rpx;
				border: 1px solid #ccc;
				.hs-image-text-detail {
					flex: 1;
					padding-left: 20rpx;
					:first-child {
						display: block;
						color: #000;
						height: 50rpx;
						font-size: 30rpx;
					}
					:last-child {
						display: block;
						color: #999;
						font-size: 26rpx;
					}
				}
			}
			/deep/ .hs-folow {
				display: flex;
				padding: 30rpx 10rpx;
				border: 1px solid #ccc;
			}
			/deep/ .hs-phone {
				display: flex;
				padding: 30rpx 10rpx;
				border: 1px solid #ccc;
			}
			/deep/ .hs-folow-phone-detail {
				flex: 1;
				padding-left: 20rpx;
				:first-child {
					display: block;
					color: #000;
					height: 50rpx;
					font-size: 30rpx;
				}
				:last-child {
					display: block;
					color: #999;
					font-size: 26rpx;
				}
			}
			/deep/ .hs-folow-phone-button {
				margin-top: 30rpx;
				width: 120rpx;
				height: 40rpx;
				font-size: 26rpx;
				border-radius: 40rpx;
				border: 1px solid #FF0000;
				color: #FF0000;
				text-align: center;
				line-height: 40rpx;
			}
			/deep/ .hs-card {
				padding: 30rpx 10rpx;
				height: 300rpx;
				border: 1px solid #ccc;
				position: relative;
				.hs-card-body {
					position: absolute;
					top: 30rpx;
					left: 10rpx;
					width: 97%;
					height: 300rpx;
					box-sizing: border-box;
					padding: 40rpx;
					display: flex;
					overflow: hidden;
					.hs-card-left {
						flex: 1;
						.hs-card-name {
							height: 80rpx;
							margin-bottom: 30rpx;
							display: flex;
							.hs-card-phone-text {
								flex: 1;
								margin-left: 20rpx;
								font-size: 20rpx;
								:first-child {
									font-size: 26rpx;
									height: 40rpx;
								}
								:last-child {
									height: 40rpx;
								}
							}
						}
						.hs-card-phone {
							height: 40rpx;
							margin-bottom: 20rpx;
							display: flex;
							.hs-card-phone-text {
								flex: 1;
								margin-left: 5rpx;
								font-size: 12rpx;
								:first-child {
									font-size: 14rpx;
									height: 20rpx;
								}
								:last-child {
									height: 20rpx;
								}
							}
						}
					}
					.hs-card-right {
						width: 180rpx;
						font-size: 20rpx;
						line-height: 30rpx;
					}
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
			bottom: -300rpx;
			padding: 30rpx;
			box-shadow: 0px 0px 10px #999;
			background-color: #FFFFFF;
			transition: bottom 0.5s;
			border-radius: 10rpx;
			z-index:1;
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
					image {
						width: 45rpx;
						height: 45rpx;
						margin-bottom: 10rpx;
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
			background: rgba(0,0,0,0.2);
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
			background: rgba(0,0,0,0.2);
			z-index: 99;
			visibility: hidden;
			transition: visibility 0.3s;
			&.model-wrap-show {
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
					padding: 20rpx 30rpx;
					border-bottom: 1px solid #E8E8E8;
					text-align: center;
					// height: 30rpx;
					.model-subtitle {
						font-size: 26rpx;
						color: #ccc;
					}
				}
				.model-type-list {
					height: 80rpx;
					background-color: #DADADA;
					display: flex;
					.type-view {
						flex: 1;
						margin-top: 10rpx;
						height: 60rpx;
						text-align: center;
						line-height: 60rpx;
						&.active {
							background-color: #FF0000;
							color: #fff;
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
					max-height: 500rpx;
					width: 100%;
					box-sizing: border-box;
					overflow: auto;
					padding: 0 30rpx 0;
					.item-view {
						padding-bottom: 10rpx;
						border-bottom: 1px solid #ccc;
						margin-bottom: 18rpx;
						.good-view {
							display: flex;
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
							}
						}
					}
					.ad-view {
						display: flex;
						padding: 30rpx 10rpx;
						border-bottom: 1px solid #ccc;
						.ad-detail {
							flex: 1;
							padding-left: 20rpx;
							:first-child {
								height: 50rpx;
								font-size: 30rpx;
							}
							:last-child {
								color: #999999;
								font-size: 26rpx;
							}
						}
						.ad-button {
							margin-top: 30rpx;
							width: 120rpx;
							height: 40rpx;
							font-size: 26rpx;
							border-radius: 40rpx;
							border: 1px solid #FF0000;
							color: #FF0000;
							text-align: center;
							line-height: 40rpx;
						}
					}
					.card-view {
						padding: 30rpx 10rpx;
						border-bottom: 1px solid #ccc;
						position: relative;
						.card-view-body {
							position: absolute;
							top: 30rpx;
							left: 10rpx;
							width: 97%;
							height: 300rpx;
							box-sizing: border-box;
							padding: 40rpx;
							display: flex;
							overflow: hidden;
							.card-view-left {
								flex: 1;
								.card-view-name {
									height: 80rpx;
									margin-bottom: 30rpx;
									display: flex;
									& > view {
										flex: 1;
										margin-left: 20rpx;
										font-size: 20rpx;
										:first-child {
											font-size: 26rpx;
											height: 40rpx;
										}
									}
								}
								.card-view-phone {
									height: 40rpx;
									margin-bottom: 20rpx;
									display: flex;
									& > view {
										flex: 1;
										margin-left: 5rpx;
										font-size: 12rpx;
										:first-child {
											font-size: 14rpx;
											height: 20rpx;
										}
									}
								}
							}
							.card-view-right {
								width: 180rpx;
								font-size: 20rpx;
								line-height: 30rpx;
							}
						}
					}
					.model-loading {
						text-align: center;
						height:40rpx;
					}
					.empty-ad {
						margin-top: 100rpx;
						font-size: 26rpx;
						text-align: center;
						& :last-child {
							margin-top: 20rpx;
							width: 240rpx;
							border-radius: 20rpx;
							font-size: 30rpx;
							display: inline-block;
							color: #fff;
							background: #00BFFF;
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
