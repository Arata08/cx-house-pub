<template>
	<view class="page">
		<view class="user">
			<u-avatar :src="avatar" size="140"></u-avatar>
			<view class="user-info">
				<view class="u-font-18 u-tips-color">帅哥</view>
				<text v-if="membershipInfo" style="color:lightcoral;">2025-06-07</text>
			</view>
		</view>

		<view class="content">
			<view class="title">会员开通方案</view>
			<view class="option">
				<view v-for="(v, k) in options" :class="'option-item ' + (k === current ? 'option-selected' : '')"
					:key="k" @click="change(k)">
					<text class="option-item-time">{{v.time}}</text>
					<view class="option-item-price"><text>￥</text><text>{{v.price}}</text></view>
					<text class="option-item-tip">{{v.tip}}</text>
					<view class="option-item-tag" v-if="v.tag">{{v.tag}}</view>
				</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="button" @click="open()">
				<text>立即以{{options[current].price}}元续费</text>
				<!-- <text>支付后可立即开具体发票</text> -->
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-TOUTIAO -->
			<view class="button" @click="createPayment()">
				<text>立即以{{options[current].price}}元续费</text>
				<!-- <text>支付后可立即开具体发票</text> -->
			</view>
			<!-- #endif -->
			<view class="agreement">
				<view @click="showAgreement()">查看《服务协议》</view>
				<web-view v-if="showWebview" src="https://ht.lilihouse.cn/service.html"></web-view>
			</view>
			<view class="title">会员权益</view>
			<view class="advantage">
				<view class="advantage-item" v-for="(v,k) in advantages" :key="k">
					<view class="advantage-item-icon">
						<image :src="v.icon"></image>
					</view>
					<view class="advantage-item-text">
						<text>{{v.name}}</text>
						<text>{{v.desc}}</text>
					</view>
				</view>
			</view>
			<view class="title" style="color: #777; font-size: 14px;">注意事项</view>
			<view class="notice">
				<text>1. 会员权益与手机号相对应,无共享账号</text>
				<text>2. 开通会员前请阅读《用户协议》,会员服务一经开通后不可退款</text>
				<text>3. 严禁使用任何手段爬取本产品数据,一经发现可能面临账号禁用风险</text>
				<text>4. 需要发票信息，请联系客服</text>
			</view>
		</view><!-- 统一支付组件，注意：vue3下ref不可以等于组件名，因此这里ref="pay" 而不能是 ref="uniPay" -->
		<!-- #ifdef MP-WEIXIN -->
		<uni-pay ref="pay" :adpid="adpid" height="70vh" return-url="/pages/order-detail/order-detail"
			logo="/static/logo.png" @success="onSuccess" @create="  " @fail="onFail"></uni-pay>
		<!-- #endif -->
		<!-- #ifdef MP-TOUTIAO -->
		<vk-uni-pay ref="vkPay" :status.sync="vkPay.status" :code-url.sync="vkPay.codeUrl"
			:qrcode-image.sync="vkPay.qrcodeImage" :query-payment-action="vkPay.queryPaymentAction"
			:page-show="vkPay.pageShow" :auto-get-openid="vkPay.autoGetOpenid" :polling="vkPay.polling"
			:return-url="vkPay.returnUrl" :await-notify="vkPay.awaitNotify"
			:pay-order-info="vkPay.payOrderInfo"></vk-uni-pay>
		<!-- #endif -->
	</view>
</template>

