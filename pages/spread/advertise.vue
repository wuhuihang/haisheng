<template>
	<view class="box">
		<view class="url-box">
			<textarea class="article-url" v-model="article_url" maxlength="1000" placeholder="双击或者长按粘贴文章链接，请勿转发谣言／暴力／色情／欺诈等违规信息，如果发现直接封号处理" />
			<view class="article-url-tips">如何获取文章链接？</view>
		</view>
		<view class="platfrom">支持今日头条、天天快报、官网http开头的、微信公众平台</view>
		<view class="article-btn">
		<view @tap="getUrlArticle" url="/pages/make_money/article_edit" class="btn-l btn">
			生成我的广告文章
		</view>
			<navigator hover-class="none" url="/pages/make_money/article_edit" class="btn-r btn">
				我要原创
			</navigator>
		</view>
		<view class="art-box">
			<view class="type-list">
					<view class="cate-box">
						<scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false">
						    <view v-for="(tab,index) in cate_list" :key="index" class="type-li uni-tab-item" :id="index" :data-current="index" @click="chooseCate(tab.popularizeType)">
						        <text class="uni-tab-item-title" :class="tab.popularizeType==choose_cate ? 'active uni-tab-item-title-active' : ''">{{tab.popularizeDesc}}</text>
						    </view>
						</scroll-view>
					</view>
			</view>
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<navigator :url="'/pages/make_money/article_detail?seqId='+item.articleSeqId+'&popularizeSeqId='+item.seqId" class="art-li "   v-for="(item,k) in data_list" :key="k">
				<view class="img">
					<u-lazy-load height="148" border-radius="4" :image="item.articlePic" :index="k"></u-lazy-load>
				</view>
				<view class="art-li-r">
					<view class="title">{{item.articleTitle}}</view>
					<view class="time-box">
						<template v-if="item.publishedHour||item.publishedMinute">
							<view v-if="item.publishedHour==0">{{item.publishedMinute}}分钟前</view>
							<view v-if="item.publishedHour>0&&item.publishedHour<24">{{item.publishedHour}}小时前</view>
						</template>
						<template v-else>
								<view>{{item.popularizeDate}}</view>
						</template>
					
						<view>阅读量 <text class="font-red">{{item.readNumber}}</text></view>
					</view>
					<view class="insert">
						<view class="insert-l">
							<image lazy-load class="avatar" :src="item.headPortrait" mode=""></image>
							{{item.customerName}}
						</view>
						<view class="insert-r" v-if="item.articleSource=='PERSONAL'">
							植入广告
						</view>
					</view>
				</view>
			</navigator>
			</mescroll-body>
			
		</view>
		<view class="blank" style="height: 154rpx;">
		</view>
		<navigator class="adert-btn-img" url="/pages/spread/spread">
			<image lazy-load class="img" src="../../static/images/adver-bottom.png" mode=""></image>
		</navigator>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
	import ULazyLoad from "@/components/u-lazy-load/u-lazy-load.vue"
	export default {
			mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				cate_list:[
					{
						popularizeDesc: "推荐",
						popularizeType: ""
					}
				],
				
				choose_cate:"",
				data_list:[],
				canReset:false,
				time:new Date().getTime(),
				article_url:""
				// article_url:"https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651238538&idx=2&sn=eb68221b315ec6d7d7afd0c544144572&chksm=bd49690e8a3ee018f78b01b4084d6edaeacfb3b15a0bb718a265141270d924365623fa145a66&scene=126&sessionid=1596513409&key=909afa0d496e3a5dc48257c8ef8bbcb0957dfec0347f0eb39e8580fbba73d244a17032a640bf8a54c9f2ef5d67012c77b8769f45562af3824ed3755a2b164e8629b4838a2ca207d56d7042889ef61867&ascene=1&uin=NzgyOTAxOTYy&devicetype=Windows+10+x64&version=62090529&lang=zh_CN&exportkey=ARKI3oWfoJ8SafdByaMXrVY%3D&pass_ticket=RGDfrsKpIbDgw6qUsvJfSe1pP%2Bq3hMtIGYuY9tOejEb0%2Fr8Lreku0iCAplznfeVI"
			}
		},
		onLoad() {
			this.loadCate()
		},
		components: {
			MescrollBody,ULazyLoad
		},
		onShow() {
			this.canReset&&this.mescroll.resetUpScroll()
			this.canReset = true // 过滤第一次的onShow事件,避免初始化界面时重复触发upCallback
		},
		methods: {
			getUrlArticle(){
				this.$api.get('/o2oMyArticle/getHtmlByUrl',{
					params:{
						url:this.article_url,
						customerSeqId:this.$common.getLocalSync('customerSeqId')
					}
				}).then(res=>{
					if(res.code==200){
						uni.navigateTo({
							url:'/pages/make_money/article_edit?fromType=5&seqId='+res.data
						})
					}
				})
			},
			loadCate(){
				this.$api.get('/o2oPopularizeType/findList').then(res=>{
					if(res.code==200){
						this.cate_list=this.cate_list.concat(res.data)
					}
				})
			},
			chooseCate(cate){
				this.choose_cate=cate;
				this.time=new Date().getTime()
				this.mescroll.resetUpScroll(true)
			},
			upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				this.$api.get('/o2oNoticePopularize/findPageListByPopularizeStatus', {
					params: {
						popularizeType: this.choose_cate,
						pageno: pageNum,
						pagesize: pageSize
					}
				}).then((res) => {
					if (res.code && res.code != 200) {
						this.mescroll.endErr();
						return
					}
					let data = res;
					// 接口返回的当前页数据列表 (数组)
					let curPageData = data.list;
					// 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
					let curPageLen = curPageData.length;
					// 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
					let totalPage = data.pages;
			
					//设置列表数据
					if (page.num == 1) this.data_list = []; //如果是第一页需手动置空列表
					for(let item of curPageData){
						if(item.popularizeDate&&item.popularizeDate!=null){
							item.popularizeDate=item.popularizeDate.slice(5,-9)
						}
					}
					
					this.data_list = this.data_list.concat(curPageData)
					// 请求成功,隐藏加载状态
					//方法一(推荐): 后台接口有返回列表的总页数 totalPage
					this.mescroll.endByPage(curPageLen, totalPage);
				})
			},
			onImageLoad(item,k){
				console.log(45);
				try{
					if(this[item][k]){
						this.$set(this.data_list[k], 'loaded', 'loaded');
						console.log(this.data_list[k]);
						// this.$set(this[item][k], 'loaded', 'loaded');
					}
				}catch(err){
					console.log(err);
				}
			},
			onImageError(e){
				console.log(e);
			}
		}
	}
