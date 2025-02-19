<template>
	<view>
		<view class="text">
			<text style="font-size: 15px;margin-left: 20rpx;">共{{total}}条评价
				<text style="float: right;margin-right: 20rpx;font-weight: bold;" @click="inputDialogToggle">添加评价</text>
			</text>
		</view>
		<view class="text" v-for="(item,index) in listData" :key="index" style="padding: 0 20rpx;margin-top: 6rpx;">
			<view><text>{{ item.evaluate }}</text></view>
			<view style="text-align: right;color: #909399;font-size: 13px;"><text>{{ item.createTime }}</text></view>
		</view>
		<view>
			<!-- 输入框示例 -->
			<uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog ref="inputClose" mode="input" title="评价房源" value="" @confirm="submitEval">
					<textarea placeholder="请输入评价" v-model="ownevalu"></textarea>
				</uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				houseId: null,
				listData: [{
					id: 1,
					evaluate: '这是一个示例评价。',
					createTime: '2024-05-20 05:20:00'
				}],
				pageNum: 1,
				pageSize: 20,
				scrollTop: 0,
				reload: false,
				loadStatus: 'loadmore',
				status: 'more',
				total: 1,
				ownevalu: '',
				userId: null
			};
		},
		onLoad(option) {},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			this.loadStatus = 'loading';
		},
		// 下拉刷新
		onPullDownRefresh() {},
		methods: {
			getList() {},
			inputDialogToggle() {
				this.$refs.inputDialog.open();
			},
			submitEval() {
				this.$mytip.successToast('评价成功')
				this.$refs.inputDialog.close()
			}
		}
	};
</script>

<style>
	.text {
		background-color: #fff;
		line-height: 80rpx;
	}
</style>