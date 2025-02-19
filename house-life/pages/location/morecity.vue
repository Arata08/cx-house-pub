<template>
	<u-index-list :scrollTop="scrollTop" :index-list="indexList">
		<view v-for="(item, index) in list" :key="index">
			<u-index-anchor :index="item.letter" />
			<view class="list-cell u-border-bottom" v-for="(item1, index) in item.data" :key="index" @click="clickCity(item1.name)">
				{{item1.name}}
			</view>
		</view>
	</u-index-list>
</template>

<script>
	import indexList from "@/common/index.list.js";
	const letterArr = indexList.list.map(val => {
		return val.letter;
	})
	export default {
		data() {
			return {
				scrollTop: 0,
				indexList: letterArr,
				list: indexList.list
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			clickCity(item){
				this.$u.vuex('vuex_city', item);
				return uni.reLaunch({
					url:'../index/index'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
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
</style>

