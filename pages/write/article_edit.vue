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
				<!-- 处理richtext 无法解析video问题 -->
				<view v-if="/^<video([\s\S]*)<\/video>$/.test(item)">
					<!-- 处理app video层级兼容问题 -->
					<image src="/static/images/write/video.jpg" style="width: 100%;"></image>
					<!-- <video :src='item.match(/src="([\s\S]*)"/)[1]'></video>	 -->
				</view>
				<view v-html="item" v-else></view>
			</view>
			<view class="ad-content">
				<view class="ad-line"></view>
				<view class="ad-text">广告</view>
				<view class="ad-line"></view>
			</view>
			<view v-html="adContent" @click="showAdListModel()"></view>
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
								<view class="good-title">{{item.spuTitle2||''}}</view>
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
		<view class="model-wrap" :class="{'model-wrap-show':showAdList}" v-if="showAdList">
			<view class="model">
				<view class="close" @click="showAdList=false">✖</view>
				<view class="model-title" style="border: 0;">
					<text>请选择广告</text>
					<view class="model-subtitle">单击完成插入</view>
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
					<view v-else-if="['图文','关注','电话'].includes(adObj[advertisementType])">
						<view class="ad-view" v-for="(ad,index) in adList" :key="index" @click="selectAdList(ad)">
							<image style="width: 120rpx;height: 120rpx;border-radius: 60rpx;" :src="ad.advertisementPic" mode="aspectFill"></image>
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
							<image style="width:100%;height:200rpx;border-radius:0;" :src="ad.advertisementPic" mode="aspectFill"></image>
						</view>
					</view>
					<view v-else-if="adObj[advertisementType]==='名片'">
						<view class="card-view" v-for="(ad,index) in adList" :key="index" @click="selectAdList(ad)">
							<image style="width:100%;height:300rpx;" :src="ad.backdropPic" mode="aspectFill"></image>
							<view class="card-view-body">
								<view class="card-view-left">
									<view class="card-view-name">
										<image style="width:80rpx;height:80rpx;border-radius: 40rpx;" mode="aspectFill" :src="ad.advertisementPic"></image>
										<view>
											<view>{{ad.name}}</view>
											<view>Name</view>
										</view>
									</view>
									<view class="card-view-phone">
										<image style="width:40rpx;height:40rpx;" mode="aspectFill" src="http://bucketshop.oss-cn-hangzhou.aliyuncs.com/images/20200806/app_1596644677256rs6c.png"></image>
										<view>
											<view>{{ad.phone}}</view>
											<view>Tellphone Number</view>
										</view>
									</view>
									<view class="card-view-phone">
										<image style="width:40rpx;height:40rpx;" mode="aspectFill" src="http://bucketshop.oss-cn-hangzhou.aliyuncs.com/images/20200806/app_1596644677256rs6c.png"></image>
										<view>
											<view>{{ad.weChatNum}}</view>
											<view>Wei Xin</view>
										</view>
									</view>
								</view>
								<view class="card-view-right">
									<image style="width:100%;height:180rpx;" mode="aspectFill" :src="ad.qrCode"></image>
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
					 :maxlength="-1" :placeholder="modalPlaceHolder" placeholder-class="model-placeholder"></textarea>
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
				adContent: '<img style="width:100%" src="http://bucketshop.oss-cn-hangzhou.aliyuncs.com/images/20200806/app_1596644553182r27d.png">',
				customerSeqId: this.$common.getLocalSync('customerSeqId'),
				fromType: 1, //1原创 2别人文章制作 3我的文章再编辑 4审核失败再编辑 5url进入
				offerRewardSeqId: "" //悬赏id
			}
		},
		watch: {
			// 没有选中项则不展示编辑工具框
			active(val) {
				this.showEdit = val !== -1
			}
		},
		onLoad(option) {
			console.log(this)
			this.fromType = option.fromType;
			this.offerRewardSeqId = option.offerRewardSeqId;
			const curTime = new Date();
			console.log(this.fromType);
			this.changeTime =
				`${curTime.getFullYear()}-${('0'+(curTime.getMonth()+1)).slice(-2)}-${('0'+(curTime.getDate())).slice(-2)}`;
			this.getUserInfo();
			// 判断是否是修改页面
			if (this.fromType == 3 || this.fromType == 4) {
				// 获取文章详情
				this.reEdit(option.seqId)
			} else if (this.fromType == 2) {
				this.reEdit(option.seqId, option.offerRewardSeqId)
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
					// res = {"code":200,"msg":"成功","data":{"seqId":"1480843bc5d0ed24fe89cb67b8af38e3618","articleTitle":"桐城市麦安日化有限公司 ","articlePic":"https://buckethisheng.oss-cn-qingdao.aliyuncs.com/images/20200807/app_1596764664969dr9p.jpg","customerSeqId":"12340a913c8e557dc8a80","customerName":"hello","customerIdentitySeqId":null,"issuedDate":"2020-08-07 09:46:16","readNum":41,"praiseNum":1,"articleContent":"<p class=\"\" style=\"\">&nbsp; &nbsp; &nbsp; &nbsp;桐城市麦安日化有限公司经销批发的牙刷畅销消费者市场，在消费者当中享有较高的地位，公司与多家零售商和代理商建立了长期稳定的合作关系。桐城市麦安日化有限公司经销的牙刷品种齐全、价格合理。桐城市麦安日化有限公司实力雄厚，重信用、守合同、保证产品质量，以多品种经营特色和薄利多销的原则，赢得了广大客户的信任。<div><br><div>联系人:李女士</div><div>电话：18244605202</div><div class=\"\">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：中国 安徽 安庆市 新渡镇华东塑料城B区7号</div>\n\t\t\t\t\t\t\t\t<div class=\"Eleditor-img-area\">\n\t\t\t\t\t\t\t\t\t< img src=\"https://buckethisheng.oss-cn-qingdao.aliyuncs.com/images/20200807/app_15967646561043v8s.jpg\" style=\"width:100%;height:auto;margin:10px auto\">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div></p >","headSeqId":"9478755ab7464af4853d6f1b6f578135","advertisementSeqId":null,"headPortrait":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erU6YrRTFQxrATvfuo4AdoGEaW1ojm6hjUVDqZnylaNxqkriaxPOfAwmicCpRkhcE6NyTXf5VzMTeFQ/132","identitySeqId":null,"identityName":null,"articleSource":null}}
					// res = {"code":200,"msg":"成功","data":{"seqId":"4408c8f0edf244329b98ac611839f5c2","articleTitle":"护手霜","articlePic":"https://bucketshop.oss-cn-hangzhou.aliyuncs.com/images/20200714/app_1594691466933qd8s.png","customerSeqId":"9f9b626a907f4f40a913c8e557dc8a80","customerName":"胖头鱼","customerIdentitySeqId":null,"issuedDate":"2020-07-14 09:53:56","readNum":19,"praiseNum":1,"articleContent":"<p class=\"\" style=\"\"><div><br></div><div><div class=\"rt-head\" style=\"position: fixed; top: 0px; left: 0px; right: 0px; z-index: 510; height: 44px; font-size: 16px; line-height: 44px; color: rgb(51, 51, 51); user-select: none; transform: translate3d(0px, 0px, 0px); font-family: Arial, Helvetica, sans-serif;\"><div class=\"topbar\" id=\"topbar\" style=\"height: 44px; position: fixed; top: 0px; left: 0px; width: 360px; z-index: 1000; border-bottom: 1px solid rgb(230, 230, 230);\"><div class=\"spark-icon top-icon\" id=\"J-spark-icon\" style=\"position: absolute; top: 0px; width: 0.3rem; text-align: center; left: 0.6rem; height: 43px;\"><img class=\"img-icon_spark\" src=\"https://bkssl.bdimg.com/static/wiki-m-lemma/widget/header-n/headerbar/img/spark-icon_9a2d20c.png\" style=\"border-style: initial; width: 0.2rem; vertical-align: middle; position: absolute; top: 0.1rem; right: 0.04rem;\"></div><div class=\"more-icon top-icon\" id=\"J-more-icon\" style=\"position: absolute; top: 0px; width: 0.3rem; text-align: center; right: 0.12rem;\"><span class=\"layout-icons layout-icons_new-more\" style=\"color: rgb(0, 0, 0); font-family: baikeFont_layout; line-height: 0.44rem; font-size: 0.22rem;\"></span></div><div class=\"search-icon top-icon\" id=\"J-search-icon\" style=\"position: absolute; top: 0px; width: 0.3rem; text-align: center; right: 0.6rem;\"><span class=\"layout-icons layout-icons_new-search\" style=\"color: rgb(0, 0, 0); font-family: baikeFont_layout; line-height: 0.44rem; font-size: 0.22rem;\"></span></div></div><div class=\"top-place J-top-place\" style=\"height: 0.44rem;\"></div></div><div class=\"rt-body\" style=\"padding-top: 44px; color: rgb(0, 0, 0); font-family: Arial, Helvetica, sans-serif; font-size: 13px;\"><div id=\"J-lemma\" class=\"J-lemma\" style=\"position: relative; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><img src=\"https://bkimg.cdn.bcebos.com/smart/9f2f070828381f30627638b8a6014c086e06f0b0-bkimg-process,v_1,rw_1,rh_1,maxl_114\" alt=\"\" style=\"border-style: initial; width: 0px; height: 0px; position: absolute;\"><div id=\"header_wrapper\" class=\"header-wrapper\"><div id=\"J-catalog-button-fixed\" class=\"button-fixed catalog-button-fixed\" style=\"border: 1px solid rgb(221, 221, 221); text-align: center; position: fixed; z-index: 999; background: rgba(255, 255, 255, 0.93); box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 7px 0px; font-size: 0.13rem; width: 0.39rem; height: 0.39rem; line-height: 0.39rem; border-radius: 50%; bottom: 1.03rem; right: 0.17rem;\"><span style=\"font-size: 0.13rem; font-weight: 700;\">目录</span></div><div id=\"J-tashuo-button-fixed\" class=\"button-fixed tashuo-button-fixed\" style=\"border: 1px solid rgb(221, 221, 221); text-align: center; position: fixed; z-index: 999; background: rgba(255, 255, 255, 0.93); box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 7px 0px; font-size: 0.13rem; width: 0.39rem; height: 0.39rem; line-height: 0.39rem; border-radius: 50%; bottom: 0.56rem; right: 0.17rem;\"><a data-sf-href=\"/tashuolist/%E6%8A%A4%E6%89%8B%E9%9C%9C/3536284?tashuoStyle=bottomRight&amp;fromLemmaTitle=%E6%8A%A4%E6%89%8B%E9%9C%9C&amp;fromLemmaId=3536284\" href=\"https://baike.baidu.com/tashuolist/%E6%8A%A4%E6%89%8B%E9%9C%9C/3536284?tashuoStyle=bottomRight&amp;fromLemmaTitle=%E6%8A%A4%E6%89%8B%E9%9C%9C&amp;fromLemmaId=3536284\" class=\"go-tashuo\" style=\"color: rgb(58, 127, 222); display: block; width: 0.41rem; height: 0.41rem;\"><span class=\"layout-icons layout-icons_new-tashuo\" style=\"color: rgb(0, 0, 0); font-family: baikeFont_layout; font-size: 13px; margin-left: -2px;\"></span></a></div><div class=\"top-component J-top-component\" style=\"height: 0.44rem; margin-top: -0.44rem;\"></div></div><div class=\"BK-body-wrapper\" id=\"BK_body_wrapper\" style=\"background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; color: rgb(51, 51, 51); overflow-wrap: break-word;\"><div id=\"BK_before_content_wrapper\" class=\"BK-before-content-wrapper\"><div class=\"full-screen-second_prestrain\" style=\"width: 100vw; height: 66vw; background-color: rgb(0, 0, 0);\"><div class=\"full-screen-second-container\" style=\"position: relative; overflow: hidden; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><div id=\"J-second-summary\" class=\"second-img-container\" style=\"position: relative; width: 99999px; left: 0px;\"><div class=\"second-summary J-invoke-2ndvideoflow\" data-showtype=\"image\" style=\"position: relative; float: left; overflow: hidden; background-size: cover; background-position: center center; background-repeat: no-repeat; width: 360px; height: 237.6px; background-image: url(&quot;https://timg03.bdimg.com/timg?wapbaike&amp;quality=90&amp;size=b960_640&amp;sec=1349839550&amp;di=594ffd24a28965795900212af86a52d5&amp;src=http://bkimg.cdn.bcebos.com/pic/b03533fa828ba61e4633468b4934970a314e59b1&quot;);\"><a class=\"summary-link\" data-href=\"//baike.baidu.com/pic/%E6%8A%A4%E6%89%8B%E9%9C%9C/3536284/0/b03533fa828ba61e4633468b4934970a314e59b1?bk_fr=view_summary\" data-sf-href=\"/pic/%E6%8A%A4%E6%89%8B%E9%9C%9C/3536284/0/b03533fa828ba61e4633468b4934970a314e59b1?bk_fr=view_summary\" style=\"color: rgb(58, 127, 222); display: block; width: 360px; height: 237.594px;\"><div class=\"second-mask\" style=\"position: absolute; left: 0px; bottom: 0px; width: 360px; height: 120px; background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4));\"></div></a></div><div class=\"second-summary J-invoke-2ndvideoflow\" data-index=\"0\" data-mediaid=\"mda-O9tgwXY16SVdPBHF\" data-secondid=\"439928\" data-url=\"//baike.baidu.com/wikisecond/videoflow?secondId=439928&amp;lemmaId=3536284&amp;from=lemma\" data-type=\"0\" data-playurl=\"https://baikevideo.cdn.bcebos.com/media/mda-O9tgwXY16SVdPBHF/8d6eafba7158b67c05681ad19fe29933.m3u8\" data-playmp4url=\"https://baikevideo.cdn.bcebos.com/media/mda-O9tgwXY16SVdPBHF/e96809904f78d0e4544139982da46715.mp4\" data-player=\"\" style=\"position: relative; float: left; overflow: hidden; background-size: cover; background-position: center center; background-repeat: no-repeat; width: 360px; height: 237.6px; background-image: url(&quot;https://bkimg.cdn.bcebos.com/smart/fc1f4134970a304ea35bb1f2ddc8a786c9175cb8-bkimg-process,v_1,rw_16,rh_9,maxl_800&quot;);\"><span class=\"second-slogan-icon\" style=\"position: absolute; background: url(&quot;https://baikebcs.bdimg.com/front-end/second-know/img/logo-small.png&quot;) center center / contain no-repeat; display: inline-block; vertical-align: middle; z-index: 1; left: 0.1rem; top: 0.1rem; width: 0.74rem; height: 0.17rem;\"></span><div class=\"second-mask\" style=\"position: absolute; left: 0px; bottom: 0px; width: 360px; height: 120px; background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4));\"></div><div class=\"second-play-container\" style=\"position: absolute; width: 360px; left: 0px; bottom: 18px;\"><div class=\"play-icon\" style=\"position: absolute; left: 0.13rem; width: 40px; height: 40px; border: 1px solid rgb(255, 255, 255); background: rgba(0, 0, 0, 0.3); border-radius: 50%;\"><span class=\"layout-icons layout-icons_new-fullTriangle\" style=\"color: rgb(255, 255, 255); font-family: baikeFont_layout; display: block; font-size: 0.4rem; position: absolute; top: 20px; left: 20px; transform: translate(-50%, -50%);\"></span></div><div class=\"play-title\" style=\"margin-left: 65px; color: rgb(255, 255, 255); font-size: 0.13rem; line-height: 0.21rem;\"><span class=\"title\" style=\"display: block; font-size: 0.18rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; overflow-wrap: normal; width: 236px;\">护手霜的神奇用法</span><span class=\"vv\" style=\"display: inline-block; font-size: 0.14rem;\"><span class=\"layout-icons layout-icons_eye\" style=\"font-family: baikeFont_layout; font-size: 0.17rem; vertical-align: -4px; margin-right: 0.05rem;\"></span>1.1万</span>&nbsp;<span class=\"duration\" style=\"font-size: 0.14rem; margin-left: 0.12rem;\"><span class=\"layout-icons layout-icons_clock\" style=\"font-family: baikeFont_layout; vertical-align: -2px; margin-right: 0.05rem;\"></span>2'24\"</span></div></div></div><div class=\"second-summary J-invoke-2ndvideoflow\" data-index=\"1\" data-mediaid=\"\" data-secondid=\"14859895\" data-url=\"//baike.baidu.com/wikisecond/videoflow?secondId=14859895&amp;lemmaId=3536284&amp;from=lemma\" data-type=\"1\" data-playurl=\"http://vd3.bdstatic.com/mda-jitqix0z8dpwxqp7/mda-jitqix0z8dpwxqp7.mp4?playlist=%5B%22hd%22%2C%22sc%22%5D\" data-playmp4url=\"https://vd3.bdstatic.com/mda-jitqix0z8dpwxqp7/mda-jitqix0z8dpwxqp7.mp4?playlist=%5B%22hd%22%2C%22sc%22%5D\" data-player=\"\" style=\"position: relative; float: left; overflow: hidden; background-size: cover; background-position: center center; background-repeat: no-repeat; width: 360px; height: 237.6px; background-image: url(&quot;https://bkimg.cdn.bcebos.com/smart/f11f3a292df5e0fe683f241e536034a85edf728e-bkimg-process,v_1,rw_16,rh_9,maxl_800&quot;);\"><span class=\"second-slogan-icon\" style=\"position: absolute; background: url(&quot;https://baikebcs.bdimg.com/front-end/second-know/img/logo-small.png&quot;) center center / contain no-repeat; display: inline-block; vertical-align: middle; z-index: 1; left: 0.1rem; top: 0.1rem; width: 0.74rem; height: 0.17rem;\"></span><div class=\"second-mask\" style=\"position: absolute; left: 0px; bottom: 0px; width: 360px; height: 120px; background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4));\"></div><div class=\"second-play-container\" style=\"position: absolute; width: 360px; left: 0px; bottom: 18px;\"><div class=\"play-icon\" style=\"position: absolute; left: 0.13rem; width: 40px; height: 40px; border: 1px solid rgb(255, 255, 255); background: rgba(0, 0, 0, 0.3); border-radius: 50%;\"><span class=\"layout-icons layout-icons_new-fullTriangle\" style=\"color: rgb(255, 255, 255); font-family: baikeFont_layout; display: block; font-size: 0.4rem; position: absolute; top: 20px; left: 20px; transform: translate(-50%, -50%);\"></span></div><div class=\"play-title\" style=\"margin-left: 65px; color: rgb(255, 255, 255); font-size: 0.13rem; line-height: 0.21rem;\"><span class=\"title\" style=\"display: block; font-size: 0.18rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; overflow-wrap: normal; width: 236px;\">老外把胶水当成护手霜用，撕下的瞬间，简直不要太酸爽</span><span class=\"vv\" style=\"display: inline-block; font-size: 0.14rem;\"><span class=\"layout-icons layout-icons_eye\" style=\"font-family: baikeFont_layout; font-size: 0.17rem; vertical-align: -4px; margin-right: 0.05rem;\"></span>5339</span>&nbsp;<span class=\"duration\" style=\"font-size: 0.14rem; margin-left: 0.12rem;\"><span class=\"layout-icons layout-icons_clock\" style=\"font-family: baikeFont_layout; vertical-align: -2px; margin-right: 0.05rem;\"></span>1'7\"</span></div></div></div><div class=\"second-summary J-invoke-2ndvideoflow\" data-index=\"2\" data-mediaid=\"\" data-secondid=\"25196312\" data-url=\"//baike.baidu.com/wikisecond/videoflow?secondId=25196312&amp;lemmaId=3536284&amp;from=lemma\" data-type=\"1\" data-playurl=\"http://vd3.bdstatic.com/mda-kbds0yncach46hbw/v1-cae/mda-kbds0yncach46hbw.mp4?playlist=%5B%22sc%22%2C%22hd%22%5D\" data-playmp4url=\"https://vd3.bdstatic.com/mda-kbds0yncach46hbw/v1-cae/mda-kbds0yncach46hbw.mp4?playlist=%5B%22sc%22%2C%22hd%22%5D\" data-player=\"\" style=\"position: relative; float: left; overflow: hidden; background-size: cover; background-position: center center; background-repeat: no-repeat; width: 360px; height: 237.6px; background-image: url(&quot;https://bkimg.cdn.bcebos.com/smart/9a504fc2d56285359668e2799fef76c6a6ef63d9-bkimg-process,v_1,rw_16,rh_9,maxl_800&quot;);\"><span class=\"second-slogan-icon\" style=\"position: absolute; background: url(&quot;https://baikebcs.bdimg.com/front-end/second-know/img/logo-small.png&quot;) center center / contain no-repeat; display: inline-block; vertical-align: middle; z-index: 1; left: 0.1rem; top: 0.1rem; width: 0.74rem; height: 0.17rem;\"></span><div class=\"second-mask\" style=\"position: absolute; left: 0px; bottom: 0px; width: 360px; height: 120px; background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4));\"></div><div class=\"second-play-container\" style=\"position: absolute; width: 360px; left: 0px; bottom: 18px;\"><div class=\"play-icon\" style=\"position: absolute; left: 0.13rem; width: 40px; height: 40px; border: 1px solid rgb(255, 255, 255); background: rgba(0, 0, 0, 0.3); border-radius: 50%;\"><span class=\"layout-icons layout-icons_new-fullTriangle\" style=\"color: rgb(255, 255, 255); font-family: baikeFont_layout; display: block; font-size: 0.4rem; position: absolute; top: 20px; left: 20px; transform: translate(-50%, -50%);\"></span></div><div class=\"play-title\" style=\"margin-left: 65px; color: rgb(255, 255, 255); font-size: 0.13rem; line-height: 0.21rem;\"><span class=\"title\" style=\"display: block; font-size: 0.18rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; overflow-wrap: normal; width: 236px;\">过期的护手霜不要扔，放在家中原来这么厉害，一年能省不少钱</span><span class=\"vv\" style=\"display: inline-block; font-size: 0.14rem;\"><span class=\"layout-icons layout-icons_eye\" style=\"font-family: baikeFont_layout; font-size: 0.17rem; vertical-align: -4px; margin-right: 0.05rem;\"></span>5122</span>&nbsp;<span class=\"duration\" style=\"font-size: 0.14rem; margin-left: 0.12rem;\"><span class=\"layout-icons layout-icons_clock\" style=\"font-family: baikeFont_layout; vertical-align: -2px; margin-right: 0.05rem;\"></span>1'47\"</span></div></div></div><div class=\"second-summary J-invoke-2ndvideoflow\" data-index=\"3\" data-mediaid=\"\" data-secondid=\"25040788\" data-url=\"//baike.baidu.com/wikisecond/videoflow?secondId=25040788&amp;lemmaId=3536284&amp;from=lemma\" data-type=\"1\" data-playurl=\"http://vd3.bdstatic.com/mda-jmewd1qf1h3njcm7/mda-jmewd1qf1h3njcm7.mp4?playlist=%5B%22hd%22%2C%22sc%22%5D\" data-playmp4url=\"https://vd3.bdstatic.com/mda-jmewd1qf1h3njcm7/mda-jmewd1qf1h3njcm7.mp4?playlist=%5B%22hd%22%2C%22sc%22%5D\" data-player=\"\" style=\"position: relative; float: left; overflow: hidden; background-size: cover; background-position: center center; background-repeat: no-repeat; width: 360px; height: 237.6px; background-image: url(&quot;https://bkimg.cdn.bcebos.com/smart/d01373f082025aafbbf189a7f4edab64024f1a9e-bkimg-process,v_1,rw_16,rh_9,maxl_800&quot;);\"><span class=\"second-slogan-icon\" style=\"position: absolute; background: url(&quot;https://baikebcs.bdimg.com/front-end/second-know/img/logo-small.png&quot;) center center / contain no-repeat; display: inline-block; vertical-align: middle; z-index: 1; left: 0.1rem; top: 0.1rem; width: 0.74rem; height: 0.17rem;\"></span><div class=\"second-mask\" style=\"position: absolute; left: 0px; bottom: 0px; width: 360px; height: 120px; background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4));\"></div><div class=\"second-play-container\" style=\"position: absolute; width: 360px; left: 0px; bottom: 18px;\"><div class=\"play-icon\" style=\"position: absolute; left: 0.13rem; width: 40px; height: 40px; border: 1px solid rgb(255, 255, 255); background: rgba(0, 0, 0, 0.3); border-radius: 50%;\"><span class=\"layout-icons layout-icons_new-fullTriangle\" style=\"color: rgb(255, 255, 255); font-family: baikeFont_layout; display: block; font-size: 0.4rem; position: absolute; top: 20px; left: 20px; transform: translate(-50%, -50%);\"></span></div><div class=\"play-title\" style=\"margin-left: 65px; color: rgb(255, 255, 255); font-size: 0.13rem; line-height: 0.21rem;\"><span class=\"title\" style=\"display: block; font-size: 0.18rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; overflow-wrap: normal; width: 236px;\">把护手霜抹在衣服上，真是厉害，解决不少人困扰的烦心事，试一试</span><span class=\"vv\" style=\"display: inline-block; font-size: 0.14rem;\"><span class=\"layout-icons layout-icons_eye\" style=\"font-family: baikeFont_layout; font-size: 0.17rem; vertical-align: -4px; margin-right: 0.05rem;\"></span>5076</span>&nbsp;<span class=\"duration\" style=\"font-size: 0.14rem; margin-left: 0.12rem;\"><span class=\"layout-icons layout-icons_clock\" style=\"font-family: baikeFont_layout; vertical-align: -2px; margin-right: 0.05rem;\"></span>2'52\"</span></div></div></div></div><ul class=\"summary-dots\" id=\"J-summary-dots\" style=\"position: absolute; right: 0.17rem; bottom: 0.18rem; font-size: 0px;\"><li class=\"cur\" style=\"display: inline-block; margin-left: 0.08rem; width: 0.08rem; height: 0.08rem; border-radius: 0.08rem; background: rgb(255, 255, 255); border-bottom: 0px;\"></li>&nbsp;&gt;<li style=\"display: inline-block; margin-left: 0.08rem; width: 0.08rem; height: 0.08rem; border-radius: 0.08rem; background: rgba(255, 255, 255, 0.6);\"></li>&nbsp;<li style=\"display: inline-block; margin-left: 0.08rem; width: 0.08rem; height: 0.08rem; border-radius: 0.08rem; background: rgba(255, 255, 255, 0.6);\"></li>&nbsp;<li style=\"display: inline-block; margin-left: 0.08rem; width: 0.08rem; height: 0.08rem; border-radius: 0.08rem; background: rgba(255, 255, 255, 0.6);\"></li>&nbsp;<li style=\"display: inline-block; margin-left: 0.08rem; width: 0.08rem; height: 0.08rem; border-radius: 0.08rem; background: rgba(255, 255, 255, 0.6);\"></li></ul></div></div><div class=\"card-part\"><div class=\"title-part\" style=\"margin: 0.18rem 0.17rem 0.12rem;\"><div class=\"title\" style=\"position: relative;\"><div class=\"lemma-title-container\" style=\"display: inline-block; margin-right: 0.63rem;\"><span class=\"lemma-title\" data-pid=\"lemma_title\" style=\"font-size: 0.24rem; color: rgb(0, 0, 0); line-height: 0.29rem; font-weight: 700;\">护手霜</span></div><div class=\"eidt-tool-container\" style=\"position: absolute; top: 0px; right: 0px;\"><div class=\"tool-right-btn lemma-audio-play audio-play\" id=\"J-lemma-audio-play\" style=\"display: inline-block; width: 0.37rem; height: 0.27rem; line-height: 0.27rem; text-align: center; float: right; position: relative; font-size: 0.13rem; margin-right: -0.1rem;\"><span class=\"tool-icon\"><span class=\"layout-icons layout-icons_new-sound1\" style=\"color: rgb(102, 102, 102); font-family: baikeFont_layout; font-size: 0.16rem; vertical-align: 0px; margin-right: 0px;\"></span></span></div><div class=\"tool-right-btn tool-right-btn--editentrance\" id=\"J-editentrance\" style=\"width: 0.37rem; height: 0.27rem; line-height: 0.27rem; text-align: center; float: right; position: relative; font-size: 0.13rem; z-index: 1; transform-origin: 0px 0px 0px; opacity: 1; transform: scale(1, 1);\"><span class=\"tool-icon\"><span class=\"layout-icons layout-icons_new-pen\" id=\"J-editentrance-icon\" style=\"color: rgb(102, 102, 102); font-family: baikeFont_layout; font-size: 0.16rem; vertical-align: 0px; margin-right: 0px;\"></span></span></div></div></div></div><div class=\"extra-info-n\" id=\"J-extra-info\" style=\"color: rgb(162, 162, 162); font-size: 0.13rem;\"><ul class=\"extra-list\" style=\"margin-right: 17px; margin-left: 17px;\"></ul></div><div class=\"summary-content\" style=\"margin-top: 24px; margin-right: 17px; margin-left: 17px; padding-top: 0.01rem; font-size: 0.18rem; line-height: 0.3rem;\"><p data-pid=\"p-0\">护手霜是一种能愈合及抚平<a href=\"https://baike.baidu.com/item/%E8%82%8C%E8%82%A4/719327\" data-lemmaid=\"719327\" style=\"color: rgb(58, 127, 222);\">肌肤</a>裂痕，干燥，能够有效预防及治疗秋冬季手部粗糙干裂的护肤产品，秋冬季节经常使用可以使手部<a href=\"https://baike.baidu.com/item/%E7%9A%AE%E8%82%A4/490734\" data-lemmaid=\"490734\" style=\"color: rgb(58, 127, 222);\">皮肤</a>更加细嫩滋润。</p><p data-pid=\"p-1\" style=\"margin-top: 0.15rem;\" class=\"\">选择护手霜要避免选择含香料、色素以及刺激成分的产品，比如有的写着包含薰衣草油，会刺激到皮肤，尤其当你皮肤上有伤口的话，就不易愈合。倒刺、<a href=\"https://baike.baidu.com/item/%E8%84%B1%E7%9A%AE/9025704\" data-lemmaid=\"9025704\" style=\"color: rgb(58, 127, 222);\">脱皮</a>和开裂的手部建议选择含有<a href=\"https://baike.baidu.com/item/%E6%8A%97%E6%B0%A7%E5%8C%96%E5%89%82/971282\" data-lemmaid=\"971282\" style=\"color: rgb(58, 127, 222);\">抗氧化剂</a>、细胞沟通因子、舒缓剂这些成分的产品，同样要避免<a href=\"https://baike.baidu.com/item/%E9%A6%99%E7%B2%BE/410232\" data-lemmaid=\"410232\" style=\"color: rgb(58, 127, 222);\">香精</a>色素等刺激性成分。</p></div></div><div class=\"basicInfo\" id=\"J-basicInfo\" data-type=\"normal\" data-pid=\"p-card\" style=\"margin: 0.3rem 17px 0.18rem; font-size: 0.18rem; line-height: 0.28rem;\"><ul><li style=\"position: relative;\"><div class=\"info-title\" style=\"float: left;\">中文名</div><div class=\"info-content\" style=\"margin-left: 0.84rem; color: rgb(102, 102, 102); overflow-wrap: break-word;\">护手霜</div></li><li style=\"position: relative;\"><div class=\"info-title\" style=\"float: left;\">外文名</div><div class=\"info-content\" style=\"margin-left: 0.84rem; color: rgb(102, 102, 102); overflow-wrap: break-word;\">Hand cream</div></li><li style=\"position: relative;\"><div class=\"info-title\" style=\"float: left;\">功能</div><div class=\"info-content\" style=\"margin-left: 0.84rem; color: rgb(102, 102, 102); overflow-wrap: break-word;\">愈合及抚平肌肤裂痕</div></li><li style=\"position: relative;\"><div class=\"info-title\" style=\"float: left;\">味道</div><div class=\"info-content\" style=\"margin-left: 0.84rem; color: rgb(102, 102, 102); overflow-wrap: break-word;\">香味清新自然</div></li><li style=\"position: relative;\"><div class=\"info-title\" style=\"float: left;\">使用季节</div><div class=\"info-content\" style=\"margin-left: 0.84rem; color: rgb(102, 102, 102); overflow-wrap: break-word;\">四季皆可</div></li></ul></div></div><div id=\"BK_content_wrapper\" class=\"BK-content-wrapper\" style=\"padding-right: 17px; padding-left: 17px;\"><div class=\"BK-main-content\"><a name=\"u0\" style=\"color: rgb(58, 127, 222);\"></a><div class=\"BK-content-margin no-margin-top\" style=\"margin-right: -17px; margin-bottom: 0rem; margin-left: -17px; background: rgb(245, 245, 245); height: 0.08rem;\"></div><a name=\"anchor-1\" id=\"anchor-1\" style=\"color: rgb(58, 127, 222);\"></a><a name=\"介绍\" style=\"color: rgb(58, 127, 222);\"></a><h2 class=\"title-level-2\" data-title=\"介绍\" data-pid=\"p-2\" style=\"margin-top: 0.24rem; margin-left: -0.11rem; line-height: 1; font-weight: 700; padding-left: 0.1rem; font-size: 0.21rem; color: rgb(0, 0, 0);\">介绍<div class=\"tool-right-btn part-audio-play audio-play\" data-index=\"header-1\" data-title=\"介绍\" style=\"display: inline-block; width: 0.37rem; height: 0.27rem; line-height: 0.27rem; text-align: center; float: right; position: relative; font-size: 0.13rem; font-weight: 400; margin-right: -0.1rem;\"><span class=\"layout-icons layout-icons_new-sound1\" style=\"color: rgb(102, 102, 102); font-family: baikeFont_layout; font-size: 0.16rem; vertical-align: 0px; margin-right: 0px;\"></span></div><span data-title=\"介绍\" class=\"tool-right-btn J-lemma-edit J-active\" data-dl=\"1\" style=\"display: inline-block; width: 0.37rem; height: 0.27rem; line-height: 0.27rem; text-align: center; float: right; position: relative; font-size: 0.13rem; font-weight: 400;\"><span class=\"layout-icons layout-icons_new-pen\" style=\"color: rgb(102, 102, 102); font-family: baikeFont_layout; font-size: 0.16rem; vertical-align: 0px; margin-right: 0px;\"></span></span></h2><a name=\"anchor-1-1\" id=\"anchor-1-1\" style=\"color: rgb(58, 127, 222);\"></a><a name=\"anchor-1_1\" style=\"color: rgb(58, 127, 222);\"></a><a name=\"护手方法\" style=\"color: rgb(58, 127, 222);\"></a><h3 class=\"title-level-3\" data-title=\"护手方法\" data-pid=\"p-3\" style=\"margin-top: 0.24rem; font-weight: 700; line-height: 1; font-size: 0.19rem; color: rgb(0, 0, 0);\">护手方法</h3><div class=\"para\" data-pid=\"p-4\" style=\"font-size: 0.18rem; line-height: 0.3rem; margin-top: 0.16rem;\"><span style=\"font-weight: 700;\">1.</span>选购洁手用品时，应注意成分中以含<a href=\"https://baike.baidu.com/item/%E7%BB%B4%E7%94%9F%E7%B4%A0E\" style=\"color: rgb(58, 127, 222);\">维生素E</a>和<a href=\"https://baike.baidu.com/item/%E7%BB%B4%E7%94%9F%E7%B4%A0B\" style=\"color: rgb(58, 127, 222);\">维生素B</a>为主的，要避免购买碱性过强的产品。</div><div class=\"para\" data-pid=\"p-5\" style=\"font-size: 0.18rem; line-height: 0.3rem; margin-top: 0.16rem;\"><span style=\"font-weight: 700;\">2.</span>白天出门前，除了必须涂上面部防晒品之外，手部最好也涂上有SPF防晒系列的产品，以防紫外光伤害，晒出皱纹和<a href=\"https://baike.baidu.com/item/%E9%BB%91%E6%96%91\" style=\"color: rgb(58, 127, 222);\">黑斑</a>来。</div><div class=\"para\" data-pid=\"p-6\" style=\"font-size: 0.18rem; line-height: 0.3rem; margin-top: 0.16rem;\"><span style=\"font-weight: 700;\">3.</span>当你洗碗、洗衣服时要接触化学产品，切记要先戴好手套，避免双手被清洁剂的皂碱伤害。</div><div class=\"para\" data-pid=\"p-7\" style=\"font-size: 0.18rem; line-height: 0.3rem; margin-top: 0.16rem;\"><span style=\"font-weight: 700;\">4.</span>每星期做一次手部去<a href=\"https://baike.baidu.com/item/%E8%A7%92%E8%B4%A8\" style=\"color: rgb(58, 127, 222);\">角质</a>的工作，使用手部专用的<a href=\"https://baike.baidu.com/item/%E7%A3%A8%E7%A0%82\" style=\"color: rgb(58, 127, 222);\">磨砂</a>用品来去掉老化的<a href=\"https://baike.baidu.com/item/%E8%A7%92%E8%B4%A8%E5%B1%82\" style=\"color: rgb(58, 127, 222);\">角质层</a>，让双手恢复光滑。</div><div class=\"para\" data-pid=\"p-8\" style=\"font-size: 0.18rem; line-height: 0.3rem; margin-top: 0.16rem;\"><span style=\"font-weight: 700;\">5.</span>利用睡眠时间来加强手部滋养，临睡前涂上滋润力较强的润手霜，并戴上透气度高的手套以利吸收。</div><div class=\"para\" data-pid=\"p-9\" style=\"font-size: 0.18rem; line-height: 0.3rem; margin-top: 0.16rem;\">6.涂抹护手霜时，可对手指个关节部分进行加强揉搓。</div></div></div></div></div></div></div></p>","headSeqId":"626d284cf9384802b0535fa66c6f3091","advertisementSeqId":null,"headPortrait":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erU6YrRTFQxrATvfuo4AdoGEaW1ojm6hjUVDqZnylaNxqkriaxPOfAwmicCpRkhcE6NyTXf5VzMTeFQ/132","identitySeqId":null,"identityName":null,"articleSource":null}}
					if (res.code === 200) {
						let articleContent = res.data.articleContent || '';
						let content = [];
						if (articleContent.startsWith('<section>')) { // 内部文章
							let ac = articleContent.replace(/^<section>/g, '').replace(/<\/section>$/g, '')
							ac = ac ||
								'<div class="hs-text" style="color:#000;font-weight:normal;text-align:left;font-size:14px;">点击开始编辑文章内容</div>'
							content = ac.split(/<\/section><section>/)
							this.adContent = content.pop(); // 提取出广告
						} else { // 外部文章
							// const reg = /<([a-z]+?)(\s[\s\S]*?(style="[^"]*?")?(src="[^"]*?")?[\s\S]*?)?>(([\s\S]*?)<\/\1>)?/g;
							// // content = articleContent.match(reg)
							// articleContent.replace(reg, ($0, tag, style, $3, src, $5, text, index) => {
							// 	let tagList = text.match(reg);
							// 	if (tagList) {
							// 		text.replace(reg, ($0, tag, style, $3, src, $5, text, index) => {
							// 			if (tag === 'img' || tag === 'video') {
							// 				content.push($0);
							// 			} else {
							// 				content.push(`<div class="hs-text" ${style}>${text}</div>`);
							// 			}
							// 			return '';
							// 		})
							// 	} else {
							// 		if (tag === 'img' || tag === 'video') {
							// 			content.push($0);
							// 		} else {
							// 			content.push(`<div class="hs-text" ${style}>${text}</div>`);
							// 		}
							// 	}
							// 	return ''
							// })
							content = this.articleToList(articleContent, content);
						}
						// content = getApp().globalData.content.replace(/^<section>/g,'').replace(/<\/section>$/g,'').split(/<\/section><section>/);
						let data = res.data;
						this.content = content;
						this.articleTitle = data.articleTitle || '';
						this.changeTime = data.issuedDate || '';
						this.articlePic = data.articlePic
					}
				});
			},

			articleToList(articleContent, content) {
				const reg = /<([a-z]+?)(\s[\s\S]*?(style="[^"]*?")?(src="[^"]*?")?[\s\S]*?)?>(([\s\S]*?)<\/\1>)?/g;
				articleContent.replace(reg, ($0, tag, style, $3, src, $5, text, index) => {
					let tagList = text.match(reg);
					if (tagList.length>1) {
						content = this.articleToList(text, content)
					} else {
						if (tag === 'img' || tag === 'video') {
							content.push($0);
						} else {
							content.push(`<div class="hs-text" ${style||''}>${text}</div>`);
						}
					}
					return ''
				})
				return content;
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
					}],
					[/modifySection/, () => { // 修改文本需要设置样式及文本
						const arrs = curContent.match(/^(<a href="(.*?)"([^>]*)?>)?<div class="hs-text".+?>/);
						const color = curContent.match(/[^-]color:([^;]+);/);
						const weight = curContent.match(/font-weight:([^;]+);/);
						const size = curContent.match(/font-size:([^;]+);/);
						const align = curContent.match(/text-align:([^;]+);/);
						this.hasHref = arrs[2] ? arrs[2] : '';
						this.modalValue = curContent.replace(/^(<a href=".*">)?<div class="hs-text".+?>/g, "").replace(
							/<\/div>(<\/a>)?$/g, "").replace(/<br\/>/g, '\n'); // 去掉首尾div标签
						this.fontColor = color ? color[1] : '#000';
						this.fontWeight = weight ? weight[1] : 'normal';
						this.fontSize = size ? size[1] : '14px';
						this.textAlign = align ? align[1] : 'left';
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
						this.content.splice(this.active + 1, 0, `<video src="${this.modalValue}"></video>`);
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
					`<div class="hs-goods" seqId="${item.seqId}" merchantSeqId="${item.merchantSeqId} url="/pages/goods/detail?seqId=${item.spuSeqId}&merchantShopId=${item.merchantShopId}"">
								<img src="${item.mainPicUrl}" style="width: 40%;height: 100px;border-radius: 10px;"></img>
								<div class="hs-goods-detail"><div>${item.spuTitle2}</div><div>${item.logisticFee}</div></div>
							</div>`;
				this.content.splice(this.active + 1, 0, content);
				this.active = -1;
				this.showGoodList = false;
			},
			getGoods() {
				let _this = this;
				this.isLoading = true;
				// this.$api.get('/o2oSpu/findPageCusForPc', {
				this.$api.get('/o2oMyArticle/findGoodsList', {
					params: {
						// user_seq_id: this.customerSeqId,
						customerSeqId: this.customerSeqId,
						// onSale: 'SALE',
						pageno: this.pageno
					}
				}).then(res => {
					let list = res.list||[];
					_this.goodList = _this.goodList.concat(list);
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
				let content = {
					'IMAGE_TEXT_ADVERTISEMENT': `<a href="${ad.advertisementLink}" onclick="return false;">
							<div class="hs-image-text">
								<img src="${ad.advertisementPic}" style="width: 60px;height: 60px;border-radius: 50%;"></img>
								<div class="hs-image-text-detail"><div>${ad.advertisementTitle}</div><div>${ad.advertisementSynopsis}</div></div>
							</div>
						</a>`,
					'PICTURE_ADVERTISEMENT': `<a href="${ad.advertisementLink}" onclick="return false;"><img style="width:100%" src="${ad.advertisementPic}"></img></a>`,
					'FOLLOW_ADVERTISEMENT': `<div class="hs-folow" qrCode="${ad.qrCode}">
							<img src="${ad.advertisementPic}" style="width: 60px;height: 60px;border-radius: 50%;"></img>
							<div class="hs-folow-phone-detail"><div>${ad.advertisementTitle}</div><div>${ad.advertisementExplain}</div></div>
							<div class="hs-folow-phone-button">+关注</div>
						</div>`,
					'TELEPHONE_ADVERTISEMENT': `<div class="hs-phone" phone="${ad.phone}">
							<img src="${ad.advertisementPic}" style="width: 60px;height: 60px;border-radius: 50%;"></img>
							<div class="hs-folow-phone-detail"><div>${ad.advertisementTitle}</div><div>${ad.advertisementExplain}</div></div>
							<div class="hs-folow-phone-button">拨打</div>
						</div>`,
					'BUSINESS_CARD_ADVERTISEMENT': `<div class="hs-card" backdropPic="${ad.backdropPic}" advertisementPic="${ad.advertisementPic}" name="${ad.name}" phone="${ad.phone}" weChatNum="${ad.weChatNum}" qrCode="${ad.qrCode}">
							<img src="${ad.backdropPic}" style="width:100%;height:100%;"></img>
							<div class="hs-card-body">
								<div class="hs-card-left">
									<div class="hs-card-name">
										<img style="height:100%;border-radius: 50%;" src="${ad.advertisementPic}"></img>
										<div class="hs-card-phone-text"><div>${ad.name}</div><div>Name</div></div>
									</div>
									<div class="hs-card-phone">
										<img style="height:100%;" src="http://bucketshop.oss-cn-hangzhou.aliyuncs.com/images/20200806/app_1596644677256rs6c.png"></img><div class="hs-card-phone-text"><div>${ad.phone}</div><div>Tellphone Number</div></div>
									</div>
									<div class="hs-card-phone">
										<img style="height:100%;" src="http://bucketshop.oss-cn-hangzhou.aliyuncs.com/images/20200806/app_1596644677256rs6c.png"></img><div class="hs-card-phone-text"><div>${ad.weChatNum}</div><div>Wei Xin</div></div>
									</div>
								</div>
								<div class="hs-card-right">
									<img style="width:100%;height:80%;pointer-events: auto!important;" src="${ad.qrCode}"></img><div>长按二维码加我咨询</div>
								</div>
							</div>
						</div>`,
				} [this.advertisementType];
				this.adContent = content;
				this.advertisementSeqId = ad.seqId;
				// this.content.splice(this.active + 1, 0, content);
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
					},
					fail: () => {
						uni.showToast({
							icon: 'none',
							title: '获取照片失败！',
							duration: 2000
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
								if (res.code === 200) {
									uni.showToast({
										title: '上传成功！',
										duration: 2000
									});
									self.content.splice(self.active + 1, 0, `<video src="${res.data.viewUrl}"></video>`);
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
				content = content + `<section>${this.adContent}</section>`;
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
							console.log(12);
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
				content = content + `<section>${this.adContent}</section>`;
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

				img,
				image {
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
				background-color: #fff;

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

			.ad-content {
				display: flex;

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

									&>view {
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

									&>view {
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
						height: 40rpx;
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
