import Vue from 'vue'
import vuex from 'vuex'
import {state} from './state'
import {mutations} from './mutation'

Vue.use(vuex);

export default new vuex.Store({
    state,
    mutations,
})