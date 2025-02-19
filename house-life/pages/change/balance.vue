<template>
	<view class="buy">
		<view class="title">
			<image src="../../static/buy.png"></image>
			<text class="text">余额：</text>
			<text class="num">{{ vuex_user.user.charge}}</text>
		</view>
		<view class="number">
			<view class="list">
				<view :class="num == index ? 'item real' : 'item'" v-for="(item, index) in list" :key="index"
					@click="pick(index)">
					<view class="card">
						<view class="top">
							<text>{{ item.number }}</text>
							<image src="../../static/buy.png"></image>
						</view>
						<text class="money">{{ item.money }}元</text>
					</view>
					<view v-if="index === 3" class="recommend">
						<text>推荐</text>
					</view>
				</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<button @click="open" style="background-color: #00CD66;">支付订单 {{ list[num].money }} 元</button>
			<!-- #endif -->
			<!-- #ifdef MP-TOUTIAO -->
			<button @click="createPayment" class="button" style="background-color: #00aaff;">支付订单 {{ list[num].money }}
				元</button>
				<!-- #endif -->
			<!-- 查询支付的弹窗 -->
			<uni-popup ref="getOrderPopup" type="bottom" :safe-area="false">
				<view class="get-order-popup">
					<view class="label">第三方交易单号：</view>
					<view class="mt20">
						<input class="pd2030" v-model="transaction_id" placeholder="请输入" />
						<view class="tips">可从支付宝账单（订单号）、微信账单（交易单号）中复制</view>
					</view>
					<view class="mt20">
						<button @click="getOrder">查询支付状态</button>
					</view>
					<view class="mt20" v-if="getOrderRes.transaction_id">
						<table class="table">
							<tr>
								<td class="align-left">订单描述</td>
								<td class="align-right">{{ getOrderRes.description }}</td>
							</tr>
							<tr>
								<td class="align-left">支付金额</td>
								<td class="align-right">{{ (getOrderRes.total_fee / 100).toFixed(2) }}</td>
							</tr>
							<tr>
								<td class="align-left">付款时间</td>
								<td class="align-right">{{ timeFormat(getOrderRes.pay_date,'yyyy-MM-dd hh:mm:ss') }}
								</td>
							</tr>
							<tr>
								<td class="align-left">支付方式</td>
								<td class="align-right">{{ providerFormat(getOrderRes.provider) }}</td>
							</tr>
							<tr>
								<td class="align-left">第三方交易单号</td>
								<td class="align-right">{{ getOrderRes.transaction_id }}</td>
							</tr>
							<tr>
								<td class="align-left">插件支付单号</td>
								<td class="align-right">{{ getOrderRes.out_trade_no }}</td>
							</tr>
							<tr>
								<td class="align-left">回调状态</td>
								<td class="align-right">{{ getOrderRes.user_order_success ? "成功" : "异常" }}</td>
							</tr>
						</table>
					</view>
				</view>
			</uni-popup>
			<!-- 统一支付组件，注意：vue3下ref不可以等于组件名，因此这里ref="pay" 而不能是 ref="uniPay" -->
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
		<view class="tip">
			<text class="titl">温馨提示</text>
			<view>
				<text>1、充值即代表已阅读并同意</text>
				<text @click="showAgreement()" style="color: coral;white-space: nowrap;">《服务协议》</text>
				<web-view v-if="showWebview" src="https://ht.lilihouse.cn/service.html"></web-view>
			</view>
			<view>
				<text>2、请在网络状态良好的情况下进行充值，为了保证充值顺利，请耐心等待充值，不要进行其他操作；</text>
			</view>
			<view>
				<text>3、若遇到网络异常状态，可下方可查询支付状态；</text>
			</view>
			<view>
				<text>4、在支付过程中遇到任何问题，请联系官方客服：</text>
				<!-- #ifdef MP-WEIXIN -->
				<button type="default" open-type="contact" style="margin-top: 20rpx;">在线咨询</button>
				<!-- #endif -->
				<!-- #ifdef MP-TOUTIAO -->
				<button open-type="im" data-im-id="65983166" bindim="imCallback" binderror="onimError">
					在线咨询
				</button>
				<!-- #endif -->
			</view>
			<button @click="getOrderPopup(true) " style="margin-top: 20rpx;">查询支付状态</button>
		</view>
	</view>
</template>

