<template>
	<view class="wrap">
		<view class="content">
			<view class="title">欢迎登录</view>
			<input class="u-border-bottom" type="number" v-model="loginName" placeholder="请输入手机号" />
			<view class="tips">未注册的手机号验证后自动创建账号</view>
			<u-button @click="submit" :style="[inputStyle]" class="getCaptcha">获取短信验证码</u-button>
			<view class="alternative">
				<view class="account" @click="accountLogin">密码登录</view>
				<view class="issue" @click="problem">遇到问题</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loginName: ''
			}
		},
		methods: {
			submit() {
				this.$u.route({
					url: 'pages/login/code',
					params: {
						loginName: this.loginName
					}
				})
			},
			accountLogin() {
				this.$u.route({
					url: 'pages/login/login'
				})
			},
			problem() {
				this.$u.route({
					url: 'pages/login/problem'
				})
			}
		}
	};
</script>

<style>
	page {
		overflow: hidden;
		background-color: #ffffff;
	}
</style>
<style lang="scss" scoped>
	.wrap {
		font-size: 28rpx;

		.content {
			width: 600rpx;
			margin: 80rpx auto 0;

			.title {
				text-align: left;
				font-size: 60rpx;
				font-weight: 500;
				margin-bottom: 100rpx;
			}

			input {
				text-align: left;
				margin-bottom: 10rpx;
				padding-bottom: 6rpx;
			}

			.tips {
				color: $u-type-info;
				margin-bottom: 60rpx;
				margin-top: 8rpx;
			}

			.getCaptcha {
				background-color: rgba(0, 0, 0, .1);
				color: $u-tips-color;
				border: none;
				font-size: 30rpx;
				padding: 12rpx 0;

				&::after {
					border: none;
				}
			}

			.alternative {
				color: $u-tips-color;
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;

				.account {
					&:active {
						background-color: #ededed;
					}
				}
			}
		}

		.buttom {
			.loginType {
				font-size: 14px;
				position: fixed;
				right: 50rpx;
				bottom: 50rpx;
				width: 60px;
				height: 60px;
				padding: 4px;
				cursor: pointer;
				background: #FFF;
				text-align: center;
				line-height: 60px;
				border-radius: 100%;
				-webkit-box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1), inset 0px -1px 0px 0px rgba(0, 0, 0, 0.1);
				box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1), inset 0px -1px 0px 0px rgba(0, 0, 0, 0.1);
			}
		}
	}
</style>