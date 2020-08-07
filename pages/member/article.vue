<template>
	<view class="box">
		<view class='slide_tab'>
			<slide-tab :tab-list="tab_list" :tabCur.sync="cur_status" :tab-class="'text-center bg-white wuc-tab fixed'"
			 :tab-style="CustomBar1" select-class="text-black" @change="tabChange"></slide-tab>
		</view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<template v-for="(item,k) in data_list">
				<view class="article-box" :key="k">
					<view class="time">
						{{item.issuedDate}}
						<text class="type font-red" v-if="item.rewardStatus=='CHECK'">
							{{checkStatus_map[item.checkStatus]}}
						</text>
					</view>
					<view class="article-cont">
						<view @tap="jump(k)" hover-class="none" :url="'/pages/make_money/article_edit?fromType='+item.formType+'&seqId='+item.seqId">
							<view class="img">
							<u-lazy-load height="180" border-radius="6" :image="item.articlePic" :index="k"></u-lazy-load>
							</view>
						</view>
						<view class="right">
							<view @tap="jump(k)" hover-class="none" :url="'/pages/make_money/article_edit?fromType='+item.formType+'&seqId='+item.seqId">
								<view class="title">{{item.articleTitle}}</view>
								<view class="name" v-if="item.customerName">
									{{item.customerName}}
								</view>
							</view>
							<view class="icon">
								<template v-if="item.rewardStatus!=='CHECK'&&item.rewardStatus!=='SPREAD'">
									<!-- 审核中 审核失败 跟推广中不能删除跟发布 -->
									<view class="icon-li font-red" @tap="deleteArticle(item.seqId,k)">
										<view class="iconfont iconshanchu"></view>
										<view class="text">
											删除
										</view>
									</view>
									<view class="icon-li font-blue" @tap="issue(k)">
										<view class="iconfont iconfabuxuanshang" style="font-size: 36rpx;"></view>
										<view class="text">
											去发布
										</view>
									</view>
								</template>

								<!-- 审核失败直接发布 不用支付 -->
								<navigator v-if="item.checkStatus=='CHECK_NOT_PASS'" class="icon-li font-blue" 
								:url="'/pages/make_money/article_edit?fromType='+item.formType+'&seqId='+item.seqId+'&offerRewardSeqId='+item.offerRewardSeqId">
									<view class="iconfont iconfabuxuanshang" style="font-size: 36rpx;"></view>
									<view class="text">
										重新发布
									</view>
								</navigator>
							</view>
						</view>
					</view>
					<view class="time check-explain font-small" v-if="item.checkStatus=='CHECK_NOT_PASS'">
						审核失败原因：<text class="text">{{item.checkExplain}}</text>
					</view>
				</view>
			</template>
		</mescroll-body>
	</view>
</template>