</script>

<style lang="scss">
	.scroll-area {
		width: calc(100% - 68rpx);
		height: 160rpx;
		margin: 34rpx auto;
		flex-direction: row;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}
	.scroll-h {
		flex-direction: row;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}
	
	.uni-tab-item {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
	}
	
	.uni-tab-item-title {
		flex-wrap: nowrap;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}
.url-box {
	width: 682rpx;
	height: auto;
	margin: 20rpx auto;
	margin-bottom: 10rpx;
	color: #999;
	padding: 20rpx 30rpx;
	width:622rpx;
	height:80rpx;
	background:rgba(255,255,255,1);
	box-shadow:0px 0px 5rpx 2rpx rgba(72,114,229,0.31);
	border-radius:6rpx;
	position: relative;
	.article-url {
		width: 100%;
		font-size:20rpx;
		height: 60rpx;
	}
	.article-url-tips {
		position: absolute;
		bottom: 5rpx;
		right: 30rpx;
		font-size:16rpx;
		color: #4872E5;
	}
}
.platfrom {
	font-size:16rpx;
	color: #666666;
	width: 682rpx;
	margin: 0 auto;
	margin-bottom: 24rpx;
}
	.article-btn {
		width: 682rpx;
		height: auto;
		margin: 0 auto;
		margin-bottom: 40rpx;
		display: flex;
		justify-content: space-between;
		.btn {
			background:rgba(72,114,229,1);
			border-radius:34rpx;
			height:68rpx;
			line-height: 68rpx;
			font-size:30rpx;
			color: white;
			text-align: center;
			cursor: pointer;
		}
		.btn-l {
			width:440rpx;
		}
		.btn-r {
			width:188rpx;
			opacity:0.7;
		}
		
	}
	.art-box {
		width: 682rpx;
		margin: 40rpx auto;
		.type-list {
			display: flex;
			align-items: center;
				
				flex-shrink: 0;
				font-size: 26rpx;
				position: relative;
				z-index: 2;
		
				.cate-box {
					width: 100%;
					display: flex;
					overflow: auto hidden;
				}
		
				.type-li {
					height: 40rpx;
					line-height: 40rpx;
					flex-shrink: 0;
					position: relative;
					overflow-y: hidden;
					display: inline-block;
					text-align: center;
					margin-right: 50rpx;
				}
		
				.active {
					font-size: 30rpx;
					font-weight: bold;
		
					&::after {
						content: "";
						position: absolute;
						bottom: 0;
						left: 10%;
						width: 80%;
						height: 12rpx;
						background: $color-primary;
						border-radius: 6rpx;
						z-index: -1;
					}
				}
		
		
		}
		.art-li {
			width: 622rpx;
			background:rgba(255,255,255,1);
			border-radius:6px;
			padding: 36rpx 30rpx;
			display: flex;
			justify-content: space-between;
			overflow: hidden;
			margin: 30rpx 0;
			.img {
				width:200rpx;
				height:148rpx;
				background:rgba(255,255,255,1);
				border-radius:4rpx;
				flex-shrink: 0;
				margin-right: 20rpx;
				box-shadow:0px 0px 5px 2px #d4d4d4;
			}
			.art-li-r {
				width: calc(100% - 220rpx);
				font-size:26rpx;
				height:148rpx;
				display: flex;
				flex-wrap: wrap;
				.title {
					margin-top: -6rpx;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap
				}
				.time-box {
					margin: 10rpx 0;
					margin-top: 0;
					display: flex;
					justify-content: space-between;
					width: 100%;
					color: #666;
				}
				.insert {
					display: flex;
					justify-content: space-between;
					font-size:16rpx;
					align-self: flex-end;
					width: 100%;
					
					.insert-l {
						display: flex;
						align-items: center;
						color: #666666;
						width: calc(100% - 160rpx);
						.avatar{
							width:40rpx;
							height:40rpx;
							flex-shrink: 0;
							flex-grow: 0;
							border-radius: 100%;
							background: #DCDCDC;
							margin-right: 8rpx;
						}
						
					}
					.insert-r {
						width:156rpx;
						height:48rpx;
						border:1px solid rgba(255,81,72,1);
						border-radius:23rpx;
						font-size:24rpx;
						color: #FF857D;
						line-height:48rpx ;
						text-align: center;
						flex-shrink: 0;
					}
					 
				}
			}
		}
	}
	.adert-btn-img {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 154rpx;
		.img {
			width: 100%;
			height: 100%;
		}
	}
</style>