<script>
	import config from "@/common/config.js" // 全局配置文件
	let baseUrl = config.baseUrl;
	export default {
		data() {
			return {
				showWebview: false, // 初始时不显示web-view
				total_fee: 1, // 支付金额，单位分 100 = 1元
				order_no: "", // 业务系统订单号（即你自己业务系统的订单表的订单号）
				out_trade_no: "", // 插件支付单号
				description: "房东卡", // 支付描述
				type: "recharge", // 支付回调类型 如 recharge 代表余额充值 goods 代表商品订单（可自定义，任意英文单词都可以，只要你在 uni-pay-co/notify/目录下创建对应的 xxx.js文件进行编写对应的回调逻辑即可）
				membershipInfo: null, // 用来存储查询到的会员信息
				transaction_id: "", // 查询订单接口的查询条件
				// #ifdef MP-WEIXIN
				options: [{
						time: '半年',
						price: 399,
						tip: '折合￥2.1/每天'
					},
					{
						time: '一年',
						price: 699,
						tip: '折合￥1.9/每天',
						tag: '最多人买'
					},
					{
						time: '两年',
						price: 1099,
						tip: '折合￥1.5/每天',
						tag: '最划算'
					}
				],
				// #endif
				advantages: [{
						icon: '/static/style1/kefu.png',
						name: '专属客服',
						desc: '24小时专属服务'
					},
					{
						icon: '/static/style1/exchange.png',
						name: '发布房源',
						desc: '可无限发布房源'
					}
				],
				current: 0, // 当前选中套餐下标
				avatar: '',
				// #ifdef MP-TOUTIAO
				options: [{
						time: '一个月',
						price: 199,
						tip: '折合￥6/每天'
					},
					{
						time: '三个月',
						price: 299,
						tip: '折合￥4.7/每天',
						tag: '最多人买'
					},
					{
						time: '半年',
						price: 399,
						tip: '折合￥2.1/每天',
						tag: '最划算'
					}
				],
				vkPay: {
					/**
					 * 查询支付状态的云函数配置
					 * 如果是非路由框架，则action为字符串，值为云函数名称
					 * 如果是路由框架，则按下方配置填写
					 * 注意：queryPaymentAction内参数用默认即可，无需更改。（除非你已经知道参数的意义）
					 */
					queryPaymentAction: {
						name: "vk-pay", // 云函数名称
						action: "pay/queryPayment", // 路由模式下云函数地址
						actionKey: "action", // 路由模式下云函数地址的识别key
						dataKey: "data" // 路由模式下云函数请求参数的识别key
					},
					// PC支付的付款二维码地址，渲染二维码需要自己写，可以参考示例中的二维码组件 vk-uni-qrcode
					codeUrl: "",
					qrcodeImage: "",
					// 当前支付状态 0:等待发起支付 1:支付中 2:已支付（注意：跟数据库的status无关）
					status: 0,
					// 当前页面是否显示
					pageShow: true,
					// 启用轮询检测订单支付状态（仅h5支付有效）
					polling: true,
					// 仅微信手机外部浏览器H5支付时有效，必须是http或https开头的绝对路径，且在微信H5支付配置的域名白名单中。你还需要将此H5域名加入uniCloud白名单
					// 如果此值为空，则默认返回当前页面，返回的页面url参数会带上confirmShow=true&out_trade_no=实际订单号
					returnUrl: "",
					// 确认已支付的弹窗开关（微信手机外部浏览器H5支付时有效）
					confirmShow: false,
					// 支付成功后，是否需要等待异步回调全部执行完成后才通知前端（当awaitNotify和payOrderInfo均为false时，支付成功的响应速度最快）
					awaitNotify: true,
					// 支付成功后，是否需要返回支付订单数据（当awaitNotify和payOrderInfo均为false时，支付成功的响应速度最快）
					payOrderInfo: false,
					// 抖音小程序不需要获取openid
					autoGetOpenid: false,
				},
				// 表单请求数据
				form1: {
					provider: "douyin", // 支付供应商 douyin 抖音支付
					total_fee: 1, // 支付金额（单位分，100=1元）
					out_trade_no: "", // 订单号
					subject: "房东卡", // 订单标题
					body: "丽丽租好房房东卡购买", // 订单详情
					type: "recharge", // 支付回调类型
					openid: ""
				},
				// #endif
			}
		},
		// 监听 - 页面每次【加载时】执行(如：前进)
		onLoad(options = {}) {
			this.updateAvatar();
			// #ifdef MP-TOUTIAO
			this.vkPay.confirmShow = options.confirmShow || false;
			// #endif
		},
		// 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
		onShow() {
			this.fetchMembershipInfo();
			// #ifdef MP-TOUTIAO
			this.vkPay.pageShow = true;
			// #endif
		},
		// #ifdef MP-TOUTIAO
		// 监听 - 页面每次【隐藏时】执行(如：返回)
		onHide() {
			this.vkPay.pageShow = false;
		},
		// #endif
		methods: {
			updateAvatar() {
				const lifeData = uni.getStorageSync('lifeData').vuex_user.user;
				this.avatar = lifeData.avatar
				if (!this.avatar.startsWith('http')) {
					this.avatar = config.staticUrl + this.avatar;
				}
				console.log(this.avatar)
			},
			showAgreement() {
				this.showWebview = true; // 点击按钮后允许显示web-view
			},
			change(k) {
				this.current = k;
			},
			// #ifdef MP-TOUTIAO
			createPayment(obj = {}) {
				uni.getSystemInfo({
					success: (res) => {
						if (res.osName === 'ios') {
							uni.showModal({
								title: '暂不支持购买',
								content: 'iOS 暂不支持购买',
								cancelText: '返回',
								confirmText: '知道了',
								success: res => {
									// if(res.confirm){
									// 	this.uni.navigateBack;
									// }else{
									// 	this.uni.navigateBack;
									// }
								}
							});
						} else {
							// total_fee的单位为分，100分=1元
							this.form1.total_fee = this.options[this.current].price * 100;
							let that = this;
							let {
								form1
							} = that;
							// 这里的订单号\金额等数据应该是从数据库里获取的,这里为演示需要,故直接本地生成.
							form1.out_trade_no = "F_" + Date.now();
							that.$refs.vkPay.createPayment({
								// 如果是非路由框架，则外层action不再是json，而为字符串，值为云函数名称，如 action: "你的云函数名称"
								// 如果是路由框架，则按下方配置填写
								// 如果云函数name为 vk-pay，则无需改动 action
								action: {
									name: "vk-pay", // 云函数名称
									action: "pay/createPayment", // 路由模式下云函数地址
									actionKey: "action", // 路由模式下云函数地址的识别key(注意VK路由框架下,此值为$url)
									dataKey: "data" // 路由模式下云函数请求参数的识别key
								},
								// 请求数据（data内的参数会传给云函数，云函数中通过 data.xxx 的方式获取）
								data: {
									provider: form1.provider,
									total_fee: form1.total_fee,
									out_trade_no: form1.out_trade_no,
									subject: form1.subject,
									body: form1.body,
									type: form1.type,
								},
								// 支付订单创建成功回调
								create: res => {
									console.log('pay-create', res);
									this.form1.out_trade_no = res.out_trade_no;
									this.create_date = res.create_date;
									uni.request({
										url: 'https://developer.toutiao.com/api/apps/v2/token',
										method: 'POST',
										header: {
											'Content-Type': 'application/json'
										},
										data: {
											appid: 'tt742d0290eb1aec7301',
											secret: '1409b00a17b1b4d6491586261999d02ae2ec3140',
											grant_type: 'client_credential'
										},
										success: r => {
											console.log("client_token成功！", r);
											this.access_token = r.data.data.access_token;

											console.log(this.access_token);
										},
										fail: function(e) {
											console.log(e)
										}
									}); // 如果订单号是云端生成的，这里可以拿到订单号，此处如果return false; 则不再执行后续逻辑
								},
								// 支付成功回调
								success: res => {
									// 代表用户已付款，且你自己写的回调成功并正确执行了---没有实现哈哈哈
									//预算不足，懒得保证安全性了，未来再说吧，可以和传回来的res对比再更新余额
									//let chargeAmount = res.chargeAmount; // 确保res中有此字段或相应地从其他地方获取充值金额
									//后端更新余额
									let url = baseUrl + "/api/membership/recharge";
									let vuex_user = uni.getStorageSync('lifeData').vuex_user;
									let user = vuex_user.user
									let userId = user.userId;
									let time = this.options[this.current].time;
									uni.request({
										url: 'https://developer.toutiao.com/api/apps/order/v2/push',
										method: 'POST',
										header: {
											'Content-Type': 'application/json'
										},
										data: {
											access_token: this.access_token,
											app_name: 'douyin',
											open_id: remark,
											// 将 order_detail 序列化为 JSON 字符串
											order_detail: JSON.stringify({
												order_id: form1.out_trade_no,
												create_time: this.create_date,
												status: '已支付',
												amount: 1,
												total_price: form1.total_fee,
												detail_url: 'pages/change/balance',
												item_list: [{
													item_code: form1.out_trade_no,
													img: 'https://47.106.182.219:29382/down/ryR65oO6z2Fn.jpg',
													title: '房东卡购买',
													amount: 1,
													price: form1.total_fee,
												}]
											}),
											order_status: 1,
											order_type: 0,
											update_time: Date.now(),
										},
										success: function(res) {
											console.log("push成功！");
										},
										fail: function(e) {
											console.error("push失败！", e);
										}
									});
									const requestData = {
										userId: userId,
										time: time,
									};
									console.log(requestData);
									const response = uni.request({
										url: url + '?userId=' + userId + '&time=' + time,
										method: 'POST',
									});
								},
								// 失败回调
								fail: res => {
									console.error("pay-fail", res);
									if (res.failType === "create") {
										// 创建支付失败时提示
										uni.showModal({
											title: "提示",
											content: res.msg,
											showCancel: false
										});
									} else if (res.failType === "request") {
										// 请求支付失败时提示
										uni.showToast({
											title: "请求支付失败",
											icon: "none",
											mask: false
										});
									} else if (res.failType === "result") {
										// 支付结果失败时提示
										uni.showToast({
											title: "支付失败",
											icon: "none",
											mask: false
										});
									}
								},
								// 取消回调
								cancel: res => {
									uni.showToast({
										title: "用户取消支付",
										icon: "none",
										mask: false
									});
								}
							})
						}
					}
				})
			},
			// #endif
			
			// #ifdef MP-WEIXIN
			open() {
				// total_fee的单位为分，100分=1元
				this.total_fee = this.options[this.current].price * 100;
				this.order_no = `F` + Date.now();
				this.out_trade_no = `${this.order_no}-1`;
				// 打开支付收银台
				this.$refs.pay.open({
					total_fee: this.total_fee, // 支付金额，单位分 100 = 1元
					order_no: this.order_no, // 业务系统订单号（即你自己业务系统的订单表的订单号）
					out_trade_no: this.out_trade_no, // 插件支付单号
					description: this.description, // 支付描述
					type: this.type, // 支付回调类型
				});
			},
			// BUG--------无法进行uni-pay-co->recharge.js回调
			onSuccess(res) {
				if (res.user_order_success) {
					try {
						// 代表用户已付款，且你自己写的回调成功并正确执行了---没有实现哈哈哈
						//预算不足，懒得保证安全性了，未来再说吧，可以和传回来的res对比再更新余额
						//let chargeAmount = res.chargeAmount; // 确保res中有此字段或相应地从其他地方获取充值金额
						//后端更新余额
						let url = baseUrl + "/api/membership/recharge";
						let vuex_user = uni.getStorageSync('lifeData').vuex_user;
						let user = vuex_user.user
						let userId = user.userId;
						let time = this.options[this.current].time;
						const requestData = {
							userId: userId,
							time: time,
						};
						console.log(requestData);
						const response = uni.request({
							url: url + '?userId=' + userId + '&time=' + time,
							method: 'POST',
						});
						this.$mytip.successToast('充值成功！')
					} catch (error) {
						uni.showToast({
							title: '网络错误，请检查网络连接！',
							icon: 'none',
							duration: 2000,
						});
					}
				}
			},
			onFail(err) {
				console.log('err: ', err)
			},
			// #endif
			async fetchMembershipInfo() {
				try {
					let vuex_user = uni.getStorageSync('lifeData').vuex_user;
					let user = vuex_user.user
					let userId = user.userId;
					const response = await uni.request({
						url: baseUrl + '/api/membership/findMembershipByUserId' + '?userId=' + userId,
						method: 'GET',
					});
					if (response[1].statusCode === 200) {
						this.membershipInfo = response[1].data;
					} else {
						this.membershipInfo = {
							'expiresAt': '未开通'
						};
					}
				} catch (error) {
					console.error('Network error:', error);
				}
			}, 
			pageTo(url) {
				uni.navigateTo({
					url
				});
			},
			providerFormat(provider) {
				let providerObj = {
					"wxpay": "微信支付",
					"alipay": "支付宝支付",
					"appleiap": "ios内购"
				};
				let providerStr = providerObj[provider] || "未知";
				return providerStr;
			},
			/**
			 * 日期格式化
			 * @params {Date || Number} date 需要格式化的时间
			 * timeFormat(new Date(),"yyyy-MM-dd hh:mm:ss");
			 */
			timeFormat(time, fmt = 'yyyy-MM-dd hh:mm:ss', targetTimezone = 8) {
				try {
					if (!time) {
						return "";
					}
					if (typeof time === "string" && !isNaN(time)) time = Number(time);
					// 其他更多是格式化有如下:
					// yyyy-MM-dd hh:mm:ss|yyyy年MM月dd日 hh时MM分等,可自定义组合
					let date;
					if (typeof time === "number") {
						if (time.toString().length == 10) time *= 1000;
						date = new Date(time);
					} else {
						date = time;
					}

					const dif = date.getTimezoneOffset();
					const timeDif = dif * 60 * 1000 + (targetTimezone * 60 * 60 * 1000);
					const east8time = date.getTime() + timeDif;

					date = new Date(east8time);
					let opt = {
						"M+": date.getMonth() + 1, //月份
						"d+": date.getDate(), //日
						"h+": date.getHours(), //小时
						"m+": date.getMinutes(), //分
						"s+": date.getSeconds(), //秒
						"q+": Math.floor((date.getMonth() + 3) / 3), //季度
						"S": date.getMilliseconds() //毫秒
					};
					if (/(y+)/.test(fmt)) {
						fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
					}
					for (let k in opt) {
						if (new RegExp("(" + k + ")").test(fmt)) {
							fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (opt[k]) : (("00" + opt[k]).substr(("" +
								opt[k]).length)));
						}
					}
					return fmt;
				} catch (err) {
					// 若格式错误,则原值显示
					return time;
				}
			},
		},
		computed: {
			h5Env() {
				// #ifdef H5
				let ua = window.navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == 'micromessenger' && (ua.match(/miniprogram/i) == 'miniprogram')) {
					// 微信小程序
					return "mp-weixin";
				}
				if (ua.match(/MicroMessenger/i) == 'micromessenger') {
					// 微信公众号
					return "h5-weixin";
				}
				if (ua.match(/alipay/i) == 'alipay' && ua.match(/miniprogram/i) == 'miniprogram') {
					return "mp-alipay";
				}
				if (ua.match(/alipay/i) == 'alipay') {
					return "h5-alipay";
				}
				// 外部 H5
				return "h5";
				// #endif
			}
		},
	}
