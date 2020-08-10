<template>
	<view class="">
		首页
		<navigator url="/pages/login/login" class="bg-btn">登录	</navigator>
		
		<navigator url="/pages/login/login" class="bg-btn" @tap="logout">退出登录	</navigator>
		<navigator url="/pages/make_money/article_edit" class="bg-btn">原创编辑文章</navigator>
		
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {}
		},
		onLoad() {

		},
		methods: {
			logout() {
				this.$common.removeLocal('token')
				this.$common.removeLocal('customerSeqId')
				this.$common.removeLocal('customerName')
				this.$store.commit('saveUser', '')
				this.$store.commit('saveOrderConfirm', {})
				this.$store.commit('saveShop', {})
				this.$store.commit('saveAddress', {})
				this.$store.commit('saveAccount', {})
				uni.navigateTo({
					url:'/pages/login/login'
				})
			},
		}
	}
</script>