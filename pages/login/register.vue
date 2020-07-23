<template>
	<view class="box">
		<view class="login-main">
			<view class="login-tips font-bold">
				注册
			</view>
			<view class="login-box">
				<view class="login-line">
					<input class="input" type="text" v-model="mobile" maxlength="11" placeholder="请输入手机号码" />
				</view>
				<view class="login-line">
					<input class="input" type="text" v-model="validateCode" maxlength="6" placeholder="请输入手机验证码" />
					<view class="yzm-btn border-btn" @tap="getPhoneCode">
						{{yzm_text}}
					</view>
				</view>
				<view class="login-line">
					<input class="input" type="text" password="password" v-model="passWord" maxlength="20" placeholder="密码长度6-20位" />
				</view>
				<view class="bg-btn bg-primary" @tap="register">
					注册
				</view>
				<view class="bg-btn bg-primary back-home2" @tap="backHome">
					返回首页
				</view>
				<view class="rule">
					<view class="iconfont iconlujing" v-if="!is_check" @tap="is_check=!is_check"></view>
					<view class="iconfont iconxuanzhong" v-if="is_check" @tap="is_check=!is_check"></view>
					我已经阅读并同意 <navigator class="url" url="/pages/user/rule">《用户服务协议》</navigator>及<navigator class="url" url="/pages/user/privacy">《隐私政策》</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let t=60;
	let cut=null;
	import jwt_decode from "jwt-decode";
	export default {
		data() {
			return {
				mobile: "",
				yzm_text: "获取验证码",
				validateCode:"",
				passWord:"",
				is_check:true
			}
		},
		onLoad() {

		},
		methods: {
			backHome() {
				uni.setStorageSync('setStatusIndexFunc', 0)
				uni.reLaunch({
					url: '/pages/index'
				})
			},
			register(){
				if(!this.is_check){
					this.$box.toast('请先阅读并同意用户协议', 'none');
					return;
				}
				let phonereg = /^1[3456789]\d{9}$/
				if (!(phonereg.test(this.mobile))) {
					this.$box.toast('请填写正确的手机号码', 'none');
					return;
				}
				if(!this.validateCode||!this.passWord){
					this.$box.toast('请正确填写所有信息', 'none');
					return;
				}
				
				this.$api.get('/login/updatePassWord',{params:{
					mobile:this.mobile,
					validateCode:this.validateCode,
					passWord:this.passWord
				}}).then(res=>{
					if(res.code==200){
						let token = res.data;
						let user_json =jwt_decode(token);
						this.$common.setLocal('token', res.data);
						this.$common.setLocal('customerSeqId', user_json.userId);
						this.$common.setLocal('customerName', user_json.userName || "");
						this.$store.commit('saveUser',user_json)
						uni.setStorageSync('setStatusIndexFunc', 0)
						uni.reLaunch({
							url:'/pages/index'
						})
					}
					
				}).catch(err=>{
					console.log(err);
				})
			},
			getPhoneCode() {
				let self = this;
				let phonereg = /^1[3456789]\d{9}$/
				if (!(phonereg.test(this.mobile))) {
					this.$box.toast('请填写正确的手机号码', 'none');
					return;
				}
				if (cut) {
					return
				}
				this.$api.get('/wechat/email/register', {
					params: {
						mobile: this.mobile
					}
				}).then(res => {
					if (res.code == 200) {
						this.$box.toast(res.msg);
						cut = setInterval(function() {
							self.cutTime()
						}, 1000)
					}
				})
			
			
			},
			cutTime() {
				let self = this;
				if (t > 0) {
					t--;
					self.yzm_text = t + "S后重试"
				} else {
					t = 60;
					self.yzm_text = "获取验证码"
					clearInterval(cut)
					cut=null
				}
			},
		},
		onUnload() {
			t = 60;
			this.yzm_text = "获取验证码"
			clearInterval(cut)
			cut=null
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
	.back-home2 {
		border:2px solid $color-primary !important;
		background: none !important;
		color: $color-primary!important;;
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
		height: calc(100vh - var(--window-top));
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
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
			border-bottom: 1px solid #eaeaea;

			.title {
				width: 130rpx;
				flex-shrink: 0;
			}

			.input {
				font-size: 26rpx;
				flex-grow: 1;
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
		font-size: 26rpx;
		width: 100%;
		text-align: center;
		color: #a1a1a1;
		margin-top: 60rpx;

		.iconfont {
			font-size: 50rpx;
			margin-top: 40rpx;
		}
	}
</style>
