<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar :is-back="true" title="通知公告" :border-bottom="false"></u-navbar>
		<!-- #endif -->
		<view class="wrap">
			<scroll-view scroll-y style="height: 100%;width: 100%;">
				<view class="page-box">
					<view class="tabSwiper" v-for="(item, index) in dataList" :key="item.id"
						@click="clickContent(item)">
						<view class="top">
							<view class="left">
								<u-icon name="bell" :size="35" color="#2979ff"></u-icon>
								<view class="title">{{ item.title }}</view>
								<u-icon name="arrow-right" color="rgb(203,203,203)" :size="26"></u-icon>
							</view>
							<view class="right">{{ item.date }}</view>
						</view>
						<view class="item">
							<view class="content">
								<view class="title u-line-2">{{ item.content }}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageNum: 1,
				pageSize: 50,
				dataList: [{
						id: 1,
						title: "重要通知：平台维护公告",
						date: "2024-10-01",
						content: "尊敬的用户，为了提供更好的服务，我们将于2024年10月1日进行系统维护，期间可能会有短暂的服务中断。"
					},
					{
						id: 2,
						title: "新功能上线：在线客服",
						date: "2024-09-25",
						content: "我们新增了在线客服功能，您可以通过点击页面底部的客服按钮与我们的客服人员进行实时沟通。"
					},
					{
						id: 3,
						title: "优惠活动：租房特惠",
						date: "2024-09-20",
						content: "即日起至2024年10月31日，所有租房用户均可享受8折优惠，请尽快联系我们了解详情。"
					}
				]
			};
		},
		onLoad() {
			this.getNoticecList();
		},
		methods: {
			clickContent(item) {
				if (item.id) {
					this.$u.route('/pages/content/content', {
						id: item.id
					});
				}
			},
			getNoticecList() {}
		}
	};
</script>
<style lang="scss" scoped>
	.tabSwiper {
		width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;

		.top {
			display: flex;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;

				.title {
					margin: 0 10rpx;
					font-size: 32rpx;
					font-weight: bold;
				}
			}

			.right {
				color: $u-tips-color;
			}
		}

		.item {
			display: flex;
			margin: 20rpx 0 0;

			.left {
				margin-right: 20rpx;

				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 10rpx;
				}
			}

			.content {
				.title {
					font-size: 28rpx;
					line-height: 50rpx;
				}
			}

			.right {
				margin-left: 10rpx;
				padding-top: 20rpx;
				text-align: right;
			}
		}
	}

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}
</style>