<template>
	<view>
		<!-- <u-navbar :is-back="true" title="房源列表" :border-bottom="false"></u-navbar> -->
		<u-sticky offset-top="0">
			<view class="sticky">
				<filterDropdown :menuTop="0" :filterData="filterData" :defaultSelected="defaultSelected"
					:updateMenuName="true" @confirm="confirm" dataFormat="Object"></filterDropdown>
			</view>
		</u-sticky>
		<view class="u-p-l-10 u-p-r-10 waterfall">
			<u-waterfall v-model="flowList" ref="uWaterfall">
				<template v-slot:left="{leftList}">
					<view class="demo-warter" v-for="(item, index) in leftList" :key="index">
						<u-lazy-load threshold="750" border-radius="12" :image="item.image" :index="index" height="480"
							img-mode="aspectFill" @click="clickImage(item.id)"></u-lazy-load>
						<view class="item-title">{{item.area2}} {{item.villageName}}
							{{item.type == '住房' ? item.houseNum + item.houseHall + item.toiletNum : '仓库/商铺'}}</view>
						<div class="container">
							<view class="item-desc">{{item.type}} |
								{{item.type == '住房' ? item.houseArea : item.roomArea}}㎡ <br> 房间号:{{item.houseNo}}
								{{item.stepType}}</view>
							<view class="item-price">¥{{item.price}}</view>
						</div>
					</view>
				</template>
				<template v-slot:right="{rightList}">
					<view class="demo-warter" v-for="(item, index) in rightList" :key="index">
						<u-lazy-load threshold="750" border-radius="12" :image="item.image" :index="index" height="480"
							img-mode="aspectFill"@click="clickImage(item.id)">
						</u-lazy-load>
						<view class="item-title">{{item.area2}} {{item.villageName}}
							{{item.type == '住房' ? item.houseNum + item.houseHall + item.toiletNum : '仓库/商铺'}}</view>
						<div class="container">
							<view class="item-desc">{{item.type}} |
								{{item.type == '住房' ? item.houseArea : item.roomArea}}㎡ <br> 房间号:{{item.houseNo}}
								{{item.stepType}}</view>
							<view class="item-price">¥{{item.price}}</view>
						</div>
					</view>
				</template>
			</u-waterfall>
			<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus"
				style="height: 80rpx;line-height: 80rpx;"></u-loadmore>
			<u-back-top :scroll-top="scrollTop" top="1000"></u-back-top>
			<u-no-network></u-no-network>
		</view>
	</view>
</template>