</script>

<style lang="scss">
	page {
		background: #53536B;
	}

	.page {
		width: 100vw;
		padding-top: 50rpx;

		.user {
			display: flex;
			align-items: center;
			background: #DCDDE0;
			width: 700rpx;
			margin: auto;
			box-sizing: border-box;
			padding: 0 30rpx;
			border-radius: 20rpx 20rpx 0 0;
			height: 160rpx;

			image {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}

			.user-info {
				height: 90rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-left: 15rpx;

				text {
					&:nth-child(1) {
						font-weight: bold;
					}

					&:nth-child(2) {
						font-size: 14px;
						color: #777;
					}
				}
			}
		}

		.content {
			background: #fff;
			border-radius: 20rpx 20rpx 20rpx 20rpx;
			padding: 20rpx;
			box-sizing: border-box;
			width: 100vw;

			.title {
				font-weight: bold;
				height: 80rpx;
				line-height: 80rpx;
			}

			.option {
				display: flex;
				justify-content: space-between;

				.option-item {
					width: 225rpx;
					height: 280rpx;
					box-sizing: border-box;
					border: 1px solid #999;
					border-radius: 15rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					position: relative;

					&:active {
						background: #FFF6ED;
						border-color: #F9D7B2;
					}

					.option-item-time {
						font-weight: bold;
						font-size: 14px;
						color: #555;
					}

					.option-item-price {
						font-weight: bold;
						margin: 20rpx 0;

						text {
							&:nth-child(2) {
								font-size: 26px;
							}
						}
					}

					.option-item-tip {
						font-size: 12px;
						color: #999;
					}

					.option-item-tag {
						position: absolute;
						left: -5rpx;
						top: -10rpx;
						font-weight: bold;
						font-size: 14px;
						padding: 5rpx 10rpx;
						border-radius: 12rpx;
						background: red;
						color: #fff;
					}
				}

				.option-selected {
					background: #FFF6ED;
					border-color: #F9D7B2;

					.option-item-price {
						color: #333;
					}
				}
			}

			.button {
				background: #F9D7B2;
				height: 100rpx;
				border-radius: 50rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin-top: 30rpx;

				&:active {
					background: #ceb295;
				}

				text {
					&:nth-child(1) {
						font-weight: bold;
						color: #333;
						line-height: 1.5;
					}

					&:nth-child(2) {
						color: #555;
						font-size: 14px;
					}
				}
			}

			.agreement {
				font-size: 14px;
				text-align: center;
				margin-top: 20rpx;
				margin-bottom: 60rpx;
				color: #f5984a;

				&:active {
					color: #9c602f;
				}
			}

			.advantage {
				display: flex;
				flex-wrap: wrap;

				.advantage-item {
					display: flex;
					width: 350rpx;
					margin-bottom: 20rpx;

					.advantage-item-icon {
						border: 1px solid #F9D7B2;
						border-radius: 50%;
						width: 70rpx;
						height: 70rpx;

						image {
							margin: 10rpx;
							width: 50rpx;
							height: 50rpx;
						}
					}

					.advantage-item-text {
						display: flex;
						flex-direction: column;
						justify-content: center;
						margin-left: 15rpx;

						text {
							&:nth-child(1) {
								font-size: 14px;
								color: #f5984a;
							}

							&:nth-child(2) {
								font-size: 12px;
								color: #888;
							}
						}
					}
				}
			}

			.notice {
				display: flex;
				flex-direction: column;

				text {
					font-size: 12px;
					color: #888;
					margin-bottom: 10rpx;
				}
			}
		}
	}
</style>