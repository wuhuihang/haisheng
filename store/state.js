import {common} from '../common/js/common.js'

export const state = {
	order_confirm:common.getLocalSync("order_confirm") || {},
	merchants_shop:common.getLocalSync("merchants_shop") || {},
	order_address:common.getLocalSync("order_address") || {},
	type_check:common.getLocalSync("type_check") ||false,
	user:common.getLocalSync("user") ||{},
	account:common.getLocalSync("account") ||{merchantCashValue:0,couponValue:0,goldBeanValue:0},
	invite_code:"",//邀请商家的邀请码
	location:{
		lat1:0,
		lon1:0
	},//用户地理位置
	issue_map:{
		lon1:"",
		lat1:"",
		regionFlag:"ALL",
		distance:"",
		distance_zh:"",
		address:"",
		province:"",
		city:"",
		region:""
	},//发布悬赏选择区域的位置跟距离
	issue_article:{
		articleTitle:"",
		articleSeqId:""
	},//发布悬赏选择的文章
	issue_identity:{
		identityName:"",
		identitySeqId:""
	}
	
};