<template>
	<view>
		<view class="text">
			<text style="font-size: 15px;margin-left: 20rpx;">共{{total}}份信息
				<text style="float: right;margin-right: 20rpx;font-weight: bold;" @click="inputDialogToggle">发布求租</text>
			</text>
		</view>
		<view v-for="(item, index) in listData" :key="index" class="comment-container"
			@click="viewCommenterPhone(item)">
			<u-avatar class="avatar" :src="item.avatar"></u-avatar>
			<view class="comment-text">
				<view><text style="font-size: 120%;">{{ item.evaluate }}</text></view>
				<view class="info">
					<text>{{ item.createTime }}</text>
					<text>{{ item.userCity }}</text>
				</view>
			</view>
		</view>
		<view>
			<uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog ref="inputClose" mode="input" title="发布信息" value="" @confirm="submitEval">
					<textarea placeholder="请输入内容" v-model="ownevalu"></textarea>
				</uni-popup-dialog>
			</uni-popup>
		</view>
		<view class="buttom">
			<view class="loginType">
				<view class="icon"><u-icon size="75" name="chat" color="#55aaff" @click="inputDialogToggle"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from "@/common/config.js" // 全局配置文件
	let baseUrl = config.baseUrl;
	export default {
		data() {
			return {
				lifeData: null,
				listData: [{
					id: 1,
					name: "张三",
					avatar: "https://free4.yunpng.top/2025/02/19/67b587e227050.jpg",
					image: "https://free4.yunpng.top/2025/02/19/67b587e227050.jpg",
					evaluate: "这是一个评价示例",
					createTime: "2023-10-01",
					userCity: "北京",
					phonenumber: "12345678901"
				}],
				pageNum: 1,
				pageSize: 999,
				scrollTop: 0,
				reload: false,
				loadStatus: 'loadmore',
				status: 'more',
				total: 1,
				ownevalu: '',
				userCity: '',
				avatar: '',
				myphonenumber: null,
				userId: null,
				paidComments: {}, // 用于记录已付费的评论ID
			};
		},
		onLoad(option) {
			this.checkToken();
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			this.loadStatus = 'loading';
			// 获取数据
			this.getList()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.pageNum = 1
			this.$refs.uWaterfall.clear();
			// 获取数据
			this.getList();
			// 关闭刷新
			uni.stopPullDownRefresh();
		},
		methods: {
			checkAndFetchOrder() {},
			viewCommenterPhone(item) {
				let userId = this.userId;
				// 在扣除余额之前先询问用户
				uni.showModal({
					title: '确认支付',
					content: '获取电话号码将扣除1P币，是否继续？',
					success: (res) => {
						if (res.confirm) {
							// 用户点击确定，扣除余额并显示电话
							this.paidComments[item.id] = true; // 标记为已付费，实际更新数据库操作应在此处完成

							// 执行扣款相关的API调用
							let url = baseUrl + "/api/houseApi/addOrders";
							uni.request({
								url: url,
								method: "GET",
								data: {
									userId: this.userId,
									commentId: item.id,
								},
								success: (res) => {
									uni.makePhoneCall({
										phoneNumber: item.phonenumber,
										success(res) {
											console.log("调用成功", res.errMsg);
										},
										fail(res) {
											console.log("调用失败", res.errMsg);
										},
									});
								},
								fail: (err) => {
									console.log(err)
								}
							});
						}
					}
				});
			}
		},
		updateUserBalance(charge) {},
		checkToken() {},
		getList() {},
		inputDialogToggle() {
			this.$refs.inputDialog.open();
		},
		submitEval() {}
	};
</script>

<style>
	.text {
		background-color: #fff;
		line-height: 80rpx;
	}

	.comment-container {
		display: flex;
		align-items: center;
		padding: 10px;
		border-bottom: 1px solid #e1e1e1;
	}

	.avatar {
		margin-right: 10px;
	}

	.comment-text {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.info {
		display: flex;
		justify-content: space-between;
		color: #909399;
		font-size: 13px;
	}

	.right-align {
		text-align: right;
	}

	.loginType {
		font-size: 14px;
		position: fixed;
		right: 30rpx;
		bottom: 40rpx;
		width: 50px;
		height: 50px;
		cursor: pointer;
		text-align: center;
		border-radius: 100%;
	}
</style>