<template>
  <scroll-view class="wuc-tab" :class="tabClass" :style="tabStyle" scroll-with-animation scroll-x :scroll-left="scrollLeft">
    <div v-if="!textFlex">
      <div class="wuc-tab-item" :class="[item.status === tabCur ? selectClass + ' cur':'']" v-for="(item,index) in tabList" :key="item.status" :id="item.status" @tap="tabSelect(item.status,$event)">
        <text :class="item.icon"></text>
        <span>{{item.name}}</span>
      </div>
    </div>

    <div class="flex text-center" v-if="textFlex">
      <div class="wuc-tab-item flex-sub" :class="item.status === tabCur ? selectClass + ' cur':''" v-for="(item,index) in tabList" :key="index" :id="index" @tap="tabSelect(item.status,$event)">
        <text :class="item.icon"></text>
        <span>{{item.name}}</span>
      </div>
    </div>
  </scroll-view>
</template>
<script>
export default {
    name: 'wuc-tab',
    data() {
        return {};
    },
    props: {
        tabList: {
            type: Array,
            default() {
                return [];
            }
        },
        tabCur: {
            type: Number,String,
            default() {
                return 0;
            }
        },
        tabClass: {
            type: String,
            default() {
                return '';
            }
        },
        tabStyle: {
            type: String,
            default() {
                return '';
            }
        },
        textFlex: {
            type: Boolean,
            default() {
                return false;
            }
        },
        selectClass: {
            type: String,
            default() {
                return 'text-blue';
            }
        }
    },
    methods: {
        tabSelect(index, e) {
            if (this.currentTab === index) return false;
            this.$emit('update:tabCur', index);
            this.$emit('change', index);
        }
    },
    computed: {
        scrollLeft() {
			let the_tabCur=this.tabCur
			if(the_tabCur>99){
				the_tabCur=-1
			}
            return (the_tabCur - 1) * 60;
        }
    }
};
</script>
<style>
div,
scroll-view,
swiper {
	box-sizing: border-box;
}
.wuc-tab {
    white-space: nowrap;
}
.wuc-tab-item {
    height: 90upx;
    display: inline-block;
    line-height: 90upx;
    margin: 0 10upx;
    padding: 0 20upx;
	font-size: 30rpx;
}

.wuc-tab-item.cur {
   position: relative;
	font-weight: 800;
}
.wuc-tab-item.cur::after {
	content: "";
	width: 70upx;
	height: 10upx;
	position: absolute;
	bottom: 10upx;
	left: 50%;
	transform: translateX(-50%);
	z-index: 2;
	background: #FFA098;
	border-radius:3px;
}
.wuc-tab.fixed {
	position: fixed;
	width: 100%;
	top: 0;
	z-index: 99;
	box-shadow: 0 1upx 6upx rgba(0, 0, 0, 0.1);
}

.flex {
    display: flex;
}
.text-center {
    text-align: center;
}
.flex-sub {
    flex: 1;
}
.text-blue{
  color:#0081ff;
}
.text-white{
  color:#ffffff;
}
.bg-white{
    background-color: #ffffff;
}
.bg-blue{
    background-color: #0081ff;
}
.text-orange{
  color: #f37b1d
}
.text-black {
	color:#333;
}
.text-xl {
	font-size: 36upx;
}

</style>
