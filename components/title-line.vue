<template>
	<view class="good-classified">
		<view class="type-list">
			<template v-for="(item,k) in titleList">
				<view class="type-li" :key="k" :class="{'active':item.id==curTitle}" @tap="checkTitle(k)">
					{{item.title}}
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		props: {
			titleList: {
				type: Array,
				default: [{
					title: "综合",
					id: 0
				}]
			},
			curTitle: {
				type: [String,Number],
				default: '0'
			}
		},
		created() {
			
		},
		methods: {
			checkTitle(k){
				this.$emit('titleChoose',this.titleList[k])
			}
		}
	}
</script>

<style lang="scss">
	.type-list {
		width: 100%;
		height: auto;
		margin: 20rpx auto;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		position: relative;
		z-index: 2;

		.type-li {
			flex-shrink: 0;
			position: relative;
			overflow-y: hidden;
			display: inline-block;
			text-align: center;
			margin-right: 40rpx;
			&:last-child {
				margin-right: 0;
			}
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
</style>