<script>

	import slideTab from '@/components/slide-tab/slide-tab.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				tab_list: [{
						name: '全部',
						status: 0,
						value: 'NONE'
					},
					{
						name: '草稿箱',
						status: 1,
						value: 'INIT'
					},
					{
						name: '审核中',
						status: 2,
						value: 'CHECK'
					},
					{
						name: '推广中',
						status: 3,
						value: 'SPREAD'
					},
					{
						name: '已结束',
						status: 4,
						value: 'END'
					}

				],
				// /*未审核*/
				// NO_CHECK,
				// /*审核中*/
				// CHECKING,
				// /*审核通过*/
				// CHECK_PASS,
				// /*审核未通过*/
				// CHECK_NOT_PASS
				checkStatus_map:{
					'NO_CHECK':"未审核",
					"CHECKING":"审核中",
					"CHECK_PASS":"审核通过",
					"CHECK_NOT_PASS":"审核未通过",
				},
				data_list: [],
				cur_status: 0,
				custom_bar: uni.getSystemInfoSync().statusBarHeight + 44,
			}
		},
		components: {
			MescrollBody,
			slideTab
		},
		computed: {
			CustomBar1() {
				// #ifdef H5
				let style = `top:${this.custom_bar}px;`;
				// #endif
				// #ifndef H5
				let style = `top:0px`
				// #endif
				return style;
			}
		},
		methods: {
			jump(k){
				let item=this.data_list[k]
				let rewardStatus=item.rewardStatus;
				if(rewardStatus=="INIT"){
					uni.navigateTo({
						url:'/pages/make_money/article_edit?fromType='+item.formType+'&seqId='+item.seqId
					})
				}else {
					uni.navigateTo({
						url:'/pages/member/article_detail?seqId='+item.seqId
					})
				}
			},
			upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				this.$api.get('/o2oMyArticle/findArticlePage', {
					params: {
						articleStatus: this.tab_list[this.cur_status].value,
						pageno: pageNum,
						pagesize: pageSize,
						issuedBySeqId: this.$common.getLocalSync('customerSeqId')
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
					for(var item of curPageData) {
						// 方便文章编辑的时候判断
						this.$set(item,'formType',item.checkStatus=='CHECK_NOT_PASS'?4:3)
					}
			


					//设置列表数据
					if (page.num == 1) this.data_list = []; //如果是第一页需手动置空列表
					this.data_list = this.data_list.concat(curPageData)
					// 请求成功,隐藏加载状态
					//方法一(推荐): 后台接口有返回列表的总页数 totalPage
					this.mescroll.endByPage(curPageLen, totalPage);
				})
			},
			// 发布文章
			issue(k) {
				this.$store.commit('saveIssueArticle', {
					articleTitle: this.data_list[k].articleTitle,
					articleSeqId: this.data_list[k].seqId,
				});
				uni.navigateTo({
					url: '/pages/make_money/issue_reward'
				})
			},
			// 删除文章
			deleteArticle(id, k) {
				this.$api.get('/o2oMyArticle/delete1', {
					params: {
						seqId: id
					}
				}).then(res => {
					if (res.code == 200) {
						this.data_list.splice(k, 1);
						this.$box.confirm(res.msg, false)
					}
				})
			},
			tabChange(k) {
				this.cur_status = k;
				this.mescroll.resetUpScroll(false)
			},
			edit(k) {
				let data = this.data_list[k]
				uni.navigateTo({
					url: '/pages/make_money/article_edit?seqId=' + data.seqId + '&offerRewardSeqId=' + data.offerRewardSeqId
				})
			},
		}
	}
</script>

<style lang="scss">
	.check-explain {
		margin-top: 10rpx;
		color: #e67373 !important;
		.text {
			color: gray;
		}
	}
	.slide_tab {
		overflow: hidden;
		width: 100%;
		height: 90rpx;
	}

	.article-box {
		width: 660rpx;
		padding: 20rpx 25rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 10rpx;
		margin: 10rpx auto;

		.time {
			font-size: 26rpx;
			margin-bottom: 16rpx;
			color: #666666;
			.type {
				float: right;
			}
		}

		.img {
			width: 200rpx;
			height: 180rpx;
			flex-shrink: 0;
			margin-right: 40rpx;
			border-radius: 6rpx;
			background: #eee;
		}

		.article-cont {
			display: flex;
			align-content: center;

			.title {
				font-size: 30rpx;
				line-height: 42rpx;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.name {
				font-size: 26rpx;
				color: #999999;
				width: 100%;
			}

			.icon {
				display: flex;
				justify-content: flex-end;
				width: 100%;

				.icon-li {
					display: flex;
					align-items: center;
					font-size: 26rpx;
					margin-right: 36rpx;

					.iconfont {
						font-size: 24rpx;
						margin-right: 10rpx;
					}
				}

				.icon-li:last-child {
					margin: 0;
				}
			}

			.right {
				display: flex;
				align-content: space-between;
				flex-wrap: wrap;
				flex-grow: 1;
			}
		}
	}

	.font-red {
		color: #FF5F51;
	}

	.font-blue {
		color: #4872E5;
	}
</style>
