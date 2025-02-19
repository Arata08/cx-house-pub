<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar :is-back="true" title="选择城市" :border-bottom="false"></u-navbar>
		<!-- #endif -->
		<view class="selected">
			<view class="title">
				已选 :
				<text style="color: #2979ff;margin-left: 12rpx;">
					{{vuex_city==''?'请选择城市':vuex_city}}
				</text>
			</view>
		</view>
		<view class="location" @click="setLocation">
			<view class="title">当前定位</view>
			<view class="body">
				<view class="left">
					<image src="../../static/navigate.png" mode="widthFix" class="img"></image>
					{{locationCity}}
				</view>
				<view class="right">切换城市</view>
			</view>
		</view>
		<view class="hot">
			<view class="title">热门城市</view>
			<view class="body">
				<view class="tag" v-for="(item,index) in hotList" :key="index" @click="clickCity(item)">
					{{item.city}}{{item.district}}
				</view>
			</view>
		</view>
		<view>
			<button @tap="open">更多城市</button>
			<cityPicker :column="column" :default-value="defaultValue" :mask-close-able="maskCloseAble"
				@confirm="confirm" @cancel="cancel" :visible="visible" />
		</view>
		<view v-show="tip" style="font-size: 25px;color: red;margin-top: 10%;">
			请打开手机定位和小程序定位权限！
		</view>
	</view>
</template>
<script>
	import cityPicker from '@/uni_modules/piaoyi-cityPicker/components/piaoyi-cityPicker/piaoyi-cityPicker' //更多城市
	import indexList from "@/common/index.list.js";
	import {
		consumers
	} from 'stream';
	const letterArr = indexList.list.map(val => {
		return val.letter;
	})
	// import wxGetAddress from '@/common/utils/wxGetAddress.js'
	export default {
		data() {
			return {
				tip: false,
				visible: false, //更多城市
				maskCloseAble: true, //更多城市
				defaultValue: ['广东省', '佛山市', '禅城区'],
				column: 3, //更多城市
				locationCity: '',
				hotList: [{
						city: '杭州市',
						district: '西湖区'
					},
					{
						city: '郑州市',
						district: '金水区'
					},
					{
						city: '北京市',
						district: '朝阳区'
					},
					{
						city: '上海市',
						district: '静安区'
					},
					{
						city: '广州市',
						district: '白云区'
					},
					{
						city: '深圳市',
						district: '福田区'
					},
					{
						city: '曲靖市',
						district: '罗平县'
					},
					{
						city: '佛山市',
						district: '禅城区'
					}
				],
				scrollTop: 0,
				indexList: letterArr,
				list: indexList.list
			}
		},
		components: {
			cityPicker
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad() {
			this.findLocation()
		},
		methods: {
			clickCity(item) {
				this.$u.vuex('vuex_shi', item.city);
				this.$u.vuex('vuex_city', item.district);
				return uni.reLaunch({
					url: '../index/index'
				})
			},
			setLocation() {
				this.$u.vuex('vuex_city', this.locationCity);
				return uni.reLaunch({
					url: '../index/index'
				})
			},
			findLocation() {
				let that = this;

				// 显示加载提示框
				uni.showLoading({
					title: "正在定位......",
					mask: true
				});

				// 定义超时标识符
				let timeoutId = setTimeout(() => {
					if (uni.getStorageSync('isLocating')) { // 如果定位正在进行中
						uni.hideLoading();
						uni.showModal({
							title: '请打开定位权限',
							content: '请检查手机定位和小程序定位权限是否打开！',
							cancelText: '返回',
							confirmText: '自己选择',
							success: res => {
								if (res.confirm) {
									this.visible = true;
								}
							}
						});
						uni.setStorageSync('isLocating', false); // 结束定位过程
					}
				}, 4500);

				// 开始定位
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						const latitude = res.latitude; // 纬度
						const longitude = res.longitude; // 经度

						// 清除超时计时器
						clearTimeout(timeoutId);

						uni.request({
							url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' +
								longitude + '**********************************',
							success: function(res) {
								const result = res.data;
								if (result.status === 0) {
									const city = result.result.address_component.district;
									const shi = result.result.address_component.city;
									that.locationCity = city;
									let lifeData = uni.getStorageSync('lifeData');
									let vuex_city = lifeData.vuex_city;
									let vuex_shi = lifeData.vuex_shi;
									that.$u.vuex('vuex_shi', shi);
									that.$u.vuex('vuex_city', city);
									console.log(vuex_city, vuex_shi);
									uni.hideLoading();
									console.log('当前城市:', city);
								} else {
									console.log('获取城市信息失败');
								}
							},
							fail: function(err) {
								console.log('请求城市信息失败', err);
							}
						});
					},
					fail: function(err) {
						// 清除超时计时器
						clearTimeout(timeoutId);
						console.log('获取位置信息失败', err);
						uni.hideLoading();
						that.tip = true;
						uni.showModal({
							title: '定位失败',
							content: '请检查手机定位和小程序定位权限是否打开！',
							cancelText: '返回',
							confirmText: '手动选择',
							success: res => {
								if (res.confirm) {
									that.visible = true;
								}
							}
						});
					}
				});

				// 标记定位开始
				uni.setStorageSync('isLocating', true);
			},

			//更多城市
			open() {
				this.visible = true
			},
			confirm(val) {
				this.locationCity = val.areaName;
				this.$u.vuex('vuex_shi', val.cityName);
				this.$u.vuex('vuex_city', val.areaName);
				this.visible = false
				this.$mytip.toast('修改定位成功')
				setTimeout(() => {
					uni.reLaunch({
						url: '../index/index'
					});
				}, 1500);
			},
			cancel() {
				this.visible = false
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: 'data-cityPicker省市区地址选择器！',
				path: '/pages/cityPicker/cityPicker'
			}
		},
		onShareTimeline(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: 'data-cityPicker省市区地址选择器！'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.is-hover {
		background-color: #55aaff;
		border-color: #179b16;
	}

	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: $u-content-color;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
	}

	.selected {
		.title {
			font-size: 30rpx;
			color: $u-main-color;
			margin: 30rpx 20rpx;
			font-weight: 600;
			margin-left: 30rpx;
		}
	}

	.location {
		background: #FFFFFF;
		border-radius: 18rpx;
		padding: 3rpx 0;
		margin: 20rpx;

		.title {
			font-size: 22rpx;
			color: $u-tips-color;
			margin: 30rpx 20rpx;
		}

		.body {
			margin: 30rpx 20rpx;
			display: flex;
			justify-content: space-between;

			.left {
				font-size: 32rpx;
				font-weight: 800;
				display: flex;
				justify-content: center;
				align-items: center;

				.img {
					width: 35rpx;
					margin-right: 12rpx;
				}
			}

			.right {
				color: #2979ff;
				font-weight: 600;
				margin-right: 10rpx;
			}

			;
		}
	}

	.hot {
		.title {
			font-size: 30rpx;
			color: $u-main-color;
			margin: 30rpx 20rpx;
			font-weight: 600;
			margin-left: 30rpx;
		}

		.body {
			background: #FFFFFF;
			padding-bottom: 15rpx;
			border-radius: 18rpx;
			margin: 30rpx;

			.tag {
				display: inline-block;
				width: 120rpx;
				height: 150rpx;
				line-height: 75rpx;
				font-size: 26rpx;
				color: $u-content-color;
				margin: 20rpx 20rpx 10rpx 30rpx;
				padding: 5rpx 20rpx;
				text-align: center;
				background-color: $u-bg-color;
				border-radius: 12rpx;
			}
		}
	}
</style>