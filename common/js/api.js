import Request from '@/common/js/request/index.js'
import {
	webconfig
} from '@/static/js/webconfig.js'
const api = new Request();
const getTokenStorage = () => {
	let token = ''
	try {
		token = uni.getStorageSync('token')
	} catch (e) {}
	return token
}
let isLogout = false;//当前是否已经退出
let isLoad = false;//loading框
let confirm_show=false;  //当前是否弹出了错误弹框



api.setConfig((config) => { /* 设置全局配置 */
	config.baseUrl = webconfig.api_url
	config.header = {
		...config.header,
		Authorization: getTokenStorage()
	}
	return config
})

api.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
	config.header = {
		...config.header,
		Authorization: getTokenStorage()
	}
	if (config.url.indexOf('/order/') > -1 || config.url.indexOf('/payInfo/') > -1 || config.url.indexOf('/express/') >
		-1) {
		config.baseUrl = webconfig.api_url2
	} else if (config.url.indexOf('/sysDict/') > -1) {
		config.baseUrl = webconfig.api_url3
	}

	if (!isLoad && config.url.indexOf('/o2oShopingCart/insert2Cart') < 0 && config.url.indexOf(
			'/o2oShopingCart/getEffectiveGoodsNum') < 0) { //显示loading框
		isLoad = true;
		uni.showLoading({
			title: '加载中'
		});
	}
	/*
	if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
	  cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
	}
	*/
	// console.log(config);
	return config
})

// 必须使用异步函数，注意
api.interceptor.response(async (response) => { /* 请求之后拦截器 */
	if (isLoad) {//隐藏loading框
		uni.hideLoading()
		isLoad = false;
	}
	if (response.data.code){// 服务端返回的状态码不等于200，则reject()
		//退出登录 
		if(response.data.code == 401 && !isLogout){
			isLogout = true;
			uni.reLaunch({
				url: '/pages/login/login'
			})
			setTimeout(function() {
				isLogout = false; //参数初始化
			}, 1000)
		}
		// 错误弹框
		if(response.data.code !== 401&&response.data.code !== 200&&!confirm_show){
			confirm_show = true;
			uni.showModal({
			    title: '提示',
			    content: response.data.msg||'网络错误，请稍后重试',
				showCancel:false,
			    success: function (res) {
					 confirm_show = false;
			    }
			});
		}
	}
	return response.data || {};
}, (response) => { // 请求错误做点什么
	if (isLoad) {//隐藏loading框
		uni.hideLoading()
		isLoad = false;
	}
	if (response.statusCode == 401) {
		if (!isLogout) {
			isLogout = true;
			uni.reLaunch({
				url: '/pages/login/login'
			})
			setTimeout(function() {
				isLogout = false; //参数初始化
			}, 1000)
			return
		}

	} else {
		uni.showModal({
			title: '错误提醒',
			content: response.errMsg,
			showCancel: false
		})
	}
	console.log(response);
	return response
})

export {
	api
}
