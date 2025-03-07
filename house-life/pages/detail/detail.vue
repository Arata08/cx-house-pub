<template>
	<view class="u-margin-left-20 u-margin-right-20">
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar :is-back="true" title="房源" :border-bottom="false" back-text="返回" :custom-back="goHome"></u-navbar>
		<!-- #endif -->
		<view>
			<u-swiper :list="swiperlist" :height="750" mode="number" effect3d effect3d-previous-margin="20"
				:interval="5000" @click="clickImg"></u-swiper>
		</view>
		<view class="item u-margin-top-5" style="display: flex; flex-direction: row;">
			<view class="item-title" style="flex: 2;">
				{{room.type == '租房' ? room.houseNum + room.houseHall + room.toiletNum : room.roomType}}</view>
			<view class="item-price">{{'¥' + room.price + '/月'}}</view>
		</view>
		<text
			style="color: #65676b;font-weight: normal;margin-left: 3px;">浏览量：{{room.pageViews}}&nbsp;&nbsp;想要：{{room.wantRent}}</text>
		<view class="item" style="display: flex;align-items: center;flex-wrap: wrap;margin-top: 5PX;">
			<view v-for="(item,index) in tagList" :key="index" style="background-color: #f5f5f5;color: #606266;margin-right: 15rpx;
			  margin-top: 15rpx;padding: 0 10rpx;height: 60rpx;line-height: 60rpx;">
				{{item.title}}
			</view>
		</view>
		<!-- 小程序通讯 -->
		<!-- 		<button type="default" open-type="contact"  class="clearBtn">
			<u-cell-group>
				<u-cell-item title="服务费另计" value="咨询"></u-cell-item>
			</u-cell-group>		
		</button> -->
		<view style="display: flex;center;margin-bottom: 10px;">
			<view style="width: 70%;">
				<view class="example-body" style="margin-top: 8px;text-align: center;">
					<uni-row>
						<uni-col :span="12">
							<view class="demo-uni-col dark">楼层:{{room.stepType}}</view>
							<view class="demo-uni-col dark">面积:{{room.houseArea}}平方米</view>
							<view class="demo-uni-col dark">起租日期:{{room.startDate}}</view>
						</uni-col>
						<uni-col :span="12">
							<view class="demo-uni-col light">水费:{{room.roomCode}}</view>
							<view class="demo-uni-col light">付款方式:{{room.payType}}</view>
							<view class="demo-uni-col light">电费:{{room.floor}}</view>
						</uni-col>
					</uni-row>
				</view>
			</view>
			<image src="../../static/logo2.jpg" mode="widthFix" style="width: 200rpx;height: 170rpx;margin-left: 10px;">
			</image>
		</view>
		<view v-if="room.introduce">
			<u-gap height="10" bg-color="#f8f8f8"></u-gap>
			<u-card title="房源介绍" :border="false" :head-border-bottom="false" padding="0" title-size="38">
				<view class="u-padding-top-45 item" slot="body">
					{{room.introduce}}
				</view>
			</u-card>
		</view>
		<u-gap height="1" bg-color="#f8f8f8"></u-gap>
		<view style="position: relative;">
			<u-card :title="room.villageName" :border="false" :head-border-bottom="false" padding="0" title-size="38">
				<view class="u-padding-top-45" slot="body">
					<map :latitude="latitude" :longitude="longitude">
						<view style='width:100%;height:100%;' @click="clickMap"></view>
					</map>
					<view @click="clickMap" style="margin-top: 30rpx;padding-left: 10rpx;height:80rpx;
					line-height: 80rpx;background-color: #fdfdfd;border-radius: 6px;
					display: flex;justify-content: space-between;
					padding-right: 10rpx;color: #909399;
					">
						<view>
							<u-icon name="map" color="#909399" size="30"></u-icon>
							<text style="margin-left: 8rpx;">
								您距离房源约 {{distance}} km
							</text>
						</view>
						<view>
							<text style="margin-right: 3rpx;">
								导航
							</text>
							<u-icon name="arrow-right" color="#909399" size="30"></u-icon>
						</view>
					</view>
				</view>
			</u-card>
		</view>
		<u-gap height="1" bg-color="#f8f8f8"></u-gap>

		<!-- 		<u-gap height="1" bg-color="#f8f8f8"></u-gap>
		<view style="position: relative;">
			<u-card title="服务介绍" :border="false" :head-border-bottom="false" padding="0" title-size="38">
				<view class="u-padding-top-35" slot="body">
					<u-cell-group :border="false">
						<u-cell-item icon="heart" title="承诺-四大租住承诺，安心有保障" :arrow="false" hover-class="none" :border-bottom="false"></u-cell-item>
						<u-cell-item icon="level" title="品质-两类品质保障，入住更无忧" :arrow="false" hover-class="none" :border-bottom="false"></u-cell-item>
						<u-cell-item icon="star" title="服务-两项日常服务，生活超便捷" :arrow="false" hover-class="none" :border-bottom="false"></u-cell-item>
						<u-cell-item icon="rmb" title="付款-多种付款方式，支付更灵活" :arrow="false" hover-class="none" :border-bottom="false"></u-cell-item>
					</u-cell-group>
				</view>
			</u-card>
		</view> -->
		<u-gap height="1" bg-color="#f8f8f8"></u-gap>
		<view style="position: relative;">
			<u-card title="房源评价" :border="false" :head-border-bottom="false" padding="0" title-size="38">
				<view class="u-padding-top-50 u-padding-bottom-50" slot="body">
					<u-cell-group :border="false">
						{{evaluate}}
						<text style="float: right;color: #909399;font-size: 13px;">{{credt}}</text>
					</u-cell-group>
				</view>
				<view slot="foot" style="padding-top: 30rpx;float: right;">
					<u-icon name="chat-fill"></u-icon>
					<text @click="moreEval"
						style="text-align: center;font-size: 12px;margin-left: 5rpx;">更多评价（{{evalsize}}）</text>
				</view>
			</u-card>
		</view>
		<u-gap height="10" bg-color="#f8f8f8"></u-gap>
		<view style="position: relative;padding-bottom: 50rpx;">
			<u-card title="房东" :border="false" :head-border-bottom="false" padding="0" title-size="38">
				<view class="u-padding-top-45" slot="body">
					<view class="u-flex">
						<view class="u-m-r-20">
							<u-avatar :src="room.agentAvatar" size="80"></u-avatar>
						</view>
						<view class="u-flex-1">
							<view class="" style="color: orangered;font-size: 120%;">{{room.ownerName}}</view>
						</view>
					</view>
					<view class="arrow-right" @click="clickItem">
						<view class="phone">
							<u-icon name="phone" class="u-p-l-10" color="#55aaff" size="45"></u-icon>
						</view>
					</view>
				</view>
			</u-card>
			<view class="item">
				<u-divider>底部</u-divider>
			</view>
		</view>
		<view class="navigation">
			<view class="left">
				<button type="default" open-type="contact" class="clearBtn" style="font-size: 14px;color: #6a6a6a;">
					<view class="item" style="padding: 15rpx;">
						<u-icon name="server-fill" :size="40"></u-icon>
						<view class="text">客服</view>
					</view>
				</button>
				<view class="item" style="padding: 15rpx;" @click="heartHouse">
					<u-icon name="heart" :size="40" v-if="!room.heart"></u-icon>
					<u-icon name="heart-fill" color="#ff9900" :size="40" v-if="room.heart"></u-icon>
					<view class="text">收藏</view>
				</view>
				<button type="default" open-type="share" class="clearBtn" style="font-size: 14px;color: #6a6a6a;">
					<view class="item" style="padding: 15rpx;">
						<u-icon name="zhuanfa" :size="40"></u-icon>
						<view class="text">分享</view>
					</view>
				</button>
			</view>
			<view class="right" @click="clickItem">
				<view class="btn">联系房东</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from "@/common/config.js" // 全局配置文件
	export default {
		data() {
			return {
				nvueWidth: "70%",
				room: {
					stepType: '1',
					id: 1,
					payType: '月付',
					type: '租房',
					houseNum: 2,
					houseHall: 1,
					toiletNum: 1,
					price: 2500,
					pageViews: 100,
					wantRent: 5,
					agentAvatar: 'https://free4.yunpng.top/2024/12/02/674d2d2380346.png',
					ownerName: '张三',
					agentPhone: '13800138000',
					heart: false,
					imageList: [{
						imgUrl: 'https://free4.yunpng.top/2024/12/02/674d2d2380346.png',
						imageName: '图片1'
					}],
					featureList: [{
							feature: '近地铁'
						},
						{
							feature: '拎包入住'
						}
					],
					villageName: '阳光小区',
					houseArea: 50,
					decoration: '简装',
					startDate: '2023-10-01',
					roomCode: '3元/每吨',
					floor: '0.5元/每度',
					introduce: '这是一个示例房源介绍。',
					longitude: 120.14,
					latitude: 30.35,
					address: '浙江省杭州市西湖区'
				},
				village: {
					year: '2020',
					type: '住宅',
					green: '30%'
				},
				swiperlist: [{
					title: '图片1',
					image: 'https://free4.yunpng.top/2024/12/02/674d2d2380346.png'
				}],
				tagList: [{
						title: '近地铁'
					},
					{
						title: '拎包入住'
					}
				],
				evaluList: [],
				user: {},
				longitude: 120.14,
				latitude: 30.35,
				distance: 0,
				ownevalu: '',
				houseId: null,
				evalsize: 1,
				havem: true,
				evaluate: '这是一个示例评价。',
				credt: '2024-05-20 05:20:00',
				limitOne: 1,
			}
		},
		onLoad: function(option) {},
		methods: {
			increaseViews(id) {},
			clickItem() {},
			heartHouse() {
				// 判断是否有token
				let lifeData = uni.getStorageSync('lifeData');
				let token = lifeData.vuex_token
				if (!token) {
					// 没有token 则跳转到登录
					return uni.reLaunch({
						url: '../login/login'
					})
				} else {
					// 判断Token是否有效
					let url = "/api/profile/isExpiration";
					this.$u.get(url, {
						token: token
					}).then(obj => {
						if (obj.data) {
							// 没有token，过期则跳转到登录
							return uni.reLaunch({
								url: '../login/login'
							})
						} else {
							// 收藏
							let lifeData = uni.getStorageSync('lifeData');
							let userId = lifeData.vuex_user.user.userId;
							let url = "api/houseApi/saveHeart";
							this.$u.post(url, {
								heart: this.room.heart,
								houseId: this.room.id,
								userId: userId,
							}).then(result => {
								this.room.heart = !this.room.heart
								this.$mytip.toast(result.msg)
							});
						}
					});
				}
			},
			goHome() {},
			async findHouseById(houseId) {
				this.village = room.village
				this.room = room
				// 判断是否收藏
				this.selectHouseHeart(houseId);
				//查询房源评价
				this.selectHouseEvals(houseId);

				// 分享自定义标题与图片
				let shareTitle = ''
				if (room.type == '租房') {
					shareTitle = this.village.name + " " + this.room.houseNum + this.room.houseHall + this.room
						.toiletNum + " " + this.room.decoration + " ¥" + this.room.price + "/月"
				} else {
					shareTitle = this.village.name + " " + room.roomType + " " + this.room.decoration + " ¥" + this
						.room.price + "/月"
				}
				this.$u.mpShare = {
					title: shareTitle, // 默认为小程序名称，可自定义
					// 支持PNG及JPG，默认为当前页面的截图
					imageUrl: this.room.faceUrl,
				}
				// 经纬度
				this.longitude = room.longitude
				this.latitude = room.latitude
				// 计算距离
				let lat1 = 39.909
				let lng1 = 116.39742
				let lat2 = this.latitude
				let lng2 = this.longitude
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						lat1 = res.latitude
						lng1 = res.longitude
						this.distance = this.getDistance(lat1, lng1, lat2, lng2);
					}
				})
			},
			//判断是否收藏
			selectHouseHeart(houseId) {},
			// 获取一条房源评价
			async selectHouseEvals(houseId) {},
			moreEval() {
				this.$u.route({
					url: '/pages/detail/evalList',
					params: {
						houseId: this.houseId
					}
				})
			},
			clickImg(index) {
				let imgArr = this.swiperlist.map(val => {
					return val.image
				})
				console.log(imgArr);
				// 预览图片
				uni.previewImage({
					current: index,
					urls: imgArr
				});
			},
			clickMap(e) {
				uni.openLocation({
					longitude: Number(this.longitude),
					latitude: Number(this.latitude),
					name: this.room.villageName,
					address: this.room.address
				})
			},
			getDistance(lat1, lng1, lat2, lng2) {
				lat1 = lat1 || 0;
				lng1 = lng1 || 0;
				lat2 = lat2 || 0;
				lng2 = lng2 || 0;
				var rad1 = lat1 * Math.PI / 180.0;
				var rad2 = lat2 * Math.PI / 180.0;
				var a = rad1 - rad2;
				var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
				var r = 6378137;
				var distance = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) *
					Math.pow(Math.sin(b / 2), 2)));
				return (distance / 1000).toFixed(2);
			},
		}
	}
