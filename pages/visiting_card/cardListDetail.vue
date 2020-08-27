<template>
	<view class="cardListDetail">
		<cardEdit 
			:title1.sync="extensionDetail.title" 
			:seqId="extensionDetail.seqId" 
			:cardExtendId="extensionDetail.cardExtendId" 
			:content1.sync="contentList"
		></cardEdit>
	</view>
</template>

<script>
	import cardEdit from './card_edit.vue'
	export default {
		data() {
			return {
				extensionDetail: {
					title:	''
				},
				contentList: []
			};
		},
		onLoad(option) {
			if(option.seqId){
				this.findListArticleInfo(option.seqId);
			}
		},
		components:{
			cardEdit
		},
		methods:{
			findListArticleInfo(seqId){
				this.$api.get('/o2oVisitingCard/findListArticleInfo', {
					params: {
						articleSeqId: seqId,
					}
				}).then(res => {
					// 转化文章字符串为htnl代码块
					let articleContent = res.data.content || '';
					let content = [];
					let ac = articleContent.replace(/^<section>/g, '').replace(/<\/section>$/g, '').replace(/<a href="([^"]*?)" /g, ($0,$1)=>{
						return $0 + ' onclick="return false;"';
					});
					ac = ac ||
						'<div class="hs-text" style="color:#000;font-weight:normal;text-align:left;font-size:14px;">点击开始编辑文章内容</div>'
					content = ac.split(/<\/section><section>/);
					this.contentList.splice(0,1);
					content.forEach((item)=>{
						this.contentList.push(item);
					})
					this.extensionDetail = res.data;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.cardListDetail {
	width: 100%;
	height: 100%;
}
</style>
