<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar :is-back="false" title="我的" :border-bottom="false"></u-navbar>
		<!-- #endif -->
		<view class="user" @click="go()">
			<u-avatar :src="avatar" size="140"></u-avatar>
			<view class="user-info">
				<view class="u-font-18 u-tips-color">{{vuex_user.user.nickName}}</view>
				<text v-if="membershipInfo" style="color:lightcoral;">会员到期时间:{{membershipInfo.expiresAt}}</text>
			</view>
		</view>

		<view class="center-nav">
			<u-row>
				<u-col span="3" text-align="center" v-for="(item,index) in navList" :key="index">
					<view @click="clickNav(item.url)">
						<u-icon :name="item.icon" color="#909399" size="50"></u-icon>
						<view class="tabName">{{item.name}}</view>
					</view>
				</u-col>
			</u-row>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<!-- 				<u-cell-item icon="integral" title="实名认证" @click="setting"></u-cell-item> -->
				<u-cell-item icon="setting" title="个人中心" @click="setting"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="question-circle" title="常见问题" @click="problem"></u-cell-item>
				<u-cell-item icon="star" title="关于我们" @click="aboutMe"></u-cell-item>
				<!-- 调用微信反馈功能 -->
				<!-- #ifdef MP-WEIXIN -->
				<button type="default" open-type="feedback" class="clearBtn" hover-class="none"
					style="background-color: #FFFFFF;">
					<view class="tabName"><u-cell-item icon="info-circle" title="问题反馈"></u-cell-item></view>
				</button>
				<!-- #endif -->
				<!-- 客服 -->
				<!-- #ifdef MP-WEIXIN -->
				<button type="default" open-type="contact" style="margin-top: 20rpx;">在线咨询</button>
				<!-- #endif -->
				<!-- #ifdef MP-TOUTIAO -->
				<button open-type="im" data-im-id="65983166" bindim="imCallback" binderror="onimError">
					在线咨询
				</button>
				<!-- #endif -->
			</u-cell-group>
		</view>
		<view class="version">Version {{vuex_version}}</view>
	</view>
</template>

<script>
	import config from "@/common/config.js" // 全局配置文件
	export default {
		data() {
			return {
				membershipInfo: {
					expiresAt: '2024-12-31'
				}, // 用来存储查询到的会员信息
				show: true,
				navList: [{
						name: "浏览记录",
						icon: "checkmark-circle",
						url: "pages/center/history"
					},
					{
						name: "我的收藏",
						icon: "heart",
						url: "pages/center/heart"
					},
					{
						name: "我的房源",
						icon: "order",
						url: "pages/center/order"
					},
					{
						name: "我的余额",
						icon: "rmb-circle",
						url: "pages/change/balance"
					}
				],
				avatar: 'https://free4.yunpng.top/2024/12/02/674d2d2380346.png',
				vuex_user: {
					user: {
						nickName: '张三',
						userId: 1,
						avatar: 'https://free4.yunpng.top/2024/12/02/674d2d2380346.png'
					}
				},
				vuex_version: '1.0.0'
			}
		},
		onLoad() {},
		onShow() {},
		methods: {
			go() {
				return this.$u.route({
					url: '/pages/change/vip',
				})
			},
			async fetchMembershipInfo() {
				this.membershipInfo = {
					'expiresAt': '未开通'
				};
			},
			setting() {
				this.$u.route('/pages/profile/setting')
			},
			problem() {
				this.$u.route({
					url: 'pages/login/problem'
				})
			},
			// 关于作者
			aboutMe() {
				this.$u.route('/pages/profile/aboutMe')
			},
			checkToken() {},
			code() {
				this.$mytip.toast('敬请期待')
			},
			clickNav(url) {
				if (url) {
					this.$u.route(url);
				} else {
					this.$mytip.toast('敬请期待')
				}
			},
			updateAvatar() {},
		},
	}
</script>

<style lang="scss">
	.version {
		position: absolute;
		bottom: 20rpx;
		width: 100%;
		font-size: 70%;
		text-align: center;
	}

	.user {
		display: flex;
		align-items: center;
		background: #c5dce0;
		width: 700rpx;
		margin: auto;
		box-sizing: border-box;
		padding: 0 30rpx;
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		height: 160rpx;

		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}

		.user-info {
			height: 90rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding-left: 15rpx;

			text {
				&:nth-child(1) {
					font-weight: bold;
				}

				&:nth-child(2) {
					font-size: 14px;
					color: #777;
				}
			}
		}
	}

	.user-box {
		background-color: #fff;
		justify-content: space-between;
	}

	.center-nav {
		background-color: #FFFFFF;
		margin-top: 30rpx;
		padding: 30rpx 0;
		border-radius: 8px;

		.tabName {
			color: #606266;
			font-size: 26rpx;
			padding-top: 10rpx;
		}
	}

	.qiandao {
		color: #606266;
		font-size: 24rpx;
		margin-right: 24rpx;
		margin-top: 54rpx;
		justify-content: center;
		align-items: center;
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