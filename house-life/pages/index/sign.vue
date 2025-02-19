<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar :is-back="false" title="签到" :border-bottom="false">
		<!-- #endif -->
		</u-navbar>
		<image src="../../static/img/sign.png" style="height: 100rpx;width: 100%;margin-top: 10rpx;"></image>
		<youlanSignIn @shift="shift" :integral="integral" :isIntegral="isIntegral" :checkinDays="checkinDays"
			:is_day_signin="is_day_signin" :already="data" :supplementary="true" bgday="#5baa30" :checkDate="true"
			type="calendar" lang="zh" @changeMonth="historysign" @change="signDate" />
	</view>
</template>

<script>
	let rewardedVideoAd = null
	let ttRewardedVideoAd = null
	import config from "@/common/config.js" // 全局配置文件
	import youlanSignIn from '@/components/youlan-SignIn/youlan-SignIn.vue'
	let baseUrl = config.baseUrl;
	export default {
		components: {
			youlanSignIn
		},
		data() {
			return {
				data: [],
				checkinDays: 0, // 签到天数
				integral: 3, // 本次签到获取的积分
				isIntegral: true, // 是否显示签到积分模块    
				is_day_signin: false,
				user: []
			}
		},
		// #ifdef MP-WEIXIN
		onLoad() {},
		// #endif
		// #ifdef MP-TOUTIAO
		onLoad() {},
		// #endif
		methods: {
			shift() {
				return this.$mytip.toast('暂时无法补签哦')
			},
			historysign() {},
			// #ifdef MP-WEIXIN
			async signDate(v) {
				// 视频播放完, 并且用户点击了【关闭广告】按钮
				this.checkinDays = this.checkinDays + 1;
				this.is_day_signin = true
			},
			// #endif
			// #ifdef MP-TOUTIAO
			async signDate(v) {
				this.checkinDays = this.checkinDays + 1;
				this.is_day_signin = true
			},
			// #endif
			setIntegralBasedOnCheckinDays() {
				switch (this.checkinDays) {
					//现在是连续签到了2天，
					case 2:
						//第三天能获得多少天会员：2
						this.integral = 2;
						break;
					case 6:
						this.integral = 3;
						break;
					case 14:
						this.integral = 5;
						break;
					case 24:
					case 26:
						this.integral = 2;
						break;
					case 29:
						this.integral = 7;
						break;
					default:
						this.integral = 1;
				}
			},
			calculateRecentContinuousCheckinDays(dateStrings, currentDate = new Date()) {},
			checkToken() {},
		}
	}
</script>

<style>
</style>