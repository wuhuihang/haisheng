import Vue from 'vue'
import App from './App'
import store from './store'
import {
	box
} from './common/js/box.js'
import {
	common
} from '@/common/js/common.js'
import {
	webconfig
} from '@/static/js/webconfig.js'
import {api} from '@/common/js/api.js'

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$box = box
Vue.prototype.$common = common
Vue.prototype.$webconfig = webconfig
Vue.prototype.$api = api


/*格式化数字*/
Vue.filter('formatNum', function(n) {
	return parseFloat(Number(n).toFixed(2));
});
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
