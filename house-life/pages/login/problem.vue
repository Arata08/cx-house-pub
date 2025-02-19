<template>
	<view style="margin: 20rpx;">
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar :is-back="true" title="常见问题" :border-bottom="false"></u-navbar>
		<!-- #endif -->
		<u-collapse class="u-p-30">
			<u-collapse-item :title="item.head" v-for="(item, index) in itemList" :key="index" :open="item.open">
				{{item.body}}
			</u-collapse-item>
		</u-collapse>
		<view class="u-m-t-20">
			<u-button class="u-m-20" type="default" @click="server" plain>
				<u-icon name="level" color="#969799" size="38"></u-icon>
				前往官网
			</u-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			appUrl: false,
			url: "http://qt.lilihouse.cn",
			itemList: [
				{
					head: "初始密码是什么？",
					body: "初始密码默认为手机号码,为了您的账户安全,请进入个人中心进行修改。",
					open: true,
				},
				{
					head: "关于我们",
					body: "xxx" ,
					open: true,
				},
			],
		}
	},
	methods: {
		server(){
			let url = "http://qt.lilihouse.cn/"
			// #ifdef  H5
				window.open(url, '_blank');
			// #endif
			// #ifndef  H5
				this.$u.route("/pages/webview/webview", {
				  title: '关于我们',
				  src:url
				});
			// #endif
			// if(this.isWeiXinLogin){
			// 	uni.showToast({
			// 		icon:'none',
			// 		title:'www.sourcebyte.cn',
			// 		duration:5000
			// 	})
			// }else{
			// 	window.open(this.url)
			// }
		},
		download(){
			this.DownLoadAndroid();
		},
		//判断是否微信登陆
		isWeiXinLogin() {
			// #ifdef H5
			let ua = window.navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				return true;
			}
			// #endif
			return false;
		},
		//安卓下载
		DownLoadAndroid() {
			if (this.isWeiXinLogin()) {
				uni.showToast({
					icon:'none',
					title:'请复制链接，在浏览器中打开下载',
					duration:3000
				})
				this.appUrl = true;
				return;
			}
			var downloadUrl = 'http://8.136.213.245/profile/apk/yixin.apk'; // 下载地址
			var urlStr = encodeURI(downloadUrl)
			// #ifdef APP-PLUS
			plus.runtime.openURL(urlStr);
			return;
			// #endif
			// #ifdef H5 
			window.open(urlStr);
			// #endif
		},
	}
};
</script>

<style>
	page {
		background: #fff;
	}
	
	.appUrl{
		padding: 20rpx;
	}
</style>
