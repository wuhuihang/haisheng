<template>
	<view class="box">
		<view class="back-home" :style="{'top':min_top+'px'}" @tap="backHome"></view>
		<navigator url="register" class="go-register" :style="{'top':min_top+'px'}">新用户，先注册</navigator>
		<view class="login-main">
			<view class="login-tips font-bold">
				Hello，你好
			</view>
			<view class="login-box">
				<view class="login-line">
					<view class="title font-bold">手机号</view>
					<input class="input" type="text" maxlength="11" v-model="mobile" placeholder="请输入手机号码" />
				</view>
				<view class="login-line">
					<view class="title font-bold">密码</view>
					<input class="input" type="text" maxlength="20" password="password" v-model="passWord" placeholder="请输入密码" />
					<navigator class="find-pass" url="/pages/user/find_password">忘记密码？</navigator>
				</view>
				<view class="bg-btn bg-primary" @tap="login">
					登录
				</view>
				<view class="rule">
					<view class="iconfont iconlujing" v-if="!is_check" @tap="is_check=!is_check"></view>
					<view class="iconfont iconxuanzhong" v-if="is_check" @tap="is_check=!is_check"></view>
					我已经阅读并同意 <navigator class="url" url="/pages/user/rule">《用户服务协议》</navigator>及<navigator class="url" url="/pages/user/privacy">《隐私政策》</navigator>
				</view> 
				<!-- #ifdef MP -->
				<view class="other-login">
					<view class="title">
						其他登录方式
					</view>
					<view class="login-type">
						<navigator url="login_wechat" class="iconfont iconweixin"></navigator>
					</view>
				</view>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	import jwt_decode from "jwt-decode";
	export default {
		data() {
			return {
				mobile: "",
				passWord: "",
				yzm_text: "获取验证码",
				min_top: 100,
				is_check:true
			}
		},
		onShow() {
			uni.setStorageSync('setStatusIndexFunc', 0)
			// #ifdef MP
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			this.min_top = menuButtonInfo.height + menuButtonInfo.top + 20;
			// #endif
		},
		methods: {
			backHome() {
				uni.setStorageSync('setStatusIndexFunc', 0)
				uni.reLaunch({
					url: '/pages/index'
				})
			},
			login() {
				if(!this.is_check){
					this.$box.toast('请先阅读并同意用户协议', 'none');
					return;
				}
				let phonereg = /^1[3456789]\d{9}$/
				if (!(phonereg.test(this.mobile))) {
					this.$box.toast('请填写正确的手机号码', 'none');
					return;
				}
				if (!this.passWord) {
					this.$box.toast('请填写密码', 'none');
					return;
				}

				this.$api.get('/login/getLoginByPassWord', {
					params: {
						mobile: this.mobile,
						passWord: this.passWord
					}
				}).then(res => {
					if (res.code == 200) {
						let token = res.data;
						let user_json = jwt_decode(token);
						this.$common.setLocal('token', res.data);
						this.$common.setLocal('customerSeqId', user_json.userId);
						this.$common.setLocal('customerName', user_json.userName || "");
						this.$store.commit('saveUser', user_json)
						uni.reLaunch({
							url: '/pages/index'
						})
					}
				}).catch(err => {
					// console.log(err);
				})
			}
		}
	}
</script>

<style lang="scss">
	.rule {
		display: flex;
		align-items: center;
		font-size: 20rpx;
		.iconfont {
			font-size: 30rpx;
			padding: 8rpx;
		}
		.iconxuanzhong {
			color: $color-primary;
		}
		.url {
			color: $color-primary;
		}
	}
	.back-home {
		position: absolute;
		top: 50rpx;
		left: 50rpx;
		color: #000;
		font-size: 30rpx;
		width: 40rpx;
		height: 40rpx;
		background: url('@/static/images/home.png') no-repeat;
		background-size: 100% 100%;
	}

	.iconshouye-xiaoxi {
		font-size: 32rpx !important;
	}

	.login-main {
		width: 100%;
	}

	.bg-primary {
		background: $color-primary;
		margin: 60rpx 0;
		height: 50rpx;
		line-height: 50rpx;
		border-radius: 100rpx;
		font-size: 30rpx;
	}

	.box {
		width: 100%;
		height: 100vh;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;

		.go-register {
			position: absolute;
			top: 100rpx;
			right: 40rpx;
			font-size: 30rpx;
			color: $color-primary;
		}
	}

	.login-tips {
		width: calc(100% - 80rpx);
		margin: 0 auto;
		font-size: 60rpx;
		margin-bottom: 70rpx;
	}

	.login-box {
		width: calc(100% - 80rpx);
		margin: 0 auto;

		.login-line {
			display: flex;
			width: 100%;
			align-items: center;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 30rpx;

			.title {
				width: 130rpx;
				flex-shrink: 0;
			}

			.input {
				font-size: 26rpx;
				flex-grow: 1;
			}
			.find-pass {
				font-size: 24rpx;
				color: $color-primary;
			}
		}
	}

	.yzm-btn {
		padding: 12rpx 20rpx;
		margin-left: 10rpx;
		height: 26rpx;
		line-height: 26rpx;
		flex-shrink: 0;
	}

	.other-login {
		width: 100%;
		font-size: 30rpx;
		width: 100%;
		text-align: center;
		color: #a1a1a1;
		margin-top: 60rpx;

		.iconfont {
			font-size: 60rpx;
			margin: 0 20rpx;
			margin-top: 40rpx;
		}

		.login-type {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
