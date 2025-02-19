const fs = require('fs');
const path = require('path')
module.exports = {
	// 统一 - 支付回调地址,格式为 "服务空间ID":"URL化地址"
	"notifyUrl": {
		// 测试环境服务空间-支付回调地址
		//"mp-56351f42-ba58-4baf-bbc7-144b70e6e6eb": "https://fc-mp-56351f42-ba58-4baf-bbc7-144b70e6e6eb.next.bspapp.com/uni-pay-co",
		"env-00jxh1uc3rp8": "https://env-00jxh1uc3rp8.dev-hz.cloudbasefunction.cn/http/vk-pay",
	},
	"notifyKey":"5FB2CD73C7B53918728417C50762E6D45FB2CD73C7B53918728417C50762E6D4", // 跨云函数通信时的加密密钥，建议手动改下，不要使用默认的密钥，长度保持在64位以上即可
	// 微信支付相关
	"wxpay": {
		"enable": true, // 是否启用微信支付
		// 微信 - 小程序支付
		"mp": {
			"appId": "wxeb47ac52d5a6bc5d", // 小程序的appid
			"secret": "d16d4bd4d0b78a1db99143bb65568c79", // 小程序的secret
			"mchId": "1679557633", // 商户id
			"key": "lilihouse12345678900987654321lil", // v2的api key
			"pfx": fs.readFileSync(__dirname + '/wxpay/apiclient_cert.p12'), // v2需要用到的证书
			"version": 2, // 启用支付的版本 2代表v2版本 3 代表v3版本
		}
	},
	// 支付宝相关（加签方式选证书模式，加密算法选RSA2）
	"alipay": {
		"enable": false, // 是否启用支付宝支付
		// 支付宝 - 小程序支付配置
		"mp": {
			"appId": "", // 支付宝小程序appid
			"privateKey": "", // 支付宝商户私钥
			"appCertPath": path.join(__dirname, 'alipay/appCertPublicKey.crt'), // 支付宝商户公钥路径
			"alipayPublicCertPath": path.join(__dirname, 'alipay/alipayCertPublicKey_RSA2.crt'), // 支付宝公钥路径
			"alipayRootCertPath": path.join(__dirname, 'alipay/alipayRootCert.crt'), // 支付宝根证书路径
		}
	},
	 // 抖音支付
  "douyin": {
    // 抖音小程序支付，请在支付配置信息中配置URL(服务器地址)为 https://vk-pay的url化地址/vk-pay-notify/
    "mp-toutiao": {
      "appId": "tt742d0290eb1aec7301", // 抖音小程序的appId
      "secret": "1409b00a17b1b4d6491586261999d02ae2ec3140", // 抖音小程序的secret
      "mchId": "73936527003967511160", // 商户id（商户号）
      "salt": "o55YDSsgkQjWK8JOfMahNMiHIWlLrk8xO2DNjckg", // SALT，从支付信息 - 支付设置中获取
      "token": "9l1XaDBc0yZ8WwMvEsJ6uKqzF7rGhnRtOIpPKA5xVmfLb4S3NjQIoUtyrkdGSz", // Token(令牌)，从支付信息 - 支付设置中获取
      "sandbox": false, // 是否是沙箱环境
    }
  }
}
