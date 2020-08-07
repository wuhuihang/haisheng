<template>
	<view class="box">
		<view class="white-box">
			<view class="tips"><text class="iconfont icontishi"></text> 发布悬赏前请先编辑好草稿箱内文章!</view>
			<view class="set-li all-line">
				<view class="title ">
					悬赏总金币
				</view>
				<view class="right">
					<input class="input" v-model="rewardTotalMoney" type="text" :placeholder="moneyPlaceholder">
				</view>
			</view>
			<view class="set-li">
				<view class="title">
					分享朋友圈(金币/次)
				</view>
				<input v-model="shareMoney" class="right" type="text" placeholder="最低悬赏20金币">
			</view>
			<view class="set-li">
				<view class="title">
					阅读金额(金币/次)
				</view>
				<input v-model="readingMoney" class="right" type="text" placeholder="请设置">
			</view>
		</view>
		<view class="white-box">
			<view class="set-li" @tap="ageChange">
				<view class="title">
					年龄段选择
				</view>
				<view class="right">
					<view>{{chooseAge}}</view>
					<view class="iconfont iconxiayibu"></view>
				</view>
			</view>
			<view class="set-li">
				<view class="title">
					性别选择
				</view>
				<picker @change="genderChange" :value="gender_index" :range="gender_map" range-key="title">
					<view class="right">
						<view>{{gender_map[gender_index].title}} </view>
						<view class="iconfont iconxiayibu"></view>
					</view>
				</picker>
			</view>
		</view>
		<view class="white-box">
			<navigator hover-class="none" class="set-li" url="/pages/make_money/issue_map">
				<view class="title">
					广告投入地区
				</view>
				<view class="right">
					<view v-if="regionFlag=='ALL'">{{region_map[regionFlag]}}</view>
					<view v-if="regionFlag=='REGION'">{{province}}{{city}}{{region}}</view>
					<view v-if="regionFlag=='RANGE'">{{address}}{{distance_zh}}</view>
					<view class="iconfont iconxiayibu"></view>
				</view>
			</navigator>
			<navigator v-if="type_check" hover-class="none" url="/pages/make_money/identity_list" class="set-li">
				<view class="title">
					选择发布人
				</view>
				<view class="right">
					<view>{{identityName}}</view>
					<view class="iconfont iconxiayibu"></view>
				</view>
			</navigator>
			<view class="set-li">
				<view class="title">
					再次分享给奖励
				</view>
				<picker @change="timeChange" :value="time_index" :range="time_map" range-key="title">
					<view class="right">
						<view>{{time_map[time_index].title}}</view>
						<view class="iconfont iconxiayibu"></view>
					</view>
				</picker>
			</view>
			<navigator hover-class="none" url="/pages/member/article_choose" class="set-li">
				<view class="title">
					选择文章
				</view>
				<view class="right">
					<view class="text">{{articleTitle}}</view>
					<view class="iconfont iconxiayibu"></view>
				</view>
			</navigator>
		</view>
		<!-- <button class="confirm-btn no-btn" open-type="getUserInfo">
			微信授权登录
		</button> -->
		<button class="no-btn submit" @tap="reward" :loading="is_load">
			提交
		</button>
		

		<w-picker :visible.sync="ageVisible" mode="linkage" :value="ageRegion1" :options="ageOptions" :level="2" default-type="name"
		 :default-props="ageProps1" @confirm="ageConfirm" ref="linkage"></w-picker>
	</view>

	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue"
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				"againShareTime": "0", //再次分享时间 
				"ageFloor": '不限', //年龄下限
				"ageUpper": '不限', //年龄上限 ,
				"customerSeqId": this.$common.getLocalSync('customerSeqId'),
				"gender": "ALL", //性别 MALE', 'FEMALE'
				"lat1": 0,
				"lon1": 0,
				"distance": "", //距离 
				"province": "",
				"city": "",
				"region": "", //广告投放地区 洪山
				"readingMoney": "", //阅读金额/一次 ,
				"regionFlag": "ALL", //地区标记 = ['ALL', 'REGION', 'RANGE']
				"rewardTotalMoney": "", //悬赏金额
				"shareMoney": "", //分享金额
				"articleTitle": "",
				"articleSeqId": "",
				region_map: {
					"ALL": '不限',
					"REGION": '按区域',
					"RANGE": '按地图',
				},
				address: "",
				distance_zh: "",
				gender_map: [{
						title: "不限",
						value: "ALL"
					}, {
						title: "男",
						value: "MALE"
					},
					{
						title: "女",
						value: "FEMALE"
					}
				],
				gender_index: 0,
				time_index: 0,
				time_map: [{
					title: "再次分享不给奖励",
					value: "0"
				}],
				ageVisible: false,
				result: {
					result: ""
				},
				ageProps1: {
					label: "name",
					value: "name",
					children: "child"
				},
				ageRegion1: ["不限", "不限"],
				ageOptions: [{
					name: "不限",
					child: [{
						name: "不限",
					}]
				}],
				chooseAge: '不限-不限',
				lowestGoldCoin: 0, //最低金币数量
				subscriptionRatio: 0, //比例
				goldCoinValue: 0, //我的金币数量
				moneyPlaceholder: '',
				identityName:"",//身份名称
				identitySeqId:"",//身份id
				is_load: false
			}
		},
		onLoad() {
			this.pickerInit();
			this.getGold()
			this.lon1 = this.location.lon1;
			this.lat1 = this.location.lat1;
			if (!this.lon1 || !this.lat1) {
				this.getNowLocation()
			}
		},
		onShow() {
			// 选择文章之后赋值
			this.articleSeqId = this.issue_article.articleSeqId;
			this.articleTitle = this.issue_article.articleTitle;
			// 选择地区之后赋值
			this.lon1 = this.issue_map.lon1;
			this.lat1 = this.issue_map.lat1;
			this.regionFlag = this.issue_map.regionFlag;
			this.province = this.issue_map.province;
			this.city = this.issue_map.city;
			this.region = this.issue_map.region;
			this.address = this.issue_map.address;
			this.distance_zh = this.issue_map.distance_zh;
			this.distance = this.issue_map.distance;
			this.identityName=this.issue_identity.identityName
			this.identitySeqId=this.issue_identity.identitySeqId
		},
		components: {
			wPicker
		},
		onUnload() {
			let range_obj = {
				lon1: "",
				lat1: "",
				regionFlag: "ALL",
				distance: "",
				province:"",
				city:"",
				region:""
			};
			this.$store.commit("saveIssueMap", range_obj);
			this.$store.commit('saveIssueArticle',{
				articleTitle:"",
				articleSeqId:"",
			});
			this.$store.commit('saveIssueIdentity',{
				identityName: "",
				identitySeqId: ""
			});
		},
		methods: {
			weixinPay(seqId) {
				let self=this;
				// #ifdef MP
				this.$api.post('/payInfo/submitRewardPay',{
					seqId:seqId
				}).then(res => {
					if (res.code == 200) {
						let paymentData = res.data;
						uni.requestPayment({
							timeStamp: paymentData.timeStamp,
							nonceStr: paymentData.nonceStr,
							package: paymentData.package,
							signType: paymentData.signType,
							paySign: paymentData.paySign,
							success: (res) => {
								uni.showModal({
									title:"支付成功",
									content:"文章审核中，请在我的-我的文章查看详情",
									showCancel:false,
									success:function(res){
										if(res.confirm){
											uni.navigateBack()
										}
									}
								})
							},
							fail: (res) => {
								uni.showModal({
									content: "支付失败",
									showCancel: false
								})
							}
						})
					} else if (res.code == 10012) {
						uni.navigateTo({
							url: '/pages/login/login_wechat'
						})
					}
				})
				// #endif
			},
			// 获取金币
			getGold() {
				this.$api.get('/o2oCustomerCash/getDataByCustomerSeqId', {
					params: {
						customerSeqId: this.customerSeqId
					}
				}).then(res => {
					if (res.code == 200) {
						let data = res.data;
						this.lowestGoldCoin = data.lowestGoldCoin; //最低金币数量
						this.subscriptionRatio = data.subscriptionRatio; //比例
						this.moneyPlaceholder = '最低悬赏' + this.lowestGoldCoin + '金币,1元=' + this.subscriptionRatio + '金币'
					}

				})
			},
			// 发布悬赏
			reward() {
				if(this.rewardTotalMoney<this.lowestGoldCoin){
					this.$box.toast('最低悬赏' + this.lowestGoldCoin + '金币','none');
					return;
				}
				
				if (!this.articleSeqId || !this.readingMoney || !this.rewardTotalMoney) {
					this.$box.toast('请正确填写所有信息','none');
					return
				}
				if(this.shareMoney<20){
					this.$box.toast('最低悬赏20金币','none');
					return
				}
				this.$api.post('/o2oOfferReward/insert', {
					"againShareTime": this.againShareTime,
					"ageFloor": this.ageFloor == '不限' ? '0' : this.ageFloor, //年龄下限
					"ageUpper": this.ageUpper == '不限' ? '10000' : this.ageUpper, //年龄上限 ,
					"articleSeqId": this.articleSeqId,
					"city": this.city,
					"customerSeqId": this.customerSeqId,
					"distance": this.distance, //距离 
					"gender": this.gender, //性别 MALE', 'FEMALE'
					"lat1": this.lat1,
					"lon1": this.lon1,
					"province": this.province,
					"readingMoney": this.readingMoney, //读金额/一次 ,
					"region": this.region, //广告投放地区 
					"regionFlag": this.regionFlag, //地区标记 = ['ALL', 'REGION', 'RANGE']
					"rewardTotalMoney": this.rewardTotalMoney,
					"shareMoney": this.shareMoney,
					"identityName":this.identityName,//身份名称
					"identitySeqId":this.identitySeqId//身份id
					
				}).then(res => {
					if (res.code == 200) {
						this.weixinPay(res.data.seqId)
					}
				})
			},
			ageChange() {
				this.ageVisible = true;
			},
			// 改变年龄
			ageConfirm(res) {
				this.ageFloor = res.value[0]; //年龄下限
				this.ageUpper = res.value[1]; //年龄上限 ,
				this.chooseAge = this.ageFloor + '-' + this.ageUpper
			},
			// 改变地区
			areaChange(e) {
				this.area_index = e.detail.value;
			},
			// 改变分享时间
			timeChange(e) {
				this.time_index = e.detail.value;
				this.againShareTime = this.time_map[this.time_index].value
			},
			// 改变性别
			genderChange(e) {
				this.gender_index = e.detail.value;
				this.gender = this.gender_map[this.gender_index].value
			},
			// 获取位置
			getNowLocation() {
				let self = this;
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						if (!self.lon1 || !self.lat1) {
							self.lon1 = res.longitude;
							self.lat1 = res.latitude;
							self.$store.commit('saveLocation', {
								lon1: res.longitude,
								lat1: res.latitude
							})
						}
					},
					fail: function(errMsg) {
						console.log(errMsg);
						self.locationFail(errMsg)
					},
				});
			},
			// 获取位置权限 
			locationFail(err) {
				let self = this;
				if (err.errMsg === "getLocation:fail auth deny" || err.errMsg === "getLocation:fail authorize no response") { // 没有授权，重新授权，兼容iso和Android
					uni.showModal({
						title: '授权提示',
						content: "是否允许开启位置信息",
						success: (res) => {
							if (res.confirm) { // 点击确定，则调用位置授权
								uni.openSetting({
									success(settingdata) {
										if (settingdata.authSetting["scope.userLocation"]) {
											uni.showToast({
												title: '获取权限成功'
											});
											self.getNowLocation();
										} else {
											console.log("获取权限失败")
										}
									}
								})
							}
						}
					})
				}
			},
			pickerInit() {
				// 初始化picker
				// 年龄范围
				let obj1 = {};
				let one_obj = {}
				for (let i = 16; i < 71; i++) {
					let arr2 = [];
					let obj2 = {};
					obj1 = {
						name: i,
						child: []
					}
					one_obj = {
						name: i,
					}
					let min_num = i + 1; //年龄下限不能小于上限
					for (let k = min_num; k < 71; k++) {
						obj2 = {
							name: k
						}
						obj1.child.push(obj2)
					}
					obj1.child.unshift({
						name: '不限'
					})
					this.ageOptions.push(obj1)
					this.ageOptions[0].child.push(one_obj)
				};
				// 再次分享时间
				let time_obj = {};
				for (let i = 10; i <= 24; i++) {
					time_obj = {
						title: i + "小时",
						value: i
					}
					this.time_map.push(time_obj)
				}
			},
		},
		computed: {
			...mapState({
				location: state => state.location,
				issue_map: state => state.issue_map,
				issue_article: state => state.issue_article,
				issue_identity: state => state.issue_identity,
				type_check: state => state.type_check	
			})
		}
	}
