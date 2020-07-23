const common = {
	setLocal(key, value) {
		/*将当前时间存入storage*/
		uni.setStorage({
			key: key,
			data: value
		});
	},
	getLocalSync(a) {
		return uni.getStorageSync(a)
	},
	removeLocal(a) {
		uni.removeStorage({
			key: a,
			success: function(res) {}
		});
	},
	/*补0*/
	zeroPadd(num, n) {
		var len = num.toString().length;
		while (len < n) {
			num = "0" + num;
			len++;
		}
		return num;
	},
	/* 去除空白 */
	removeBlank(value) {
		return value.toString().replace(/\s+/g, "")
	},
	// 订单类型
	isAandC(orderType) {
		return orderType == 'COUPON' && orderType == 'ACTIVE_POINT'
	},
	isAorC(orderType) {
		return orderType == 'COUPON' || orderType == 'ACTIVE_POINT'
	}
};
export {
	common
}
