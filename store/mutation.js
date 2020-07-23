import {common} from '../common/js/common.js'

export const mutations = {
	// 商品详情到确认订单界面
	saveOrderConfirm(state, param) {
	    state.order_confirm = param;
	    common.setLocal("order_confirm", param)
	},
	// 商品详情页面
	saveShop(state, param) {
		state.merchants_shop = param;
		common.setLocal("merchants_shop", param)
	},
	saveAddress(state,param){
		state.order_address = param;
		common.setLocal("order_address", param)
	},
	saveTypecheck(state,param){
		state.type_check = param;
		common.setLocal("type_check", param)
	},
	// 我的个人信息
	saveUser(state,param){
		state.user = param;
		common.setLocal("user", param)
	},
	// 我的账户余额
	saveAccount(state,param){
		state.account = param;
		common.setLocal("account", param)
	},
	// 我的上级邀请码
	saveInviteCode(state,param){
		state.invite_code = param;
	},
	// 位置
	saveLocation(state,param){
		state.location = param;
	},
	//发布悬赏选择区域的位置跟距离
	saveIssueMap(state,param){
		state.issue_map = param;
	},
	//发布悬赏选择文章
	saveIssueArticle(state,param){
		state.issue_article = param;
	},
	//发布悬赏选择发布人
	saveIssueIdentity(state,param){
		state.issue_identity = param;
	}
	
	
};