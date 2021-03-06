import Vue from "vue"

import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 购物车课程数量
        cart_length: 0,
    },
    mutations: {
        // 监测购物车的动作
        change_count(state, count) {
            state.cart_length = count;
            console.log(count)
        },
    }
})
