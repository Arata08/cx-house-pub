// 全局配置文件
let baseUrl = 'http://localhost:8088';
let staticUrl = 'http://localhost:8088';
// 版本号 用于更新
let version = 21;
// vuex_version版本号 用于显示s
let vuex_version = '1.7.' + version;
// 是否需要热更新（后台自动更新）
let flag_hot = false;

export default {
	baseUrl: baseUrl,
	staticUrl:staticUrl,
	version: version,
	vuex_version: vuex_version,
}

/* 
1.7.24
修改help页面参数
 */