<script>
	import config from "@/common/config.js" // 全局配置文件
	import searchData from '@/common/utils/searchData.js'; //筛选菜单数据
	import filterDropdown from '@/components/zy/filterDropdown.vue';
	export default {
		components: {
			filterDropdown
		},
		data() {
			return {
				indexArr: [],
				valueArr: [],
				defaultSelected: [],
				filterData: [],
				searchData: {},
				pageNum: 1,
				pageSize: 100,
				scrollTop: 0,
				houseList: [],
				loadStatus: 'nomore',
				flowList: []
			}
		},
		onLoad(option) {
			let type = option.type
			let villageName = option.villageName
			this.searchData = {}
			if (type) {
				this.searchData.type = type
			}
			if (villageName) {
				this.searchData.villageName = villageName
			}
			// 获取房源数据
			this.findHouseList();
			// 获取小区数据
			this.findVillageList();
		},
		// onPageScroll(e) {
		//     this.scrollTop = e.scrollTop;
		// },
		// onReachBottom() { 
		//     this.loadStatus = 'loading';
		//     // 获取数据
		// 	this.findHouseList()
		// },
		// // 下拉刷新
		// onPullDownRefresh() {
		// 	this.pageNum = 1
		// 	this.flowList = []
		// 	this.$refs.uWaterfall.clear();
		// 	// 获取数据
		// 	this.findHouseList();
		// 	// 关闭刷新
		// 	uni.stopPullDownRefresh();
		// },
		methods: {
			findHouseList() {
				this.loadStatus = 'loading'
				let url = "/api/houseApi/findHouseRoomList";
				let defaultData = {
					state: 1,
					villageCity: uni.getStorageSync('lifeData').vuex_city,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					orderByColumn: 'price',
				}
				this.$u.get(url, {
					...defaultData,
					...this.searchData
				}).then(result => {
					this.total = result.total
					const data = result.rows;
						this.loadStatus = 'loadmore';
						this.houseList = data;
						for (let i = 0; i < this.houseList.length; i++) {
							// 先转成字符串再转成对象，避免数组对象引用导致数据混乱
							let item = this.houseList[i]
							if (!item.faceUrl.includes(config.staticUrl)) {
								item.image = config.staticUrl + item.faceUrl
							} else {
								item.image = item.faceUrl
							}
							if (item.type == 0) {
								item.type = '住房'
							} else if (item.type == 1) {
								item.type = '仓库/商铺'
							}
							if (this.$u.test.isEmpty(item.houseNum)) {
								item.houseNum = ''
							}
							if (this.$u.test.isEmpty(item.toiletNum)) {
								item.toiletNum = ''
							}
							if (this.$u.test.isEmpty(item.decoration)) {
								item.decoration = ''
							} else {
								item.decoration = '|' + item.decoration
							}
							if (this.$u.test.isEmpty(item.stepType) || this.$u.test.isEmpty(item.roomType)) {
								item.stepType = ''
							} else {
								item.stepType = '|' + item.stepType + ',' + item.roomType + '楼'
							}
							this.flowList.push(item);
						}
						++this.pageNum
					uni.removeStorageSync('searchKeyword')
				});
			},
			// 检查 name 是否已经存在于 submenu 数组中
			checkIfNameExists(value, submenuArray) {
				return submenuArray.some(item => item.value === value);
			},
			findVillageList() {
				const submenuLength = searchData[1].submenu.length;
				if (submenuLength == 1) {
					let url = "/api/houseApi/findVillageListHaveRoom"; //有房源的小区列表
					this.$u.get(url, {
						state: 1,
						city: uni.getStorageSync('lifeData').vuex_shi,
						area: uni.getStorageSync('lifeData').vuex_city
					}).then(result => {
						const data = result.rows
						searchData[0].submenu[0] = {
							name: '不限（' + uni.getStorageSync('lifeData').vuex_city + '）',
							value: ''
						};
						searchData[0].submenu[1] = {
							name: '还未划分区域',
							value: '未划分'
						};
						for (let i = 0; i < data.length; i++) {
							// 先转成字符串再转成对象，避免数组对象引用导致数据混乱
							let item = data[i]
							searchData[1].submenu.push({
								name: item.name,
								value: item.name
							});
							if (!this.checkIfNameExists(item.area2, searchData[0].submenu)) {
								searchData[0].submenu.push({
									name: item.area2,
									value: item.area2
								});
							}
						}
						console.log(result)
					});
				}
				this.filterData = searchData;
			},
			async findarea2VillageList(area2) {
				let url = "/api/houseApi/findVillageListHaveRoom"; //有房源的小区列表,区域内的小区
				await this.$u.get(url, {
					state: 1,
					city: uni.getStorageSync('lifeData').vuex_shi,
					area: uni.getStorageSync('lifeData').vuex_city,
					area2: area2
				}).then(result => {
					const data = result.rows
					searchData[1].submenu = [{
						"name": "不限",
						"value": ""
					}, ];
					for (let i = 0; i < data.length; i++) {
						// 先转成字符串再转成对象，避免数组对象引用导致数据混乱
						let item = data[i]
						searchData[1].submenu.push({
							name: item.name,
							value: item.name
						})
					}
					this.filterData = searchData;
				});
			},
			clickImage(houseId) {
				this.$u.route({
					url: '/pages/detail/detail',
					params: {
						houseId: houseId
					}
				})
			},
			//接收菜单结果
			confirm(e) {
				let type = e.value[2][0]
				let villageName = e.value[1][0]
				let price = e.value[3][0]
				let combo = e.value[4]
				let area2 = e.value[0][0]
				let houseNum = combo[0]
				let stepType = combo[1]
				let decoration = combo[2]
				let feature = combo[3]
				if (type!=null) {
					this.searchData.type = type
				}
				if (stepType=='' || stepType.length > 0) {
					this.searchData.stepType = stepType.toString()
				}
				if (area2) {
					this.searchData.area2 = area2
					this.findarea2VillageList(area2)
				}
				if (villageName!=null) {
					this.searchData.villageName = villageName
				}
				if (price!=null) {
					this.searchData.price = price
				}
				if (houseNum =='' || houseNum.length > 0) {
					this.searchData.houseNum = houseNum.toString()
				}
				if (decoration =='' || decoration.length > 0) {
					this.searchData.decoration = decoration.toString()
				}
				if (feature =='' || feature.length > 0) {
					this.searchData.feature = feature.toString()
				}
				this.pageNum = 1
				this.houseList = []
				this.flowList = []
				this.$refs.uWaterfall.clear();
				this.findHouseList();
				this.loadDefaulFindHouse = false
			},
			code() {
				this.$mytip.toast('请咨询技术支持')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		justify-content: space-between;
	}

	.waterfall {
		// padding-top: 85rpx;
	}

	.nomore {
		background-color: $u-bg-color;
	}

	.search {
		width: 54px;
		height: 44px;

		&:active {
			background-color: $u-bg-color;
		}
	}

	.rowClass {
		border-radius: 8px;
		background-color: rgb(255, 255, 255);
		margin-top: 10rpx;
	}

	.hoverClass {
		background-color: #E4E7ED;
	}

	.tabName {
		font-size: 28rpx;
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
		font-size: 55rpx;
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
</style>