<script>
	import config from "@/common/config.js" // 全局配置文件
	var fee;
	export default {
		data() {
			return {
				showWebview: false, // 初始时不显示web-view
				num: 0,
				total_fee: 1, // 支付金额，单位分 100 = 1元
				order_no: "", // 业务系统订单号（即你自己业务系统的订单表的订单号）
				out_trade_no: "", // 插件支付单号
				description: "P币", // 支付描述
				type: "recharge", // 支付回调类型 如 recharge 代表余额充值 goods 代表商品订单（可自定义，任意英文单词都可以，只要你在 uni-pay-co/notify/目录下创建对应的 xxx.js文件进行编写对应的回调逻辑即可）
				custom: {
					a: "a",
					b: 1
				},
				adpid: "", // uni-ad的广告位id
				transaction_id: "", // 查询订单接口的查询条件
				list: [{
						number: '6',
						money: '6',
					},
					{
						number: '20',
						money: '18',
					},
					{
						number: '43',
						money: '36',
					},
					{
						number: '85',
						money: '68',
					},
					{
						number: '135',
						money: '108',
					},
					{
						number: '260',
						money: '208',
					}
				],
				// #ifdef MP-TOUTIAO
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
					subject: "P币余额充值", // 订单标题
					body: "丽丽租好房P币购买", // 订单详情
					type: "recharge", // 支付回调类型
					openid: ""
				},
				create_date: '',
				access_token: '',
				// #endif
			};
		},
		// #ifdef MP-TOUTIAO
		// 监听 - 页面每次【加载时】执行(如：前进)
		onLoad(options = {}) {
			this.vkPay.confirmShow = options.confirmShow || false;
		},
		// 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
		onShow() {
			this.vkPay.pageShow = true;
		},
		// 监听 - 页面每次【隐藏时】执行(如：返回)
		onHide() {
			this.vkPay.pageShow = false;
		},
		// #endif
		methods: {
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
							this.form1.total_fee = this.list[this.num].money * 100;
							let that = this;
							let {
								form1
							} = that;
							// 这里的订单号\金额等数据应该是从数据库里获取的,这里为演示需要,故直接本地生成.
							form1.out_trade_no = "P_" + Date.now();
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
									});
									// 如果订单号是云端生成的，这里可以拿到订单号，此处如果return false; 则不再执行后续逻辑
								},
								// 支付成功回调
								success: resp => {
									// 代表用户已付款，且你自己写的回调成功并正确执行了---没有实现哈哈哈

									//预算不足，懒得保证安全性了，未来再说吧，可以和传回来的res对比再更新余额
									//let chargeAmount = res.chargeAmount; // 确保res中有此字段或相应地从其他地方获取充值金额
									//后端更新余额
									let url = "api/profile/updateBalance";
									let vuex_user = uni.getStorageSync('lifeData').vuex_user;
									let user = vuex_user.user
									let userId = user.userId;
									let remark = user.remark;
									let balance = Number(user.charge) + Number(this.list[this.num].number);
									let amount_p = Number(this.list[this.num].number);
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
													img: 'https://47.106.182.219:29382/down/hpF4MaCnYRpg.png',
													title: 'P币购买',
													amount: amount_p,
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
									this.$u.put(url, {
										userId: userId,
										balance: balance,
									}).then(data => {
										// 保存更新后的用户信息回Vuex和本地存储
										user.charge = balance;
										vuex_user.user = user;
										this.$u.vuex('vuex_user', vuex_user);
										this.showModel = false;
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
			showAgreement() {
				this.showWebview = true; // 点击按钮后允许显示web-view
			},
			pick(index) {
				this.num = index;
			},
			/**
			 * 发起支付（唤起收银台，如果只有一种支付方式，则收银台不会弹出来，会直接使用此支付方式）
			 * 在调用此api前，你应该先创建自己的业务系统订单，并获得订单号 order_no，把order_no当参数传给此api，而示例中为了简化跟支付插件无关的代码，这里直接已时间戳生成了order_no
			 */
			// #ifdef MP-WEIXIN
			open() {
				// total_fee的单位为分，100分=1元
				this.total_fee = this.list[this.num].money * 100;
				this.order_no = `P` + Date.now();
				this.out_trade_no = `${this.order_no}-1`;
				// 打开支付收银台
				this.$refs.pay.open({
					total_fee: this.total_fee, // 支付金额，单位分 100 = 1元
					order_no: this.order_no, // 业务系统订单号（即你自己业务系统的订单表的订单号）
					out_trade_no: this.out_trade_no, // 插件支付单号
					description: this.description, // 支付描述
					type: this.type, // 支付回调类型
					//qr_code: this.qr_code, // 是否强制使用扫码支付/
					number: this.list[this.num].number, // 自定义数据
				});
			},
			// #endif
			// 打开查询订单的弹窗
			getOrderPopup(key) {
				if (key) {
					this.$refs.getOrderPopup.open();
				} else {
					this.$refs.getOrderPopup.close();
				}
			},
			// 查询支付状态
			async getOrder() {
				this.getOrderRes = {};
				let res = await this.$refs.pay.getOrder({
					//out_trade_no: this.out_trade_no, // 插件支付单号 两者传1个即可
					transaction_id: this.transaction_id, // 第三方单号 两者传1个即可
					await_notify: true
				});
				if (res) {
					this.getOrderRes = res.pay_order;
					let obj = {
						"-1": "已关闭",
						"1": "已支付",
						"0": "未支付",
						"2": "已部分退款",
						"3": "已全额退款"
					};
					uni.showToast({
						title: obj[res.status] || res.errMsg,
						icon: "none"
					});
				}
			},
			// #ifdef MP-WEIXIN
			// 监听事件 - 支付成功
			// BUG--------无法进行uni-pay-co->recharge.js回调
			onSuccess(res) {
				if (res.user_order_success) {
					// 代表用户已付款，且你自己写的回调成功并正确执行了---没有实现哈哈哈

					//预算不足，懒得保证安全性了，未来再说吧，可以和传回来的res对比再更新余额
					//let chargeAmount = res.chargeAmount; // 确保res中有此字段或相应地从其他地方获取充值金额

					//后端更新余额
					let url = "api/profile/updateBalance";
					let vuex_user = uni.getStorageSync('lifeData').vuex_user;
					let user = vuex_user.user
					let userId = user.userId;
					let balance = Number(user.charge) + Number(this.list[this.num].number);
					this.$u.put(url, {
						userId: userId,
						balance: balance,
					}).then(data => {
						// 保存更新后的用户信息回Vuex和本地存储
						user.charge = balance;
						vuex_user.user = user;
						this.$u.vuex('vuex_user', vuex_user);
						this.showModel = false;
					});
				} else {
					this.$mytip.toast('充值失败')
				}
			},
			onFail(err) {
				console.log('err: ', err)
			},
			// #endif
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
	};
</script>

<style lang="scss" scoped>
	.app {
		padding: 30rpx;
	}

	input {
		border: 1px solid #f3f3f3;
		padding: 10rpx;
		width: 100%;
		box-sizing: border-box;
		height: 80rpx;
	}

	.label {
		margin: 10rpx 0;
	}

	.tips {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #565656;
	}

	.get-order-popup {
		background-color: #ffffff;
		padding: 30rpx;
		height: 60vh;
		border-radius: 30rpx 30rpx 0 0;
		overflow: hidden;
	}

	.mt20 {
		margin-top: 20rpx;
	}

	.pd2030 {
		padding: 20rpx 30rpx;
	}

	.table {
		font-size: 24rpx;
	}

	.align-left {
		text-align: left;
		width: 50%;
	}

	.align-right {
		text-align: right;
		width: 50%;
	}

	.buy {
		width: 100%;
		height: 100%;

		.title {
			display: flex;
			align-items: center;
			padding: 42rpx 0 20rpx 50rpx;
			background-color: #ffffff;

			>image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 6rpx;
			}

			>text {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666666;
				line-height: 40rpx;
			}

			.num {
				color: #ff4141;
			}
		}

		.number {
			width: 100%;
			height: 700rpx;
			background-color: #ffffff;
			margin-top: 18rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.list {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				padding: 38rpx 40rpx 0rpx 40rpx;

				.item {
					width: 194rpx;
					height: 194rpx;
					background: #ffffff;
					box-shadow: 0rpx 0rpx 6rpx 0rpx rgba(0, 0, 0, 0.1);
					border-radius: 20rpx;
					margin-bottom: 44rpx;
					display: flex;

					.card {
						width: 194rpx;
						height: 194rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;

						.top {
							display: flex;
							align-items: center;

							>text {
								font-size: 45rpx;
								font-family: PingFangSC-Semibold, PingFang SC;
								font-weight: 600;
								color: #666666;
								line-height: 44rpx;
								margin-right: 12rpx;
							}

							>image {
								width: 30rpx;
								height: 30rpx;
							}
						}

						.money {
							font-size: 24rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #999999;
							line-height: 34rpx;
							margin-top: 12rpx;
						}
					}

					.recommend {
						width: 112rpx;
						height: 36rpx;
						background: #f3f2ea;
						border-radius: 8rpx 0rpx 8rpx 0rpx;
						position: absolute;
						text-align: center;
						margin-top: -18rpx;

						>text {
							font-size: 20rpx;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #666666;
							line-height: 36rpx;
						}
					}
				}

				.real {
					border: 2rpx solid #f88700;
				}

				&:after {
					content: '';
					width: 194rpx;
				}
			}

			.sure {
				width: 582rpx;
				height: 80rpx;
				background: #ff6a5f;
				border-radius: 40rpx;
				text-align: center;

				>text {
					font-size: 28rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 600;
					color: #ffffff;
					line-height: 80rpx;
				}
			}
		}

		.tip {
			height: 394rpx;
			background: #ffffff;
			margin-top: 18rpx;
			padding: 40rpx;

			.titl {
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 600;
				color: #666666;
				line-height: 40rpx;
				margin-bottom: 6rpx;
			}

			>view {
				>text {
					font-size: 22rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					color: #999999;
					line-height: 32rpx;
				}

				&:nth-child(2) {
					>text:nth-child(2) {
						color: #333333;
					}
				}

				&:nth-child(5) {
					>text:nth-child(2) {
						color: #ff6a5f;
						font-weight: 600;
						border-bottom: 2rpx solid #ff6a5f;
					}
				}
			}
		}
	}
</style>