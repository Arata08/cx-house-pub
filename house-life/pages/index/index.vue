<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar :is-back="false">
			<view style="display: flex;align-items: center;">
				<view @click="location">{{vuex_city==''?'选择':vuex_city}}</view>
				<u-icon name="arrow-down-fill" class="u-p-l-10" color="#44a0de"></u-icon>
				<u-search placeholder="你想住在哪儿" v-model="keyword" input-align="center" :show-action="false"
					:clearabled="true" height="60" :disabled="true" style="width: 400rpx;" @click="search"></u-search>
			</view>
		</u-navbar>
		<!-- #endif -->

		<!-- #ifdef MP-TOUTIAO -->
		<view
			style="display: flex;align-items: center;border: 0px solid #ccc;border-radius: 20px;background-color: #ffffff;">
			<view style="padding-left: 10rpx;" @click="location">{{vuex_city==''?'选择':vuex_city}}</view>
			<u-icon name="arrow-down-fill" class="u-p-l-10" color="#44a0de"></u-icon>
			<u-search placeholder="你想住在哪儿" v-model="keyword" input-align="center" :show-action="false"
				:clearabled="true" height="60" :disabled="true" style="width: 600rpx;" @click="search"></u-search>
		</view>
		<!-- #endif -->

		<view><!-- 相关文档地址https://uniapp.dcloud.net.cn/component/video.html -->
			<!-- 			<video id="myVideo" :loop="true" :src='video_src' autoplay show-play-btn enable-play-gesture :show-fullscreen-btn="false" show-mute-btn muted style="width: 100%">
			</video> -->
			<!-- 相关文档地址https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wxa75efa648b60994b&token=540037788&lang=zh_CN -->

			<!-- #ifdef MP-WEIXIN -->
			<txv-video :vid='video_src[0].src' playerid="txv1" enablePlayGesture enableProgressGesture
				autoPauseIfOpenNative autoPauseIfNavigate show-mute-btn></txv-video>
			<!-- #endif -->

			<!-- #ifdef MP-TOUTIAO -->
			<video :src='video_src[1].src' autoplay poster="https://free4.yunpng.top/2025/01/06/677bebf9881a9.jpg"
				style="width: 100%"></video>
			<!-- #endif -->
		</view>
		<view class="rowClass">
			<u-row>
				<!-- #ifdef MP-WEIXIN -->
				<u-col span="3" text-align="center" v-for="(item,index) in navList" :key="index">
				<!-- #endif -->
					<!-- #ifdef MP-TOUTIAO -->
					<u-col span="4" text-align="center" v-for="(item,index) in navList" :key="index">
					<!-- #endif -->
						<view class="u-padding-20" @tap="clickNav(item)" hover-class="hoverClass">
							<image :src="item.src" style="width: 90rpx;height: 90rpx;" mode="widthFix"></image>
							<view class="tabName">{{item.name}}</view>
						</view>
					</u-col>
			</u-row>
		</view>
		<u-gap height="10"></u-gap>
		<view @click="notice">
			<u-notice-bar mode="vertical" :list="noticeList" type="primary" more-icon bg-color="#fff" :duration="5000"
				border-radius="15"></u-notice-bar>
		</view>
		<!-- 筛选条 -->
		<u-gap height="5"></u-gap>
		<text>筛选条无数据，暂不展示：</text>
		<!-- #ifdef MP-WEIXIN -->
		<view class="sticky">
			<filterDropdown :menuTop="0" :filterData="filterData" :defaultSelected="defaultSelected"
				:updateMenuName="true" @confirm="confirm" dataFormat="Object"></filterDropdown>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-TOUTIAO -->
		<u-sticky offset-top="0">
			<view class="sticky">
				<filterDropdown :menuTop="0" :filterData="filterData" :defaultSelected="defaultSelected"
					:updateMenuName="true" @confirm="confirm" dataFormat="Object"></filterDropdown>
			</view>
		</u-sticky>
		<!-- #endif -->
		<u-gap height="5"></u-gap>
		<u-waterfall v-model="flowList" ref="uWaterfall">
			<template v-slot:left="{leftList}">
				<view class="demo-warter" v-for="(item, index) in leftList" :key="index">
					<u-lazy-load threshold="750" border-radius="12" :image="item.image" :index="index" height="480"
						img-mode="aspectFill" @click="clickImage(item.id)"></u-lazy-load>
					<view class="item-title">{{item.area2}} {{item.villageName}}
						{{item.type == '住房' ? item.houseNum + item.houseHall + item.toiletNum : '仓库/商铺'}}
					</view>
					<div class="container">
						<view class="item-desc">{{item.type}} | {{item.type == '住房' ? item.houseArea : item.roomArea}}㎡
							<br> 房间号:{{item.houseNo}} {{item.stepType}}
						</view>
						<view class="item-price">¥{{item.price}}</view>
					</div>
				</view>
			</template>
			<template v-slot:right="{rightList}">
				<view class="demo-warter" v-for="(item, index) in rightList" :key="index">
					<u-lazy-load threshold="750" border-radius="12" :image="item.image" :index="index" height="480"
						img-mode="aspectFill" @click="clickImage(item.id)">
					</u-lazy-load>
					<view class="item-title">{{item.area2}} {{item.villageName}}
						{{item.type == '住房' ? item.houseNum + item.houseHall + item.toiletNum : '仓库/商铺'}}
					</view>
					<div class="container">
						<view class="item-desc">{{item.type}} | {{item.type == '住房' ? item.houseArea : item.roomArea}}㎡
							<br> 房间号:{{item.houseNo}} {{item.stepType}}
						</view>
						<view class="item-price">¥{{item.price}}</view>
					</div>
				</view>
			</template>
		</u-waterfall>
		<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="findHouse"
			style="height: 80rpx;line-height: 80rpx;"></u-loadmore>
		<u-back-top :scroll-top="scrollTop" top="500"></u-back-top>
		<!--客服电话 		<view class="buttom">
			<view class="loginType">
				<view class="wechat item">
					<view class="icon"><u-icon size="75" name="server-man" color="#55aaff" @click="server"></u-icon></view>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import filterDropdown from '@/components/zy/filterDropdown.vue';
	export default {
		components: {
			filterDropdown
		},
		data() {
			return {
				video_src: [{
						src: 'h355723vic1'
					}, // 示例视频链接
					{
						src: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4'
					} // 示例视频链接
				],
				keyword: '',
				pageNum: 1,
				pageSize: 20,
				scrollTop: 0,
				houseList: [],
				noticeList: [
					'欢迎使用我们的租房平台！',
					'最新房源已上线，快来查看吧！'
				],
				navList: [{
						name: "我要租房",
						src: "/static/img/index/cover/index_cover1.png",
						type: "0"
					},
					{
						name: "仓库/店铺",
						src: "/static/img/index/cover/index_cover2.png",
						type: "1"
					},
					{
						name: "我要求租",
						src: "/static/img/index/cover/index_cover3.png",
						type: "2"
					},
					{
						name: "发布房源",
						src: "/static/img/index/cover/index_cover4.png",
						type: "3"
					}
				],
				flowList: [{
					id: 1,
					image: 'https://free4.yunpng.top/2025/02/19/67b587e227050.jpg',
					area2: '未划分',
					villageName: '阳光小区',
					type: '住房',
					houseNum: 2,
					houseHall: 1,
					toiletNum: 1,
					roomArea: 50,
					houseNo: 'A1-2-3',
					stepType: '高层',
					price: 2500,
					houseArea: 99
				}],
				uvCode: uni.getStorageSync('uvCode'),
				indexArr: [],
				valueArr: [],
				defaultSelected: [],
				loadStatus: 'loadmore',
				loadDefaulFindHouse: true,
				total: 999,
				vuex_city: '禅城区'
			}
		},
		onLoad() {
			this.$u.vuex('vuex_shi', '佛山市');
			this.$u.vuex('vuex_city', '禅城区');
		},
		onUnload() {
			// 移除监听事件  
			uni.$off('findIndexHouseList');
		},
		// #ifdef MP-TOUTIAO
		onShow() {},
		// #endif
		onPageScroll(e) {},
		onReachBottom() {},
		// 下拉刷新
		onPullDownRefresh() {
			// 关闭刷新
			uni.stopPullDownRefresh();
		},
		methods: {
			location() {
				this.$u.route({
					url: 'pages/location/location',
				})
			},
			search() {
				this.$u.route({
					url: 'pages/search/search',
				})
			},
			notice() {
				this.$u.route({
					url: 'pages/notice/notice'
				})
			},
			findHouse() {},
			findHouseList(type = 0) {},
			findHouseListFilt() {},
			clickSearch() {
				this.$u.route('/pages/search/search');
			},
			clickImage(houseId) {
				this.$u.route({
					url: '/pages/detail/detail',
					params: {
						houseId: houseId
					}
				})
			},
			clickNav(item) {
				if (item.type === "3") {
					return this.$u.route('/pages/detail/preHouse');
				} else if ((item.type === "0") || (item.type === "1")) {
					// #ifdef MP-WEIXIN
					return this.$u.route({
						url: '/pages/search/searchList',
						params: {
							type: item.type
						}
					})
					// #endif
					// #ifdef MP-TOUTIAO
					uni.pageScrollTo({
						selector: '#viewA',
						duration: 300
					});
					this.searchData.type = item.type
					this.pageNum = 1
					this.houseList = []
					this.flowList = []
					this.$refs.uWaterfall.clear();
					this.findHouseListFilt();
					setTimeout(() => {
						tt.showToast({
							icon: 'success',
							title: '主页房源已更新！',
						});
					}, 1000);
					// #endif
				}
				// #ifdef MP-WEIXIN
				else {
					return this.$u.route('/pages/center/help');
				}
				// #endif
			},
			code() {
				this.$mytip.toast('请咨询作者')
			},
			getNoticecList() {},
			findVillageList() {},
			async findarea2VillageList(area2) {},
			//接收菜单结果
			confirm(e) {
				console.log("筛选")
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		justify-content: space-between;
	}

	.nomore {
		background-color: $u-bg-color;
	}

	.search {

		&:active {
			background-color: $u-bg-color;
		}
	}

	.rowClass {
		border-radius: 8px;
		background-color: rgb(255, 255, 255);
	}

	.hoverClass {
		background-color: #E4E7ED;
	}

	.tabName {
		font-size: 25rpx;
		color: $u-main-color;
	}

	.demo-warter {
		border-radius: 8px;
		margin-top: 3px;
		background-color: #ffffff;
		padding: 3px;
		position: relative;
	}

	.u-close {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
	}

	.item-cover {
		font-size: 50rpx;
		color: $u-type-warning;
	}

	.item-title {
		font-size: 23rpx;
		color: $u-main-color;
		font-weight: bold;
		padding-top: 5rpx;
		padding-left: 10rpx;
	}

	.item-price {
		font-weight: normal;
		font-size: 40rpx;
		color: $u-type-warning;
		margin-top: 10rpx;
	}

	.item-desc {
		font-weight: normal;
		font-size: 23rpx;
		color: $u-tips-color;
		padding-bottom: 5rpx;
		padding-left: 10rpx;
	}

	.item-tag {
		font-size: 24rpx;
		color: $u-tips-color;
		margin-top: 3px;
	}

	.buttom {
		.loginType {
			font-size: 14px;
			position: fixed;
			right: 30rpx;
			bottom: 0rpx;
			width: 50px;
			height: 50px;
			cursor: pointer;
			background: #FFF;
			text-align: center;
			line-height: 60px;
			border-radius: 100%;
			-webkit-box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1), inset 0px -1px 0px 0px rgba(0, 0, 0, 0.1);
			box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1), inset 0px -1px 0px 0px rgba(0, 0, 0, 0.1);
		}
	}
</style>