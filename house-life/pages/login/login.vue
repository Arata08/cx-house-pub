<template>
	<view>
		<u-toast ref="uToast" />
		<view class="img-a">
			<view class="t-b">
				您好，欢迎使用
			</view>
		</view>
		<view class="login-view">
			<view class="t-login">
				<form class="cl">
					<view class="t-a">
						<text class="txt">手机号</text>
						<input type="number" name="phone" placeholder="请输入您的手机号" maxlength="11" v-model="username" />
					</view>
					<view class="t-a">
						<text class="txt">密码</text>
						<!-- #ifdef MP-WEIXIN -->
						<input type="password" name="code" maxlength="18" placeholder="请输入您的密码" v-model="password" />
						<!-- #endif -->
						<!-- #ifdef MP-TOUTIAO -->
						<input password="true" name="code" maxlength="18" placeholder="请输入您的密码" v-model="password" />
						<!-- #endif -->
					</view>
					<view>
						<checkbox-group @change="checkboxChange">
							<label>
								<checkbox :checked="isChecked" value="cb" style="transform:scale(0.7);" /><text
									style=" font-size: 76%;">我已阅读并同意</text>
								<text @click="showAgreement1()"
									style="color: coral; white-space: nowrap; font-size: 76%;">《丽丽租好房用户协议》</text>
								<web-view v-if="showWebview1" src="https://ht.lilihouse.cn/user.html"></web-view>
								<text style="white-space: nowrap; font-size: 76%;">和</text>
								<text @click="showAgreement2()"
									style="color: coral;white-space: nowrap; font-size: 76%;">《隐私政策》</text>
								<web-view v-if="showWebview2" src="https://ht.lilihouse.cn/privacy.html"></web-view>
							</label>
						</checkbox-group>
					</view>
					<button @tap="login()">登 录</button>
					<view class="reg" @tap="reg()">短信登录</view>
				</form>
			</view>
		</view>

		<!-- #ifdef MP-WEIXIN -->
		<view class="buttom">
			<button open-type="getPhoneNumber" @getphonenumber="weChatLogin" class="clearBtn">
				<view class="loginType">
					<view class="item">
						<view class="icon"><u-icon size="60" name="phone" color="rgb(83,194,64)"></u-icon></view>
						手机号快捷登录
					</view>
				</view>
			</button>
		</view>
		<!-- #endif -->

		<!-- #ifdef MP-TOUTIAO -->
		<view class="buttom">
			<button class="clearBtn">
				<view class="loginType">
					<view class="item">
						<image src="../../static/dy.png" style="height: 70rpx;width: 70rpx;margin-bottom: 7px;"></image>
						<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumberHandler"
							style="font-size: 25rpx;color: black;">抖音快捷登录</button>
					</view>
				</view>
			</button>
		</view>
		<!-- #endif -->
	</view>
</template>
<script>
	import {
		loginController
	} from '../../common/utils/login.js';
	import {
		promisify,
		request
	} from '../../common/utils/promisify.js';
	import config from "@/common/config.js" // 全局配置文件
	let baseUrl = config.baseUrl;
	let code;
	export default {
		data() {
			return {
				openid: '',
				// 抖音登录状态
				nickName: '',
				avatar: '',
				username: '',
				password: '',
				isChecked: false,
				showPrivacy: false,
				showWebview1: false, // 初始时不显示web-view
				showWebview2: false, // 初始时不显示web-view
				sessionKey: '',
				oppenid: '',
			}
		},
		//#ifdef MP-TOUTIAO
		onLoad() {},
		//#endif
		methods: {
			//#ifdef MP-TOUTIAO
			async getPhoneNumberHandler(e) {},
			//#endif
			showAgreement1() {
				this.showWebview1 = true; // 点击按钮后允许显示web-view
			},
			showAgreement2() {
				this.showWebview2 = true; // 点击按钮后允许显示web-view
			},
			checkboxChange(e) {
				this.isChecked = !this.isChecked;
			},
			login() {
				// 登录成功初始化token与用户信息
				this.$mytip.toast('密码和账号相同，请及时前往个人中心修改密码！')
				setTimeout(() => {
					this.$u.vuex('vuex_token', data.token);
					this.$u.vuex('vuex_user', data.loginUser);
					uni.switchTab({
						url: '/pages/index/index'
					})
				}, 2000); // 延迟时间可以根据需要调整
			},
			weChatLogin(e) {},
		}
	};
</script>


<style>
	page {
		background-color: #ffffff;
	}
</style>
<style lang="scss" scoped>
	.txt {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}

	.img-a {
		width: 100%;
		height: 450rpx;
		background-image: url(https://47.106.182.219:29382/down/PGdeFw7eS7jw.jpg);
		background-size: 100%;
	}

	.reg {
		font-size: 28rpx;
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 50rpx;
		font-weight: bold;
		background: #f5f6fa;
		color: #000000;
		text-align: center;
		margin-top: 30rpx;
	}

	.login-view {
		width: 100%;
		position: relative;
		margin-top: -120rpx;
		background-color: #ffffff;
		border-radius: 8% 8% 0% 0;
	}

	.t-login {
		width: 600rpx;
		margin: 0 auto;
		font-size: 28rpx;
		padding-top: 80rpx;
	}

	.t-login button {
		font-size: 28rpx;
		background: #2796f2;
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 50rpx;
		font-weight: bold;
	}

	.t-login input {
		height: 90rpx;
		line-height: 90rpx;
		margin-bottom: 50rpx;
		border-bottom: 1px solid #e9e9e9;
		font-size: 28rpx;
	}

	.t-login .t-a {
		position: relative;
	}

	.t-b {
		text-align: left;
		font-size: 42rpx;
		color: #ffffff;
		padding: 130rpx 0 0 70rpx;
		font-weight: bold;
		line-height: 70rpx;
	}

	.t-login .t-c {
		position: absolute;
		right: 22rpx;
		top: 22rpx;
		background: #5677fc;
		color: #fff;
		font-size: 24rpx;
		border-radius: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		padding: 0 25rpx;
	}

	.t-login .t-d {
		text-align: center;
		color: #999;
		margin: 80rpx 0;
	}

	.t-login .t-e {
		text-align: center;
		width: 250rpx;
		margin: 80rpx auto 0;
	}

	.t-login .t-g {
		float: left;
		width: 50%;
	}

	.t-login .t-e image {
		width: 50rpx;
		height: 50rpx;
	}

	.t-login .t-f {
		text-align: center;
		margin: 150rpx 0 0 0;
		color: #666;
	}

	.t-login .t-f text {
		margin-left: 20rpx;
		color: #aaaaaa;
		font-size: 27rpx;
	}

	.t-login .uni-input-placeholder {
		color: #aeaeae;
	}

	.cl {
		zoom: 1;
	}

	.cl:after {
		clear: both;
		display: block;
		visibility: hidden;
		height: 0;
		content: '\20';
	}

	.buttom {
		.loginType {
			display: flex;
			padding: 140rpx 0;
			justify-content: center;

			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: $u-tips-color;
				font-size: 22rpx;
			}
		}

		.hint {
			position: absolute;
			bottom: 0;
			padding: 20rpx 40rpx;
			font-size: 20rpx;
			color: $u-tips-color;

			.link {
				color: #2979ff;
			}
		}
	}

	.clearBtn {
		margin: 0;
		padding: 0;
		line-height: 1;
		background-color: #FFFFFF;
	}

	.clearBtn::after {
		position: unset !important;
		border: unset;
	}
</style>