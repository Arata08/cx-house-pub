<template>
	<view class="">
		<u-image width="100%" height="350rpx" :src="src"></u-image>
		<view class="wrap">
			<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
				<u-form-item :label-position="labelPosition" label="小区/村名" prop="villageName" label-width="180"
					left-icon="map" :leftIconStyle="{color:'#00aaff'}">
					<uni-combox :candidates="labels" v-model="model.villageName" emptyTips="这里啥都没有"
						placeholder="输入并筛选"></uni-combox>
					<!-- 					<u-input :border="border" type="select" :select-open="selectShow" v-model="model.villageName"
						placeholder="请选择小区/村" @click="selectShow = true"></u-input> -->
				</u-form-item>
				<!-- 				<view class="search-container">
					<u-input placeholder="小区太多找不到？输入小区名模糊查找" v-model="searchKeyword" style="flex: 1;margin-left: 3px;"
						@confirm="searchVillage"></u-input>
					<uni-icons type="search" size="15" @click="searchVillage()"><text
							style="font-size: 90%;">筛选/搜索小区</text></uni-icons>
				</view> -->
				<u-form-item :label-position="labelPosition" label="详细地址" prop="address" label-width="180"
					left-icon="file-text" :leftIconStyle="{color:'#ff557f'}" right-icon="map"
					:rightIconStyle="{color:'#d5d5d5'}">
					<u-input :border="border" placeholder="请在地图选择详细地址" v-model="model.address" type="text" disabled
						@click="chooseAddress"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="房东姓名" prop="ownerName" label-width="180"
					left-icon="account" :leftIconStyle="{color:'#ffaa00'}">
					<u-input :border="border" placeholder="请输入房东姓名(必填)" v-model="model.ownerName" type="text"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="房东电话" prop="owerPhone" label-width="180"
					left-icon="phone" :leftIconStyle="{color:'#ffaa00'}">
					<u-input :border="border" placeholder="请正确输入房东电话(必填)" v-model="model.owerPhone" type="text"
						maxlength="11"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="水费(元/每吨)" prop="roomCode" label-width="220"
					left-icon="rmb-circle" :leftIconStyle="{color:'#55ffff'}">
					<u-input :border="border" placeholder="请正确输入水费(元/每吨)" v-model="model.roomCode" type="text"
						maxlength="5"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="电费(元/每度)" prop="floor" label-width="220"
					left-icon="rmb-circle" :leftIconStyle="{color:'#55ffff'}">
					<u-input :border="border" placeholder="请正确输入电费(元/每度)" v-model="model.floor" type="text"
						maxlength="5"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="楼梯/电梯" prop="stepType" label-width="180"
					left-icon="eye" :leftIconStyle="{color:'#55557f'}">
					<u-input :border="border" type="select" placeholder="请选择楼梯" :select-open="stepTypenShow"
						v-model="model.stepType" @click="stepTypeShow = true"></u-input>
				</u-form-item>
			</u-form>
			<u-select mode="single-column" :list="selectList" v-model="selectShow" @confirm="selectConfirm"></u-select>
			<u-select mode="single-column" :list="stepTypeList" v-model="stepTypeShow"
				@confirm="stepTypeConfirm"></u-select>
			<!-- 流量主-腾讯视频广告 -->
			<!-- <ad unit-id="adunit-c6cdd74f48eed506" ad-type="video" ad-theme="white"></ad> -->
		</view>
		<view class="bottom-btn">
			<u-button type="primary" @click="submit">下一步</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			let that = this;
			return {
				Expired: false,
				//searchKeyword: '',
				src: 'http://img.sccnn.com/bimg/340/02027.jpg',
				actionSheetShow: false,
				stepTypeShow: false,
				model: {
					type: 0,
					houseType: '',
					roomLabel: '',
					villageName: '',
					villageId: '',
					address: '',
					houseNo: '',
					//装修
					decoration: '',
					//电梯？
					stepType: '',
					//房东
					ownerName: '',
					//房东电话
					owerPhone: '',
					payType: '',
					createName: null,
					publishId: null,
					state: 0,
					longitude: 0,
					latitude: 0,
					//水费
					roomCode: '',
					//电费
					floor: '0.',
				},
				selectList: [],
				stepTypeList: [{
						label: '楼梯',
						value: '简装'
					},
					{
						label: '电梯',
						value: '电梯'
					}
				],
				rules: {},
				border: false,
				check: false,
				selectShow: false,
				labelPosition: 'left',
				errorType: ['toast'],
			};
		},
		onLoad(option) {
			this.findVillageList();
			this.checkExpired();
			let houseId = option.houseId //上个页面传递的参数。
			if (houseId) {
				// 渲染当前房源信息
				this.findHouseById(houseId);
			}
			// 定位经纬度
			uni.getLocation({
				type: 'gcj02',
				// 当指定 high 时，期望精度值为100m，当指定 best 时期望精度值为20m
				accuracy: 'best',
				// 开启高精度定位
				isHighAccuracy: true,
				success: (res) => {
					this.longitude = res.longitude
					this.latitude = res.latitude
				}
			});
			uni.$on('changeAddressConfig', (address, lon, lat) => {
				// 获取数据
				this.changeAddressConfig(address, lon, lat);
			})
		},
		onUnload() {
			// 移除监听事件  
			uni.$off('changeAddressConfig');
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		computed: {
			// 定义计算属性来获取所有 label
			labels() {}
		},
		methods: {
			// async searchVillage() {
			// 	// 假设findVillageList是一个异步方法，接收搜索关键词作为参数
			// 	try {
			// 		const response = await this.findVillageList(this.searchKeyword);
			// 		this.$mytip.toast('筛选成功')
			// 	} catch (error) {
			// 		console.error("搜索过程中出现错误", error);
			// 	}
			// },
			changeAddressConfig(address, lon, lat) {},
			checkExpired() {},
			submit() {
				if (this.Expired) {
					this.model.state = 0;
					return this.$u.route({
						url: '/pages/detail/addHouse',
					})
				}
			},
			selectConfirm(e) {
				e.map((val, index) => {
					this.model.villageName = val.label;
					this.model.villageId = val.value
				})
			},
			decorationConfirm(e) {
				e.map((val, index) => {
					this.model.decoration = val.label;
				})
			},
			stepTypeConfirm(e) {
				e.map((val, index) => {
					this.model.stepType = val.label;
				})
			},
			labelPositionChange(index) {
				this.labelPosition = index == 0 ? 'left' : 'top';
			},
			// 点击actionSheet回调
			actionSheetCallback(index) {
				uni.hideKeyboard();
				this.model.payType = this.actionSheetList[index].text;
			},
			findVillageList(VillageName) {},
			findHouseById(houseId) {},
			chooseAddress() {
				this.$u.route({
					url: '/pages/chooseAddress/index'
				})
			},
		}
	};
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style scoped lang="scss">
	.wrap {
		padding: 30rpx;
	}

	.search-container {
		display: flex;
		/* 使用Flex布局 */
		align-items: center;
		/* 垂直居中对齐 */
		width: 100%;
		/* 容器宽度根据需要设定，这里假设是全宽 */
		box-sizing: border-box;
		/* 确保padding和border被包含在宽度内 */
	}

	/* #ifdef MP-WEIXIN */
	.bottom-btn {
		position: fixed;
		bottom: 8rpx;
		width: 100%;
		padding: 30rpx;
		border-top: 1rpx solid #eee;
		background-color: #FFFFFF;
	}

	/* #endif */

	/* #ifndef MP-WEIXIN */
	.bottom-btn {
		padding: 0 30rpx 30rpx 30rpx;
		background-color: #FFFFFF;
	}

	/* #endif */
</style>