</script>

<style>
	/* page不能写带scope的style标签中，否则无效 */
	page {
		background-color: rgb(255, 255, 255);
	}
</style>


<style lang="scss" scoped>
	.demo-uni-row {
		margin-bottom: 10px;
		/* QQ、抖音小程序文档写有 :host，但实测不生效 */
		/* 百度小程序没有 :host，需要设置block */
		/* #ifdef MP-TOUTIAO || MP-QQ || MP-BAIDU */
		display: block;
		/* #endif */
	}

	/* 支付宝小程序没有 demo-uni-row 层级 */
	/* 微信小程序使用了虚拟化节点，没有 demo-uni-row 层级 */
	/* #ifdef MP-ALIPAY || MP-WEIXIN */
	/deep/ .uni-row {
		margin-bottom: 10px;
	}

	/* #endif */

	.demo-uni-col {
		height: 36px;
		border-radius: 4px;
	}

	.dark_deep {
		background-color: #99a9bf;
	}

	.dark {
		background-color: #d3dce6;
	}

	.light {
		background-color: #e5e9f2;
	}

	map {
		width: 100%;
		height: 350rpx;
	}

	.item {
		padding: 5rpx;
		line-height: 80rpx;
		margin-top: -30rpx;
	}

	.item-title {
		font-size: 42rpx;
		color: $u-main-color;
		font-weight: bold;
	}

	.item-price {
		font-weight: normal;
		font-size: 45rpx;
		color: $u-type-warning;
	}

	.item-desc {
		font-weight: normal;
		font-size: 36rpx;
		color: $u-tips-color;
	}

	.arrow-right {
		position: absolute;
		top: 80rpx;
		right: 28rpx;
		font-weight: normal;
		font-size: 28rpx;
		color: $u-tips-color;

		.phone {
			width: 90rpx;
			height: 90rpx;
			border-radius: 100%;
			box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1);
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.wayClass {
		color: #606266;
		padding: 30rpx;
		line-height: 50rpx;
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

	.navigation {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 0rpx 15rpx;
		background-color: #ffffff;
		box-shadow: 0 -1px 1px 0 rgba(0, 0, 0, 0.05);
		z-index: 9999;

		.left {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 38rpx;
			font-size: 14px;
			color: #6a6a6a;

			.item {
				display: flex;

				.text {
					margin-left: 4rpx;
				}
			}
		}

		.right {
			display: flex;
			font-size: 28rpx;
			align-items: center;

			.btn {
				line-height: 66rpx;
				margin-left: 30rpx;
				padding: 5rpx 50rpx;
				color: #ffffff;
				border-radius: 36rpx;
				background-color: #2979ff;
			}
		}
	}
</style>