</script>

<style lang="scss">
	.tips {
		font-size: 24rpx;
		display: flex;
		align-items: center;
		margin-left: 30rpx;
		padding-top: 20rpx;
		color: gray;

		.iconfont {
			color: $color-primary;
			margin-right: 10rpx;
		}
	}

	.white-box {
		width: 100%;
		height: auto;
		background: white;
		margin-bottom: 30rpx;

		.set-li {
			margin: 0 30rpx;
			min-height: 95rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #E6E6E6;
			font-size: 28rpx;

			.title {
				flex-shrink: 0;
				line-height: 95rpx;
			}

			.right {
				font-size: 26rpx;
				color: #999999;
				text-align: right;
				display: flex;
				align-items: center;
				justify-content: flex-end;

				.text {
					width: 400rpx;
					text-align: right;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			&:last-child {
				border: none;
			}
		}

		.all-line {
			flex-wrap: wrap;

			.title {
				width: 100%;
			}

			.right {
				width: 100%;
				min-height: 95rpx;
				text-align: left;
				justify-content: space-between;

				.input {
					font-size: 26rpx;
					text-align: left;
					width: calc(100% - 100rpx);
				}

				.primary-btn {
					width: 80rpx;
					text-align: center;
				}
			}
		}
	}

	.submit {
		width: 236rpx;
		height: 74rpx;
		background: rgba(255, 158, 151, 1);
		border-radius: 37rpx;
		font-size: 30rpx;
		color: white;
		text-align: center;
		line-height: 74rpx;
		margin: 100rpx auto;
		margin-bottom: 0;
	}
</style>
